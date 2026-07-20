import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { articles } from './article-data.mjs';
import { readFigureBlocks, figureAlt, figureIllustration } from './figure-blocks.mjs';

const siteUrl = 'https://yutoshimaoka.github.io/rifokatsubook/';
const source = await readFile('article.html', 'utf8');

function between(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`Article content marker not found: ${startMarker}`);
  return source.slice(start + startMarker.length, end).trim();
}

const rainContent = between(
  '<div class="article-detail-body seo-article" id="rain-leak-content" hidden>',
  '\n        </div>\n        <div class="article-detail-body" id="generic-content">',
);
const genericContent = between(
  '<div class="article-detail-body" id="generic-content">',
  '\n        </div>\n        <section class="related-articles"',
);

// 図解ブロックを画像に差し替える（画像は npm run generate:figures で生成）
const figureBlocks = await readFigureBlocks();

function replaceFiguresWithImages(html) {
  let output = html;
  for (const block of figureBlocks) {
    if (!output.includes(block.html)) continue;
    const illustration = figureIllustration[block.name];
    if (illustration) {
      // イラストで全体像を見せ、詳細は開閉式で残す
      output = output.replace(
        block.html,
        `<img class="article-illustration" src="../../images/figures/${illustration.file}" alt="${illustration.alt.replaceAll('"', '&quot;')}" loading="lazy" decoding="async">`
        + `<details class="article-details"><summary>${illustration.summary}</summary>${block.html}</details>`,
      );
      continue;
    }
    const alt = figureAlt[block.name] ?? '';
    output = output.replace(
      block.html,
      `<img class="article-figure-image" src="../../images/figures/${block.name}.webp" alt="${alt.replaceAll('"', '&quot;')}" loading="lazy" decoding="async">`,
    );
  }
  return output;
}

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

function formatDate(date) {
  return date.replaceAll('-', '.');
}

function addHeadingIds(content) {
  let index = 0;
  const headings = [];
  const html = content.replace(/<h2>([\s\S]*?)<\/h2>/g, (match, label) => {
    index += 1;
    const id = `section-${index}`;
    headings.push({ id, label: label.replace(/<[^>]+>/g, '') });
    return `<h2 id="${id}">${label}</h2>`;
  });
  return { html, headings: headings.slice(0, 5) };
}

// 本文中CTAの候補。記事のタグに応じて2つ選び、課題提示の直後とまとめの直後に置きます。
const ctaCandidates = {
  '見積り比較': { label: '見積り比較', text: '見積書のどこを見れば比較できるのか、確認する順番を整理しています。', href: '../../articles.html?worry=見積り比較', action: '見積り比較の記事を読む' },
  '業者選び': { label: '業者選び', text: '相見積もりや契約前に確認したい業者選びの基準をまとめています。', href: '../../articles/contractor-selection/', action: '業者の選び方を読む' },
  '補助金': { label: '補助金', text: '対象になりやすい工事と、申請前に確認したい注意点を整理しています。', href: '../../articles/remodel-subsidy-basics/', action: '補助金の基礎知識を読む' },
  '費用': { label: '費用', text: '部位ごとの費用の目安と、費用が変わる理由をまとめた記事を集めています。', href: '../../articles.html?worry=費用', action: '費用の記事を探す' },
  '修理判断': { label: '修理判断', text: '修理で足りるのか交換が必要なのか、判断の目安を整理しています。', href: '../../articles.html?worry=修理判断', action: '修理判断の記事を探す' },
};

function pickCtas(article) {
  const own = new Set(article.tags.map((tag) => tag.label));
  const ordered = [
    ...article.tags.map((tag) => tag.label),            // 記事のタグを優先
    '見積り比較', '業者選び', '費用',                     // 足りなければ汎用の導線で補う
  ];
  const picked = [];
  for (const key of ordered) {
    const cta = ctaCandidates[key];
    if (!cta || picked.some((item) => item.href === cta.href)) continue;
    // 自分自身へのリンクは出さない
    if (cta.href.includes(`/${article.slug}/`)) continue;
    picked.push(cta);
    if (picked.length === 2) break;
  }
  return picked;
}

