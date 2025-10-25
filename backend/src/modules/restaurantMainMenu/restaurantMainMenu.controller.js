const RestaurantMainMenu = require('./restaurantMainMenu.model');
const https = require('https');
const http = require('http');

// Conditionally load pdf-parse (not available in serverless environments)
let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch (error) {
  console.warn('pdf-parse not available in this environment:', error.message);
}

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
    
    // Method 3: Try binary search approach for more pages
    const binarySearchCount = await countPdfPagesWithBinarySearch(pdfUrl);
    if (binarySearchCount > 0) {
      console.log(`PDF page count detected with binary search: ${binarySearchCount}`);
      return binarySearchCount;
    }
    
    // Method 4: Manual estimation based on content
    const estimatedCount = await estimatePdfPages(pdfUrl);
    if (estimatedCount > 0) {
      console.log(`PDF page count estimated: ${estimatedCount}`);
      return estimatedCount;
    }
    
    console.warn('All methods failed, unable to determine page count');
    return null; // No fallback - let the caller handle this
    
  } catch (error) {
    console.error('Error in countPdfPages:', error);
    return null; // No fallback - let the caller handle this
  }
}

// Method 1: Using pdf-parse
async function countPdfPagesWithPdfParse(pdfUrl) {
  if (!pdfParse) {
    console.log('pdf-parse not available, skipping this method');
    return 0;
  }
  
  return new Promise((resolve) => {
    const protocol = pdfUrl.startsWith('https') ? https : http;
    
    const request = protocol.get(pdfUrl, (response) => {
      if (response.statusCode !== 200) {
        console.log(`Failed to fetch PDF: ${response.statusCode}`);
        resolve(0);
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          console.log(`PDF buffer size: ${pdfBuffer.length} bytes`);
          
          const data = await pdfParse(pdfBuffer);
          console.log('PDF parse result:', { 
            numpages: data.numpages, 
            textLength: data.text ? data.text.length : 0 
          });
          
          if (data.numpages && data.numpages > 0) {
            resolve(data.numpages);
          } else {
            resolve(0);
          }
        } catch (error) {
          console.log('PDF parse error:', error.message);
          resolve(0);
        }
      });
    });
    
    request.on('error', (error) => {
      console.log('Request error:', error.message);
      resolve(0);
    });
    
    request.setTimeout(30000, () => {
      console.log('Request timeout');
      request.destroy();
      resolve(0);
    });
  });
}

// Method 2: Using Cloudinary transformations to test pages
async function countPdfPagesWithCloudinary(pdfUrl) {
  console.log('Trying Cloudinary transformation method...');
  
  // Use binary search approach for more efficient and accurate counting
  let left = 1;
  let right = 500; // Increased limit to handle larger PDFs
  let lastValidPage = 0;
  
  // First, find if page 1 exists
  const firstPageUrl = pdfUrl.replace('/upload/', `/upload/pg_1,f_jpg,q_auto/`);
  const firstPageExists = await testCloudinaryPage(firstPageUrl);
  if (!firstPageExists) {
    console.log('Page 1 does not exist, PDF might be corrupted');
    return 0;
  }
  
  lastValidPage = 1;
  
  // Binary search to find the last existing page
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const testUrl = pdfUrl.replace('/upload/', `/upload/pg_${mid},f_jpg,q_auto/`);
    const exists = await testCloudinaryPage(testUrl);
    
    if (exists) {
      lastValidPage = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  console.log(`Cloudinary binary search found ${lastValidPage} pages`);
  return lastValidPage;
}

// Method 3: Enhanced binary search approach to find the last existing page
async function countPdfPagesWithBinarySearch(pdfUrl) {
  console.log('Trying enhanced binary search method...');
  
  // First, find a rough upper bound by testing powers of 2
  let upperBound = 1;
  let lowerBound = 1;
  
  // Find upper bound - test up to 1000 pages
  while (upperBound <= 1000) {
    const testUrl = pdfUrl.replace('/upload/', `/upload/pg_${upperBound},f_jpg,q_auto/`);
    const exists = await testCloudinaryPage(testUrl);
    if (!exists) {
      break;
    }
    lowerBound = upperBound;
    upperBound *= 2;
  }
  
  console.log(`Binary search bounds: ${lowerBound} to ${upperBound}`);
  
  // If we found an upper bound, do binary search
  if (upperBound > 1) {
    let left = lowerBound;
    let right = upperBound;
    let lastValidPage = lowerBound;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const testUrl = pdfUrl.replace('/upload/', `/upload/pg_${mid},f_jpg,q_auto/`);
      const exists = await testCloudinaryPage(testUrl);
      
      if (exists) {
        lastValidPage = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    console.log(`Enhanced binary search found ${lastValidPage} pages`);
    return lastValidPage;
  }
  
  return 0;
}

// Test if a Cloudinary transformation URL exists
async function testCloudinaryPage(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Check for successful response and content type
      const isSuccess = response.statusCode === 200 && 
                       response.headers['content-type'] && 
                       response.headers['content-type'].includes('image');
      
      console.log(`Testing ${url}: status=${response.statusCode}, content-type=${response.headers['content-type']}, success=${isSuccess}`);
      resolve(isSuccess);
    });
    
    request.on('error', (error) => {
      console.log(`Request error for ${url}:`, error.message);
      resolve(false);
    });
    
    request.setTimeout(8000, () => {
      console.log(`Request timeout for ${url}`);
      request.destroy();
      resolve(false);
    });
  });
}

