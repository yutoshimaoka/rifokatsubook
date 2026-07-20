<?php
/**
 * Rifokatsu theme setup.
 *
 * @package Rifokatsu
 */

if (! defined('ABSPATH')) {
    exit;
}

function rifokatsu_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support(
        'html5',
        ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']
    );

    register_nav_menus(
        [
            'primary' => __('Primary Menu', 'rifokatsu'),
        ]
    );
}
add_action('after_setup_theme', 'rifokatsu_setup');

function rifokatsu_assets(): void
{
    wp_enqueue_style(
        'rifokatsu-fonts',
        'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'rifokatsu-style',
        get_stylesheet_uri(),
        ['rifokatsu-fonts'],
        wp_get_theme()->get('Version')
    );

    wp_enqueue_script(
        'rifokatsu-main',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'rifokatsu_assets');

function rifokatsu_asset(string $path): string
{
    return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
}

function rifokatsu_primary_menu_fallback(): void
{
    ?>
    <nav class="site-nav" id="site-nav" aria-label="主要ナビゲーション">
        <a href="<?php echo esc_url(home_url('/#equipment')); ?>">設備から探す</a>
        <a href="<?php echo esc_url(home_url('/#worries')); ?>">悩みから探す</a>
        <a href="<?php echo esc_url(home_url('/#cases')); ?>">施工事例</a>
        <a href="<?php echo esc_url(home_url('/#guide')); ?>">はじめてガイド</a>
        <a href="<?php echo esc_url(home_url('/#new')); ?>">リフォ活ブログ</a>
    </nav>
    <?php
}

function rifokatsu_register_case_post_type(): void
{
    register_post_type(
        'case',
        [
            'labels' => [
                'name' => __('施工事例', 'rifokatsu'),
                'singular_name' => __('施工事例', 'rifokatsu'),
                'add_new_item' => __('施工事例を追加', 'rifokatsu'),
                'edit_item' => __('施工事例を編集', 'rifokatsu'),
            ],
            'public' => true,
            'has_archive' => true,
            'menu_position' => 5,
            'menu_icon' => 'dashicons-admin-home',
            'rewrite' => ['slug' => 'cases'],
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
            'show_in_rest' => true,
        ]
    );

    register_taxonomy(
        'case_category',
        ['case'],
        [
            'labels' => [
                'name' => __('施工事例カテゴリー', 'rifokatsu'),
                'singular_name' => __('施工事例カテゴリー', 'rifokatsu'),
            ],
            'public' => true,
            'hierarchical' => true,
            'rewrite' => ['slug' => 'case-category'],
            'show_in_rest' => true,
        ]
    );
}
add_action('init', 'rifokatsu_register_case_post_type');

function rifokatsu_case_meta_fields(): array
{
    return [
        'case_area' => __('施工場所', 'rifokatsu'),
        'case_house_type' => __('住宅種別', 'rifokatsu'),
        'case_period' => __('工期', 'rifokatsu'),
        'case_lead' => __('概要テキスト', 'rifokatsu'),
    ];
}

function rifokatsu_add_case_meta_box(): void
{
    add_meta_box(
        'rifokatsu_case_details',
        __('施工事例の概要', 'rifokatsu'),
        'rifokatsu_render_case_meta_box',
        'case',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'rifokatsu_add_case_meta_box');

function rifokatsu_render_case_meta_box(WP_Post $post): void
{
    wp_nonce_field('rifokatsu_save_case_meta', 'rifokatsu_case_meta_nonce');

    foreach (rifokatsu_case_meta_fields() as $key => $label) {
        $value = get_post_meta($post->ID, $key, true);
        $is_textarea = 'case_lead' === $key;
        ?>
        <p>
            <label for="<?php echo esc_attr($key); ?>"><strong><?php echo esc_html($label); ?></strong></label><br>
            <?php if ($is_textarea) : ?>
                <textarea id="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($key); ?>" rows="4" style="width:100%;"><?php echo esc_textarea($value); ?></textarea>
            <?php else : ?>
                <input id="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($key); ?>" type="text" value="<?php echo esc_attr($value); ?>" style="width:100%;">
            <?php endif; ?>
        </p>
        <?php
    }
}

function rifokatsu_save_case_meta(int $post_id): void
{
    if (
        ! isset($_POST['rifokatsu_case_meta_nonce'])
        || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['rifokatsu_case_meta_nonce'])), 'rifokatsu_save_case_meta')
    ) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (! current_user_can('edit_post', $post_id)) {
        return;
    }

    foreach (rifokatsu_case_meta_fields() as $key => $label) {
        if (! isset($_POST[$key])) {
            continue;
        }

        $raw = wp_unslash($_POST[$key]);
        $value = 'case_lead' === $key ? sanitize_textarea_field($raw) : sanitize_text_field($raw);
        update_post_meta($post_id, $key, $value);
    }
}
add_action('save_post_case', 'rifokatsu_save_case_meta');
