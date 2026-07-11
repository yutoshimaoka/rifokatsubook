<?php
/**
 * Case archive template.
 *
 * @package Rifokatsu
 */

get_header();
?>

    <main>
      <section class="section section-feature">
        <div class="section-heading section-heading-row">
          <div>
            <h1 class="entry-title">施工事例</h1>
          </div>
          <p>完成後の写真を見ることで、費用だけでは分かりにくい暮らしの変化や工事範囲を想像しやすくします。</p>
        </div>

        <?php if (have_posts()) : ?>
          <div class="news-grid">
            <?php while (have_posts()) : the_post(); ?>
              <?php
              $terms = get_the_terms(get_the_ID(), 'case_category');
              $label = (! is_wp_error($terms) && ! empty($terms)) ? $terms[0]->name : '施工事例';
              ?>
              <article class="news-card">
                <?php if (has_post_thumbnail()) : ?>
                  <?php the_post_thumbnail('medium_large', ['alt' => the_title_attribute(['echo' => false])]); ?>
                <?php endif; ?>
                <div>
                  <span class="article-label"><?php echo esc_html($label); ?></span>
                  <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                  <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 42)); ?></p>
                </div>
              </article>
            <?php endwhile; ?>
          </div>
          <div class="section-button">
            <?php the_posts_pagination(); ?>
          </div>
        <?php else : ?>
          <p>施工事例がまだありません。</p>
        <?php endif; ?>
      </section>
    </main>

<?php
get_footer();
