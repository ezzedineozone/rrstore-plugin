<?php get_header(); ?>

<?php
if (have_posts()) :
    while (have_posts()) : the_post(); ?>
    <div class = "product-page-container">
        <div class = "product-page-image-container">
            <?php
                $img_id = get_post_meta(get_the_ID(), '_my_image_attachment_id', true);
                $img = wp_get_attachment_url($img_id);
                if(!$img):
                ?>
                <img class = "product-page-image" src="<?php echo site_url() ?>/wp-content/plugins/rrstore-plugin/images/sample-product.png" class = "product-card-image" id = "<?php echo $post_slug . '_img'; ?>" />
                <?php
                else :
                ?>
                <img class = "product-page-image" src = "<?php echo $img ?>" />
                <?php endif;
            ?>
        </div> 
        <div class = "product-page-info-container">
            <div class = "product-page-product-title">
                <?php the_title()?>
            </div>
            <div class = "product-page-product-price-container">
                <p class = "product-page-product-price">$<?php echo get_post_meta(get_the_ID(), 'product_price', true)?> </p>
            </div>
            <div class = "product-page-product-description">
                <?php the_content()?>
            </div>
            <div class = "product-page-actions-container">
                <input class = "product-page-actions-input" type = "number" value = "1" min = "0" max = "99" />
                <button class = "product-page-actions-cart">
                    Add To Cart
                </button>
            </div>
        </div>
    </div>
    <?php endwhile;
else :
    echo '<p>No product found.</p>';
endif;
?>

<?php get_footer(); ?>
