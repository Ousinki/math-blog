// Cloudflare Pages Function for GitHub OAuth callback
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
	return new Blob([html], { type: "text/html;charset=UTF-8" });
}

export async function onRequest(context: {
	request: Request;
	env: { GITHUB_CLIENT_ID?: string; GITHUB_CLIENT_SECRET?: string };
}) {
	const { request, env } = context;
	const client_id = env.GITHUB_CLIENT_ID;
	const client_secret = env.GITHUB_CLIENT_SECRET;

	if (!client_id || !client_secret) {
		return new Response(renderBody("error", { error: "OAuth not configured" }), {
			headers: { "content-type": "text/html;charset=UTF-8" },
			status: 500,
		});
	}

	try {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");

		if (!code) {
			return new Response(renderBody("error", { error: "No code provided" }), {
				headers: { "content-type": "text/html;charset=UTF-8" },
				status: 400,
			});
		}

		const response = await fetch("https://github.com/login/oauth/access_token", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"user-agent": "cf-pages-oauth",
				accept: "application/json",
			},
			body: JSON.stringify({ client_id, client_secret, code }),
		});

		const result = (await response.json()) as { error?: string; access_token?: string };

		if (result.error) {
			return new Response(renderBody("error", result), {
				headers: { "content-type": "text/html;charset=UTF-8" },
				status: 401,
			});
		}

		const token = result.access_token;
		const provider = "github";

		return new Response(renderBody("success", { token, provider }), {
			headers: { "content-type": "text/html;charset=UTF-8" },
			status: 200,
		});
	} catch (error) {
		return new Response(renderBody("error", { error: (error as Error).message }), {
			headers: { "content-type": "text/html;charset=UTF-8" },
			status: 500,
		});
	}
}

