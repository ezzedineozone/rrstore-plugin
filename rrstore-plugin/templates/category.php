<?php

/**
 * Template Name: Products Page
 */
?>

<?php get_header() ?>
<div class="products-page-container">
    <div class="products-page-actions">
        <div class="flex flex-row justify-start w-max top-0 left-0 absolute">
            <button class="bg-blue-800 px-2 py-1 w-max" id="open-filter-menu-button">
                <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                </svg>
            </button>
        </div>
        <h1 class="products-page-title">
            Browse Products
        </h1>
    </div>
    <div class="products-container relative">
        <?php
        $category_slug = get_query_var('category_name');
        $args = array(
            'post_type' => 'products',
            'orderby' => 'date',
            'order' => 'DESC',
            'tax_query' => array(
                array(
                    'taxonomy' => 'category',  // Adjust taxonomy if necessary
                    'field'    => 'slug',
                    'terms'    => $category_slug,
                ),)
        );
        $query = new WP_Query($args);
        if ($query->have_posts()) :
            while ($query->have_posts()) : $query->the_post();
                $post_slug = get_post_field('post_name', get_the_ID());
        ?>
                <div class="product-card ">
                    <div class="product-card-details">
                        <h3 class="product-card-title" id="<?php echo $post_slug . '_title'; ?>"><?php the_title() ?></h3>
                        <p class="product-card-description" id="<?php echo $post_slug . '_description'; ?>">Product Summary</p>
                    </div>
                    <div class="product-card-image-container">
                        <div class="product-card-image">
                            <?php
                            $img_id = get_post_meta(get_the_ID(), '_my_image_attachment_id', true);
                            $img = wp_get_attachment_url($img_id);
                            if (!$img):
                            ?>
                                <img src="<?php echo site_url() ?>/wp-content/plugins/rrstore-plugin/images/sample-product.png" class="product-card-image" id="<?php echo $post_slug . '_img'; ?>" />
                            <?php
                            else :
                            ?>
                                <img src="<?php echo wp_get_attachment_url(get_post_meta(get_the_ID(), '_my_image_attachment_id', true)); ?>" class="product-card-image" id="<?php echo $post_slug . '_img'; ?>" />
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="product-card-price-container">
                        <p class="product-card-price">$<?php echo get_post_meta(get_the_ID(), 'product_price', true) ?></p>
                    </div>
                    <div class="product-card-actions-container" id="<?php echo $post_slug . '_card'; ?>">
                        <button class="product-card-actions-details" id="<?php echo $post_slug . '_info'; ?>" onclick="showProductInfo(this)">Info</Button>
                        <button class="product-card-actions-cart" id="<?php echo $post_slug . '_cart'; ?>">
                            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
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
        <?php endif; ?>
    </div>
    <div class="categories-container">
        <div class="categories-container-control">
            <button class="rounded-md" id="close-filter-menu-button">
                <svg class="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                </svg>
            </button>
        </div>
        <div class="categories-container-content">
            <div class="price-picker">
                <label class="categories-container-title">Price Range:</label>
                <div x-data="range()" x-init="mintrigger(); maxtrigger()" class="relative max-w-xl w-full">
                    <div class="mb-4">
                        <input type="range"
                            step="5"
                            x-bind:min="min" x-bind:max="max"
                            x-on:input="mintrigger"
                            x-model="minprice"
                            class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer">

                        <input type="range"
                            step="5"
                            x-bind:min="min" x-bind:max="max"
                            x-on:input="maxtrigger"
                            x-model="maxprice"
                            class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer">

                        <div class="relative z-10 h-2">

                            <div class="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-white"></div>

                            <div class="absolute z-20 top-0 bottom-0 rounded-md bg-blue-800" x-bind:style="'right:'+maxthumb+'%; left:'+minthumb+'%'"></div>

                            <div class="absolute z-30 w-6 h-6 top-0 left-0 bg-blue-800 rounded-full -mt-2 -ml-1" x-bind:style="'left: '+minthumb+'%'"></div>

                            <div class="absolute z-30 w-6 h-6 top-0 right-0 bg-blue-800 rounded-full -mt-2 -mr-3" x-bind:style="'right: '+maxthumb+'%'"></div>

                        </div>
                        <div class="flex justify-between items-center space-x-2 pt-4">
                            <div>
                                <input type="number" maxlength="5" x-on:input="mintrigger" x-model="minprice" class=" border border-gray-200 rounded w-full text-center price-input-boxes" id="price-input-low">
                            </div>
                            <div>
                                <input type="number" maxlength="5" x-on:input="maxtrigger" x-model="maxprice" class=" border border-gray-200 rounded w-full text-center price-input-boxes" id="price-input-high">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class = "space-y-2 flex flex-col">
                <label class = "categories-container-title">Chose a category:</label>
                <button id="dropdownDelayButton" data-dropdown-toggle="dropdownDelay" class="text-white w-3/5 h-10 bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Category 
                <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
                </button>

                <!-- Dropdown menu -->
                <div id="dropdownDelay" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                            <?php
                                $categories = get_categories(array(
                                    'hide_empty' => false
                                ));
                                $categories = array_filter($categories, function($category)
                                {
                                    return $category->name !== 'Uncategorized';
                                });
                                foreach ( $categories as $category ) :
                                    $category_link = get_category_link($category);
                                    ?>
                                    <li>
                                        <button onclick="handleCategoryClick('<?php echo esc_js($category_link); ?>'); return false;" class="flex justify-start items-center pl-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full  dark:hover:text-white">
                                            <?php echo esc_html($category->name); ?>
                                        </button>
                                    </li>
                                    <?php
                                endforeach;
                            ?>
                        </ul>
                    </div>
                </div>
                <div class="w-full flex flex-row space-x-2 justify-start items-center mb-4 pt-4">
                    <button class="px-3 py-2 bg-blue-800 text-white rounded-md" id = "filter-apply-button">Apply</button>
                    <button class="px-3 py-2 bg-red-600 text-white rounded-md" id = "filter-reset-button">Reset</button>
                </div>
            </div>
        </div>
    </div>

</div>


<?php get_footer() ?>