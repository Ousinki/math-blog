// Cloudflare Pages Function for GitHub OAuth authentication at /auth endpoint
export async function onRequest(context: { request: Request; env: { GITHUB_CLIENT_ID?: string } }) {
	const { request, env } = context;
	const client_id = env.GITHUB_CLIENT_ID;

	if (!client_id) {
		return new Response("GITHUB_CLIENT_ID not configured", { status: 500 });
	}

	try {
		const url = new URL(request.url);
		const redirectUrl = new URL("https://github.com/login/oauth/authorize");
		redirectUrl.searchParams.set("client_id", client_id);
		redirectUrl.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
		redirectUrl.searchParams.set("scope", "repo user");
		redirectUrl.searchParams.set("state", crypto.getRandomValues(new Uint8Array(12)).join(""));

		return Response.redirect(redirectUrl.href, 302);
	} catch (err) {
		return new Response(String((err as Error)?.message || err), { status: 500 });
	}
}

