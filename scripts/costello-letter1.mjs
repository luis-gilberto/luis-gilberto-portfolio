#!/usr/bin/env node
import { main } from "../studio/kitchen/costello/production/letter-1/lib/cli.mjs";

main(process.argv.slice(2))
  .then((code) => process.exit(code ?? 0))
  .catch((err) => {
    console.error(err?.stack || err?.message || err);
    process.exit(1);
  });
