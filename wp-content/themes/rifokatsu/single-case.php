<?php
/**
 * Single case template.
 *
 * @package Rifokatsu
 */

get_header();
?>

    <main>
      <?php while (have_posts()) : the_post(); ?>
        <?php
        $terms = get_the_terms(get_the_ID(), 'case_category');
        $label = (! is_wp_error($terms) && ! empty($terms)) ? $terms[0]->name : '施工事例';
        $area = get_post_meta(get_the_ID(), 'case_area', true);
        $house_type = get_post_meta(get_the_ID(), 'case_house_type', true);
        $period = get_post_meta(get_the_ID(), 'case_period', true);
        ?>
        <article class="section section-feature">
          <div class="case-grid">
            <div class="case-card case-card-large">
              <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('large', ['alt' => the_title_attribute(['echo' => false])]); ?>
              <?php else : ?>
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1300&q=80" alt="">
              <?php endif; ?>
              <div class="case-body">
                <span class="article-label"><?php echo esc_html($label); ?></span>
                <h1 class="entry-title"><?php the_title(); ?></h1>
                <div class="case-meta" aria-label="施工事例の概要">
                  <?php foreach (array_filter([$area, $house_type, $period]) as $meta_item) : ?>
                    <span><?php echo esc_html($meta_item); ?></span>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>
          </div>
          <div class="entry-content">
            <?php the_content(); ?>
          </div>
        </article>
      <?php endwhile; ?>
    </main>

<?php
get_footer();
