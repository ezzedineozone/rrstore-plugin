<?php
    /**
    * Template Name: Products Page
    */
?>

<?php get_header()?>
<div class = "products-container">
    <?php
        $args = array(
            'post_type' => 'product',
            'orderby' => 'date',
            'order' => 'DESC'
        );
        $query = new WP_Query($args);
        if($query->have_posts()) :
            while($query->have_posts()) : $query->the_post();
    ?>
    <div class = "product-card">
        <h3 class = "product-card-title"><?php the_title()?></h3>
        <p class = "product-card-description"><?php the_content()?></p>
        <img src="<?php echo site_url() ?>/wp-content/plugins/rrstore-plugin/images/sample-product.png" class = "product-card-image" />
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