<?php
/**
 * Default index / blog list template.
 *
 * @package Rifokatsu
 */

get_header();

$fallback_equipment = ['外壁・屋根', 'キッチン', '浴室', 'トイレ', '洗面台', '給湯器', '窓・断熱'];
$fallback_worry = ['費用', '修理判断', '補助金', '業者選び', '見積り比較'];

$equipment_terms = get_categories(['hide_empty' => false]);
$worry_terms = get_tags(['hide_empty' => false]);

$current_cat_id = is_category() ? (int) get_queried_object_id() : 0;
$current_tag_id = is_tag() ? (int) get_queried_object_id() : 0;
$is_all = ! $current_cat_id && ! $current_tag_id;
?>

    <main>
      <section class="section blog-page" aria-labelledby="blog-title">
        <div class="section-heading">
          <h1 id="blog-title" class="entry-title"><?php echo esc_html(is_home() ? 'リフォ活ブログ' : (get_the_archive_title() ?: 'リフォ活ブログ')); ?></h1>
          <p>設備や悩みのタグから、リフォーム前に確認したい判断材料を探せます。</p>
        </div>

        <div class="blog-filter" aria-label="記事の絞り込み">
          <div class="filter-row">
            <span class="filter-label">設備</span>
            <a class="filter-pill<?php echo $is_all ? ' is-active' : ''; ?>" href="<?php echo esc_url(home_url('/')); ?>">すべて</a>
            <?php if (! empty($equipment_terms)) : ?>
              <?php foreach ($equipment_terms as $term) : ?>
                <a class="filter-pill<?php echo ($current_cat_id === (int) $term->term_id) ? ' is-active' : ''; ?>" href="<?php echo esc_url(get_category_link($term->term_id)); ?>"><?php echo esc_html($term->name); ?></a>
              <?php endforeach; ?>
            <?php else : ?>
              <?php foreach ($fallback_equipment as $label) : ?>
                <span class="filter-pill is-disabled" aria-disabled="true"><?php echo esc_html($label); ?></span>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
          <div class="filter-row">
            <span class="filter-label">悩み</span>
            <?php if (! empty($worry_terms)) : ?>
              <?php foreach ($worry_terms as $term) : ?>
                <a class="filter-pill<?php echo ($current_tag_id === (int) $term->term_id) ? ' is-active' : ''; ?>" href="<?php echo esc_url(get_tag_link($term->term_id)); ?>"><?php echo esc_html($term->name); ?></a>
              <?php endforeach; ?>
            <?php else : ?>
              <?php foreach ($fallback_worry as $label) : ?>
                <span class="filter-pill is-disabled" aria-disabled="true"><?php echo esc_html($label); ?></span>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>

        <?php if (have_posts()) : ?>
          <div class="blog-grid">
            <?php
            while (have_posts()) :
                the_post();
                $categories = get_the_category();
                $post_tags = get_the_tags();
                ?>
                <article class="post-card">
                  <a class="post-thumb" href="<?php the_permalink(); ?>">
                    <?php if (has_post_thumbnail()) : ?>
                      <?php the_post_thumbnail('medium_large', ['alt' => the_title_attribute(['echo' => false])]); ?>
                    <?php else : ?>
                      <img src="<?php echo esc_url(rifokatsu_asset('images/equipment/gaiheki.webp')); ?>" alt="" loading="lazy">
                    <?php endif; ?>
                  </a>
                  <div class="post-body">
                    <h2 class="post-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    <?php if (! empty($categories) || ! empty($post_tags)) : ?>
                      <div class="post-tags">
                        <?php if (! empty($categories)) : ?>
                          <span class="tag-group">
                            <?php foreach ($categories as $category) : ?>
                              <a class="post-tag post-tag-worry" href="<?php echo esc_url(get_category_link($category->term_id)); ?>"><?php echo esc_html($category->name); ?></a>
                            <?php endforeach; ?>
                          </span>
                        <?php endif; ?>
                        <?php if (! empty($post_tags)) : ?>
                          <span class="tag-group">
                            <?php foreach ($post_tags as $post_tag) : ?>
                              <a class="post-tag post-tag-worry" href="<?php echo esc_url(get_tag_link($post_tag->term_id)); ?>"><?php echo esc_html($post_tag->name); ?></a>
                            <?php endforeach; ?>
                          </span>
                        <?php endif; ?>
                      </div>
                    <?php endif; ?>
                    <time datetime="<?php echo esc_attr(get_the_date('Y-m-d')); ?>"><?php echo esc_html(get_the_date('Y.m.d')); ?></time>
                  </div>
                </article>
                <?php
            endwhile;
            ?>
          </div>
          <nav class="pagination" aria-label="ページ送り">
            <?php
            echo paginate_links(
                [
                    'type' => 'list',
                    'prev_text' => '前へ',
                    'next_text' => '次へ',
                ]
            );
            ?>
          </nav>
        <?php else : ?>
          <p>記事がまだありません。</p>
        <?php endif; ?>
      </section>
    </main>

<?php
get_footer();
