import { resolveShareRequest, SHARE_HEADERS } from "./_packet.js";

const PREFIX = "/studio/share/costello/";

export async function onRequest(context) {
  const { request, env } = context;
  const headers = new Headers(SHARE_HEADERS);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405, headers });
  }

  const pathname = new URL(request.url).pathname;
  const path = pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) : "";

  const resolved = resolveShareRequest({
    path,
    token: String(env.COSTELLO_COUNSEL_SHARE_TOKEN || "").trim(),
  });

  if (!resolved.ok) {
    return new Response(null, { status: 404, headers });
  }

  const assetRes = await fetchFirstAsset(env, request, resolved.assetPaths);
  if (!assetRes || !assetRes.ok) {
    return new Response(null, { status: 404, headers });
  }

  headers.set("Content-Type", resolved.contentType);
  headers.set("Content-Disposition", resolved.contentDisposition);

  return new Response(request.method === "HEAD" ? null : assetRes.body, {
    status: 200,
    headers,
  });
}

async function fetchFirstAsset(env, request, assetPaths) {
  if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") return null;
  for (const assetPath of assetPaths) {
    const assetUrl = new URL(assetPath, request.url);
    const assetRes = await env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (assetRes && assetRes.ok) return assetRes;
  }
  return null;
}
