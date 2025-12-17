interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1. Redirect to GitHub for authorization
  if (!url.searchParams.has("code")) {
    const provider = url.searchParams.get("provider");
    if (provider !== "github") {
      return new Response("Unknown provider", { status: 400 });
    }

    const redirectUrl = new URL("https://github.com/login/oauth/authorize");
    redirectUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    redirectUrl.searchParams.set("scope", "repo,user");
    // The callback URL should be the same as this function's URL
    redirectUrl.searchParams.set("redirect_uri", url.origin + "/auth"); 
    
    // Decap CMS sends a random state, pass it through if present, or generate one
    const state = url.searchParams.get("state") || Math.random().toString(36).substring(2);
    redirectUrl.searchParams.set("state", state);

    return Response.redirect(redirectUrl.toString(), 302);
  }

  // 2. Exchange code for token
  const code = url.searchParams.get("code");
  
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      "user-agent": "cloudflare-pages-auth",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const result = await response.json() as any;

  if (result.error) {
    return new Response(JSON.stringify(result), { status: 400 });
  }

  // 3. Return the token to Decap CMS
  // Decap CMS expects a postMessage with the token
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
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        
        // Also try sending immediately in case the listener is already ready
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({
            token: result.access_token,
            provider: "github",
          })}',
          "${url.origin}"
        );
        
        // Close the popup
        // window.close(); // Optional: let the user see it worked or close automatically
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
};
