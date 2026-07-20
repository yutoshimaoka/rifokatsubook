// 記事本文の図解ブロックを画像（webp）に書き出します。
// 使い方: npm run generate:figures
import { execFile } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { readFigureBlocks, figureIllustration } from './figure-blocks.mjs';

const run = promisify(execFile);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CONTENT_WIDTH = 760;   // .article-detail-body の最大幅
const SCALE = 2;             // Retina 用に2倍で描画
const OUT_DIR = 'images/figures';
const TMP_DIR = '.figure-tmp';

const page = (inner) => `<!doctype html>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<style>
  /* 背景を透明にして書き出し、あとで余白を切り詰めます */
  html, body { margin: 0; padding: 0; background: transparent; }
  /* ビューポートはPC幅のまま、本文と同じ760pxに絞って描画する（段組みを本番と一致させる） */
  body { width: ${CONTENT_WIDTH}px; }
  /* 本文中と同じ間隔で描画されないよう、ブロック自身の外余白は消す */
  body > * { margin-top: 0 !important; margin-bottom: 0 !important; }
  .scroll-box { overflow: visible; }
  table { min-width: 0 !important; }
</style>
<div class="article-detail-body seo-article">${inner}</div>`;

await mkdir(OUT_DIR, { recursive: true });
await mkdir(TMP_DIR, { recursive: true });

const blocks = await readFigureBlocks();
for (const block of blocks) {
  if (figureIllustration[block.name]) continue; // 手描きイラストに置き換えるブロックは書き出さない
  const html = `${TMP_DIR}/${block.name}.html`;
  const shot = `${TMP_DIR}/${block.name}.png`;
  await writeFile(html, page(block.html));
  await run(CHROME, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--force-device-scale-factor=${SCALE}`,
    '--window-size=1280,2400',
    '--virtual-time-budget=6000',
    `--screenshot=${shot}`,
    `file://${process.cwd()}/${html}`,
  ]);
  // 透明部分を切り落として、記事の背景色（--warm-paper）に合成する
  await run('python3', ['-c', `
from PIL import Image
im = Image.open("${shot}").convert("RGBA")
box = im.getbbox()
im = im.crop(box)
bg = Image.new("RGBA", im.size, (243, 236, 227, 255))
bg.alpha_composite(im)
bg.convert("RGB").save("${shot}")
print(im.size)
`]);
  await run('cwebp', ['-q', '90', shot, '-o', `${OUT_DIR}/${block.name}.webp`]);
  console.log(`generated: ${OUT_DIR}/${block.name}.webp`);
}

await rm(TMP_DIR, { recursive: true, force: true });