// Method 3: Estimate pages based on content analysis
async function estimatePdfPages(pdfUrl) {
  if (!pdfParse) {
    console.log('pdf-parse not available for content analysis, skipping this method');
    return 0;
  }
  
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
            // Analyze text content to estimate pages more accurately
            const textLength = data.text.length;
            
            // Try to extract page count from content first
            const extractedCount = extractPageCountFromContent(data.text);
            if (extractedCount > 0) {
              console.log(`Page count extracted from content: ${extractedCount}`);
              resolve(extractedCount);
              return;
            }
            
            // Fallback to text length estimation with better accuracy
            // Restaurant menus typically have 1500-3000 characters per page
            const avgCharsPerPage = 2000;
            const estimatedPages = Math.max(1, Math.ceil(textLength / avgCharsPerPage));
            
            console.log(`Text length: ${textLength}, estimated pages: ${estimatedPages}`);
            resolve(estimatedPages);
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

// Enhanced method to extract page count from PDF content
function extractPageCountFromContent(text) {
  if (!text) return 0;
  
  // Look for common page indicators in PDF text with more patterns
  const pagePatterns = [
    /page\s+(\d+)/gi,
    /(\d+)\s*\/\s*(\d+)/g, // Format like "1 / 5"
    /page\s*(\d+)\s*of\s*(\d+)/gi,
    /(\d+)\s*of\s*(\d+)/gi, // Format like "1 of 5"
    /page\s*(\d+)/gi,
    /(\d+)\s*\/\s*(\d+)\s*page/gi, // Format like "1 / 5 page"
    /(\d+)\s*-\s*(\d+)/g, // Format like "1-5" (page range)
  ];
  
  let maxPageFound = 0;
  
  for (const pattern of pagePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      console.log('Found page patterns:', matches);
      
      // Extract all numbers from matches
      const allNumbers = [];
      matches.forEach(match => {
        const numbers = match.match(/\d+/g);
        if (numbers) {
          allNumbers.push(...numbers.map(Number));
        }
      });
      
      if (allNumbers.length > 0) {
        const maxPage = Math.max(...allNumbers);
        if (maxPage > maxPageFound) {
          maxPageFound = maxPage;
        }
      }
    }
  }
  
  // Also look for total page count in common formats
  const totalPagePatterns = [
    /total\s*pages?\s*:?\s*(\d+)/gi,
    /pages?\s*:?\s*(\d+)/gi,
    /(\d+)\s*pages?/gi
  ];
  
  for (const pattern of totalPagePatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/\d+/g);
      if (numbers) {
        const pageCount = Math.max(...numbers.map(Number));
        if (pageCount > maxPageFound) {
          maxPageFound = pageCount;
        }
      }
    }
  }
  
  console.log(`Extracted page count from content: ${maxPageFound}`);
  return maxPageFound;
}

async function uploadPdf(req, res) {
  const file = req.file;
  if (!file || file.mimetype !== 'application/pdf') return res.status(400).json({ message: 'PDF required' });
  
  try {
    console.log('PDF uploaded to Cloudinary:', file.path);
    
    // Count pages in the uploaded PDF with comprehensive error handling
    let pageCount = null;
    let pageCountError = null;
    
    try {
      console.log(`Starting page count process for PDF: ${file.path}`);
      pageCount = await countPdfPages(file.path);
      console.log(`PDF page count result: ${pageCount}`);
      
      // Validate page count
      if (!pageCount || pageCount <= 0 || isNaN(pageCount)) {
        pageCountError = 'Page count could not be determined automatically';
        console.warn(pageCountError);
        pageCount = null;
      } else {
        console.log(`✅ Successfully detected ${pageCount} pages`);
      }
    } catch (error) {
      pageCountError = `Page counting failed: ${error.message}`;
      console.error(pageCountError);
      pageCount = null;
    }
    
    const existing = await RestaurantMainMenu.findOne();
    if (existing) {
      existing.pdfFile = file.path;
      existing.pageCount = pageCount;
      await existing.save();
      console.log('Updated existing menu with page count:', pageCount);
      
      // Include page count error in response if applicable
      const response = existing.toObject();
      if (pageCountError) {
        response.pageCountError = pageCountError;
      }
      return res.json(response);
    }
    
    const doc = await RestaurantMainMenu.create({ pdfFile: file.path, pageCount });
    console.log('Created new menu with page count:', pageCount);
    
    // Include page count error in response if applicable
    const response = doc.toObject();
    if (pageCountError) {
      response.pageCountError = pageCountError;
    }
    res.status(201).json(response);
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

async function updatePageCount(req, res) {
  try {
    const { pageCount } = req.body;
    
    if (!pageCount || pageCount <= 0 || !Number.isInteger(pageCount)) {
      return res.status(400).json({ message: 'Valid page count required' });
    }
    
    const doc = await RestaurantMainMenu.findOne();
    if (!doc) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    
    doc.pageCount = pageCount;
    await doc.save();
    
    console.log(`Manually updated page count to: ${pageCount}`);
    res.json(doc);
  } catch (error) {
    console.error('Error updating page count:', error);
    res.status(500).json({ message: 'Failed to update page count', error: error.message });
  }
}

module.exports = { uploadPdf, getPdf, deletePdf, updatePageCount };



