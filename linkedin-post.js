const { RestliClient } = require('linkedin-api-client');
require('dotenv').config();

// Constants
const POSTS_RESOURCE = '/posts';
const API_VERSION = '202506';

// Initialize RestliClient
const restliClient = new RestliClient();
restliClient.setDebugParams({ enabled: true });

// Get access token from command line or environment
const accessToken = process.argv[2] || process.env.ACCESS_TOKEN;

if (!accessToken) {
  console.error('Please provide an access token as an argument or set ACCESS_TOKEN in .env');
  console.error('Usage: node linkedin-post.js <access_token>');
  process.exit(1);
}

async function createPost() {
  try {
    console.log('Creating LinkedIn post...');
    
    const postsCreateResponse = await restliClient.create({
      resourcePath: POSTS_RESOURCE,
      entity: {
        author: `urn:li:person:U9YPPJ07vq`,
        lifecycleState: 'PUBLISHED',
        visibility: 'PUBLIC',
        commentary: 'Hello LinkedIn! This is a test post created via API.',
        distribution: {
          feedDistribution: 'MAIN_FEED',
          targetEntities: [],
          thirdPartyDistributionChannels: []
        }
      },
      accessToken,
      versionString: API_VERSION
    });
    
    console.log('Post created successfully!');
    console.log('Response:', JSON.stringify(postsCreateResponse, null, 2));
    
    // Extract the post ID from the response headers
    const postId = postsCreateResponse.createdEntityId;
    console.log(`\nPost ID: ${postId}`);
    console.log(`View your post at: https://www.linkedin.com/feed/update/${postId}/`);
    
  } catch (error) {
    console.error('Error creating post:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Common error explanations
      if (error.response.status === 403) {
        console.error('\n❌ 403 Forbidden - Possible reasons:');
        console.error('- Missing w_member_social scope');
        console.error('- Invalid person URN format');
        console.error('- Account restrictions');
      } else if (error.response.status === 422) {
        console.error('\n❌ 422 Unprocessable Entity - Invalid request data');
      } else if (error.response.status === 401) {
        console.error('\n❌ 401 Unauthorized - Invalid or expired access token');
      }
    }
  }
}

// Run the post creation
console.log('Using access token:', accessToken.substring(0, 20) + '...');
createPost();