globalThis.process ??= {}; globalThis.process.env ??= {};
import { E as decodeKey } from './chunks/astro/server_DDkrq0wE.mjs';
import './chunks/astro-designed-error-pages_BFOTuBc9.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_z0VKXTUl.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/","cacheDir":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/node_modules/.astro/","outDir":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/dist/","srcDir":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/","publicDir":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/public/","buildClientDir":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/dist/","buildServerDir":"file:///Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"notes/rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/notes/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/notes\\/rss\\.xml\\/?$","segments":[[{"content":"notes","dynamic":false,"spread":false}],[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/notes/rss.xml.ts","pathname":"/notes/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"tags/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tags","isIndex":true,"type":"page","pattern":"^\\/tags\\/?$","segments":[[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tags/index.astro","pathname":"/tags","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://astro-cactus.chriswilliams.dev/","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/posts/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/notes/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/notes/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/posts/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/tags/[tag]/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/tags/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/components/note/Note.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/notes/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/notes/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/data/post.ts",{"propagation":"in-tree","containsHead":false}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/og-image/[...slug].png.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/og-image/[...slug].png@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/posts/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/posts/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/tags/[tag]/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/tags/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/layouts/BlogPost.astro",{"propagation":"in-tree","containsHead":false}],["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/pages/notes/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/notes/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/notes/rss.xml@_@ts":"pages/notes/rss.xml.astro.mjs","\u0000@astro-page:src/pages/notes/[...page]@_@astro":"pages/notes/_---page_.astro.mjs","\u0000@astro-page:src/pages/notes/[...slug]@_@astro":"pages/notes/_---slug_.astro.mjs","\u0000@astro-page:src/pages/og-image/[...slug].png@_@ts":"pages/og-image/_---slug_.png.astro.mjs","\u0000@astro-page:src/pages/posts/[...page]@_@astro":"pages/posts/_---page_.astro.mjs","\u0000@astro-page:src/pages/posts/[...slug]@_@astro":"pages/posts/_---slug_.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/tags/[tag]/[...page]@_@astro":"pages/tags/_tag_/_---page_.astro.mjs","\u0000@astro-page:src/pages/tags/index@_@astro":"pages/tags.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Cxbtcyww.mjs","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/.astro/content-assets.mjs":"chunks/content-assets_BTTwgCDg.mjs","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/.astro/content-modules.mjs":"chunks/content-modules_Bvq7llv8.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BBoRQ_z2.mjs","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CnpLerHU.mjs","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/layouts/BlogPost.astro?astro&type=script&index=0&lang.ts":"_astro/BlogPost.astro_astro_type_script_index_0_lang.CSRpGidt.js","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.DuSsDY4R.js","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/components/Search.astro?astro&type=script&index=0&lang.ts":"_astro/Search.astro_astro_type_script_index_0_lang.rgeqRwRC.js","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts":"_astro/ThemeToggle.astro_astro_type_script_index_0_lang.C1tldoqx.js","/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/node_modules/@pagefind/default-ui/npm_dist/mjs/ui-core.mjs":"_astro/ui-core.D3wZvCxs.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/ousin/.gemini/antigravity/scratch/astro-cactus-blog/src/layouts/BlogPost.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"to-top-btn\"),n=document.getElementById(\"blog-hero\");function c(t){t.forEach(o=>{e.dataset.show=(!o.isIntersecting).toString()})}e.addEventListener(\"click\",()=>{document.documentElement.scrollTo({behavior:\"smooth\",top:0})});const r=new IntersectionObserver(c);r.observe(n);"]],"assets":["/_astro/ec.a8zzi.css","/_astro/ec.0vx5m.js","/_astro/roboto-mono-regular.Ceay284C.ttf","/_astro/roboto-mono-700.CAZppuP3.ttf","/_astro/logo.Njau-rsP.png","/_astro/cover.CXyjlGn_.png","/_astro/_slug_.DcdpiiDi.css","/_redirects","/icon.svg","/social-card.png","/_astro/Header.astro_astro_type_script_index_0_lang.DuSsDY4R.js","/_astro/Search.astro_astro_type_script_index_0_lang.rgeqRwRC.js","/_astro/ThemeToggle.astro_astro_type_script_index_0_lang.C1tldoqx.js","/_astro/domElement.CpM5XNjJ.js","/_astro/ui-core.D3wZvCxs.js","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_astro/_slug_.DcdpiiDi.css","/_worker.js/_astro/cover.CXyjlGn_.png","/_worker.js/_astro/ec.0vx5m.js","/_worker.js/_astro/ec.a8zzi.css","/_worker.js/_astro/logo.Njau-rsP.png","/_worker.js/_astro/roboto-mono-700.CAZppuP3.ttf","/_worker.js/_astro/roboto-mono-regular.Ceay284C.ttf","/_worker.js/pages/404.astro.mjs","/_worker.js/pages/about.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/rss.xml.astro.mjs","/_worker.js/pages/tags.astro.mjs","/_worker.js/chunks/Base_CTo6LNC5.mjs","/_worker.js/chunks/FormattedDate_DlU0jh0u.mjs","/_worker.js/chunks/Icon_DeIi9TRS.mjs","/_worker.js/chunks/Note_oprzMQBA.mjs","/_worker.js/chunks/Paginator_CDtvjrSb.mjs","/_worker.js/chunks/PostPreview_C8P9SzB5.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_c3eTZYHx.mjs","/_worker.js/chunks/_astro_assets_Dj5OM8fE.mjs","/_worker.js/chunks/_astro_content_DSPtv2tP.mjs","/_worker.js/chunks/_astro_data-layer-content_BBoRQ_z2.mjs","/_worker.js/chunks/astro-designed-error-pages_BFOTuBc9.mjs","/_worker.js/chunks/astro_CqWZcxph.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/content-assets_BTTwgCDg.mjs","/_worker.js/chunks/content-modules_Bvq7llv8.mjs","/_worker.js/chunks/date_BmKkvDh4.mjs","/_worker.js/chunks/index_CDyXXej9.mjs","/_worker.js/chunks/index_LfC4b8se.mjs","/_worker.js/chunks/noop-middleware_z0VKXTUl.mjs","/_worker.js/chunks/parse_BeDHJKc-.mjs","/_worker.js/chunks/path_BgNISshD.mjs","/_worker.js/chunks/post_CvwUY7X1.mjs","/_worker.js/chunks/remote_CrdlObHx.mjs","/_worker.js/chunks/runtime_DCg6k_UE.mjs","/_worker.js/chunks/sharp_CnpLerHU.mjs","/_worker.js/chunks/site.config_BRaR8pS3.mjs","/_worker.js/pages/notes/_---page_.astro.mjs","/_worker.js/pages/notes/_---slug_.astro.mjs","/_worker.js/pages/notes/rss.xml.astro.mjs","/_worker.js/pages/og-image/_---slug_.png.astro.mjs","/_worker.js/pages/posts/_---page_.astro.mjs","/_worker.js/pages/posts/_---slug_.astro.mjs","/_worker.js/chunks/astro/server_DDkrq0wE.mjs","/_worker.js/pages/tags/_tag_/_---page_.astro.mjs","/404.html","/about/index.html","/notes/rss.xml","/rss.xml","/tags/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"ivE/yayztQgF6gW/gucMs+Xmz+BudBfElV/dHiR7rS8=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
