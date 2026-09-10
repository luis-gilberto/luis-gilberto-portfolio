export const ALLOWED_FILES = Object.freeze({
  "Costello_Website_SOW_Revised_2026-09-10.docx": {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    disposition: "attachment",
  },
  "Costello_Website_SOW_Redline_2026-09-10.docx": {
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

export function resolveShareRequest({ path, token }) {
  const expected = String(token || "");
  if (!expected) return { ok: false, reason: "unconfigured" };

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

  const [given, filename] = parts;
  if (!isExactAllowlistName(filename)) return { ok: false, reason: "allowlist" };
  if (!tokensMatch(given, expected)) return { ok: false, reason: "token" };

  const meta = ALLOWED_FILES[filename];
  return {
    ok: true,
    filename,
    assetPaths: [ASSET_DIR + filename, ASSET_FALLBACK_DIR + filename],
    contentType: meta.contentType,
    contentDisposition: `${meta.disposition}; filename="${filename}"`,
  };
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
