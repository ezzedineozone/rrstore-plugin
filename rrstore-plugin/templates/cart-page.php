<?php

/**
 * Template Name: Cart Page
 */
rrstore_plugin_header();
?>
<div class='rrstore-cart-page-container'>
    <div class = "rrstore-cart-table-container">
    </div>
    <div class='rrstore-cart-user-actions-container'>
        <h1 class="rrstore-cart-user-actions-title">Checkout</h1>
        <p class="text-xl font-bold" id="total-price">
            Subtotal:
            <br>
            <span class="text-blue-800" id = "total-price-num">$0</span>
        </p>
        <h1 class="rrstore-cart-user-actions-title">Address</h1>
        <div class="flex flex-col w-full h-max mb-3 space-y-4">
            <div class="flex flex-row w-full h-max space-x-2 items-center justify-center">
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="firstname" class="w-full text-sm">First Name:</label>
                    <input type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="lastname" class="w-full text-sm ">Last Name:</label>
                    <input type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
            </div>
            <div class="flex flex-row w-full h-max space-x-2 items-center justify-center">
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="country" class="w-full text-sm">Email:</label>
                    <input type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="email" class="w-full text-sm ">Country:</label>
                    <select id="country-select" class="w-full h-8 border-2 border-gray-200 rounded-md pl-2">
                        <option value="" disabled selected class = "text-sm text-gray-300" >Select your country</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col w-full h-max">
                <label for ="phone_num" class = "w-full h-max">Phone number</label>
                <div class = "flex flex-row w-full h-max space-x-2">
                    <input placeholder="961" type = "number" class ="w-1/4 h-8 border-2 border-gray-200 rounded-md"/>
                    <input placeholder="70123456" type = "number" class ="w-3/4 h-8 border-2 border-gray-200 rounded-md"/>
                </div>
            </div>
            <div class="flex flex-col w-full h-max">
                <label for="adress2" class="w-1/2">Adress Line</label>
                <input type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
            </div>
        </div>
        <div class="rrstore-cart-user-actions-buttons-container">
            <button class="rrstore-cart-user-actions-checkout">
                Checkout
            </button>
            <button class="rrstore-cart-user-actions-save-address">
                Save Address
            </button>
        </div>
    </div>
</div>
<?php rrstore_plugin_footer();?>