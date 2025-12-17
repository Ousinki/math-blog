export const prerender = false;

function renderBody(status: string, content: unknown) {
  const html = `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>Authorizing...</title>
	</head>
	<body>
		<script>
			const receiveMessage = (message) => {
				window.opener.postMessage(
					'authorization:github:${status}:${JSON.stringify(content)}',
					message.origin
				);
				window.removeEventListener("message", receiveMessage, false);
			}
			window.addEventListener("message", receiveMessage, false);
			window.opener.postMessage("authorizing:github", "*");
		</script>
	</body>
	</html>`;
  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
}

export async function GET({ request }: { request: Request }) {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return renderBody("error", { error: "OAuth not configured" });
  }

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      const errorResponse = renderBody("error", { error: "No code provided" });
      return new Response(errorResponse.body, {
        headers: errorResponse.headers,
        status: 400,
      });
    }

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "astro-decap-oauth",
        accept: "application/json",
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const result = (await response.json()) as { error?: string; access_token?: string };

    if (result.error) {
      return renderBody("error", result);
    }

    const token = result.access_token;
    const provider = "github";

    return renderBody("success", { token, provider });
  } catch (error) {
    return renderBody("error", { error: (error as Error).message });
  }
}

