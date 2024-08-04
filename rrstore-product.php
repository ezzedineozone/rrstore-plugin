<?php

/*
* Plugin Name: rrstore-product
* Plugin URI: <?php echo esc_url(get_site_url(null, 'products')); ?>
* Description: products for rrstore
* Author: Ezzedine Al Ozon
*/

function plugin_activate(){
    add_option( $option = "default", $value = '', $deprecated = '', $autoload = 'yes' );
    add_role('editor', array(
        'read' => true,
        'edit_posts' => true,
        'publish_posts'=> true
    ));
}

function rrstore_product(){
    $labels = array(
        'name'                  => _x('Products', 'Post type general name', 'textdomain'),
        'singular_name'         => _x('Product', 'Post type singular name', 'textdomain'),
        'menu_name'             => _x('Products', 'Admin Menu text', 'textdomain'),
        'name_admin_bar'        => _x('Product', 'Add New on Toolbar', 'textdomain'),
        'add_new'               => __('Add New', 'textdomain'),
        'add_new_item'          => __('Add New Product', 'textdomain'),
        'new_item'              => __('New Product', 'textdomain'),
        'edit_item'             => __('Edit Product', 'textdomain'),
        'view_item'             => __('View Product', 'textdomain'),
        'all_items'             => __('All Products', 'textdomain'),
        'search_items'          => __('Search Products', 'textdomain'),
        'parent_item_colon'     => __('Parent Products:', 'textdomain'),
        'not_found'             => __('No products found.', 'textdomain'),
        'not_found_in_trash'    => __('No products found in Trash.', 'textdomain'),
        'featured_image'        => _x('Product Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain'),
        'set_featured_image'    => _x('Set product image', 'textdomain'),
        'remove_featured_image' => _x('Remove product image', 'textdomain'),
        'use_featured_image'    => _x('Use as product image', 'textdomain'),
        'archives'              => _x('Product archives', 'The post type archive label used in nav menus. Defaults to the post type name. Added in 4.4', 'textdomain'),
        'insert_into_item'      => _x('Insert into product', 'textdomain'),
        'uploaded_to_this_item' => _x('Uploaded to this product', 'textdomain'),
        'filter_items_list'     => _x('Filter products list', 'textdomain'),
        'items_list_navigation' => _x('Products list navigation', 'textdomain'),
        'items_list'            => _x('Products list', 'textdomain'));

    $args = array(
        'public' => true,
        'label' => 'products',
        'supports' => array ('title', 'editor'),
        'rewrite' => array('slug' => 'product'),
        'labels' => $labels,
        'has_archive' => true
    );
    register_post_type('product', $args);
}
function register_templates($template){
    if(is_singular('product'))
    {
        $custom_template = plugin_dir_path(__FILE__) . 'rrstore-plugin/templates/single-product.php';
        if(file_exists($custom_template))
            return $custom_template;
    }
    else if(is_post_type_archive('product'))
    {
        $custom_template = plugin_dir_path(__FILE__) . 'rrstore-plugin/templates/archive-product.php';
        if(file_exists($custom_template))
            return $custom_template; 
    }
    return $template;
}

function get_product_archive_template()
{
    return plugin_dir_path(__FILE__) . "rrstore-plugin/templates/archive-product.php";
}
function product_plugin_active(){
    $plugin_file = 'rrstore-product.php';
    $active_plugins = get_option('active_plugins');
    return in_array($plugin_file, $active_plugins);
}
register_activation_hook(__FILE__, 'plugin_activate');
add_action('init', 'rrstore_product');
add_filter('template_include', 'register_templates');