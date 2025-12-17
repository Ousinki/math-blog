// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/_server-islands/*"
  ],
  exclude: [
    "/",
    "/_astro/*",
    "/#",
    "/blog/*",
    "/icon.svg",
    "/social-card.png",
    "/notes/*",
    "/og-image/*",
    "/rss.xml",
    "/404",
    "/about",
    "/posts/*",
    "/tags/*"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/.wrangler/tmp/pages-0oEbSG/bundledWorker-0.8546041584343934.mjs";
import { isRoutingRuleMatch } from "/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/.wrangler/tmp/pages-0oEbSG/bundledWorker-0.8546041584343934.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=sqb1hpdtmwf.js.map
