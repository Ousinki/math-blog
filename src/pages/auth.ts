import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, redirect }) => {
	const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;

	if (!GITHUB_CLIENT_ID) {
		return new Response("GITHUB_CLIENT_ID not configured", { status: 500 });
	}

	try {
		const url = new URL(request.url);
		const redirectUrl = new URL("https://github.com/login/oauth/authorize");
		redirectUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
		redirectUrl.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
		redirectUrl.searchParams.set("scope", "repo user");
		redirectUrl.searchParams.set("state", crypto.getRandomValues(new Uint8Array(12)).join(""));

		return redirect(redirectUrl.href, 302);
	} catch (err) {
		return new Response(String((err as Error)?.message || err), { status: 500 });
	}
};

