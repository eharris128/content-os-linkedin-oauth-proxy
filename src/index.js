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
    .linkedin-signin-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #0077B5;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
    }
    .linkedin-signin-button:hover {
      background: #005885;
      text-decoration: none;
      color: white;
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
      <a href="/auth" class="linkedin-signin-button">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAwCAYAAADDr+jgAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARuSURBVHgB7Z1PVxNHFMafJIQQAiEkhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQkAIASEEhBAQQk" alt="Sign in with LinkedIn" style="width: 200px; height: auto;">
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