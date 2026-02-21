const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Check multiple possible build paths
const possiblePaths = [
  path.join(__dirname, 'dist/dwellhub/browser'),
  path.join(__dirname, 'dist/browser'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'browser')
];

let buildPath = null;

console.log('=== Checking for build files ===');
console.log('Current directory:', __dirname);

for (const p of possiblePaths) {
  console.log(`Checking: ${p}`);
  if (fs.existsSync(p)) {
    const indexExists = fs.existsSync(path.join(p, 'index.html'));
    console.log(`✓ Directory exists, index.html: ${indexExists ? 'YES' : 'NO'}`);
    if (indexExists) {
      buildPath = p;
      break;
    }
  } else {
    console.log(`✗ Not found`);
  }
}

if (!buildPath) {
  console.error('ERROR: Could not find build directory with index.html!');
  console.log('Directory contents of __dirname:');
  try {
    const files = fs.readdirSync(__dirname);
    console.log(files);
    
    // Check if dist exists
    if (files.includes('dist')) {
      console.log('Contents of dist/:');
      console.log(fs.readdirSync(path.join(__dirname, 'dist')));
    }
  } catch (e) {
    console.error('Could not read directory:', e);
  }
  process.exit(1);
}

console.log(`✓ Using build path: ${buildPath}`);

// Serve static files
app.use(express.static(buildPath));

// Handle all routes - serve index.html
app.get('/*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log(`Request: ${req.url}`);
  
  if (!fs.existsSync(indexPath)) {
    console.error('ERROR: index.html not found at:', indexPath);
    return res.status(500).send('Build files not found');
  }
  
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Frontend Server Started`);
  console.log(`Port: ${PORT}`);
  console.log(`Build Path: ${buildPath}`);
  console.log(`=================================`);
});