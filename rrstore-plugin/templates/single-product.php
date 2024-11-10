<?php rrstore_plugin_header(); ?>

<?php
if (have_posts()) :
    while (have_posts()) : the_post(); ?>
    <div class="flex flex-row justify-start w-full h-max py-4 pr-8">
        <div class="flex flex-row justify-start w-max">
            <button class="bg-blue-800 text-white text-xl font-bold px-2 py-1 w-max transform transition duration-200 ease-in-out hover:scale-105 hover:opacity-90" id="back-home-button">
                &larr; Back
            </button>
        </div>
    </div>
    <div class = "rrstore-product-page-container">
        <div class = "rrstore-product-page-image-container">
            <?php
                $img_id = get_post_meta(get_the_ID(), '_my_image_attachment_id', true);
                $img = wp_get_attachment_url($img_id);
                $slug = get_post_field('post_name', get_the_ID());
                if(!$img):
                ?>
                <img class = "rrstore-product-page-image" id = "<?php echo $slug ;?>_img" src="<?php echo site_url() ?>/wp-content/plugins/rrstore plugin/rrstore-plugin/images/sample-product.png" class = "product-card-image" id = "<?php echo $post_slug . '_img'; ?>" />
                <?php
                else :
                ?>
                <img class = "rrstore-product-page-image" id = "<?php echo $slug ;?>_img" src = "<?php echo $img ?>" />
                <?php endif;
                $post_slug = get_post_field('post_name', get_the_ID());
            ?>
        </div> 
        <div class = "rrstore-product-page-info-container">
            <div class = "rrstore-product-page-product-title">
                <?php the_title()?>
            </div>
            <div class = "rrstore-product-page-product-price-container">
                <p class = "rrstore-product-page-product-price">$<?php echo get_post_meta(get_the_ID(), 'product_price', true)?> </p>
            </div>
            <div class = "rrstore-product-page-product-description">
                <?php the_content()?>
            </div>
            <div class = "rrstore-product-page-actions-container">
                <button class = "rrstore-product-page-actions-info" hidden id="<?php echo $post_slug . '_info'; ?>"> Info</button>
                <button class = "rrstore-product-page-actions-cart" id="<?php echo $post_slug . '_cart'; ?>">
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
<div class = "flex flex-row justify-end w-full h-max">
    <p>BAck</p>
</div>
<?php rrstore_plugin_footer(); ?>
