const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const srcPath = path.resolve(root, "insights/assets/images/coral-3d_logomark.png");
const outDir = path.resolve(root, "insights/assets/icons");

// File is WebP bytes despite .png extension
const srcBuf = fs.readFileSync(srcPath);
const srcDataUrl = "data:image/webp;base64," + srcBuf.toString("base64");

const sizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 64, name: "favicon-64x64.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: chrome,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  for (const { size, name } of sizes) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(
      `<!DOCTYPE html><html><body style="margin:0;background:#111">
<canvas id="c" width="${size}" height="${size}"></canvas>
<script>
window.done = (async () => {
  const img = new Image();
  img.src = ${JSON.stringify(srcDataUrl)};
  await img.decode();
  const c = document.getElementById("c");
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, ${size}, ${size});
  const pad = Math.round(${size} * 0.10);
  const box = ${size} - pad * 2;
  const scale = Math.min(box / img.naturalWidth, box / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (${size} - dw) / 2;
  const dy = (${size} - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  return c.toDataURL("image/png");
})();
</script>
</body></html>`,
      { waitUntil: "domcontentloaded" }
    );
    const dataUrl = await page.evaluate(() => window.done);
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    fs.writeFileSync(path.join(outDir, name), buf);
    console.log(name, buf.length);
  }

  fs.copyFileSync(
    path.join(outDir, "favicon-32x32.png"),
    path.join(outDir, "favicon.ico")
  );
  console.log("favicon.ico <- favicon-32x32.png");
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
