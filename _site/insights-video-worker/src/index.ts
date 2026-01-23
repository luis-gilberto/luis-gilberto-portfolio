export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)
    const key = url.pathname.replace(/^\//, "")
    if (!key) return new Response("Not Found", { status: 404 })

    const range = request.headers.get("Range") || undefined
    const object = await env.INSIGHTS_VIDEO.get(key, { range })
    if (!object) return new Response("Not Found", { status: 404 })

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set("etag", object.httpEtag)
    return new Response("body" in object ? object.body : undefined, {
      status: "body" in object ? 200 : 412,
      headers,
    })
  },
}

