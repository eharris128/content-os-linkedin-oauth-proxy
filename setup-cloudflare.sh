#!/bin/bash

echo "Setting up Cloudflare Workers for LinkedIn OAuth..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Instructions for secrets
echo "Next steps:"
echo "1. Update the KV namespace ID in wrangler.toml with the output from the previous command"
echo "2. Add your LinkedIn OAuth credentials:"
echo "   wrangler secret put CLIENT_ID"
echo "   wrangler secret put CLIENT_SECRET"
echo ""
echo "3. Update your LinkedIn App redirect URL to:"
echo "   Development: http://localhost:8787/oauth"
echo "   Production: https://contentos-oauth.workers.dev/oauth"
echo ""
echo "4. Run the development server: npm run dev"
echo "5. Deploy to production: npm run deploy"