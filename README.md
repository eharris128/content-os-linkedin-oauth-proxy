# OAuth Proxy for Cloudflare Workers

A stateless OAuth proxy service that handles the OAuth flow and returns access tokens directly to users without storing them.

## Features

- **Stateless Architecture**: No token storage - tokens are returned directly to users
- **CSRF Protection**: Uses HMAC-signed state parameters
- **No Database Required**: No KV storage or persistence needed
- **Simple Integration**: Users get their tokens without setting up OAuth
- **Secure**: Secrets stored in Cloudflare environment variables

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Secrets

Add the following secrets using Wrangler:

```bash
wrangler secret put CLIENT_ID
wrangler secret put CLIENT_SECRET
```

- `CLIENT_ID`: Your OAuth application's client ID
- `CLIENT_SECRET`: Your OAuth application's client secret

### 3. Configure Redirect URL

Update the `REDIRECT_URL` in `wrangler.toml` with your actual worker URL:
```toml
REDIRECT_URL = "https://your-worker.workers.dev/callback"
```

### 4. Update OAuth Application

In your LinkedIn (or other OAuth provider) application settings:
- Add the same URL from `REDIRECT_URL` as an authorized redirect URL
- This ensures the redirect URL matches between your worker and LinkedIn app settings

### 5. Deploy

```bash
npm run deploy
```

## Usage

1. Users visit your worker URL: `https://your-worker.workers.dev`
2. Click "Authorize with LinkedIn"
3. Complete the OAuth authorization
4. Receive their access token on the success page
5. Copy and use the token in their applications

## How It Works

1. **Initiation** (`/auth`): Uses LinkedIn AuthClient to generate authorization URL
2. **Callback** (`/callback`): Uses LinkedIn AuthClient to exchange code for token
3. **Token Display**: Shows the token to the user with copy functionality
4. **No Storage**: Token is never stored server-side

## Security Features

- Uses official LinkedIn API client for proper OAuth handling
- CSRF protection handled by LinkedIn AuthClient
- All secrets stored in environment variables
- No token persistence reduces attack surface

## API Endpoints

- `GET /` - Home page with instructions
- `GET /auth` - Initiates OAuth flow
- `GET /callback` - OAuth callback handler

## Adding More Providers

To add support for other OAuth providers:

1. Update `wrangler.toml` with provider URLs:
```toml
GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
```

2. Modify `src/index.js` to handle provider-specific logic

## Development

Run locally with:

```bash
npm run dev
```

Monitor logs with:

```bash
npm run tail
```

## License

MIT