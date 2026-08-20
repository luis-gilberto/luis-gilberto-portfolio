#!/usr/bin/env python3
"""Local static server with CSC Image Director save/apply/browse endpoints.

Usage (from repo root):
  python studio/tools/csc-image-director/dev-server.py
"""
from __future__ import annotations

import json
import mimetypes
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

try:
    from PIL import Image
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parents[3]
PORT = 4173
MANIFEST = ROOT / "studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json"
APPLIED_CSS = ROOT / "studio/case-studies/criar-sin-culpas/csc-crops-applied.css"
INDEX_HTML = ROOT / "studio/case-studies/criar-sin-culpas/index.html"

ALLOWED_ROOTS = [
    ROOT / "studio/lg-studio-portfolio/assets/criar-sin-culpas",
    ROOT / "studio/case-studies/criar-sin-culpas/evidence",
    ROOT / "nari-method-prod/assets",
]

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}


def _strip_bound_img(html: str, instance_id: str) -> tuple[str, int]:
    pattern = re.compile(
        r'<img\b(?=[^>]*\bdata-csc-img="' + re.escape(instance_id) + r'")[^>]*/?\s*>',
        re.IGNORECASE | re.DOTALL,
    )
    return pattern.subn("", html)


def _delete_manifest_instance(data: dict, instance_id: str) -> bool:
    before = len(data.get("instances") or [])
    data["instances"] = [i for i in data.get("instances") or [] if i.get("id") != instance_id]
    if len(data["instances"]) == before:
        return False
    if isinstance(data.get("pilots"), list):
        data["pilots"] = [p for p in data["pilots"] if p != instance_id]
    if isinstance(data.get("stats"), dict):
        data["stats"]["instances"] = len(data["instances"])
    return True


def _safe_under_allowed(rel: str) -> Path | None:
    rel = rel.replace("\\", "/").lstrip("/")
    candidate = (ROOT / rel).resolve()
    for base in ALLOWED_ROOTS:
        base_res = base.resolve()
        try:
            candidate.relative_to(base_res)
            return candidate
        except ValueError:
            continue
    return None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/__csc_director/ping":
            self._json(200, {"ok": True, "director": True})
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8"))
        except Exception:
            self.send_error(400, "Invalid JSON")
            return

        if parsed.path == "/__csc_director/ping":
            self._json(200, {"ok": True, "director": True})
            return

        if parsed.path == "/__csc_director/delete-instance":
            instance_id = str(payload.get("id") or "").strip()
            if not instance_id:
                self.send_error(400, "Missing id")
                return
            if not MANIFEST.exists():
                self.send_error(404, "Manifest not found")
                return
            data = json.loads(MANIFEST.read_text(encoding="utf-8"))
            if not _delete_manifest_instance(data, instance_id):
                self.send_error(404, "Instance not found")
                return
            MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            removed_html = 0
            if payload.get("removeFromHtml") and INDEX_HTML.exists():
                html = INDEX_HTML.read_text(encoding="utf-8")
                html, removed_html = _strip_bound_img(html, instance_id)
                if removed_html:
                    INDEX_HTML.write_text(html, encoding="utf-8")
            self._json(
                200,
                {
                    "ok": True,
                    "id": instance_id,
                    "removedHtml": removed_html > 0,
                    "instances": len(data["instances"]),
                },
            )
            return

        if parsed.path == "/__csc_director/save-manifest":
            if not isinstance(payload, dict) or "instances" not in payload:
                self.send_error(400, "Manifest must include instances")
                return
            MANIFEST.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            self._json(200, {"ok": True, "path": str(MANIFEST.relative_to(ROOT)).replace("\\", "/")})
            return

        if parsed.path == "/__csc_director/apply-crops":
            css = payload.get("css") or ""
            APPLIED_CSS.write_text(css, encoding="utf-8")
            self._json(
                200,
                {
                    "ok": True,
                    "path": str(APPLIED_CSS.relative_to(ROOT)).replace("\\", "/"),
                    "count": payload.get("count", 0),
                },
            )
            return

        if parsed.path == "/__csc_director/list-dir":
            rel = str(payload.get("path") or "").replace("\\", "/").strip("/")
            if not rel:
                target = ALLOWED_ROOTS[0].resolve()
            else:
                target = _safe_under_allowed(rel)
            if target is None or not target.exists():
                self.send_error(403, "Path not allowed")
                return
            if not target.is_dir():
                self.send_error(400, "Not a directory")
                return
            entries = []
            for child in sorted(target.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
                if child.name.startswith("."):
                    continue
                rel_child = str(child.relative_to(ROOT)).replace("\\", "/")
                if child.is_dir():
                    entries.append({"type": "dir", "name": child.name, "path": rel_child})
                elif child.suffix.lower() in IMG_EXT:
                    w = h = None
                    if Image:
                        try:
                            with Image.open(child) as im:
                                w, h = im.size
                        except Exception:
                            pass
                    entries.append(
                        {
                            "type": "file",
                            "name": child.name,
                            "path": rel_child,
                            "width": w,
                            "height": h,
                        }
                    )
            self._json(200, {"path": str(target.relative_to(ROOT)).replace("\\", "/"), "entries": entries})
            return

        if parsed.path == "/__csc_director/register-asset":
            rel = str(payload.get("path") or "").replace("\\", "/")
            target = _safe_under_allowed(rel)
            if target is None or not target.is_file():
                self.send_error(403, "File not allowed")
                return
            self._json(
                200,
                {
                    "ok": True,
                    "path": str(target.relative_to(ROOT)).replace("\\", "/"),
                    "filename": target.name,
                    "copied": False,
                    "originalPath": str(target.relative_to(ROOT)).replace("\\", "/"),
                },
            )
            return

        self.send_error(404, "Unknown endpoint")

    def _json(self, code: int, obj: dict):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        if args and str(args[0]).startswith("POST"):
            super().log_message(fmt, *args)


def main():
    mimetypes.add_type("application/json", ".json")
    mimetypes.add_type("image/svg+xml", ".svg")
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Serving {ROOT}")
    print(f"Image Director: http://localhost:{PORT}/studio/tools/csc-image-director/")
    print(f"Case study:     http://localhost:{PORT}/studio/case-studies/criar-sin-culpas/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
