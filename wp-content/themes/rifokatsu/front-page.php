<?php
/**
 * Front page template.
 *
 * @package Rifokatsu
 */

get_header();

$posts_page_id = (int) get_option('page_for_posts');
$posts_url = $posts_page_id ? get_permalink($posts_page_id) : home_url('/');
?>

    <main>
      <section class="hero" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
        <div class="hero-gallery" aria-label="リフォーム後の住まいイメージ">
          <figure>
            <img src="<?php echo esc_url(rifokatsu_asset('images/fv-room.webp')); ?>" alt="木の質感でまとめた明るいLDKのリフォームイメージ">
          </figure>
          <figure>
            <img src="<?php echo esc_url(rifokatsu_asset('images/fv-kitchen.webp')); ?>" alt="使いやすく整えたキッチンのリフォームイメージ">
          </figure>
        </div>
        <div class="hero-content">
          <div class="hero-copy">
            <p class="hero-en"><span>RENOVATE</span> <span>YOUR LIFE</span></p>
            <p class="hero-lead">
              費用・修理の判断・補助金・業者選びまで。リフォーム前に知っておきたい情報を、やさしく整理する住宅リフォーム情報サイトです。
            </p>
          </div>
        </div>
      </section>

      <section class="section" id="equipment" aria-labelledby="equipment-title">
        <div class="section-heading">
          <h2 id="equipment-title">設備から探す</h2>
          <p>気になる場所や設備から、費用・交換時期・注意点を確認できます。</p>
        </div>
        <div class="carousel" data-carousel>
          <button class="carousel-arrow carousel-prev" type="button" aria-label="前のカードへ"><span class="chev"></span></button>
          <div class="carousel-track equipment-grid">
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/equipment/gaiheki.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">外壁・屋根</span>
                <span class="card-text">ひび割れ・雨漏り・塗装の不安を確認</span>
              </span>
            </a>
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/fv-kitchen.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">キッチン</span>
                <span class="card-text">費用相場や使いやすさの改善ポイントを確認</span>
              </span>
            </a>
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/equipment/bathroom.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">浴室</span>
                <span class="card-text">お風呂の交換時期やリフォーム費用を確認</span>
              </span>
            </a>
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/equipment/toilet.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">トイレ</span>
                <span class="card-text">交換費用や工事前の注意点を確認</span>
              </span>
            </a>
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/fv-kitchen.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">洗面台</span>
                <span class="card-text">交換費用や選び方のポイントを確認</span>
              </span>
            </a>
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/fv-room.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">給湯器</span>
                <span class="card-text">交換タイミングや費用の目安を確認</span>
              </span>
            </a>
            <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url(rifokatsu_asset('images/fv-room.webp')); ?>')">
              <span class="topic-card-glass">
                <span class="card-title">窓・断熱</span>
                <span class="card-text">断熱リフォームや補助金の確認ポイントを見る</span>
              </span>
            </a>
          </div>
          <button class="carousel-arrow carousel-next" type="button" aria-label="次のカードへ"><span class="chev"></span></button>
        </div>

        <div class="section-heading find-subheading" id="worries">
          <h2 id="worries-title">悩みから探す</h2>
          <p>リフォーム前の不安を、費用・判断・制度・業者選びに分けて整理します。</p>
        </div>
        <div class="carousel" data-carousel>
          <button class="carousel-arrow carousel-prev" type="button" aria-label="前のカードへ"><span class="chev"></span></button>
          <div class="carousel-track worry-grid">
          <?php
          $worries = [
              ['label' => '費用', 'text' => '費用相場や内訳の考え方を確認', 'img' => rifokatsu_asset('images/services/cost.svg')],
              ['label' => '修理判断', 'text' => '修理か交換かの判断ポイントを確認', 'img' => rifokatsu_asset('images/services/repair.svg')],
              ['label' => '補助金', 'text' => '対象になりやすい制度と申請の流れを確認', 'img' => rifokatsu_asset('images/services/subsidy.svg')],
              ['label' => '業者選び', 'text' => '失敗しない業者の選び方を確認', 'img' => rifokatsu_asset('images/services/contractor.svg')],
              ['label' => '見積り比較', 'text' => '相見積もりの比較ポイントを確認', 'img' => rifokatsu_asset('images/services/quote.svg')],
          ];
          foreach ($worries as $worry) :
              ?>
              <a class="topic-card" href="#" style="--card-img: url('<?php echo esc_url($worry['img']); ?>')">
                <span class="topic-card-glass">
                  <span class="card-title"><?php echo esc_html($worry['label']); ?></span>
                  <span class="card-text"><?php echo esc_html($worry['text']); ?></span>
                </span>
              </a>
          <?php endforeach; ?>
          </div>
          <button class="carousel-arrow carousel-next" type="button" aria-label="次のカードへ"><span class="chev"></span></button>
        </div>
      </section>

      <section class="section section-feature" id="cases" aria-labelledby="cases-title">
        <div class="section-heading section-heading-row">
          <div>
            <h2 id="cases-title">施工事例</h2>
          </div>
          <p>完成後の写真を見ることで、費用だけでは分かりにくい暮らしの変化や工事範囲を想像しやすくします。</p>
        </div>
        <div class="case-grid">
          <?php
          $case_query = new WP_Query(
              [
                  'post_type' => 'case',
                  'posts_per_page' => 1,
                  'no_found_rows' => true,
              ]
          );
          if ($case_query->have_posts()) :
              while ($case_query->have_posts()) :
                  $case_query->the_post();
                  $terms = get_the_terms(get_the_ID(), 'case_category');
                  $label = (! is_wp_error($terms) && ! empty($terms)) ? $terms[0]->name : '施工事例';
                  $area = get_post_meta(get_the_ID(), 'case_area', true);
                  $house_type = get_post_meta(get_the_ID(), 'case_house_type', true);
                  $period = get_post_meta(get_the_ID(), 'case_period', true);
                  $lead = get_post_meta(get_the_ID(), 'case_lead', true) ?: get_the_excerpt();
                  ?>
                  <article class="case-card case-card-large">
                    <?php if (has_post_thumbnail()) : ?>
                      <?php the_post_thumbnail('large', ['alt' => the_title_attribute(['echo' => false])]); ?>
                    <?php else : ?>
                      <img src="<?php echo esc_url(rifokatsu_asset('images/fv-room.webp')); ?>" alt="">
                    <?php endif; ?>
                    <div class="case-body">
                      <span class="article-label"><?php echo esc_html($label); ?></span>
                      <h3><?php the_title(); ?></h3>
                      <div class="case-meta" aria-label="施工事例の概要">
                        <?php foreach (array_filter([$area, $house_type, $period]) as $meta_item) : ?>
                          <span><?php echo esc_html($meta_item); ?></span>
                        <?php endforeach; ?>
                      </div>
                      <p><?php echo esc_html(wp_trim_words($lead, 52)); ?></p>
                    </div>
                  </article>
                  <?php
              endwhile;
              wp_reset_postdata();
          else :
              ?>
              <article class="case-card case-card-large">
                <img src="<?php echo esc_url(rifokatsu_asset('images/fv-room.webp')); ?>" alt="明るいLDKのリフォーム事例">
                <div class="case-body">
                  <span class="article-label">水回り・内装</span>
                  <h3>家族で過ごしやすい明るいLDKへ</h3>
                  <div class="case-meta" aria-label="施工事例の概要">
                    <span>LDK</span>
                    <span>戸建て</span>
                    <span>約3週間</span>
                  </div>
                  <p>キッチンまわりの動線や収納を見直し、家族が集まりやすい空間に整える事例です。</p>
                </div>
              </article>
          <?php endif; ?>
        </div>
      </section>

      <section class="photo-divider" aria-labelledby="divider-title">
        <img src="<?php echo esc_url(rifokatsu_asset('images/fv-room.webp')); ?>" alt="明るい住まいのダイニング">
        <div class="photo-divider-copy">
          <h2 id="divider-title">家族が居心地のいい空間を。<br>来た人にも居心地のいい空間を。</h2>
        </div>
      </section>

      <section class="section" id="guide" aria-labelledby="guide-title">
        <div class="section-heading section-heading-row">
          <div>
            <h2 id="guide-title">はじめてのリフォームガイド</h2>
          </div>
          <p>最初に読んでおくと、家族との相談や見積もり前の準備がしやすくなる記事です。</p>
        </div>
        <div class="article-grid">
          <article class="guide-card">
            <span class="article-label">費用不安の解消</span>
            <h3>リフォーム費用の相場まとめ</h3>
            <p>部位ごとの費用感と、費用が変わる主な理由を整理します。</p>
          </article>
          <article class="guide-card">
            <span class="article-label">業者選び</span>
            <h3>リフォーム業者の選び方</h3>
            <p>相談前に確認したい業者選びの基準を整理します。</p>
          </article>
          <article class="guide-card">
            <span class="article-label">制度確認</span>
            <h3>リフォーム補助金の基礎知識</h3>
            <p>対象になりやすい工事や、確認するときの注意点を整理します。</p>
          </article>
          <article class="guide-card">
            <span class="article-label">比較検討</span>
            <h3>見積もりの見方と注意点</h3>
            <p>見積書を見るときに確認したい項目や比較の考え方を整理します。</p>
          </article>
        </div>
      </section>

      <section class="section" id="new" aria-labelledby="new-title">
        <div class="section-heading section-heading-row">
          <div>
            <h2 id="new-title">新着記事</h2>
          </div>
        </div>
        <div class="news-grid">
          <?php
          $news_query = new WP_Query(
              [
                  'post_type' => 'post',
                  'posts_per_page' => 6,
                  'ignore_sticky_posts' => true,
              ]
          );

          if ($news_query->have_posts()) :
              while ($news_query->have_posts()) :
                  $news_query->the_post();
                  $category = get_the_category();
                  ?>
                  <a class="news-card" href="<?php the_permalink(); ?>">
                    <?php if (has_post_thumbnail()) : ?>
                      <?php the_post_thumbnail('medium_large', ['alt' => the_title_attribute(['echo' => false])]); ?>
                    <?php else : ?>
                      <img src="<?php echo esc_url(rifokatsu_asset('images/equipment/gaiheki.webp')); ?>" alt="">
                    <?php endif; ?>
                    <div>
                      <?php if (! empty($category)) : ?>
                        <span class="article-label"><?php echo esc_html($category[0]->name); ?></span>
                      <?php endif; ?>
                      <h3><?php the_title(); ?></h3>
                      <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 42)); ?></p>
                      <time datetime="<?php echo esc_attr(get_the_modified_date('Y-m-d')); ?>">更新日 <?php echo esc_html(get_the_modified_date('Y.m.d')); ?></time>
                    </div>
                  </a>
                  <?php
              endwhile;
              wp_reset_postdata();
          else :
              $fallback_news = [
                  ['外壁・屋根', '外壁塗装の費用相場と見積もりの見方', '費用の幅と、見積もり前に確認したい項目を整理します。', rifokatsu_asset('images/equipment/gaiheki.webp'), '戸建て住宅の外観'],
                  ['水回り', 'キッチンリフォームの費用相場と注意点', '工事範囲による費用差と、使いやすさを考えるポイントを紹介します。', rifokatsu_asset('images/fv-kitchen.webp'), '清潔感のあるキッチン'],
                  ['水回り', '浴室リフォームの費用相場と工事の流れ', '交換時期の目安と、見積もり前に知っておきたい流れを整理します。', rifokatsu_asset('images/equipment/bathroom.webp'), '明るい浴室'],
              ];
              foreach ($fallback_news as $item) :
                  ?>
                  <a class="news-card" href="<?php echo esc_url($posts_url); ?>">
                    <img src="<?php echo esc_url($item[3]); ?>" alt="<?php echo esc_attr($item[4]); ?>">
                    <div>
                      <span class="article-label"><?php echo esc_html($item[0]); ?></span>
                      <h3><?php echo esc_html($item[1]); ?></h3>
                      <p><?php echo esc_html($item[2]); ?></p>
                      <time datetime="2026-07-04">更新日 2026.07.04</time>
                    </div>
                  </a>
                  <?php
              endforeach;
          endif;
          ?>
        </div>
        <div class="section-button">
          <a class="button button-secondary" href="<?php echo esc_url($posts_url); ?>">すべての記事を見る</a>
        </div>
      </section>

    </main>

<?php
get_footer();
