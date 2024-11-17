<?php

/**
 * Template Name: Products page
 */
?>

<?php rrstore_plugin_header() ?>
<div class="rrstore-products-page-container">
    <div class="rrstore-products-page-actions">
        <!-- <div class="flex flex-row justify-start w-max top-0 left-0 absolute">
            <button class="bg-blue-800 px-2 py-1 w-max" id="open-filter-menu-button">
                <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                </svg>
            </button>
        </div> -->
        <h1 class="rrstore-products-page-title">
            Browse Products
        </h1>
    </div>
    <div class="rrstore-products-container relative">
        <?php
        if(!function_exists('product_plugin_active'))
        {
            echo `<h1>rrstore plugin not activated!</h1>`;
            return;
        }
        $query = new WP_Query(
            array(
                'post_type'=>'products',
                'posts_per_page'=>-1
            )
        );
        if ($query->have_posts()) :
            while ($query->have_posts()) : $query->the_post();
                $post_slug = get_post_field('post_name', get_the_ID());
        ?>
                <div class="rrstore-product-card" id="<?php echo $post_slug . '_card'; ?>">
                    <div class="rrstore-product-card-details" id="<?php echo $post_slug . '_details'; ?>">
                        <h3 class="rrstore-product-card-title" id="<?php echo $post_slug . '_title'; ?>"><?php the_title() ?></h3>
                        <p class="rrstore-product-card-description" id="<?php echo $post_slug . '_description'; ?>">Product Summary</p>
                        <div class="rrstore-product-card-image-container">
                        <div class="rrstore-product-card-image">
                            <?php
                            $img_id = get_post_meta(get_the_ID(), '_my_image_attachment_id', true);
                            $img = wp_get_attachment_url($img_id);
                            if (!$img):
                            ?>
                                <img src="<?php echo site_url() ?>/wp-content/plugins/rrstore plugin/rrstore-plugin/images/sample-product.png" class="rrstore-product-card-image" id="<?php echo $post_slug . '_img'; ?>" />
                            <?php
                            else :
                            ?>
                                <img src="<?php echo wp_get_attachment_url(get_post_meta(get_the_ID(), '_my_image_attachment_id', true)); ?>" class="rrstore-product-card-image" id="<?php echo $post_slug . '_img'; ?>" />
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="rrstore-product-card-price-container">
                        <p class="rrstore-product-card-price">$<?php echo get_post_meta(get_the_ID(), 'product_price', true) ?></p>
                    </div>
                    </div>
                    <div class="rrstore-product-card-actions-container">
                        <button class="rrstore-product-card-actions-details" id="<?php echo $post_slug . '_info'; ?>">Info</Button>
                        <button class="rrstore-product-card-actions-cart" id="<?php echo $post_slug . '_cart'; ?>">
                            <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
            <div class = "w-full h-screen flex flex-col justify-center items-center">
                <h1 class = "text-2xl">
                    No products found under specified filters!
                </h1>
                <h1 class = "text-2xl">
                    please refine your filters.
                </h1>
            </div>
        <?php endif; ?>
    </div>
    <div class="rrstore-categories-container">
        <div class="rrstore-categories-container-control">
            <button class="rounded-md" id="close-filter-menu-button">
                <svg class="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                </svg>
            </button>
        </div>
        <div class="rrstore-categories-container-content">
            <form>
                <div class="price-picker mb-6">
                <label class = "rrstore-categories-container-title">Price range:</label>
                    <div class=" m-4 flex justify-center items-center">
                        <div x-data="range()" x-init="mintrigger(); maxtrigger()" class="relative w-full">
                            <div>
                                <input type="range" step="100" x-bind:min="min" x-bind:max="max" x-on:input="mintrigger" x-model="minprice" class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer">

                                <input type="range" step="100" x-bind:min="min" x-bind:max="max" x-on:input="maxtrigger" x-model="maxprice" class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer">

                                <div class="relative z-10 h-2">

                                    <div class="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200"></div>

                                    <div class="absolute z-20 top-0 bottom-0 rounded-md bg-blue-800" x-bind:style="'right:'+maxthumb+'%; left:'+minthumb+'%'"></div>

                                    <div class="absolute z-30 w-6 h-6 top-0 left-0 bg-blue-800 rounded-full -mt-2" x-bind:style="'left: '+minthumb+'%'"></div>

                                    <div class="absolute z-30 w-6 h-6 top-0 right-0 bg-blue-800 rounded-full -mt-2" x-bind:style="'right: '+maxthumb+'%'"></div>

                                </div>

                            </div>

                            <div class="flex items-center justify-between pt-5 space-x-4 text-sm text-gray-700">
                                <div>
                                    <input type="text" maxlength="5" name="min-price" x-on:input.debounce="mintrigger" x-model="minprice"
                                        wire:model.debounce.300="minPrice"
                                        class="w-24 px-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-yellow-400 focus:outline-none">
                                </div>
                                <div>
                                    <input type="text" name="max-price" maxlength="5" x-on:input.debounce.300="maxtrigger" x-model="maxprice"
                                        wire:model.debounce="maxPrice"
                                        class="w-24 px-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-yellow-400 focus:outline-none">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-2 flex flex-col">
                    <label class="rrstore-categories-container-title">Chose a category:</label>
                    <button id="rrstore-dropdownDelayButton" data-dropdown-toggle="dropdownDelay" class="text-white w-3/5 h-10 bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                        <p id="rrstore-category-slug-text">Category</p>
                        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <input name="category-slug" id="category-slug-input" hidden />
                    <div id="dropdownDelay" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                            <?php
                            $categories = get_categories(array(
                                'hide_empty' => false
                            ));
                            $categories = array_filter($categories, function ($category) {
                                return $category->name !== 'Uncategorized';
                            });
                            foreach ($categories as $category) :
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
                    <button type="submit" class="px-3 py-2 bg-blue-800 text-white rounded-md" id="filter-apply-button">Apply</button>
                    <button class="px-3 py-2 bg-red-600 text-white rounded-md" id="filter-reset-button">Reset</button>
                </div>
            </form>
        </div>
    </div>
</div>

</div>


<?php rrstore_plugin_footer() ?>