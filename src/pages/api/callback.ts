import type { APIRoute } from "astro";

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

export const GET: APIRoute = async ({ request, url }) => {
	const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
	const GITHUB_CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

	if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
		return renderBody("error", { error: "OAuth not configured" });
	}

	try {
		const code = url.searchParams.get("code");

		if (!code) {
			return renderBody("error", { error: "No code provided" });
		}

		const response = await fetch("https://github.com/login/oauth/access_token", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"user-agent": "cf-pages-oauth",
				accept: "application/json",
			},
			body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code }),
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
};

