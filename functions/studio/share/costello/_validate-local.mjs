import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveShareRequest, SHARE_HEADERS, ALLOWED_FILES } from "./_packet.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.resolve(here, "../../../../studio/kitchen/costello/documents");
const token = process.env.COSTELLO_COUNSEL_SHARE_TOKEN;
if (!token) {
  console.error("COSTELLO_COUNSEL_SHARE_TOKEN is required");
  process.exit(1);
}

function deny(res) {
  res.writeHead(404, { ...SHARE_HEADERS });
  res.end();
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { ...SHARE_HEADERS });
    res.end();
    return;
  }
  const prefix = "/studio/share/costello/";
  if (url.pathname === "/studio/share/costello" || url.pathname === "/studio/share/costello/") {
    deny(res);
    return;
  }
  if (!url.pathname.startsWith(prefix)) {
    deny(res);
    return;
  }
  const rest = url.pathname.slice(prefix.length);
  const resolved = resolveShareRequest({ path: rest, token });
  if (!resolved.ok) {
    deny(res);
    return;
  }
  const filePath = path.join(docs, resolved.filename);
  if (path.dirname(filePath) !== docs || !fs.existsSync(filePath)) {
    deny(res);
    return;
  }
  const body = fs.readFileSync(filePath);
  const headers = {
    ...SHARE_HEADERS,
    "Content-Type": resolved.contentType,
    "Content-Disposition": resolved.contentDisposition,
    "Content-Length": String(body.length),
  };
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
});

const port = 8766;
await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

const base = `http://127.0.0.1:${port}/studio/share/costello`;
const results = [];

async function check(name, pathname, expect) {
  const res = await fetch(base + pathname, { redirect: "manual" });
  const buf = Buffer.from(await res.arrayBuffer());
  const headerOk = res.headers.get("x-robots-tag") === "noindex, nofollow, noarchive"
    && res.headers.get("cache-control") === "private, no-store"
    && res.headers.get("referrer-policy") === "no-referrer"
    && res.headers.get("x-content-type-options") === "nosniff";
  let pass = res.status === expect.status && headerOk;
  if (expect.type) pass = pass && res.headers.get("content-type") === expect.type;
  if (expect.magic) pass = pass && buf.slice(0, expect.magic.length).equals(Buffer.from(expect.magic));
  if (expect.empty) pass = pass && buf.length === 0;
  results.push({ name, pass, status: res.status, type: res.headers.get("content-type"), bytes: buf.length });
}

try {
  for (const filename of Object.keys(ALLOWED_FILES)) {
    const meta = ALLOWED_FILES[filename];
    const magic = filename.endsWith(".pdf") ? "%PDF" : "PK";
    await check("valid " + filename, `/${token}/${filename}`, {
      status: 200,
      type: meta.contentType,
      magic,
    });
  }
  await check("invalid token", `/not-the-token/COI_General_Liability.pdf`, { status: 404, empty: true });
  await check("unapproved filename", `/${token}/Costello_Referral_Letter_PROOF.pdf`, { status: 404, empty: true });
  await check("path traversal", `/${token}/../costello-review/index.html`, { status: 404, empty: true });
  await check("encoded traversal", `/${token}/%2e%2e/Costello_Website_SOW_Itemized_Final_2026-09-10.docx`, { status: 404, empty: true });
  await check("directory", `/`, { status: 404, empty: true });
  await check("token only", `/${token}/`, { status: 404, empty: true });
} finally {
  server.close();
}

console.log(JSON.stringify(results, null, 2));
if (results.some((row) => !row.pass)) process.exit(1);
