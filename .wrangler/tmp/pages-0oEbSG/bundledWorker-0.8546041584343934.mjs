var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import { renderers } from "./renderers.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_c3eTZYHx.mjs";
import { manifest } from "./manifest_Cxbtcyww.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name(() => import("./pages/404.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/about.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/notes/rss.xml.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/notes/_---page_.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/notes/_---slug_.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/og-image/_---slug_.png.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/posts/_---page_.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/posts/_---slug_.astro.mjs"), "_page7");
var _page8 = /* @__PURE__ */ __name(() => import("./pages/rss.xml.astro.mjs"), "_page8");
var _page9 = /* @__PURE__ */ __name(() => import("./pages/tags/_tag_/_---page_.astro.mjs"), "_page9");
var _page10 = /* @__PURE__ */ __name(() => import("./pages/tags.astro.mjs"), "_page10");
var _page11 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page11");
var pageMap = /* @__PURE__ */ new Map([
  ["src/pages/404.astro", _page0],
  ["src/pages/about.astro", _page1],
  ["src/pages/notes/rss.xml.ts", _page2],
  ["src/pages/notes/[...page].astro", _page3],
  ["src/pages/notes/[...slug].astro", _page4],
  ["src/pages/og-image/[...slug].png.ts", _page5],
  ["src/pages/posts/[...page].astro", _page6],
  ["src/pages/posts/[...slug].astro", _page7],
  ["src/pages/rss.xml.ts", _page8],
  ["src/pages/tags/[tag]/[...page].astro", _page9],
  ["src/pages/tags/index.astro", _page10],
  ["src/pages/index.astro", _page11]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name(() => import("./noop-entrypoint.mjs"), "actions"),
  middleware: /* @__PURE__ */ __name(() => import("./_astro-internal_middleware.mjs"), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.8546041584343934.mjs.map