function renderCta(cta) {
  if (!cta) return '';
  return `<aside class="article-cta"><div><span class="article-cta-label">${escapeHtml(cta.label)}</span><p>${escapeHtml(cta.text)}</p></div><a class="button button-outline" href="${cta.href}">${escapeHtml(cta.action)}</a></aside>`;
}

function renderAuthor(article) {
  return `<footer class="article-author">
          <p class="article-author-eyebrow">この記事について</p>
          <div class="article-author-body">
            <span class="article-author-avatar" aria-hidden="true">リフォ活</span>
            <div>
              <p class="article-author-name">リフォ活編集部</p>
              <p class="article-author-text">リフォームの費用・補助金・業者選びについて、公的機関や業界団体の公開情報を確認しながら記事を作成しています。</p>
              <dl class="article-author-meta">
                <div><dt>公開日</dt><dd><time datetime="${article.published}">${formatDate(article.published)}</time></dd></div>
                <div><dt>最終確認日</dt><dd><time datetime="${article.modified}">${formatDate(article.modified)}</time></dd></div>
              </dl>
              <a class="article-author-link" href="../../articles.html">リフォ活編集部の記事一覧</a>
            </div>
          </div>
        </footer>`;
}

function renderArticle(article) {
  const canonical = `${siteUrl}articles/${article.slug}/`;
  const imageUrl = `${siteUrl}${article.image}`;
  const ctas = pickCtas(article);
  const selectedContent = replaceFiguresWithImages(article.content === 'rain-leak' ? rainContent : genericContent)
    .replace('<!--cta-1-->', renderCta(ctas[0]))
    .replace('<!--cta-2-->', renderCta(ctas[1]));
  const content = addHeadingIds(selectedContent);
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 3);
  const tags = article.tags.map((tag) => `<a class="post-tag post-tag-worry" href="../../articles.html?${tag.group}=${encodeURIComponent(tag.label)}">${escapeHtml(tag.label)}</a>`).join('');
  const toc = content.headings.map((heading) => `<li><a href="#${heading.id}">${escapeHtml(heading.label)}</a></li>`).join('');
  const relatedCards = related.map((item) => `
            <a class="related-article-card" href="../${item.slug}/">
              <img src="../../${item.image}" alt="${escapeHtml(item.imageAlt)}" loading="lazy">
              <div><span>${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3></div>
            </a>`).join('');
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BlogPosting', headline: article.title, description: article.description, image: imageUrl, datePublished: article.published, dateModified: article.modified, author: { '@type': 'Organization', name: 'リフォ活編集部' }, publisher: { '@type': 'Organization', name: 'リフォ活編集部' }, mainEntityOfPage: canonical, articleSection: article.category, keywords: article.tags.map((tag) => tag.label), inLanguage: 'ja' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'リフォ活ブログ', item: `${siteUrl}articles.html` },
        { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
      ] },
    ],
  });

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(article.title)} | リフォ活 入門Book</title>
    <meta name="description" content="${escapeHtml(article.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="article"><meta property="og:locale" content="ja_JP">
    <meta property="og:site_name" content="リフォ活 入門Book">
    <meta property="og:title" content="${escapeHtml(article.title)} | リフォ活 入門Book">
    <meta property="og:description" content="${escapeHtml(article.description)}">
    <meta property="og:url" content="${canonical}"><meta property="og:image" content="${imageUrl}">
    <meta property="article:published_time" content="${article.published}"><meta property="article:modified_time" content="${article.modified}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${structuredData}</script>
    <link rel="icon" href="../../favicon.ico" sizes="32x32"><link rel="icon" href="../../favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="../../apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../styles.css">
  </head>
  <body class="page-sub">
    <header class="site-header">
      <a class="brand" href="../../index.html" aria-label="リフォ活 入門Book トップ"><img src="../../images/logo-rifokatsu.webp" alt="住まいのリフォ活入門BOOK"></a>
      <button class="nav-toggle" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="主要ナビゲーション"><a href="../../index.html#equipment">設備から探す</a><a href="../../index.html#worries">悩みから探す</a><a href="../../index.html#cases">施工事例</a><a href="../../index.html#guide">はじめてガイド</a><a href="../../articles.html">リフォ活ブログ</a></nav>
    </header>
    <main class="article-detail">
      <article class="article-entry" itemscope itemtype="https://schema.org/BlogPosting">
        <nav class="article-breadcrumb" aria-label="パンくず"><ol><li><a href="../../index.html">トップ</a></li><li><a href="../../articles.html">リフォ活ブログ</a></li><li aria-current="page">${escapeHtml(article.title)}</li></ol></nav>
        <header class="article-detail-header">
          <span class="article-label">${escapeHtml(article.category)}</span>
          <h1 itemprop="headline">${escapeHtml(article.title)}</h1>
          <div class="article-dates"><time datetime="${article.published}">公開日 ${formatDate(article.published)}</time><time datetime="${article.modified}">更新日 ${formatDate(article.modified)}</time></div>
          <p itemprop="description">${escapeHtml(article.description)}</p>
          <div class="article-tags" aria-label="カテゴリとタグ">${tags}</div>
        </header>
        <img class="article-detail-image" src="../../${article.image}" alt="${escapeHtml(article.imageAlt)}" itemprop="image">
        <div class="article-sheet">
        <nav class="article-toc" aria-labelledby="toc-title"><h2 id="toc-title">目次</h2><ol>${toc}</ol></nav>
        <div class="article-detail-body${article.content === 'rain-leak' ? ' seo-article' : ''}" itemprop="articleBody">${content.html}</div>
        ${renderAuthor(article)}
        </div>
        <section class="related-articles" aria-labelledby="related-articles-title"><div class="related-articles-heading"><p><span aria-hidden="true">#</span>Popular</p><h2 id="related-articles-title">よく見られている記事</h2></div><div class="related-articles-grid">${relatedCards}</div><a class="button button-outline related-articles-more" href="../../articles.html">リフォ活ブログをもっと見る</a></section>
      </article>
    </main>
    <footer class="site-footer"><div class="footer-main"><div class="footer-message"><p class="footer-catch"><span class="footer-catch-main">住まいを、<br>もっと心地よく。</span><span class="footer-catch-sub">知ってから選ぶ、<br>リフォーム情報サイト</span></p></div><nav class="footer-nav" aria-label="フッターナビゲーション"><div><p class="footer-nav-title">探す</p><a href="../../index.html#equipment">設備から探す</a><a href="../../index.html#worries">悩みから探す</a><a href="../../index.html#cases">施工事例</a></div><div><p class="footer-nav-title">読む</p><a href="../../articles.html">リフォ活ブログ</a><a href="../../index.html#guide">はじめてガイド</a><a href="../../index.html#new">新着記事</a></div></nav></div><div class="footer-bottom"><a class="brand brand-footer" href="../../index.html"><img src="../../images/logo-rifokatsu.webp" alt="住まいのリフォ活入門BOOK"></a><div class="footer-legal"><a href="../../privacy.html">プライバシーポリシー</a><p>© 2026 refokatsu</p></div></div></footer>
    <script>const header=document.querySelector('.site-header'),toggle=document.querySelector('.nav-toggle'),nav=document.getElementById('site-nav');if(header&&toggle&&nav){toggle.addEventListener('click',()=>{const open=header.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));});nav.addEventListener('click',e=>{if(e.target.closest('a'))header.classList.remove('nav-open');});}</script>
    <script type="module" src="../../reveal.js"></script>
  </body>
</html>`;
}

for (const article of articles) {
  const directory = `articles/${article.slug}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, renderArticle(article));
}

console.log(`Generated ${articles.length} article pages.`);
