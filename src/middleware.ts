import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
	const url = context.url;

	// 排除 CMS 和 API 路由，让 Cloudflare Functions 处理
	if (url.pathname.startsWith("/auth") || url.pathname.startsWith("/api/")) {
		return next();
	}

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

