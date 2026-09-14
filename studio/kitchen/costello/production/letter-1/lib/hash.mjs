import crypto from "node:crypto";
import fs from "node:fs";

export function fileSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

export function runFingerprint(letterPath, listPath) {
  return {
    letterSha256: fileSha256(letterPath),
    listSha256: fileSha256(listPath),
    combined: crypto
      .createHash("sha256")
      .update(fileSha256(letterPath) + ":" + fileSha256(listPath))
      .digest("hex"),
  };
}
