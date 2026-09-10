import { parseSharePath, isAuthorizedShareToken, SHARE_HEADERS } from "./_packet.js";
import { PAYLOADS } from "./_payloads.js";

const PREFIX = "/studio/share/costello/";

export async function onRequest(context) {
  const { request, env } = context;
  const headers = new Headers(SHARE_HEADERS);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405, headers });
  }

  const pathname = new URL(request.url).pathname;
  const path = pathname.startsWith(PREFIX) ? pathname.slice(PREFIX.length) : "";
  const parsed = parseSharePath(path);

  if (!parsed.ok || !(await isAuthorizedShareToken(parsed.token, env && env.COSTELLO_COUNSEL_SHARE_TOKEN))) {
    return new Response(null, { status: 404, headers });
  }

  const body = decodePayload(parsed.filename);
  if (!body) {
    return new Response(null, { status: 404, headers });
  }

  headers.set("Content-Type", parsed.contentType);
  headers.set("Content-Disposition", parsed.contentDisposition);
  headers.set("Content-Length", String(body.byteLength));

  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers,
  });
}

function decodePayload(filename) {
  const b64 = PAYLOADS[filename];
  if (!b64) return null;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
