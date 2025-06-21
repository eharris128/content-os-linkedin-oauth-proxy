#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

// Check required variables
if (!envVars.CLIENT_ID || !envVars.CLIENT_SECRET) {
  console.error('Error: CLIENT_ID and CLIENT_SECRET must be set in .env file');
  process.exit(1);
}

console.log('Setting Cloudflare Worker secrets from .env file...');

try {
  // Set CLIENT_ID
  console.log('Setting CLIENT_ID...');
  execSync(`echo "${envVars.CLIENT_ID}" | npx wrangler secret put CLIENT_ID`, {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  // Set CLIENT_SECRET
  console.log('Setting CLIENT_SECRET...');
  execSync(`echo "${envVars.CLIENT_SECRET}" | npx wrangler secret put CLIENT_SECRET`, {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('✅ Secrets set successfully!');
  console.log('\nNext steps:');
  console.log('1. Make sure your LinkedIn app redirect URL is set to:');
  console.log('   https://content-os.echarris.workers.dev/callback');
  console.log('2. Deploy your worker: npm run deploy');
  
} catch (error) {
  console.error('Error setting secrets:', error.message);
  process.exit(1);
}