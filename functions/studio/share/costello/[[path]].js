import { resolveShareRequest, SHARE_HEADERS } from "./_packet.js";

export async function onRequest(context) {
  const { request, env, params } = context;
  const headers = new Headers(SHARE_HEADERS);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405, headers });
  }

  const resolved = resolveShareRequest({
    path: params.path,
    token: env.COSTELLO_COUNSEL_SHARE_TOKEN,
  });

  if (!resolved.ok || !env.ASSETS) {
    return new Response(null, { status: 404, headers });
  }

  const assetUrl = new URL(resolved.assetPath, request.url);
  const assetRes = await env.ASSETS.fetch(
    new Request(assetUrl, { method: "GET" })
  );

  if (!assetRes.ok) {
    return new Response(null, { status: 404, headers });
  }

  headers.set("Content-Type", resolved.contentType);
  headers.set("Content-Disposition", resolved.contentDisposition);

  return new Response(request.method === "HEAD" ? null : assetRes.body, {
    status: 200,
    headers,
  });
}
