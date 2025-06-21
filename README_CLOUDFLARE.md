# LinkedIn OAuth on Cloudflare Workers

This project has been migrated from a traditional Node.js Express server to Cloudflare Workers for better scalability and edge performance.

## Project Structure

```
contentos/
├── src/
│   ├── index.js           # Main Worker entry point
│   ├── handlers/
│   │   └── post.js        # LinkedIn post creation handler
│   └── utils/
│       └── html.js        # HTML template generator
├── wrangler.toml          # Cloudflare Workers configuration
├── linkedin-oauth.js      # Original Express implementation (legacy)
├── linkedin-post.js       # Original post utility (legacy)
└── package.json           # Project dependencies
```

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Create KV Namespace

```bash
npm run kv:create
```

Update the `wrangler.toml` file with the generated KV namespace ID.

### 3. Configure Secrets

Add your LinkedIn OAuth credentials as secrets:

```bash
wrangler secret put CLIENT_ID
# Enter your LinkedIn App Client ID

wrangler secret put CLIENT_SECRET  
# Enter your LinkedIn App Client Secret
```

### 4. Update LinkedIn App Settings

Update your LinkedIn App's redirect URL to:
- For development: `http://localhost:8787/oauth`
- For production: `https://contentos-oauth.workers.dev/oauth`

### 5. Run Development Server

```bash
npm run dev
```

The Worker will be available at `http://localhost:8787`

### 6. Deploy to Production

```bash
npm run deploy
```

## API Endpoints

### Web Routes
- `GET /` - Home page, shows profile if authenticated or login button
- `GET /oauth` - OAuth callback endpoint
- `GET /logout` - Clears session and logs out
- `GET /test-token/:token` - Test a specific access token

### API Routes
- `GET /api/profile` - Returns authenticated user's profile (JSON)
- `POST /api/post` - Creates a LinkedIn post
  - Request body: `{ "content": "Your post content" }`
  - Response: `{ "success": true, "postId": "...", "viewUrl": "..." }`

## Key Differences from Express Implementation

1. **Stateless Architecture**: Workers are stateless, so session data is stored in KV storage
2. **Cookie-based Sessions**: Uses HTTP-only secure cookies with session IDs
3. **KV Storage**: OAuth tokens are stored in Cloudflare KV with automatic expiration
4. **Fetch API**: Uses native Fetch API instead of Express routes
5. **Edge Performance**: Runs at Cloudflare edge locations globally

## Security Considerations

1. **Session Management**: Sessions are stored server-side in KV, only session ID in cookie
2. **HTTPS Only**: Workers automatically use HTTPS in production
3. **Token Expiration**: Tokens are automatically removed from KV when they expire
4. **Secure Cookies**: Session cookies are HttpOnly, Secure, and SameSite

## Troubleshooting

### KV Namespace Issues
If you see KV-related errors, ensure:
1. The KV namespace is created: `wrangler kv:namespace list`
2. The namespace ID in `wrangler.toml` matches the created namespace
3. For local development, use the `preview_id` value

### OAuth Flow Issues
1. Verify redirect URLs match in LinkedIn App settings
2. Check that CLIENT_ID and CLIENT_SECRET are set correctly
3. Ensure requested scopes are approved for your LinkedIn App

### Development vs Production
- Development runs on `http://localhost:8787`
- Production runs on `https://contentos-oauth.workers.dev`
- Update OAuth redirect URLs accordingly in LinkedIn App settings

## Migration Notes

The original Express implementation files are preserved for reference:
- `linkedin-oauth.js` - Original OAuth implementation
- `linkedin-post.js` - Original post creation utility

These can be removed once the Workers implementation is fully tested and deployed.