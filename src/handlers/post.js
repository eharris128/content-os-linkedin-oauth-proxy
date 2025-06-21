// LinkedIn post creation handler
export async function handlePost(request, env) {
  // Get session from cookie
  const sessionId = getCookie(request, 'session_id');
  
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get session data from KV store
  const session = await env.OAUTH_STORE.get(`session:${sessionId}`, 'json');
  
  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get post content from request body or use default
  let postContent = 'Hello LinkedIn! This is a test post created via Cloudflare Workers API.';
  
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      if (body.content) {
        postContent = body.content;
      }
    } catch (e) {
      // Use default content if body parsing fails
    }
  }

  try {
    // First, fetch the user's profile to get their person URN
    const profile = await fetchLinkedInProfile(session.accessToken);
    const personUrn = `urn:li:person:${profile.sub}`; // 'sub' contains the person ID

    // Create the post
    const postData = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      visibility: 'PUBLIC',
      commentary: postContent,
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: []
      }
    };

    const response = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202506',
        'X-RestLi-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Post creation failed:', error);
      
      let errorMessage = 'Failed to create post';
      if (response.status === 403) {
        errorMessage = 'Forbidden: Check if w_member_social scope is granted';
      } else if (response.status === 422) {
        errorMessage = 'Invalid post data';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized: Token may be expired';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        status: response.status,
        details: error
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract post ID from Location header
    const locationHeader = response.headers.get('x-restli-id') || response.headers.get('location');
    const postId = locationHeader ? locationHeader.split('/').pop() : 'unknown';

    return new Response(JSON.stringify({
      success: true,
      postId: postId,
      message: 'Post created successfully',
      viewUrl: `https://www.linkedin.com/feed/update/${postId}/`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Post creation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to fetch LinkedIn profile
async function fetchLinkedInProfile(accessToken) {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'LinkedIn-Version': '202506'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Profile fetch failed: ${error}`);
  }

  return await response.json();
}

// Cookie helper function
function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}