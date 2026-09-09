const COOKIE = "lg_kitchen";
const TTL_SEC = 14 * 24 * 60 * 60;
const UNLOCK_PATH = "/studio/kitchen/_unlock";

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const headers = kitchenHeaders();

  if (url.pathname === UNLOCK_PATH && request.method === "POST") {
    return handleUnlock(request, url, env, headers);
  }

  if (await hasValidSession(request, env)) {
    const response = await next();
    const out = new Response(response.body, response);
    headers.forEach((value, key) => out.headers.set(key, value));
    return out;
  }

  if (request.method === "HEAD") {
    return new Response(null, { status: 401, headers });
  }

  return unlockPage(url, headers, "");
}

function kitchenHeaders() {
  return new Headers({
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
    "Referrer-Policy": "same-origin",
  });
}

async function handleUnlock(request, url, env, headers) {
  const expected = env.KITCHEN_PASSWORD;
  if (!expected) {
    return unlockPage(url, headers, "Kitchen gate is not configured.");
  }

  const form = await request.formData();
  const submitted = String(form.get("password") || "");
  const nextPath = safeNext(form.get("next"));

  if (!(await passwordsMatch(submitted, expected))) {
    return unlockPage(url, headers, "That password is not correct.", nextPath);
  }

  headers.set("Set-Cookie", sessionCookie(await signSession(expected), url.protocol === "https:"));
  headers.set("Location", nextPath);
  return new Response(null, { status: 303, headers });
}

async function hasValidSession(request, env) {
  const secret = env.KITCHEN_PASSWORD;
  if (!secret) return false;
  const raw = readCookie(request, COOKIE);
  if (!raw) return false;
  return verifySession(raw, secret);
}

async function passwordsMatch(submitted, expected) {
  const a = await sha256(submitted);
  const b = await sha256(expected);
  return timingSafeEqual(a, b);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return new Uint8Array(buf);
}

function timingSafeEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function signSession(secret) {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = String(exp);
  const sig = await hmacHex(secret, payload);
  return `${payload}.${sig}`;
}

async function verifySession(token, secret) {
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = await hmacHex(secret, payload);
  return timingSafeEqual(utf8(sig), utf8(expected));
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("lg-studio-kitchen-v1:" + secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function utf8(text) {
  return new TextEncoder().encode(text);
}

function sessionCookie(value, secure) {
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/studio/kitchen",
    `Max-Age=${TTL_SEC}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(name + "=")) return trimmed.slice(name.length + 1);
  }
  return "";
}

function safeNext(value) {
  const next = String(value || "/studio/kitchen/");
  if (!next.startsWith("/studio/kitchen/") || next.startsWith("//") || next.includes("\\")) {
    return "/studio/kitchen/";
  }
  return next;
}

function unlockPage(url, headers, error, nextPath) {
  const next = safeNext(nextPath || url.searchParams.get("next") || refererKitchenPath(url));
  const message = error
    ? `<p class="err">${escapeHtml(error)}</p>`
    : `<p class="lede">This folder is a private review. Enter the shared password to continue.</p>`;
  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>LG Studio · Kitchen</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500&family=Inter:wght@400;500;600&display=swap" />
<style>
  :root { --ground:#EDEAE4; --navy:#2E4A6B; --flame:#F37021; --ink:#111111; --ink-soft:#45423D; --faint:#7B766D; --rule:#D8D2C8; --surface:#FBFAF7; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { min-height: 100vh; background: var(--ground); color: var(--ink); font-family: Inter, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .topbar { border-bottom: 1px solid var(--rule); }
  .wrap { max-width: 520px; margin: 0 auto; padding: 20px 24px; }
  .brandline { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .22em; }
  .brandline .sub { font-weight: 400; color: var(--faint); }
  .dot { margin: 0 8px; color: #BFB8AC; }
  .card { margin: 72px auto 96px; max-width: 520px; padding: 0 24px; }
  .eyebrow { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .24em; color: var(--flame); }
  h1 { margin: 12px 0 0; font-family: Fraunces, Georgia, serif; font-weight: 300; font-size: clamp(2rem, 5vw, 2.6rem); line-height: 1.1; letter-spacing: -.01em; }
  .lede, .err { margin: 16px 0 0; font-size: 15px; line-height: 1.7; color: var(--ink-soft); }
  .err { color: #8A2B0E; }
  form { margin-top: 28px; }
  label { display: block; font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); }
  input { width: 100%; margin-top: 8px; padding: 12px 14px; border: 1px solid var(--rule); border-radius: 2px; background: var(--surface); color: var(--ink); font: 15px/1.4 Inter, sans-serif; }
  input:focus { outline: 2px solid var(--flame); outline-offset: 2px; }
  button { margin-top: 16px; width: 100%; border: 0; border-radius: 2px; padding: 12px 16px; background: var(--navy); color: #FBFAF7; font-size: 13px; font-weight: 600; letter-spacing: .02em; cursor: pointer; }
  button:hover { opacity: .88; }
</style>
</head>
<body>
  <header class="topbar"><div class="wrap"><div class="brandline">LG Studio <span class="dot">·</span><span class="sub">Kitchen</span></div></div></header>
  <main class="card">
    <p class="eyebrow">Private review</p>
    <h1>Unlock this folder.</h1>
    ${message}
    <form method="post" action="${UNLOCK_PATH}">
      <input type="hidden" name="next" value="${escapeHtml(next)}" />
      <label for="password">Shared password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button type="submit">Unlock</button>
    </form>
  </main>
</body>
</html>`, { status: 401, headers });
}

function refererKitchenPath(url) {
  if (url.pathname.startsWith("/studio/kitchen/") && url.pathname !== UNLOCK_PATH) {
    return url.pathname + url.search;
  }
  return "/studio/kitchen/";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
