import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  
  // Get environment variables from Cloudflare runtime or import.meta.env
  // @ts-ignore
  const env = locals.runtime?.env || {};
  const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return new Response("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET configuration", { status: 500 });
  }

  // 1. Redirect to GitHub for authorization
  if (!url.searchParams.has("code")) {
    const provider = url.searchParams.get("provider");
    // Simple health check or direct access
    if (!provider) {
       return new Response("Decap CMS OAuth Backend Ready", { status: 200 });
    }
    
    if (provider !== "github") {
      return new Response("Unknown provider", { status: 400 });
    }

    const redirectUrl = new URL("https://github.com/login/oauth/authorize");
    redirectUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
    redirectUrl.searchParams.set("scope", "repo,user");
    // Hardcode the redirect_uri to ensure it matches GitHub settings exactly
    const callbackUrl = "https://math-blog-6hw.pages.dev/auth";
    redirectUrl.searchParams.set("redirect_uri", callbackUrl); 
    
    console.log(`Initiating OAuth with redirect_uri: ${callbackUrl}`); 
    
    const state = url.searchParams.get("state") || Math.random().toString(36).substring(2);
    redirectUrl.searchParams.set("state", state);

    return Response.redirect(redirectUrl.toString(), 302);
  }

  // 2. Exchange code for token
  const code = url.searchParams.get("code");
  
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "user-agent": "math-blog",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: "https://math-blog-6hw.pages.dev/auth", // Add this!
      }),
    });

    const result = await response.json() as any;
    console.log("GitHub Token Exchange Result:", JSON.stringify(result));

    if (result.error) {
      return new Response(JSON.stringify({
        error: result.error,
        error_description: result.error_description,
        error_uri: result.error_uri,
        details: "GitHub returned an error during token exchange"
      }), { status: 400 });
    }

    // 3. Return the token to Decap CMS
    const content = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            
            // Send the token to the window that opened this popup
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: result.access_token,
                provider: "github",
              })}',
              "*"
            );
          }
          window.addEventListener("message", receiveMessage, false);
          
          // Also try sending immediately
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({
              token: result.access_token,
              provider: "github",
            })}',
            "*"
          );
        })();
      </script>
      Authentication successful! You can close this window.
      </body>
      </html>
    `;

    return new Response(content, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
