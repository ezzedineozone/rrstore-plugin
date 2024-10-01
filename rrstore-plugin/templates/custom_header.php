<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php wp_head() ?>
</head>
<body class = "body"> 
<div class = "header">
    <img class = "logo-container" src="<?php echo plugin_dir_url(__FILE__); ?>../images/rr-logo.png"/>
    <div id ="mobile-navigation-button-container" class = " flex flex-row space-x-4 w-full justify-end hidden">
        <button class = "product-card-actions-cart-header" onClick="onCartButtonClicked()">
                <svg class="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                </svg>
                <p class = "font-semibold" >Cart</p>
        </button>
        <button class="rounded-md flex flex-col items-center  border-black border-1 mobile-navigation-button" id="mobile-navigation-button">
            <svg class="w-8 h-8 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
            </svg>
            <p class = "font-semibold" >Menu</p>
        </button>
        <div class = "absolute top-0 left-0 w-full h-full bg-yellow-custom z-50" id = "mobile-navigation-modal" hidden>
            <div id = "mobile-navigation-container" class = "mobile-navigation-container">
                <div class = "w-full h-max flex flex-row justify-end">
                    <button class="rounded-md flex flex-col items-center  border-black border-1 mobile-navigation-button" >
                        <svg class="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                        </svg>
                        <p class = "font-semibold" >Close Menu</p>
                    </button>
                </div>
                <div class = "mobile-navigation">
                    <?php 
                        wp_nav_menu(
                            array(
                                'menu' => 'primary',
                                'container' => '',
                                'theme_location' => 'primary',
                                'items_wrap'=> '<ul id="%1$s" class="%2$s mobile-navigation">%3$s</ul>',
                            )
                        );
                    ?>
                </div>
            </div>
        </div>
    </div>
    <div class = "navigation-container">
        <?php 
            wp_nav_menu(
                array(
                    'menu' => 'primary',
                    'container' => '',
                    'theme_location' => 'primary',
                    'items_wrap'=> '<ul id="%1$s" class="%2$s navigation">%3$s</ul>',
                )
            );
        ?>
        <div class = "custom-navigation-container">
            <button class = "product-card-actions-cart-header " onClick="onCartButtonClicked()">
                    <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                    </svg>
            </button>
            <form class = "border-yellow-custom border-4 w-auto h-auto flex text-sm rounded-sm space-x-2">
                    <input class = "rounded-sm text-base bg-white h-8 p-2 space-x-2" placeholder = "Search..." />
                    <button class = "bg-blue-800 rounded-sm text-white w-10 h-auto flex items-center justify-center">
                        <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                        </svg>
                    </button>
            </form>
        </div>
    </div>
</div>
