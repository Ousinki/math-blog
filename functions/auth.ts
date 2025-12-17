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
        const authData = {
          token: "${result.access_token}",
          provider: "github"
        };
        
        // Try different message formats that Decap CMS might expect
        const messageString = "authorization:github:success:" + JSON.stringify(authData);
        const messageObject = {
          type: "authorization",
          provider: "github", 
          status: "success",
          ...authData
        };
        
        function sendMessages() {
          if (!window.opener) {
            console.error("No window.opener found!");
            return;
          }
          
          // Send both formats to be safe
          window.opener.postMessage(messageString, "*");
          window.opener.postMessage(messageObject, "*");
          console.log("Messages sent:", { messageString, messageObject });
        }
        
        // Send immediately
        sendMessages();
        
        // Also listen for a message from parent just in case
        window.addEventListener("message", (e) => {
          console.log("Callback received message:", e.data);
          sendMessages();
        });
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

