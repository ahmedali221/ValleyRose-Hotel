// Test script to verify PDF page counting
// Run this in your backend directory: node test-pdf-count.js

const pdfParse = require('pdf-parse');
const https = require('https');

async function testPdfPageCount(pdfUrl) {
  return new Promise((resolve, reject) => {
    console.log('Testing PDF URL:', pdfUrl);
    
    const protocol = pdfUrl.startsWith('https') ? https : https;
    
    protocol.get(pdfUrl, (response) => {
      console.log('Response status:', response.statusCode);
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch PDF: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          console.log('PDF buffer size:', pdfBuffer.length, 'bytes');
          
          const data = await pdfParse(pdfBuffer);
          console.log('PDF parsed successfully!');
          console.log('Total pages:', data.numpages);
          console.log('PDF info:', data.info);
          
          resolve(data.numpages);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching PDF:', error);
      reject(error);
    });
  });
}

// Test with your PDF URL
const testUrl = 'YOUR_PDF_URL_HERE'; // Replace with your actual PDF URL

if (testUrl !== 'YOUR_PDF_URL_HERE') {
  testPdfPageCount(testUrl)
    .then(pageCount => {
      console.log('✅ Success! PDF has', pageCount, 'pages');
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
    });
} else {
  console.log('Please update the testUrl variable with your actual PDF URL');
}
