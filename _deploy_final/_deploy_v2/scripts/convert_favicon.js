const sharp = require('sharp');
const path = require('path');

const sizes = [16, 32, 64];
const inputPath = path.join(__dirname, '..', 'assets', 'Components', 'LG_Symbol_fav_icon_Insights.png');
const outputDir = path.join(__dirname, '..', 'insights', 'assets', 'icons');

async function generateFavicons() {
  try {
    // Generate PNG files for each size
    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));
    }

    // Generate ICO file containing all sizes
    await sharp(inputPath)
      .resize(64, 64)
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('Favicon generation complete!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();