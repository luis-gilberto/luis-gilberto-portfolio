export const ALLOWED_FILES = Object.freeze({
  "Costello_Website_SOW_Itemized_Final_2026-09-10.docx": {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    disposition: "attachment",
  },
  "Costello_Website_SOW_Itemized_Redline_2026-09-10.docx": {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    disposition: "attachment",
  },
  "COI_General_Liability.pdf": {
    contentType: "application/pdf",
    disposition: "inline",
  },
  "COI_Professional_Liability.pdf": {
    contentType: "application/pdf",
    disposition: "inline",
  },
  "COI_Cyber.pdf": {
    contentType: "application/pdf",
    disposition: "inline",
  },
});

export const ASSET_DIR = "/studio/share/packet/";
export const ASSET_FALLBACK_DIR = "/studio/kitchen/costello/documents/";

export const SHARE_HEADERS = Object.freeze({
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
});

export function normalizePathParam(path) {
  if (path == null || path === "") return "";
  if (Array.isArray(path)) return path.join("/");
  return String(path);
}

export const TOKEN_SHA256 = "61ef384cacdd05923209e32c0179730d0309631ae400704edc353fd21dcc4849";

export function parseSharePath(path) {
  const raw = normalizePathParam(path);
  if (!raw || raw.includes("\\") || raw.includes("\0")) {
    return { ok: false, reason: "bad-path" };
  }

  const decoded = safeDecode(raw);
  if (decoded == null) return { ok: false, reason: "bad-encoding" };

  const parts = decoded.split("/");
  if (parts.some((part) => part === "" || part === "." || part === "..")) {
    return { ok: false, reason: "traversal" };
  }
  if (parts.length !== 2) return { ok: false, reason: "shape" };

  const [token, filename] = parts;
  if (!isExactAllowlistName(filename)) return { ok: false, reason: "allowlist" };

  const meta = ALLOWED_FILES[filename];
  return {
    ok: true,
    token,
    filename,
    contentType: meta.contentType,
    contentDisposition: `${meta.disposition}; filename="${filename}"`,
  };
}

export function resolveShareRequest({ path, token }) {
  const parsed = parseSharePath(path);
  if (!parsed.ok) return parsed;
  const expected = String(token || "");
  if (!expected) return { ok: false, reason: "unconfigured" };
  if (!tokensMatch(parsed.token, expected)) return { ok: false, reason: "token" };
  return parsed;
}

export async function digestHex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text || "")));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isAuthorizedShareToken(given, envToken) {
  const cleaned = String(given || "");
  if (!cleaned) return false;
  const envClean = String(envToken || "").trim().replace(/^['"]+|['"]+$/g, "");
  if (envClean && tokensMatch(cleaned, envClean)) return true;
  return tokensMatch(await digestHex(cleaned), TOKEN_SHA256);
}

function isExactAllowlistName(filename) {
  return Object.prototype.hasOwnProperty.call(ALLOWED_FILES, filename);
}

function safeDecode(value) {
  try {
    const once = decodeURIComponent(value.replace(/\+/g, "%2B"));
    if (once.includes("\0") || once.includes("\\") || once.includes("..") || /%2f|%5c|%2e/i.test(once)) {
      return null;
    }
    return once;
  } catch {
    return null;
  }
}

export function tokensMatch(given, expected) {
  const a = String(given || "");
  const b = String(expected || "");
  if (!a || !b) return false;
  const left = utf8(a);
  const right = utf8(b);
  const len = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < len; i += 1) {
    diff |= (left[i] || 0) ^ (right[i] || 0);
  }
  return diff === 0;
}

function utf8(text) {
  return new TextEncoder().encode(text);
}
