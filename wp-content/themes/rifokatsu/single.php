<?php
/**
 * Single post template.
 *
 * @package Rifokatsu
 */

get_header();
?>

    <main>
      <?php while (have_posts()) : the_post(); ?>
        <article class="section">
          <div class="section-heading">
            <?php
            $category = get_the_category();
            if (! empty($category)) :
                ?>
                <span class="article-label"><?php echo esc_html($category[0]->name); ?></span>
            <?php endif; ?>
            <h1 class="entry-title"><?php the_title(); ?></h1>
            <p><time datetime="<?php echo esc_attr(get_the_modified_date('Y-m-d')); ?>">更新日 <?php echo esc_html(get_the_modified_date('Y.m.d')); ?></time></p>
          </div>

          <?php if (has_post_thumbnail()) : ?>
            <div class="entry-image">
              <?php the_post_thumbnail('large', ['alt' => the_title_attribute(['echo' => false])]); ?>
            </div>
          <?php endif; ?>

          <div class="entry-content">
            <?php the_content(); ?>
          </div>
        </article>
      <?php endwhile; ?>
    </main>

<?php
get_footer();
