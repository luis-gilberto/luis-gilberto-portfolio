
const fs = require('fs');
const path = require('path');

const handlerPath = path.join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs');

if (fs.existsSync(handlerPath)) {
  const content = fs.readFileSync(handlerPath, 'utf8');
  const index = content.indexOf('resvg.wasm');
  if (index !== -1) {
    console.log('Found resvg.wasm at index:', index);
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + 100);
    console.log('Context:', content.substring(start, end));
  } else {
    console.log('resvg.wasm not found in handler.mjs');
  }
} else {
  console.log('handler.mjs not found');
}
