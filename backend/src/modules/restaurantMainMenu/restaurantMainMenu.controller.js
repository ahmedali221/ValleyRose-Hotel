const RestaurantMainMenu = require('./restaurantMainMenu.model');
const pdfParse = require('pdf-parse');
const https = require('https');
const http = require('http');

// Function to count PDF pages from URL using multiple methods
async function countPdfPages(pdfUrl) {
  console.log('Starting PDF page count for URL:', pdfUrl);
  
  try {
    // Method 1: Try pdf-parse first
    const pageCount = await countPdfPagesWithPdfParse(pdfUrl);
    if (pageCount > 0) {
      console.log(`PDF page count detected with pdf-parse: ${pageCount}`);
      return pageCount;
    }
    
    // Method 2: Try Cloudinary transformation method
    const cloudinaryCount = await countPdfPagesWithCloudinary(pdfUrl);
    if (cloudinaryCount > 0) {
      console.log(`PDF page count detected with Cloudinary: ${cloudinaryCount}`);
      return cloudinaryCount;
    }
    
    // Method 3: Manual estimation based on content
    const estimatedCount = await estimatePdfPages(pdfUrl);
    if (estimatedCount > 0) {
      console.log(`PDF page count estimated: ${estimatedCount}`);
      return estimatedCount;
    }
    
    console.warn('All methods failed, using default page count');
    return 5; // Default fallback
    
  } catch (error) {
    console.error('Error in countPdfPages:', error);
    return 5; // Default fallback
  }
}

// Method 1: Using pdf-parse
async function countPdfPagesWithPdfParse(pdfUrl) {
  return new Promise((resolve, reject) => {
    const protocol = pdfUrl.startsWith('https') ? https : http;
    
    protocol.get(pdfUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch PDF: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const data = await pdfParse(pdfBuffer);
          
          if (data.numpages && data.numpages > 0) {
            resolve(data.numpages);
          } else {
            resolve(0);
          }
        } catch (error) {
          resolve(0);
        }
      });
    }).on('error', () => resolve(0));
  });
}

// Method 2: Using Cloudinary transformations to test pages
async function countPdfPagesWithCloudinary(pdfUrl) {
  console.log('Trying Cloudinary transformation method...');
  
  // Test pages 1-10 to see which ones exist
  for (let page = 1; page <= 10; page++) {
    try {
      const testUrl = pdfUrl.replace('/upload/', `/upload/pg_${page},f_jpg,q_auto/`);
      const exists = await testCloudinaryPage(testUrl);
      if (!exists) {
        console.log(`Page ${page} does not exist, stopping at page ${page - 1}`);
        return page - 1;
      }
    } catch (error) {
      console.log(`Page ${page} test failed, stopping at page ${page - 1}`);
      return page - 1;
    }
  }
  
  return 0;
}

// Test if a Cloudinary transformation URL exists
async function testCloudinaryPage(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      resolve(response.statusCode === 200);
    });
    
    request.on('error', () => resolve(false));
    request.setTimeout(5000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

// Method 3: Estimate pages based on content analysis
async function estimatePdfPages(pdfUrl) {
  return new Promise((resolve) => {
    const protocol = pdfUrl.startsWith('https') ? https : http;
    
    protocol.get(pdfUrl, (response) => {
      if (response.statusCode !== 200) {
        resolve(0);
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const data = await pdfParse(pdfBuffer);
          
          if (data.text) {
            // Analyze text content to estimate pages
            const textLength = data.text.length;
            const estimatedPages = Math.max(1, Math.ceil(textLength / 2000)); // Rough estimate: 2000 chars per page
            
            console.log(`Text length: ${textLength}, estimated pages: ${estimatedPages}`);
            resolve(Math.min(estimatedPages, 10)); // Cap at 10 pages
          } else {
            resolve(0);
          }
        } catch (error) {
          resolve(0);
        }
      });
    }).on('error', () => resolve(0));
  });
}

// Alternative method to extract page count from PDF content
function extractPageCountFromContent(text) {
  if (!text) return 0;
  
  // Look for common page indicators in PDF text
  const pagePatterns = [
    /page\s+(\d+)/gi,
    /(\d+)\s*\/\s*(\d+)/g, // Format like "1 / 5"
    /page\s*(\d+)\s*of\s*(\d+)/gi
  ];
  
  for (const pattern of pagePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      console.log('Found page patterns:', matches);
      // Extract the highest number found
      const numbers = matches.join(' ').match(/\d+/g);
      if (numbers) {
        const maxPage = Math.max(...numbers.map(Number));
        if (maxPage > 0) {
          return maxPage;
        }
      }
    }
  }
  
  return 0;
}

async function uploadPdf(req, res) {
  const file = req.file;
  if (!file || file.mimetype !== 'application/pdf') return res.status(400).json({ message: 'PDF required' });
  
  try {
    console.log('PDF uploaded to Cloudinary:', file.path);
    
    // Count pages in the uploaded PDF
    let pageCount = 5; // Default fallback
    try {
      pageCount = await countPdfPages(file.path);
      console.log(`PDF page count detected: ${pageCount}`);
      
      // Validate page count
      if (!pageCount || pageCount <= 0 || isNaN(pageCount)) {
        console.warn('Invalid page count detected, using default');
        pageCount = 5;
      }
    } catch (error) {
      console.warn('Failed to count PDF pages, using default:', error.message);
      pageCount = 5;
    }
    
    const existing = await RestaurantMainMenu.findOne();
    if (existing) {
      existing.pdfFile = file.path;
      existing.pageCount = pageCount;
      await existing.save();
      console.log('Updated existing menu with page count:', pageCount);
      return res.json(existing);
    }
    
    const doc = await RestaurantMainMenu.create({ pdfFile: file.path, pageCount });
    console.log('Created new menu with page count:', pageCount);
    res.status(201).json(doc);
  } catch (error) {
    console.error('Error in uploadPdf:', error);
    res.status(500).json({ message: 'Failed to process PDF', error: error.message });
  }
}

async function getPdf(_req, res) {
  try {
    const doc = await RestaurantMainMenu.findOne();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    
    console.log('Returning menu data:', {
      id: doc._id,
      pageCount: doc.pageCount,
      pdfFile: doc.pdfFile ? 'PDF URL present' : 'No PDF'
    });
    
    res.json(doc);
  } catch (error) {
    console.error('Error in getPdf:', error);
    res.status(500).json({ message: 'Failed to fetch menu', error: error.message });
  }
}

async function deletePdf(_req, res) {
  const doc = await RestaurantMainMenu.findOneAndDelete({});
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}

module.exports = { uploadPdf, getPdf, deletePdf };



