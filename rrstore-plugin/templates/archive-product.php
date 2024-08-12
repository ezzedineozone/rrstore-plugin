<?php
    /**
    * Template Name: Products Page
    */
?>

<?php get_header()?>
<div class = "products-container">
    <?php
        $args = array(
            'post_type' => 'products',
            'orderby' => 'date',
            'order' => 'DESC'
        );
        $query = new WP_Query($args);
        if($query->have_posts()) :
            while($query->have_posts()) : $query->the_post();
            $post_slug = get_post_field('post_name', get_the_ID());
    ?>
    <div class = "product-card">
        <div class = "product-card-details">
            <h3 class = "product-card-title" id = "<?php echo $post_slug . '_title'; ?>"><?php the_title()?></h3>
            <p class = "product-card-description" id = "<?php echo $post_slug . '_description'; ?>">Product Summary</p>
        </div>
        <div class = "product-card-image-container">
            <div class = "product-card-image">
            <?php
                $img_id = get_post_meta(get_the_ID(), '_my_image_attachment_id', true);
                $img = wp_get_attachment_url($img_id);
                if(!$img):
                ?>
                <img src="<?php echo site_url() ?>/wp-content/plugins/rrstore-plugin/images/sample-product.png" class = "product-card-image" id = "<?php echo $post_slug . '_img'; ?>" />
                <?php
                else :
                ?>
                <img src="<?php echo wp_get_attachment_url(get_post_meta(get_the_ID(), '_my_image_attachment_id', true)); ?>" class = "product-card-image" id = "<?php echo $post_slug . '_img'; ?>" />
                <?php endif;?>
            </div>
        </div>
        <div class = "product-card-price-container">
            <p class = "product-card-price">$<?php echo get_post_meta(get_the_ID(), 'product_price', true)?></p>
        </div>
        <div class = "product-card-actions-container" id = "<?php echo $post_slug . '_card'; ?>">
                <button class = "product-card-actions-details" id = "<?php echo $post_slug . '_info'; ?>" onclick="showProductInfo(this)">Info</Button>
                <button class = "product-card-actions-cart" id = "<?php echo $post_slug . '_cart'; ?>">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                    </svg>
                </button>

        </div>
    </div>
    <?php 
        endwhile;
        wp_reset_postdata();
        else:
    ?>
    <p>no products found </p>
    <?php endif;?>
</div>
<?php get_footer()?>