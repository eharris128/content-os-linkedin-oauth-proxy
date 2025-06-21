import { AuthClient } from 'linkedin-api-client';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      switch (url.pathname) {
        case '/':
          return handleHome(request, env);
        case '/auth':
          return handleAuth(request, env);
        case '/callback':
          return handleCallback(request, env);
        default:
          return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

function handleHome(request, env) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Get Your LinkedIn Access Token</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { 
      color: #333;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #666;
      font-size: 18px;
      margin-bottom: 30px;
    }
    .steps {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      border-left: 4px solid #0077B5;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin: 15px 0;
      padding: 10px 0;
    }
    .step-number {
      background: #0077B5;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .step-content {
      font-size: 16px;
      line-height: 1.5;
    }
    .security-note {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      border: 1px solid #c3e6c3;
    }
    .security-icon {
      color: #28a745;
      font-size: 20px;
      margin-right: 8px;
    }
    .what-is-token {
      background: #fff3cd;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      border: 1px solid #ffeaa7;
    }
    code {
      background: #f4f4f4;
      padding: 12px;
      border-radius: 4px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      display: block;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Get Your LinkedIn Access Token</h1>
    <p class="subtitle">Connect your LinkedIn account to get an access token for API integration</p>
    
    <div class="what-is-token">
      <h3>What's an Access Token?</h3>
      <p>An access token is like a temporary key that lets your applications interact with LinkedIn on your behalf. You'll copy this token and paste it into your Content OS plugin settings.</p>
    </div>
    
    <div class="steps">
      <h3>Here's how it works:</h3>
      <div class="step">
        <div class="step-number">1</div>
        <div class="step-content">
          <strong>Click the LinkedIn button below</strong><br>
          This will take you to LinkedIn's secure login page
        </div>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <div class="step-content">
          <strong>Login via LinkedIn</strong><br>
          Use your normal LinkedIn username and password to sign in
        </div>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <div class="step-content">
          <strong>Copy your access token</strong><br>
          We'll show you a token that you can copy and use in the Content OS Obsidian plugin
        </div>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <div class="step-content">
          <strong>Paste it into your application</strong><br>
          Paste this token into the settings page for the Content OS plugin
        </div>
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="/auth">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANcAAAApCAYAAACm5bzcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIyQkEyMUY3OTlFMDExRTRBMzEyRTBGMTg0QzI0RDc3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIyQkEyMUY4OTlFMDExRTRBMzEyRTBGMTg0QzI0RDc3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjJCQTIxRjU5OUUwMTFFNEEzMTJFMEYxODRDMjRENzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjJCQTIxRjY5OUUwMTFFNEEzMTJFMEYxODRDMjRENzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RBhcaAAAIY0lEQVR42uyce1BU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" alt="Sign in with LinkedIn" style="width: 200px; height: auto;">
      </a>
    </div>
    
    <div class="security-note">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <strong>Your Privacy & Security</strong>
      </div>
      <p><strong>We never store your access token.</strong> Once you get your token, it's completely private to you. We only help you get it from LinkedIn - that's it!</p>
      <p>Your token will expire after 60 days for security, and you can always come back here to get a new one.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function handleAuth(request, env) {
  // Use configured redirect URL or fall back to current origin
  const redirectUri = env.REDIRECT_URL || `${new URL(request.url).origin}/callback`;
  
  // Create AuthClient instance
  const authClient = new AuthClient({
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    redirectUrl: redirectUri
  });
  
  // Generate authorization URL with required scopes
  const authUrl = authClient.generateMemberAuthorizationUrl(['openid', 'profile', 'w_member_social']);
  
  return Response.redirect(authUrl, 302);
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  if (error) {
    return errorResponse(`OAuth error: ${error}`, url.searchParams.get('error_description'));
  }
  
  if (!code) {
    return errorResponse('Missing authorization code');
  }
  
  try {
    // Exchange code for token using AuthClient
    const tokenData = await exchangeCodeForToken(code, env);
    
    if (!tokenData.access_token) {
      return errorResponse('Failed to obtain access token', tokenData.error_description);
    }
    
    // Return token to user
    return tokenResponse(tokenData);
  } catch (error) {
    console.error('Token exchange error:', error);
    return errorResponse('Failed to exchange code for token', error.message);
  }
}

async function exchangeCodeForToken(code, env) {
  // Use configured redirect URL or fall back to current origin
  const redirectUri = env.REDIRECT_URL;
  
  // Create AuthClient instance
  const authClient = new AuthClient({
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    redirectUrl: redirectUri
  });
  
  // Exchange authorization code for access token
  return await authClient.exchangeAuthCodeForAccessToken(code);
}


function tokenResponse(tokenData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Success</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .success {
      color: #22c55e;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .button {
      background: #0077B5;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
    }
    .button:hover { background: #005885; }
    .info {
      background: #fef3c7;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">Authorization Successful!</div>
    <h2>Your Access Token:</h2>
    
    <button class="button" onclick="copyToken()">Copy Access Token</button>
    
    <div class="info">
      <strong>Important:</strong> Save this token securely. We do not store it. The token will expire in 60 days.
    </div>

    <p><a href="/">Start Over</a></p>
  </div>
  
  <script>
    function copyToken() {
      // Extract just the access token from the JSON
      const tokenDataElement = document.getElementById('tokenData');
      const tokenText = tokenDataElement.textContent;
      
      try {
        const tokenObj = JSON.parse(tokenText);
        const accessToken = tokenObj.access_token;
        
        if (accessToken) {
          navigator.clipboard.writeText(accessToken).then(() => {
            alert('Access token copied to clipboard!');
          });
        } else {
          // Fallback to full data if access_token not found
          navigator.clipboard.writeText(tokenText).then(() => {
            alert('Token data copied to clipboard!');
          });
        }
      } catch (e) {
        // Fallback to full text if JSON parsing fails
        navigator.clipboard.writeText(tokenText).then(() => {
          alert('Token data copied to clipboard!');
        });
      }
    }
  </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

function errorResponse(error, description = '') {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Error</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .error {
      color: #ef4444;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .error-box {
      background: #fee;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
      border: 1px solid #fcc;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error">✗ Authorization Failed</div>
    <div class="error-box">
      <strong>Error:</strong> ${error}
      ${description ? `<br><br><strong>Description:</strong> ${description}` : ''}
    </div>
    <p><a href="/">Try Again</a></p>
  </div>
</body>
</html>
  `;
  
  return new Response(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html' }
  });
}
