const express = require('express');
const { AuthClient, RestliClient } = require('linkedin-api-client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.OAUTH2_REDIRECT_URL) {
  console.error('ERROR: Missing required environment variables');
  console.error('Please set CLIENT_ID, CLIENT_SECRET, and OAUTH2_REDIRECT_URL in your .env file');
  process.exit(1);
}

// Initialize LinkedIn API clients
const authClient = new AuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUrl: process.env.OAUTH2_REDIRECT_URL
});

const restliClient = new RestliClient();
restliClient.setDebugParams({ enabled: true });

// Store access token (in production, use proper session management)
let accessToken = '';

// Add test route for manual token testing
app.get('/test-token/:token', async (req, res) => {
  const testToken = req.params.token;
  console.log('Testing with manual token...');
  
  try {
    // Try different API endpoints
    console.log('Trying /userinfo endpoint...');
    const meResponse = await restliClient.get({
      resourcePath: '/userinfo',
      accessToken: testToken,
      headers: {
        'LinkedIn-Version': '202506'
      }
    });
    
    res.json({
      success: true,
      endpoint: '/userinfo',
      data: meResponse.data
    });
  } catch (error) {
    console.error('Error with /userinfo:', error.message);
    
    // Try userinfo endpoint
    try {
      console.log('Trying /userinfo endpoint...');
      const userinfoResponse = await restliClient.get({
        resourcePath: '/userinfo',
        accessToken: testToken,
        headers: {
          'LinkedIn-Version': '202506'
        }
      });
      
      res.json({
        success: true,
        endpoint: '/userinfo',
        data: userinfoResponse.data
      });
    } catch (error2) {
      res.json({
        error: true,
        messages: {
          '/userinfo': error.message,
          '/userinfo': error2.message
        }
      });
    }
  }
});

// Home route - initiates OAuth flow or displays profile
app.get('/', async (req, res) => {
  if (!accessToken) {
    // Generate authorization URL with required scopes
    const authUrl = authClient.generateMemberAuthorizationUrl(['openid', 'profile', 'w_member_social']);
    res.redirect(authUrl);
    
    res.send(`
      <html>
        <head><title>LinkedIn OAuth Demo</title></head>
        <body>
          <h1>LinkedIn OAuth Demo</h1>
          <p>No access token found. Please authorize the application.</p>
          <a href="${authUrl}" style="display: inline-block; padding: 10px 20px; background: #0077b5; color: white; text-decoration: none; border-radius: 4px;">
            Sign in with LinkedIn
          </a>
        </body>
      </html>
    `);
  } else {
    try {
      console.log('Fetching profile with access token...');
      // Fetch profile data using v2 API
      const profileResponse = await restliClient.get({
        resourcePath: '/userinfo',
        accessToken,
        headers: {
          'LinkedIn-Version': '202506'
        }
      });
      
      console.log('Profile response data:', profileResponse.data);
      
      res.send(`
        <html>
          <head><title>LinkedIn Profile</title></head>
          <body>
            <h1>LinkedIn Profile Data</h1>
            <pre>${JSON.stringify(profileResponse.data, null, 2)}</pre>
            <a href="/logout">Logout</a>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      res.send(`Error fetching profile: ${error.message}<br><br>Check console for details.`);
    }
  }
});

// OAuth callback route
app.get('/oauth', async (req, res) => {
  const { code, error, error_description } = req.query;
  
  if (error) {
    console.error('OAuth error:', error, error_description);
    return res.send(`Authorization error: ${error_description || error}`);
  }
  
  if (!code) {
    return res.send('No authorization code received');
  }
  
  try {
    console.log('Exchanging auth code for access token...');
    // Exchange authorization code for access token
    const tokenResponse = await authClient.exchangeAuthCodeForAccessToken(code);
    accessToken = tokenResponse.access_token;
    
    console.log('Access token obtained successfully');
    console.log('Full token response:', JSON.stringify(tokenResponse, null, 2));
    console.log(`Token expires in: ${tokenResponse.expires_in} seconds`);
    
    // Redirect to home page to display profile
    res.redirect('/');
  } catch (error) {
    console.error('Token exchange error:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    res.send(`Error exchanging authorization code: ${error.message}`);
  }
});

// Logout route
app.get('/logout', (req, res) => {
  accessToken = '';
  res.redirect('/');
});

// Start server
app.listen(port, () => {
  console.log(`LinkedIn OAuth demo running at http://localhost:${port}`);
  console.log(`Make sure your LinkedIn app's redirect URL is set to: ${process.env.OAUTH2_REDIRECT_URL}`);
});