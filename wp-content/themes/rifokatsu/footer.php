    <?php
    $footer_posts_page_id = (int) get_option('page_for_posts');
    $footer_posts_url = $footer_posts_page_id ? get_permalink($footer_posts_page_id) : home_url('/');
    ?>
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-message">
          <p class="footer-catch"><span class="footer-catch-main">住まいを、<br>もっと心地よく。</span><span class="footer-catch-sub">知ってから選ぶ、<br>リフォーム情報サイト</span></p>
        </div>
        <nav class="footer-nav" aria-label="フッターナビゲーション">
          <div>
            <p class="footer-nav-title">探す</p>
            <a href="<?php echo esc_url(home_url('/#equipment')); ?>">設備から探す</a>
            <a href="<?php echo esc_url(home_url('/#worries')); ?>">悩みから探す</a>
            <a href="<?php echo esc_url(home_url('/#cases')); ?>">施工事例</a>
          </div>
          <div>
            <p class="footer-nav-title">読む</p>
            <a href="<?php echo esc_url($footer_posts_url); ?>">リフォ活ブログ</a>
            <a href="<?php echo esc_url(home_url('/#guide')); ?>">はじめてガイド</a>
            <a href="<?php echo esc_url(home_url('/#new')); ?>">新着記事</a>
          </div>
        </nav>
      </div>
      <div class="footer-bottom">
        <a class="brand brand-footer" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?> トップ">
          <img src="<?php echo esc_url(rifokatsu_asset('images/logo-rifokatsu.webp')); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
        </a>
        <p>© 2026 refokatsu</p>
      </div>
    </footer>
    <?php wp_footer(); ?>
  </body>
</html>
