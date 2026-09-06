import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function serveRepoStatic() {
  const prefixes = ["/studio/", "/assets/", "/work/"];
  return {
    name: "serve-repo-static",
    configureServer(server: {
      middlewares: {
        use: (fn: (req: { url?: string }, res: { setHeader: (k: string, v: string) => void; end: (b: Buffer) => void; statusCode: number }, next: () => void) => void) => void;
      };
    }) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url ?? "";
        const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
        let url = raw.split("?")[0] ?? "";
        const appBase = "/studio/work/sharnay-photography/";
        if (
          url.startsWith(`${appBase}studio/`) ||
          url.startsWith(`${appBase}assets/css/`) ||
          url.startsWith(`${appBase}assets/js/`) ||
          url.startsWith(`${appBase}assets/images/`)
        ) {
          url = url.slice(appBase.length - 1);
          req.url = url + q;
        }
        if (url === "/favicon.ico") {
          const fav = path.join(repoRoot, "studio/brand-system/assets/monogram.png");
          if (fs.existsSync(fav)) {
            res.setHeader("Content-Type", "image/png");
            res.end(fs.readFileSync(fav));
            return;
          }
        }
        if (url === `${appBase}es` || url === `${appBase}es/`) {
          req.url = appBase;
          return next();
        }
        if (!prefixes.some((p) => url.startsWith(p))) return next();
        if (url.startsWith(appBase)) return next();
        const filePath = path.join(repoRoot, url.replace(/^\//, ""));
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return next();
        const ext = path.extname(filePath);
        const types: Record<string, string> = {
          ".css": "text/css; charset=utf-8",
          ".js": "text/javascript; charset=utf-8",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".svg": "image/svg+xml",
          ".woff2": "font/woff2",
        };
        res.setHeader("Content-Type", types[ext] || "application/octet-stream");
        res.end(fs.readFileSync(filePath));
      });
    },
  };
}

function restoreOriginAbsoluteUrls() {
  const base = "/studio/work/sharnay-photography/";
  return {
    name: "restore-origin-absolute-urls",
    transformIndexHtml(html: string) {
      return html
        .replaceAll(`${base}studio/`, "/studio/")
        .replaceAll(`${base}assets/css/`, "/assets/css/")
        .replaceAll(`${base}assets/js/`, "/assets/js/")
        .replaceAll(`${base}assets/images/`, "/assets/images/");
    },
  };
}

export default defineConfig({
  base: "/studio/work/sharnay-photography/",
  plugins: [react(), restoreOriginAbsoluteUrls(), serveRepoStatic()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
  },
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
  },
});
