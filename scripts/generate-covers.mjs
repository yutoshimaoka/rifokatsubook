// 記事データから記事イメージ（横長カード＋写真）を生成します。
// 使い方: npm run generate:covers
import { execFile } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { articles } from './article-data.mjs';
import { palette, layouts } from './cover-art.mjs';

const run = promisify(execFile);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTH = 1200;
const HEIGHT = 675;
const OUT_DIR = 'images/covers';
const TMP_DIR = '.cover-tmp';

// 記事ごとの表示内容（帯・主見出し・副見出し2行・写真）
const covers = {
  'exterior-paint-cost': {
    badge: '外壁・屋根', main: '雨漏り修理',
    sub: ['費用と見積り内訳の', '確認ポイント'], photo: 'images/equipment/gaiheki.webp',
  },
  'kitchen-remodel-cost': {
    badge: 'キッチン', main: 'キッチンリフォーム',
    sub: ['工事範囲で変わる', '費用相場と注意点'], photo: 'images/marquee/kitchen.webp',
  },
  'bathroom-remodel-flow': {
    badge: '浴室', main: '浴室リフォーム',
    sub: ['費用相場と', '工事の流れ'], photo: 'images/equipment/bathroom.webp',
  },
  'toilet-remodel-cost': {
    badge: 'トイレ', main: 'トイレの交換',
    sub: ['交換時期と', 'リフォーム費用の目安'], photo: 'images/equipment/toilet.webp',
  },
  'washbasin-remodel-cost': {
    badge: '洗面台', main: '洗面台リフォーム',
    sub: ['サイズ・収納から見る', '選び方と費用'], photo: 'images/equipment/washbasin.webp',
  },
  'water-heater-replacement': {
    badge: '給湯器', main: '給湯器の交換',
    sub: ['交換タイミングと', '費用の目安'], photo: 'images/equipment/waterheater.webp',
  },
  'window-insulation-subsidy': {
    badge: '窓・断熱', main: '窓・断熱リフォーム',
    sub: ['費用の目安と', '補助金の見方'], photo: 'images/equipment/window.webp',
  },
  'remodel-subsidy-basics': {
    badge: '補助金', main: 'リフォーム補助金',
    sub: ['対象工事の基礎知識と', '申請前の確認方法'], photo: 'images/worries/subsidy.webp',
  },
  'contractor-selection': {
    badge: '業者選び', main: '業者の選び方',
    sub: ['失敗しないための', '確認ポイント'], photo: 'images/worries/contractor.webp',
  },
};

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

// 「リフォーム」を含む主見出しは、その前後で改行して級数を保つ
function mainLines(text) {
  const index = text.indexOf('リフォーム');
  if (index === -1) return [text];
  const head = text.slice(0, index);
  const tail = text.slice(index + 'リフォーム'.length);
  // 先頭が「リフォーム」なら後ろで、そうでなければ前で改行する
  return head ? [head, 'リフォーム' + tail] : ['リフォーム', tail].filter(Boolean);
}

// 主見出し・副見出しの文字数に応じて級数を決める（テキスト幅 568px に収める）
function mainSize(lines) {
  const longest = Math.max(...lines.map((line) => line.length));
  if (longest <= 5) return 74;
  if (longest <= 6) return 68;
  if (longest <= 7) return 62;
  if (longest <= 8) return 57;
  if (longest <= 9) return 52;
  return 47;
}

function subSize(lines) {
  const longest = Math.max(...lines.map((line) => line.length));
  if (longest <= 9) return 50;
  if (longest <= 10) return 46;
  return 42;
}

function renderShapes(layout) {
  return layout
    .map((item) => {
      const pos = ['top', 'right', 'bottom', 'left']
        .filter((side) => item[side] !== undefined)
        .map((side) => `${side}:${item[side]}px`)
        .join(';');
      return `<span style="${pos};width:${item.size}px;height:${item.size}px;background:${item.color}"></span>`;
    })
    .join('');
}

function renderPage(cover, index) {
  const layout = layouts[index % layouts.length];
  const headline = mainLines(cover.main);
  return `<!doctype html>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    display: grid; place-items: center;
    font-family: "Noto Sans JP", sans-serif;
    background: url("../${OUT_DIR}/_wood.webp") center/cover no-repeat;
  }
  .card {
    position: relative; width: 1004px; height: 562px;
    border-radius: 6px 14px 14px 6px;
    background: ${palette.card};
    box-shadow: 0 2px 5px rgba(70, 52, 34, 0.2), 0 22px 44px rgba(70, 52, 34, 0.22);
    overflow: hidden;
  }
  /* 左端の綴じ部分 */
  .card::after {
    content: ""; position: absolute; inset: 0 auto 0 0; width: 18px;
    background: linear-gradient(90deg, rgba(96, 74, 52, 0.18), rgba(96, 74, 52, 0.03) 65%, transparent);
  }
  .shapes { position: absolute; inset: 0; }
  /* 装飾円は薄くしてテキストの可読性を優先 */
  .shapes > span { position: absolute; display: block; border-radius: 50%; opacity: 0.4; }
  /* 主見出しが1行でも2行でも天地の余白が釣り合うよう中央寄せ */
  .text {
    position: absolute; left: 52px; top: 0; bottom: 0; z-index: 2; width: 568px;
    display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  }
  .badge {
    display: inline-block; padding: 13px 28px; border-radius: 18px;
    background: ${palette.teal}; color: #fff;
    font-size: 26px; font-weight: 700; letter-spacing: 0.06em;
  }
  h1 {
    margin-top: 26px; color: ${palette.brown};
    font-size: ${mainSize(headline)}px; font-weight: 900;
    line-height: 1.22; letter-spacing: 0.02em; white-space: nowrap;
  }
  p {
    margin-top: 20px; color: ${palette.brownSoft};
    font-size: ${subSize(cover.sub)}px; font-weight: 700;
    line-height: 1.55; letter-spacing: 0.02em;
  }
  .photo {
    position: absolute; right: 16px; top: 20px; z-index: 2;
    width: 340px; height: 528px; border-radius: 14px; overflow: hidden;
  }
  .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>
<div class="card">
  <span class="shapes">${renderShapes(layout)}</span>
  <div class="text">
    <span class="badge">${escapeHtml(cover.badge)}</span>
    <h1>${headline.map(escapeHtml).join('<br>')}</h1>
    <p>${cover.sub.map(escapeHtml).join('<br>')}</p>
  </div>
  <span class="photo"><img src="../${cover.photo}" alt=""></span>
</div>`;
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(TMP_DIR, { recursive: true });

let index = 0;
for (const article of articles) {
  const cover = covers[article.slug];
  if (!cover) {
    console.warn(`skip: ${article.slug}（covers に設定がありません）`);
    continue;
  }
  const page = `${TMP_DIR}/${article.slug}.html`;
  const shot = `${TMP_DIR}/${article.slug}.png`;
  await writeFile(page, renderPage(cover, index));
  await run(CHROME, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    `--window-size=${WIDTH},${HEIGHT}`,
    '--virtual-time-budget=6000',
    `--screenshot=${shot}`,
    `file://${process.cwd()}/${page}`,
  ]);
  await run('cwebp', ['-q', '84', '-resize', String(WIDTH), '0', shot, '-o', `${OUT_DIR}/${article.slug}.webp`]);
  console.log(`generated: ${OUT_DIR}/${article.slug}.webp`);
  index += 1;
}

await rm(TMP_DIR, { recursive: true, force: true });
