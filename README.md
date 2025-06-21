# LinkedIn Access Token Generator

A secure, stateless service for obtaining LinkedIn access tokens without requiring users to set up their own OAuth applications. Built on Cloudflare Workers for maximum reliability and security.

## 🔐 For Obsidian Plugin Reviewers

This service is designed to help users obtain LinkedIn access tokens for API integration. **Important security notes:**

- **No Token Storage**: We never store, log, or persist user access tokens anywhere
- **Stateless Design**: No databases, no session storage, no token caching
- **Direct Token Delivery**: Tokens are shown directly to users and immediately discarded
- **Open Source**: All code is publicly available for security review
- **Zero Data Collection**: No user data, analytics, or tracking

## Features

- **Privacy-First**: Zero token storage or persistence
- **User-Friendly**: Simple interface for non-technical users
- **Secure by Design**: Uses official LinkedIn API client with CSRF protection
- **No Setup Required**: Users don't need to create LinkedIn apps
- **Cloudflare Workers**: Serverless, globally distributed, and highly available

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure LinkedIn Application Secrets

Add your LinkedIn application credentials using Wrangler:

```bash
wrangler secret put CLIENT_ID
wrangler secret put CLIENT_SECRET
```

- `CLIENT_ID`: Your LinkedIn application's client ID
- `CLIENT_SECRET`: Your LinkedIn application's client secret

> **Note**: You need to create a LinkedIn application at [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) to get these credentials.

### 3. Configure Redirect URL

Update the `REDIRECT_URL` in `wrangler.toml` with your actual worker URL:
```toml
REDIRECT_URL = "https://your-worker.workers.dev/callback"
```

### 4. Configure LinkedIn Application Redirect URLs

In your LinkedIn application settings:
- Add the callback URL as an authorized redirect URL: `https://your-worker.workers.dev/callback`
- Ensure the redirect URL matches exactly between your worker and LinkedIn app settings
- Required scopes: `openid`, `profile`, `w_member_social`

### 5. Deploy

```bash
npm run deploy
```

## How Users Get Their Tokens

1. **Visit the Service**: Users go to your deployed worker URL: `https://your-worker.workers.dev`
2. **Click "Sign in with LinkedIn"**: User-friendly interface with clear instructions
3. **Authenticate with LinkedIn**: Users log in with their existing LinkedIn credentials
4. **Receive Access Token**: Token is displayed with copy functionality
5. **Use in Applications**: Users paste the token into their LinkedIn integrations

The interface guides non-technical users through each step with clear explanations.

## How It Works

1. **Initiation** (`/auth`): Uses LinkedIn AuthClient to generate authorization URL
2. **Callback** (`/callback`): Uses LinkedIn AuthClient to exchange code for token
3. **Token Display**: Shows the token to the user with copy functionality
4. **No Storage**: Token is never stored server-side

## Security & Privacy

- **Official LinkedIn SDK**: Uses `linkedin-api-client` for secure OAuth handling
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Environment Variables**: All secrets stored securely in Cloudflare Workers
- **No Persistence**: Zero token storage reduces security attack surface
- **HTTPS Only**: All communication encrypted in transit
- **Minimal Scopes**: Only requests necessary LinkedIn permissions

## API Endpoints

- `GET /` - User-friendly home page with step-by-step instructions
- `GET /auth` - Initiates LinkedIn OAuth flow
- `GET /callback` - Handles OAuth callback and displays token

## Project Structure

```
src/
├── index.js          # Main worker with routing and OAuth flow
├── handlers/
│   └── post.js       # LinkedIn posting functionality (optional)
└── utils/
    └── html.js       # HTML template utilities

signin_with_linkedin-buttons/  # Official LinkedIn button assets
wrangler.toml                  # Cloudflare Workers configuration
```

## Development

Run locally with:

```bash
npm run dev
```

Monitor logs with:

```bash
npm run tail
```

## Use Cases

- **Obsidian Plugins**: Enable LinkedIn integration without requiring users to create developer accounts
- **Content Management**: Tools that need LinkedIn API access for posting or profile data
- **Educational Projects**: Students learning LinkedIn API integration
- **Prototyping**: Quick LinkedIn API access for proof-of-concepts

## Privacy Policy Summary

- **No Data Collection**: We don't collect, store, or log any user data
- **No Token Storage**: Access tokens are never persisted anywhere
- **No Analytics**: No tracking, metrics, or usage monitoring
- **No Third-Party Services**: Only direct communication with LinkedIn's APIs
- **Temporary Processing**: Tokens exist only in memory during the OAuth exchange

## License

MIT - Feel free to fork, modify, and use for your own projects.