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
    flush_rewrite_rules();
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
function register_payment_methods_submenu() {
    add_submenu_page(
        'edit.php?post_type=products',
        'Delivery Prices',             
        'Delivery Prices',             
        'manage_options',              
        'payment-methods',             
        'payment_methods_page_callback'
    );
}
add_action('admin_menu', 'register_payment_methods_submenu');

function payment_methods_page_callback() {
    if (isset($_POST['submit_delivery_price'])) {
        $country = sanitize_text_field($_POST['country']);
        $delivery_price = floatval($_POST['delivery_price']);
        if (!empty($country) && $delivery_price >= 0) {
            update_option("delivery_price_{$country}", $delivery_price);
            echo '<div class="updated"><p>Delivery price saved successfully!</p></div>';
        } else {
            echo '<div class="error"><p>Please enter a valid country and delivery price.</p></div>';
        }
    }
    $countries = array(
        'AF' => 'Afghanistan',
        'AL' => 'Albania',
        'DZ' => 'Algeria',
        'AS' => 'American Samoa',
        'AD' => 'Andorra',
        'AO' => 'Angola',
        'AI' => 'Anguilla',
        'AQ' => 'Antarctica',
        'AG' => 'Antigua and Barbuda',
        'AR' => 'Argentina',
        'AM' => 'Armenia',
        'AW' => 'Aruba',
        'AU' => 'Australia',
        'AT' => 'Austria',
        'AZ' => 'Azerbaijan',
        'BS' => 'Bahamas',
        'BH' => 'Bahrain',
        'BD' => 'Bangladesh',
        'BB' => 'Barbados',
        'BY' => 'Belarus',
        'BE' => 'Belgium',
        'BZ' => 'Belize',
        'BJ' => 'Benin',
        'BM' => 'Bermuda',
        'BT' => 'Bhutan',
        'BO' => 'Bolivia',
        'BQ' => 'Bonaire, Sint Eustatius and Saba',
        'BA' => 'Bosnia and Herzegovina',
        'BW' => 'Botswana',
        'BV' => 'Bouvet Island',
        'BR' => 'Brazil',
        'IO' => 'British Indian Ocean Territory',
        'BN' => 'Brunei Darussalam',
        'BG' => 'Bulgaria',
        'BF' => 'Burkina Faso',
        'BI' => 'Burundi',
        'CV' => 'Cabo Verde',
        'KH' => 'Cambodia',
        'CM' => 'Cameroon',
        'CA' => 'Canada',
        'KY' => 'Cayman Islands',
        'CF' => 'Central African Republic',
        'TD' => 'Chad',
        'CL' => 'Chile',
        'CN' => 'China',
        'CX' => 'Christmas Island',
        'CC' => 'Cocos (Keeling) Islands',
        'CO' => 'Colombia',
        'KM' => 'Comoros',
        'CD' => 'Congo, Democratic Republic of the',
        'CG' => 'Congo',
        'CK' => 'Cook Islands',
        'CR' => 'Costa Rica',
        'HR' => 'Croatia',
        'CU' => 'Cuba',
        'CW' => 'Curaçao',
        'CY' => 'Cyprus',
        'CZ' => 'Czech Republic',
        'DK' => 'Denmark',
        'DJ' => 'Djibouti',
        'DM' => 'Dominica',
        'DO' => 'Dominican Republic',
        'EC' => 'Ecuador',
        'EG' => 'Egypt',
        'SV' => 'El Salvador',
        'GQ' => 'Equatorial Guinea',
        'ER' => 'Eritrea',
        'EE' => 'Estonia',
        'SZ' => 'Eswatini',
        'ET' => 'Ethiopia',
        'FK' => 'Falkland Islands (Malvinas)',
        'FO' => 'Faroe Islands',
        'FJ' => 'Fiji',
        'FI' => 'Finland',
        'FR' => 'France',
        'GF' => 'French Guiana',
        'PF' => 'French Polynesia',
        'TF' => 'French Southern Territories',
        'GA' => 'Gabon',
        'GM' => 'Gambia',
        'GE' => 'Georgia',
        'DE' => 'Germany',
        'GH' => 'Ghana',
        'GI' => 'Gibraltar',
        'GR' => 'Greece',
        'GL' => 'Greenland',
        'GD' => 'Grenada',
        'GP' => 'Guadeloupe',
        'GU' => 'Guam',
        'GT' => 'Guatemala',
        'GG' => 'Guernsey',
        'GN' => 'Guinea',
        'GW' => 'Guinea-Bissau',
        'GY' => 'Guyana',
        'HT' => 'Haiti',
        'HM' => 'Heard Island and McDonald Islands',
        'VA' => 'Holy See',
        'HN' => 'Honduras',
        'HK' => 'Hong Kong',
        'HU' => 'Hungary',
        'IS' => 'Iceland',
        'IN' => 'India',
        'ID' => 'Indonesia',
        'IR' => 'Iran',
        'IQ' => 'Iraq',
        'IE' => 'Ireland',
        'IM' => 'Isle of Man',
        'IL' => 'Israel',
        'IT' => 'Italy',
        'JM' => 'Jamaica',
        'JP' => 'Japan',
        'JE' => 'Jersey',
        'JO' => 'Jordan',
        'KZ' => 'Kazakhstan',
        'KE' => 'Kenya',
        'KI' => 'Kiribati',
        'KP' => 'Korea, Democratic People\'s Republic of',
        'KR' => 'Korea, Republic of',
        'KW' => 'Kuwait',
        'KG' => 'Kyrgyzstan',
        'LA' => 'Lao People\'s Democratic Republic',
        'LV' => 'Latvia',
        'LB' => 'Lebanon',
        'LS' => 'Lesotho',
        'LR' => 'Liberia',
        'LY' => 'Libya',
        'LI' => 'Liechtenstein',
        'LT' => 'Lithuania',
        'LU' => 'Luxembourg',
        'MO' => 'Macao',
        'MG' => 'Madagascar',
        'MW' => 'Malawi',
        'MY' => 'Malaysia',
        'MV' => 'Maldives',
        'ML' => 'Mali',
        'MT' => 'Malta',
        'MH' => 'Marshall Islands',
        'MQ' => 'Martinique',
        'MR' => 'Mauritania',
        'MU' => 'Mauritius',
        'YT' => 'Mayotte',
        'MX' => 'Mexico',
        'FM' => 'Micronesia',
        'MD' => 'Moldova',
        'MC' => 'Monaco',
        'MN' => 'Mongolia',
        'MH' => 'Montenegro',
        'MS' => 'Montserrat',
        'MA' => 'Morocco',
        'MZ' => 'Mozambique',
        'MM' => 'Myanmar',
        'NA' => 'Namibia',
        'NR' => 'Nauru',
        'NP' => 'Nepal',
        'NL' => 'Netherlands',
        'NC' => 'New Caledonia',
        'NZ' => 'New Zealand',
        'NI' => 'Nicaragua',
        'NE' => 'Niger',
        'NG' => 'Nigeria',
        'NU' => 'Niue',
        'NF' => 'Norfolk Island',
        'MK' => 'North Macedonia',
        'MP' => 'Northern Mariana Islands',
        'NO' => 'Norway',
        'OM' => 'Oman',
        'PK' => 'Pakistan',
        'PW' => 'Palau',
        'PS' => 'Palestine, State of',
        'PA' => 'Panama',
        'PG' => 'Papua New Guinea',
        'PY' => 'Paraguay',
        'PE' => 'Peru',
        'PH' => 'Philippines',
        'PN' => 'Pitcairn',
        'PL' => 'Poland',
        'PT' => 'Portugal',
        'PR' => 'Puerto Rico',
        'QA' => 'Qatar',
        'RE' => 'Réunion',
        'RO' => 'Romania',
        'RU' => 'Russian Federation',
        'RW' => 'Rwanda',
        'BL' => 'Saint Barthélemy',
        'SH' => 'Saint Helena, Ascension and Tristan da Cunha',
        'KN' => 'Saint Kitts and Nevis',
        'LC' => 'Saint Lucia',
        'MF' => 'Saint Martin (French part)',
        'PM' => 'Saint Pierre and Miquelon',
        'VC' => 'Saint Vincent and the Grenadines',
        'WS' => 'Samoa',
        'SM' => 'San Marino',
        'ST' => 'Sao Tome and Principe',
        'SA' => 'Saudi Arabia',
        'SN' => 'Senegal',
        'RS' => 'Serbia',
        'SC' => 'Seychelles',
        'SL' => 'Sierra Leone',
        'SG' => 'Singapore',
        'SX' => 'Sint Maarten (Dutch part)',
        'SK' => 'Slovakia',
        'SI' => 'Slovenia',
        'SB' => 'Solomon Islands',
        'SO' => 'Somalia',
        'ZA' => 'South Africa',
        'GS' => 'South Georgia and the South Sandwich Islands',
        'SS' => 'South Sudan',
        'ES' => 'Spain',
        'LK' => 'Sri Lanka',
        'SD' => 'Sudan',
        'SR' => 'Suriname',
        'SJ' => 'Svalbard and Jan Mayen',
        'SZ' => 'Sweden',
        'CH' => 'Switzerland',
        'SY' => 'Syrian Arab Republic',
        'TW' => 'Taiwan',
        'TJ' => 'Tajikistan',
        'TZ' => 'Tanzania, United Republic of',
        'TH' => 'Thailand',
        'TL' => 'Timor-Leste',
        'TG' => 'Togo',
        'TK' => 'Tokelau',
        'TO' => 'Tonga',
        'TT' => 'Trinidad and Tobago',
        'TN' => 'Tunisia',
        'TR' => 'Turkey',
        'TM' => 'Turkmenistan',
        'TC' => 'Turks and Caicos Islands',
        'TV' => 'Tuvalu',
        'UG' => 'Uganda',
        'UA' => 'Ukraine',
        'AE' => 'United Arab Emirates',
        'GB' => 'United Kingdom',
        'US' => 'United States',
        'UY' => 'Uruguay',
        'UZ' => 'Uzbekistan',
        'VU' => 'Vanuatu',
        'VE' => 'Venezuela',
        'VN' => 'Viet Nam',
        'WF' => 'Wallis and Futuna',
        'EH' => 'Western Sahara',
        'YE' => 'Yemen',
        'ZM' => 'Zambia',
        'ZW' => 'Zimbabwe',
    );
    ?>
    <div class="wrap">
        <h1>Delivery Prices</h1>
        <form method="post" action="">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="country">Select Country</label></th>
                    <td>
                        <select name="country" id="country" required>
                            <option value="">-- Select a Country --</option>
                            <?php foreach ($countries as $code => $name) : ?>
                                <option value="<?php echo esc_attr($code); ?>"><?php echo esc_html($name); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="delivery_price">Delivery Price ($)</label></th>
                    <td>
                        <input type="number" name="delivery_price" id="delivery_price" step="0.01" min="0" required>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="submit_delivery_price" class="button button-primary" value="Save Delivery Price">
            </p>
        </form>

        <h2>Current Delivery Prices</h2>
        <table class="form-table">
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Delivery Price ($)</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($countries as $code => $name) : ?>
                    <tr>
                        <td><?php echo esc_html($name); ?></td>
                        <td>
                            <?php 
                            // Retrieve and display the saved delivery price
                            $price = get_option("delivery_price_{$code}");
                            echo $price !== false ? esc_html($price) : 'Not set'; 
                            ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}
