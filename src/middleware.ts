import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
	const url = context.url;

	// 阻止所有 /blog/ 路由，返回 404
	if (url.pathname.startsWith("/blog")) {
		// 返回 404 响应
		return new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	}

	return next();
};

