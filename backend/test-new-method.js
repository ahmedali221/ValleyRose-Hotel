// Test the new multi-method PDF page counting
// Run: node test-new-method.js

const pdfParse = require('pdf-parse');
const https = require('https');

const pdfUrl = 'https://res.cloudinary.com/deilfrlsh/image/upload/v1759794494/valleyrose/en26ggublui726cajrbt.pdf';

// Method 1: pdf-parse
async function testPdfParse() {
  console.log('\n=== Method 1: pdf-parse ===');
  return new Promise((resolve) => {
    https.get(pdfUrl, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const data = await pdfParse(buffer);
          console.log('pdf-parse result:', data.numpages);
          resolve(data.numpages || 0);
        } catch (error) {
          console.log('pdf-parse error:', error.message);
          resolve(0);
        }
      });
    }).on('error', () => resolve(0));
  });
}

// Method 2: Cloudinary transformation test
async function testCloudinaryMethod() {
  console.log('\n=== Method 2: Cloudinary transformation ===');
  
  for (let page = 1; page <= 10; page++) {
    const testUrl = pdfUrl.replace('/upload/', `/upload/pg_${page},f_jpg,q_auto/`);
    console.log(`Testing page ${page}: ${testUrl}`);
    
    const exists = await testCloudinaryPage(testUrl);
    console.log(`Page ${page} exists:`, exists);
    
    if (!exists) {
      console.log(`Found ${page - 1} pages`);
      return page - 1;
    }
  }
  
  return 0;
}

async function testCloudinaryPage(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      console.log(`  Status: ${response.statusCode}`);
      resolve(response.statusCode === 200);
    });
    
    request.on('error', () => resolve(false));
    request.setTimeout(5000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

// Method 3: Content estimation
async function testContentEstimation() {
  console.log('\n=== Method 3: Content estimation ===');
  
  return new Promise((resolve) => {
    https.get(pdfUrl, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const data = await pdfParse(buffer);
          
          if (data.text) {
            const textLength = data.text.length;
            const estimatedPages = Math.max(1, Math.ceil(textLength / 2000));
            console.log(`Text length: ${textLength}`);
            console.log(`Estimated pages: ${estimatedPages}`);
            resolve(Math.min(estimatedPages, 10));
          } else {
            resolve(0);
          }
        } catch (error) {
          console.log('Content estimation error:', error.message);
          resolve(0);
        }
      });
    }).on('error', () => resolve(0));
  });
}

// Run all tests
async function runTests() {
  console.log('Testing PDF:', pdfUrl);
  
  const method1 = await testPdfParse();
  const method2 = await testCloudinaryMethod();
  const method3 = await testContentEstimation();
  
  console.log('\n=== RESULTS ===');
  console.log('Method 1 (pdf-parse):', method1);
  console.log('Method 2 (Cloudinary):', method2);
  console.log('Method 3 (Estimation):', method3);
  
  const finalResult = method1 || method2 || method3 || 5;
  console.log('\nFinal page count:', finalResult);
}

runTests().catch(console.error);
