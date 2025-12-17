globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_BFOTuBc9.mjs';
import './chunks/astro/server_DDkrq0wE.mjs';
import { s as sequence } from './chunks/index_CDyXXej9.mjs';

const onRequest$2 = async (context, next) => {
  const url = context.url;
  if (url.pathname.startsWith("/blog")) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
  }
  return next();
};

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
