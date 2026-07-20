<!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <header class="site-header">
      <a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?> トップ">
        <img src="<?php echo esc_url(rifokatsu_asset('images/logo-rifokatsu.webp')); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
      </a>
      <button class="nav-toggle" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="site-nav">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <?php
      wp_nav_menu(
          [
              'theme_location' => 'primary',
              'container' => 'nav',
              'container_class' => 'site-nav',
              'container_id' => 'site-nav',
              'container_aria_label' => '主要ナビゲーション',
              'menu_class' => '',
              'items_wrap' => '%3$s',
              'fallback_cb' => 'rifokatsu_primary_menu_fallback',
              'depth' => 1,
          ]
      );
      ?>
    </header>
