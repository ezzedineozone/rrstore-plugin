<?php

/*
* Plugin Name: rrstore-cart
* Description: Cart for rrstore
* Author: Ezzedine Al Ozon
*/


function rrstore_cart_activate() {
    add_option("rrstore_cart_default_option", '', '', 'yes');
}
register_activation_hook(__FILE__, 'rrstore_cart_activate');



function load_cart_script() {
    wp_enqueue_script('jquery');
    if(is_page('cart') || is_post_type_archive('products')):
        wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/2.1.3/css/dataTables.dataTables.min.css');
        wp_enqueue_script('datatables-js', 'https://cdn.datatables.net/2.1.3/js/dataTables.min.js', array('jquery'), null, true);
        wp_enqueue_script('cart-js', plugin_dir_url(__FILE__) . '/rrstore-cart/cart.js', array('jquery'), null, true);
        wp_localize_script('cart-js', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
    endif;
}
add_action('wp_enqueue_scripts', 'load_cart_script');

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
                $_SESSION['rrstore_cart'] = array_values($cart); // Re-index array
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
            $cart = $_SESSION['rrstore-cart'];
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
add_action('wp_ajax_get_item_qty_cart', 'get_item_qty');
add_action('wp_ajax_nopriv_get_item_qty_cart', 'get_item_qty');
?>