function get_country_delivery() {
    // Check if the 'country' parameter is set in the POST request
    if (!isset($_GET['country'])) {
        wp_send_json_error('Country parameter is missing.'); // Provide an error message
        wp_die(); // Stop further execution
    }

    // Sanitize the country code input to prevent security issues
    $country_iso_code = sanitize_text_field($_GET['country']); 

    // Debugging output (optional)
    // Remove var_dump in production; it's only for debugging
    error_log('country iso php: ' . $country_iso_code);

    // Retrieve the delivery price option for the given country code
    $price = get_option("delivery_price_{$country_iso_code}");

    // Debugging output for the price (optional)
    error_log("price: " . ($price !== false ? $price : 'not set'));

    // Check if the price was successfully retrieved
    if ($price !== false) {
        wp_send_json_success($price);
    } else {
        wp_send_json_error('Delivery price not set for this country.'); // Send a specific error message
    }

    wp_die(); // Stop further execution
}

add_action('wp_ajax_get_country_delivery', 'get_country_delivery');
add_action('wp_ajax_nopriv_get_country_delivery', 'get_country_delivery');
function sanitize_payment_method($method) {
    return [
        'name' => sanitize_text_field($method['name']),
        'link' => esc_url_raw($method['link']),
    ];
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
        wp_enqueue_script('Swal', 'https://cdn.jsdelivr.net/npm/sweetalert2@11', array(), '0.1.0',  true);
        wp_enqueue_script('main-js_rrstore', plugin_dir_url(__FILE__).'/rrstore-plugin/main.js', array('jquery', 'Swal'), '0.1.0', true);
        wp_enqueue_script('flowbite-js', 'https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js', array('jquery'), '2.5.1', true);
        wp_enqueue_script('alpine-js', 'https://cdn.jsdelivr.net/npm/alpinejs@2.x.x/dist/alpine.min.js',array(),null, true);
        wp_enqueue_script('custom-swal', plugin_dir_url(__File__).'./rrstore-plugin/custom-swal.js', array('Swal'), '0.1.0', true);
        wp_enqueue_script('product-js_rrstore', plugin_dir_url(__FILE__) . '/rrstore-plugin/products.js', array('jquery', 'custom-swal'), null , true);
        wp_enqueue_script('cart-js_rrstore', plugin_dir_url(__FILE__) . '/rrstore-plugin/cart.js', array('jquery', 'product-js_rrstore', 'custom-swal'), null, true);
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

function remove_from_cart() {
    if (isset($_POST['slug']) && isset($_POST['qty'])) {
        $slug = sanitize_text_field($_POST['slug']);
        $qty = intval($_POST['qty']); // Ensure qty is an integer

        if (isset($_SESSION['rrstore_cart'])) {
            $cart = $_SESSION['rrstore_cart'];
            $key_to_remove = array_search($slug, array_column($cart, 'slug'));

            if ($key_to_remove !== false) {
                // Check if item exists in the cart and reduce the quantity
                if ($cart[$key_to_remove]['qty'] > $qty) {
                    // Reduce quantity
                    $cart[$key_to_remove]['qty'] -= $qty;
                    $_SESSION['rrstore_cart'] = $cart;
                    wp_send_json_success($_SESSION['rrstore_cart']);
                } elseif ($cart[$key_to_remove]['qty'] <= $qty) {
                    // Remove item completely if qty reaches zero or less
                    unset($cart[$key_to_remove]);
                    $_SESSION['rrstore_cart'] = array_values($cart);
                    wp_send_json_success($_SESSION['rrstore_cart']);
                }
            } else {
                wp_send_json_error('Item not found in cart');
            }
        } else {
            wp_send_json_error('Cart is empty');
        }
    } else {
        wp_send_json_error('No slug or quantity provided');
    }
}

add_action('wp_ajax_remove_from_cart', 'remove_from_cart');
add_action('wp_ajax_nopriv_remove_from_cart', 'remove_from_cart');


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
function get_cart_no_json() {
    if (isset($_SESSION['rrstore_cart'])) {
        return $_SESSION['rrstore_cart'];
    } else {
        return array();
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
function get_item_qty_no_json($slug)
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
        return $slug_count;
    }
}
function prdct_price() {
    if (isset($_GET['slug'])) {
        $slug = sanitize_text_field($_GET['slug']);
        $post = get_page_by_path($slug, OBJECT, 'products');

        if ($post) {
            $price = get_post_meta($post->ID, 'product_price', true);
            if ($price !== '') {
                wp_send_json_success($price);
            } else {
                wp_send_json_error('Product price not found for slug: ' . $slug);
            }
        } else {
            wp_send_json_error('Product not found for slug: ' . $slug);
        }
    } else {
        wp_send_json_error('Slug not provided');
    }
}



add_action('wp_ajax_prdct_price', 'prdct_price');
add_action('wp_ajax_nopriv_prdct_price', 'prdct_price');



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