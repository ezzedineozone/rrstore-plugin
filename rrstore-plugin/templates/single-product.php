<?php get_header(); ?>

<main>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post(); ?>
            <article>
                <h1><?php the_title(); ?></h1>
                <div class="product-description">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile;
    else :
        echo '<p>No product found.</p>';
    endif;
    ?>
</main>

<?php get_footer(); ?>
