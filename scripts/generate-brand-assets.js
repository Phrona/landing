/**
 * Generate Phrona brand assets (favicon set + OG share image) from SVG sources.
 *
 * Outputs to landing/src/app/ (Next.js auto-wires icon.png + apple-icon.png + opengraph-image.png).
 * Run: node scripts/generate-brand-assets.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");
const PUBLIC_DIR = path.join(ROOT, "public");
const LOGOS_DIR = path.join(PUBLIC_DIR, "logos");

const NAVY = { r: 8, g: 17, b: 34, alpha: 1 }; // #081122 — Phrona brand navy
const P_MARK = path.join(LOGOS_DIR, "Phrona_P_Light_paths.svg");
const WORDMARK = path.join(LOGOS_DIR, "Phrona_Light_paths.svg");

// --- Favicon set: navy badge with centered white P-mark ---
// Like Notion (black square + white N) and Linear (light square + dark icon).
// High contrast on both light AND dark browser tabs.
//
// Logo at 78% of canvas — bumped from 62% to make the P read thicker at small
// browser-tab sizes (16x16). Higher density (1200) sharpens edge rasterization.
async function makeBadgeIcon(size, outPath) {
  const logoSize = Math.round(size * 0.78);
  const pSvgBuffer = fs.readFileSync(P_MARK);

  // Pre-render the P at logoSize at high density for sharper edges
  const pPng = await sharp(pSvgBuffer, { density: 1200 })
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: NAVY,
    },
  })
    .composite([{ input: pPng, gravity: "center" }])
    .png()
    .toFile(outPath);

  console.log(`  ✓ ${path.relative(ROOT, outPath)} (${size}×${size})`);
}

// --- SVG icon: navy badge + white P, vector. Preferred by modern browsers. ---
// Wraps the existing P SVG inside an outer SVG with a navy rect background.
// Renders crisp at any size (16x16 favicon all the way up to 512x512 dock icon).
function makeSvgIcon(outPath) {
  const pContent = fs.readFileSync(P_MARK, "utf-8");
  const innerMatch = pContent.match(/<svg[^>]*>([\s\S]+)<\/svg>/);
  if (!innerMatch) {
    throw new Error("Couldn't extract inner content from P-mark SVG");
  }
  const innerContent = innerMatch[1];

  // P-mark intrinsic dimensions: 835×752. Center it in a 1000×1000 viewBox
  // with ~80% sizing for a thicker P appearance.
  const composed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="#081122"/>
  <svg x="100" y="124" width="800" height="752" viewBox="0 0 835 752" preserveAspectRatio="xMidYMid meet">
    ${innerContent}
  </svg>
</svg>
`;

  fs.writeFileSync(outPath, composed);
  console.log(`  ✓ ${path.relative(ROOT, outPath)} (vector)`);
}

// --- OG share image: 1200×630, navy bg, white wordmark centered slightly above middle ---
async function makeOGImage(outPath) {
  const W = 1200;
  const H = 630;
  const wordmarkWidth = 720; // ~60% of W
  // Wordmark intrinsic ratio: 3116 / 1215 ≈ 2.566:1
  const wordmarkHeight = Math.round(wordmarkWidth / 2.566);

  const wordmarkSvg = fs.readFileSync(WORDMARK);
  const wordmarkPng = await sharp(wordmarkSvg, { density: 300 })
    .resize(wordmarkWidth, wordmarkHeight, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Center horizontally, slightly above center vertically (more visually balanced for OG previews)
  const left = Math.round((W - wordmarkWidth) / 2);
  const top = Math.round((H - wordmarkHeight) / 2) - 20;

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: NAVY,
    },
  })
    .composite([{ input: wordmarkPng, top, left }])
    .png()
    .toFile(outPath);

  console.log(`  ✓ ${path.relative(ROOT, outPath)} (${W}×${H})`);
}

(async () => {
  console.log("Generating Phrona brand assets...\n");

  // Ensure dirs exist
  if (!fs.existsSync(APP_DIR)) {
    throw new Error(`App dir not found: ${APP_DIR}`);
  }

  console.log("Favicon set (navy badge + white P):");
  // SVG first — modern browsers prefer it, renders crisp at any size
  makeSvgIcon(path.join(APP_DIR, "icon.svg"));
  // Next.js auto-wires these by filename convention in app/
  await makeBadgeIcon(32, path.join(APP_DIR, "icon.png"));
  await makeBadgeIcon(180, path.join(APP_DIR, "apple-icon.png"));
  // Higher-res versions in public/ for manifest references later
  await makeBadgeIcon(192, path.join(PUBLIC_DIR, "icon-192.png"));
  await makeBadgeIcon(512, path.join(PUBLIC_DIR, "icon-512.png"));

  console.log("\nOG share image:");
  // Next.js auto-wires opengraph-image.png in app/ as the og:image meta
  await makeOGImage(path.join(APP_DIR, "opengraph-image.png"));
  // Twitter uses the same image by default if twitter-image isn't specified
  await makeOGImage(path.join(APP_DIR, "twitter-image.png"));

  console.log("\nDone. Restart Next dev server to pick up new icon files.");
})().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
