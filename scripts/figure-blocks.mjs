// article.html から data-figure 付きのブロックを取り出す共通処理。
// generate-figures.mjs（画像化）と generate-articles.mjs（img への差し替え）で使います。
import { readFile } from 'node:fs/promises';

// 画像の代替テキスト。画像化しても内容が伝わるように、表・図の中身を要約しています。
export const figureAlt = {
  'cause-table': '原因候補別に費用差が出やすい項目の表。屋根材・棟板金、外壁・開口部、ベランダ防水、取合い部・天窓まわり、原因不明のそれぞれについて、見積もりに出やすい工事項目、費用差が出やすい理由、契約前の確認ポイントを整理しています。',
  'estimate-items': '見積書で確認すべき内訳の図解。応急処置、原因調査、足場、下地補修、防水、撤去処分、追加費用、保証、材料費・施工費・諸経費の9項目について、確認する内容と、抜けると比較しにくい理由を示しています。',
  'warning-signs': '見積書の注意サインの図解。「○○一式」、調査費と工事費が未分離、施工範囲が曖昧、保証主体が不明、追加費用条件が未記載の5つについて、起こりやすい問題と確認したいことを示しています。',
  'quote-conditions': '相見積もりでそろえる条件の図解。調査方法、施工範囲、足場有無、内装復旧有無、保証条件、写真報告書、再発防止確認の7項目と、その具体例を示しています。',
  'prepare-ask': '相談前の準備と質問の図解。準備するものは写真・動画、見積書、保証書、過去修理記録、調査報告書、契約書面、引き渡し書類、保険関連書類。業者に聞くことは調査範囲、応急処置と本修理が分かれているか、追加費用の発生条件です。',
  'next-checklist': '次に確認することのチェックリスト図解。保証書・引き渡し書類、過去修理記録、見積書内訳、写真・動画記録、調査報告書、契約書面、リフォーム瑕疵保険の加入有無、加入事業者検索、消費者ホットライン188、住まいるダイヤルの10項目について、手元で見る資料と確認先を示しています。',
  'compare-4points': '見積もりを比較するときにそろえる4項目の図解。1.工事範囲（撤去・処分／下地補修／内装復旧を含むか）、2.製品とグレード（品番の記載があるか）、3.追加費用の条件（発生条件と承認方法が書面にあるか）、4.保証（対象範囲・期間・保証主体）。',
};

// イラスト図に置き換えるブロック。詳細は <details> に格納して残します。
export const figureIllustration = {
  'cause-table': {
    file: 'leak-points.svg',
    alt: '雨漏りの原因になりやすい4か所を示した住宅の断面イラスト。1.屋根材・棟板金、2.取合い部・天窓まわり、3.外壁・開口部、4.ベランダ防水から雨水が浸入する経路を示しています。',
    summary: '原因候補ごとの工事項目・費用差の理由・確認ポイントを見る',
  },
  'estimate-items': {
    file: 'estimate-items.svg',
    alt: '見積書のイラスト。応急処置、原因調査、足場、下地補修、防水、撤去処分、追加費用、保証、材料費・施工費・諸経費の9項目に分かれているかを確認します。',
    summary: '9項目それぞれの確認内容と、抜けると比較しにくい理由を見る',
  },
  'warning-signs': {
    file: 'warning-signs.svg',
    alt: '注意が必要な見積書のイラスト。工事一式の表記、調査費と工事費が未分離、施工範囲が曖昧、保証の記載なし、追加費用の記載なしの5点に注意マークを付けています。',
    summary: '注意サインごとに起こりやすい問題と確認したいことを見る',
  },
  'quote-conditions': {
    file: 'quote-conditions.svg',
    alt: 'A社とB社の見積書を並べたイラスト。調査方法、施工範囲、足場有無、内装復旧有無、保証条件、写真報告書、再発防止確認の7項目を同じ条件にそろえて比較します。',
    summary: '7つの条件の具体例を見る',
  },
  'prepare-ask': {
    file: 'prepare-ask.svg',
    alt: '相談前の準備と質問のイラスト。準備するものは写真・動画、見積書・保証書、契約書面、過去の修理記録。業者に聞くことは調査範囲、応急処置と本修理の区分、追加費用の発生条件です。',
    summary: '準備するものと質問の一覧を見る',
  },
  'next-checklist': {
    file: 'next-checklist.svg',
    alt: '次に確認することの3ステップのイラスト。1.手元の書類を確認、2.業者に確認、3.公的窓口に相談という流れを示しています。',
    summary: '確認する10項目と、手元で見る資料・確認先を見る',
  },
  'compare-4points': {
    file: 'compare-4points.svg',
    alt: '見積書のイラストに4つの吹き出し。工事範囲、製品とグレード、追加費用の条件、保証の4項目をそろえて比較することを示しています。',
    summary: '4項目の詳細を見る',
  },
};

// 開始タグから対応する閉じタグまでを、入れ子を数えながら取り出す
function extractBlock(source, startIndex, tagName) {
  const open = new RegExp(`<${tagName}[\\s>]`, 'g');
  const close = new RegExp(`</${tagName}>`, 'g');
  let depth = 0;
  let cursor = startIndex;
  while (cursor < source.length) {
    open.lastIndex = cursor;
    close.lastIndex = cursor;
    const nextOpen = open.exec(source);
    const nextClose = close.exec(source);
    if (!nextClose) throw new Error(`閉じタグが見つかりません: ${tagName}`);
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      cursor = nextOpen.index + 1;
    } else {
      depth -= 1;
      cursor = nextClose.index + `</${tagName}>`.length;
      if (depth === 0) return { html: source.slice(startIndex, cursor), end: cursor };
    }
  }
  throw new Error(`ブロックを取り出せません: ${tagName}`);
}

export async function readFigureBlocks() {
  const source = await readFile('article.html', 'utf8');
  const blocks = [];
  const marker = /<(\w+)[^>]*data-figure="([\w-]+)"[^>]*>/g;
  let match;
  while ((match = marker.exec(source)) !== null) {
    const [, tagName, name] = match;
    const { html, end } = extractBlock(source, match.index, tagName);
    blocks.push({ name, html });
    marker.lastIndex = end;
  }
  return blocks;
}
