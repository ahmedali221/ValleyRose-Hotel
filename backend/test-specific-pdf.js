// Test script for your specific PDF
// Run: node test-specific-pdf.js

const pdfParse = require('pdf-parse');
const https = require('https');

const pdfUrl = 'https://res.cloudinary.com/deilfrlsh/image/upload/v1759794494/valleyrose/en26ggublui726cajrbt.pdf';

async function testSpecificPdf() {
  console.log('Testing PDF:', pdfUrl);
  
  return new Promise((resolve, reject) => {
    https.get(pdfUrl, (response) => {
      console.log('Status:', response.statusCode);
      console.log('Headers:', response.headers);
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', chunk => {
        chunks.push(chunk);
        console.log('Chunk size:', chunk.length);
      });
      
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          console.log('Total size:', buffer.length, 'bytes');
          
          // Try different parsing options
          console.log('\n--- Trying basic parse ---');
          const basicData = await pdfParse(buffer);
          console.log('Basic parse result:', {
            numpages: basicData.numpages,
            hasText: !!basicData.text,
            textLength: basicData.text ? basicData.text.length : 0
          });
          
          console.log('\n--- Trying with options ---');
          const optionData = await pdfParse(buffer, {
            max: 0,
            version: 'v1.10.100'
          });
          console.log('Options parse result:', {
            numpages: optionData.numpages,
            hasText: !!optionData.text,
            textLength: optionData.text ? optionData.text.length : 0
          });
          
          // Try to extract from text content
          if (optionData.text) {
            console.log('\n--- Analyzing text content ---');
            const text = optionData.text;
            console.log('First 500 chars:', text.substring(0, 500));
            
            // Look for page numbers
            const pageMatches = text.match(/\bpage\s+\d+\b/gi);
            console.log('Page matches:', pageMatches);
            
            const numberMatches = text.match(/\d+/g);
            console.log('All numbers found:', numberMatches);
            
            if (numberMatches) {
              const numbers = numberMatches.map(Number).filter(n => n > 0 && n < 100);
              const maxNumber = Math.max(...numbers);
              console.log('Max number found:', maxNumber);
            }
          }
          
          resolve(optionData.numpages || 0);
        } catch (error) {
          console.error('Parse error:', error);
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

testSpecificPdf()
  .then(pages => {
    console.log('\n✅ Final result: PDF has', pages, 'pages');
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
  });
