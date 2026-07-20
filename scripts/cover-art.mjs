// 表紙の配色と装飾レイアウト。generate-covers.mjs から読み込みます。

export const palette = {
  card: '#efe9de',
  brown: '#4a3a33',
  brownSoft: '#6b5c52',
  teal: '#3f7d72',
  mint: '#a9cbc0',
  sand: '#dccbae',
  sky: '#b9cede',
};

// 装飾円のバリエーション（カード内。はみ出した分はカードでクリップされます）
export const layouts = [
  [
    { size: 128, top: -46, left: 400, color: palette.mint },
    { size: 118, top: -34, right: 78, color: palette.sand },
    { size: 236, bottom: -96, right: 320, color: palette.sand },
    { size: 140, bottom: -58, left: 58, color: palette.sky },
  ],
  [
    { size: 150, top: -60, left: 300, color: palette.sand },
    { size: 110, top: -30, right: 96, color: palette.mint },
    { size: 210, bottom: -84, right: 340, color: palette.mint },
    { size: 132, bottom: -52, left: 40, color: palette.sand },
  ],
  [
    { size: 136, top: -50, left: 470, color: palette.sky },
    { size: 124, top: -40, right: 70, color: palette.mint },
    { size: 226, bottom: -92, right: 300, color: palette.sand },
    { size: 148, bottom: -62, left: 66, color: palette.mint },
  ],
  [
    { size: 142, top: -54, left: 350, color: palette.mint },
    { size: 112, top: -32, right: 88, color: palette.sky },
    { size: 220, bottom: -88, right: 330, color: palette.mint },
    { size: 136, bottom: -56, left: 48, color: palette.sand },
  ],
];
