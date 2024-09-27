<?php

/*
* Plugin Name: rrstore-plugin
* Plugin URI: <?php echo esc_url(get_site_url(null, 'products')); ?>
* Description: products for rrstore
* Author: Ezzedine Al Ozon
*/

function product_plugin_activate(){
    add_option( $option = "default", $value = '', $deprecated = '', $autoload = 'yes' );
    add_role('editor', array(
        'read' => true,
        'edit_posts' => true,
        'publish_posts'=> true
    ));
    update_option('permalink_structure', '/%postname%/');
}
// function twentytwenty_dequeue_styles() {
// 	wp_dequeue_style( 'twentytwenty-style' );
// 	wp_dequeue_style( 'twentytwenty-print-style' );
//     wp_dequeue_style('chld_thm_cfg_parent');
// }
// add_action( 'wp_enqueue_scripts', 'twentytwenty_dequeue_styles', 20 );
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
        'rewrite' => array('slug'=> 'products'),
        'labels' => $labels,
        'has_archive' => true,
        'taxonomies' => array('category')
    );
    register_post_type('products', $args);
    flush_rewrite_rules();
}
function add_custom_menu_item($items, $args) {
    if ($args->theme_location == 'primary') {
        $items .= '<li class="menu-item"><a href="' . home_url(). '/products' . '">Store</a></li>';
    }
    return $items;
}
add_filter('wp_nav_menu_items', 'add_custom_menu_item', 10, 2);
function add_product_price()
{
    add_meta_box(
        'product_price',
        'Product Price',
        'show_product_price',
        'products'
    );
}
function show_product_price($post){
    $image_id = get_post_meta($post->ID, 'product_price', true);
    ?>
        <div class="inside">
            <div class="inside">
                <p>
                    <input type="number" id="product_price" name="product_price" value="<?php echo esc_attr($image_id); ?>" class="regular-text" />
                </p>
            </div>
        </div>
    <?php
}
function save_product_price($post_id)
{
    if (isset($_POST['product_price'])) {
        $image_id = floatval($_POST['product_price']);
        update_post_meta($post_id, 'product_price', $image_id);
    }
}
function get_product_price() {
    if (isset($_GET['slug'])) {
        $slug = sanitize_text_field($_GET['slug']);
        $post = get_page_by_path($slug, OBJECT, 'products');

        if ($post) {
            $price = get_post_meta($post->ID, 'product_price', true);
            if ($price !== '') {
                wp_send_json_success($price);
            } else {
                wp_send_json_error('Product price not found');
            }
        } else {
            wp_send_json_error('Product not found');
        }
    } else {
        wp_send_json_error('Slug not provided');
    }
}
function rrstore_plugin_header(){
    $header = plugin_dir_path(__FILE__) . './rrstore-plugin/templates/custom_header.php';
    if (file_exists($header)) {
        include($header);
    } else {
        get_header();
    }
}
function rrstore_plugin_footer(){
    $header = plugin_dir_path(__FILE__) . './rrstore-plugin/templates/custom_footer.php';
    if (file_exists($header)) {
        include($header);
    } else {
        get_footer();
    }
}
function filter_product_by_price($query){
    if(!is_admin() && $query->is_main_query() && (is_post_type_archive('products') || is_category()))
    {
        $min_price = isset($_GET['min-price'])?floatval($_GET['min-price']):0;
        $max_price = isset($_GET['max-price'])?floatval($_GET['max-price']):200;
        $category_slug = isset($_GET['category-slug'])?$_GET['category-slug']:"category";
        $meta_query = array(
            array(
                'key'     => 'product_price',
                'value'   => array($min_price, $max_price),
                'compare' => 'BETWEEN',
                'type'    => 'NUMERIC'
            )
        );
        $tax_query = array();
        if ($category_slug && $category_slug !== 'category' && $category_slug !== 'Category') {
            $tax_query = array(
                array(
                    'taxonomy' => 'category',
                    'field'    => 'slug',
                    'terms'    => $category_slug,
                    'operator' => 'IN',
                )
            );
        }
        $query->set('meta_query',$meta_query);
        if($tax_query !== array())
            $query->set('tax_query', $tax_query);
    }
}
add_action('pre_get_posts', 'filter_product_by_price');
function add_image_meta_box(){
    add_meta_box(
        'product_image',
        'Product Image',
        'show_product_image',
        'products'
    );
}
function show_product_image($post){
    $image_id = get_post_meta($post->ID, '_my_image_attachment_id', true);
    $image_url = $image_id?wp_get_attachment_url($image_id):'';
    ?> 
        <label for="my_image_attachment_id">Image Attachment:</label>
        <input type="text" name="my_image_attachment_id" id="my_image_attachment_id" value="<?php echo esc_attr($image_id); ?>" />
        <button type="button" class="button" id="my_image_button">Select Image</button>
        <div id="my_image_preview">
            <?php if ($image_url) { echo '<img src="' . esc_url($image_url) . '" style="max-width: 100%; height: auto;" />'; } ?>
        </div>
    <?php
};
function save_product_image($post_id){
    if(isset($_POST['my_image_attachment_id']))
    {
        $image_id = $_POST['my_image_attachment_id'];
        update_post_meta($post_id, '_my_image_attachment_id', $image_id);
    }
}
function register_templates($template){
    $plugin_path = plugin_dir_path(__FILE__);
    $plugin_path = str_replace('\\', '/', $plugin_path); 
    if(is_singular('products'))
    {
        $custom_template = $plugin_path . 'rrstore-plugin/templates/single-product.php';
        if(file_exists($custom_template))
            return $custom_template;
    }
    else if(is_post_type_archive('products'))
    {
        $custom_template = $plugin_path . 'rrstore-plugin/templates/archive-product.php';
        if(file_exists($custom_template))
            return $custom_template; 
    }
    else if(is_category())
    {
        $custom_template = $plugin_path . 'rrstore-plugin/templates/category.php';
        if(file_exists($custom_template))
            return $custom_template;
    }
    else if (is_page('cart'))
    {
        $custom_template = $plugin_path . 'rrstore-plugin/templates/cart-page.php';
        if(file_exists($custom_template))
            return $custom_template;
    }
    return $template;
}
add_filter('template_include', 'register_templates');
function get_product_archive_template()
{
    return plugin_dir_path(__FILE__) . "rrstore-plugin/templates/archive-product.php";
}
function product_plugin_active(){
    $plugin_file = 'rrstore-plugin.php';
    $active_plugins = get_option('active_plugins');
    return in_array($plugin_file, $active_plugins);
}
function wpse_340767_dequeue_theme_assets() {
    if(is_page('cart') || is_post_type_archive('products') || is_singular('products'))
    {
        $wp_scripts = wp_scripts();
        $wp_styles  = wp_styles();
        $themes_uri = get_theme_root_uri();

        foreach ( $wp_styles->registered as $wp_style ) {
            if ( strpos( $wp_style->src, $themes_uri ) !== false ) {
                wp_deregister_style( $wp_style->handle );
            }
        }
    }
}
add_action( 'wp_enqueue_scripts', 'wpse_340767_dequeue_theme_assets', 999 );
function rrstore_plugin_script(){
    if(is_page('cart') || is_post_type_archive('products') || is_category() || is_singular('products')):
        wp_enqueue_script('jquery', 'https://code.jquery.com/jquery-3.7.1.min.js', array(), '3.7.1', true);
        wp_enqueue_script('main-js_rrstore', plugin_dir_url(__FILE__).'/rrstore-plugin/main.js', array('jquery'), '0.1.0', true);
        wp_enqueue_script('flowbite-js', 'https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js', array('jquery'), '2.5.1', true);
        wp_enqueue_script('alpine-js', 'https://cdn.jsdelivr.net/npm/alpinejs@2.x.x/dist/alpine.min.js',array(),null, true);
        wp_enqueue_script('product-js_rrstore', plugin_dir_url(__FILE__) . '/rrstore-plugin/products.js', array('jquery'), null , true);
        wp_enqueue_script('cart-js_rrstore', plugin_dir_url(__FILE__) . '/rrstore-plugin/cart.js', array('jquery', 'product-js_rrstore'), null, true);
        wp_localize_script('cart-js_rrstore', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
    endif;
    wp_localize_script('main-js_rrstore', 'wpData', array(
        'baseUrl' => get_site_url()
    ));
}

function start_session(){
    if(!session_id())
        session_start();
}
function rrstore_plugin_style(){
    wp_enqueue_style('flowbite-css', 'https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css', array(), '2.5.1');
    wp_enqueue_style('main-style', plugin_dir_url(__FILE__)."/rrstore-plugin/css/main-style.css", array(), '0.1.0');
}
function rrstore_admin_scripts(){
    wp_enqueue_script('admin-product-js', plugin_dir_url(__FILE__) . '/rrstore-plugin/image-library.js', array(), null, true);
}
function create_required_pages(){
    $page_titles = array('cart', 'products');
    foreach($page_titles as $title)
    {
        $query = new WP_QUERY(array(
            'post_type' => 'page',
            'title' => $title,
            'post_status' => 'publish'
        ));
        if(!$query->have_posts())
        {
            $new_page = array('post_type' => 'page', 'post_title' =>$title,'post_status' => 'publish');
            $page_id = wp_insert_post($new_page);
        }
    }
}
register_activation_hook(__FILE__, 'create_required_pages');


// below functions are for the Cart communication from javscript with PHP session cookie
// mostly chatgpt tbh id rather die than write ajax functions manually


function add_to_cart() {
    if (isset($_POST['slug']) && isset($_POST['quantity'])) {
        $slug = sanitize_text_field($_POST['slug']);
        $quantity = intval($_POST['quantity']);
        
        if ($quantity <= 0) {
            wp_send_json_error('Invalid quantity');
            return;
        }

        if (isset($_SESSION['rrstore_cart'])) {
            $cart = $_SESSION['rrstore_cart'];
            for ($i = 0; $i < $quantity; $i++)
            {
                $cart[] = $slug;
            }
            
            $_SESSION['rrstore_cart'] = $cart;
        } else {
            $_SESSION['rrstore_cart'] = array_fill(0, $quantity, $slug);
        }
        
        wp_send_json_success($_SESSION['rrstore_cart']);
    } else {
        wp_send_json_error('No slug or quantity provided');
    }
}


add_action('wp_ajax_add_to_cart', 'add_to_cart');
add_action('wp_ajax_nopriv_add_to_cart', 'add_to_cart');


function remove_from_cart_single() {
    if (isset($_POST['slug'])) {
        $slug = sanitize_text_field($_POST['slug']);
        if (isset($_SESSION['rrstore_cart'])) {
            $cart = $_SESSION['rrstore_cart'];
            $key_to_remove = array_search($slug, $cart);
            if ($key_to_remove !== false) {
                unset($cart[$key_to_remove]);
                $_SESSION['rrstore_cart'] = array_values($cart);
                wp_send_json_success($_SESSION['rrstore_cart']);
            } else {
                wp_send_json_error('Item not found');
            }
        } else {
            wp_send_json_error('Cart is empty');
        }
    } else {
        wp_send_json_error('No slug provided');
    }
}
add_action('wp_ajax_remove_from_cart_single', 'remove_from_cart_single');
add_action('wp_ajax_nopriv_remove_from_cart_single', 'remove_from_cart_single');

function remove_from_cart_all($slug)
{
    if(isset($_POST['slug']))
    {
        $slug = sanitize_text_field($_POST['slug']);
        if(isset($_SESSION['rrstore_cart']))
        {
            $cart = $_SESSION['rrstore_cart'];
            $updated_cart = array();
            for($i = 0; $i < sizeof($cart); $i++)
            {
                if($cart[$i] !== $slug)
                    $updated_cart[] = $cart[$i];
            }
            $_SESSION['rrstore_cart'] = $updated_cart;
            wp_send_json_success();
        }
        wp_send_json_error();
    }
    wp_send_json_error();
}
add_action('wp_ajax_remove_from_cart_all', 'remove_from_cart_all');
add_action('wp_ajax_nopriv_remove_from_cart_all', 'remove_from_cart_all');

function clear_cart() {
    if (isset($_SESSION['rrstore_cart'])) {
        $_SESSION['rrstore_cart'] = array();
        wp_send_json_success('Cart cleared');
    } else {
        wp_send_json_error('Cart is already empty');
    }
}
add_action('wp_ajax_clear_cart', 'clear_cart');
add_action('wp_ajax_nopriv_clear_cart', 'clear_cart');


function get_cart() {
    if (isset($_SESSION['rrstore_cart'])) {
        wp_send_json_success($_SESSION['rrstore_cart']);
    } else {
        wp_send_json_success(array());
    }
}
add_action('wp_ajax_get_cart', 'get_cart');
add_action('wp_ajax_nopriv_get_cart', 'get_cart');

function get_item_qty($slug)
{
    if(isset($_SESSION['rrstore_cart']))
    {
        $cart = $_SESSION['rrstore_cart'];
        $slug_count = 0;
        for($i = 0; $i<sizeof($cart);$i++)
        {
            if ($cart[$i] == $slug)
                $slug_count++;
        }
        wp_send_json_success($slug_count);
    }
    return wp_send_json_error();
}




add_action('wp_ajax_get_product_price', 'get_product_price');
add_action('wp_ajax_noprive_get_product_price', 'get_product_price');


register_activation_hook(__FILE__, 'product_plugin_activate');
add_action('wp_ajax_get_item_qty_cart', 'get_item_qty');
add_action('wp_ajax_nopriv_get_item_qty_cart', 'get_item_qty');
add_action('admin_enqueue_scripts', 'rrstore_admin_scripts');

add_action('init', 'rrstore_product');
add_action('init', 'start_session');
add_action('wp_enqueue_scripts', 'rrstore_plugin_script');
add_action('wp_enqueue_scripts', 'rrstore_plugin_style');
add_action('add_meta_boxes', 'add_product_price');
add_action('save_post', 'save_product_price');
add_action('add_meta_boxes', 'add_image_meta_box');
add_action('save_post', 'save_product_image');

?>