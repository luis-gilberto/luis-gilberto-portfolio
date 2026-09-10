import { SHARE_HEADERS } from "../costello/_packet.js";

export async function onRequest() {
  return new Response(null, {
    status: 404,
    headers: new Headers(SHARE_HEADERS),
  });
}
