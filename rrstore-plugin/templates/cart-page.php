<?php

/**
 * Template Name: Cart Page
 */
rrstore_plugin_header();
$first_name = isset($_GET['first_name']) ? htmlspecialchars($_GET['first_name']) : 'not provided';
$last_name = isset($_GET['last_name']) ? htmlspecialchars($_GET['last_name']) : 'not provided';
$email = isset($_GET['email']) ? htmlspecialchars($_GET['email']) : 'not provided';
$country = isset($_GET['country']) ? htmlspecialchars($_GET['country']) : 'not provided';
$phone_number = isset($_GET['country_code']) && isset($_GET['phone_number']) 
    ? htmlspecialchars($_GET['country_code']) . '-' . htmlspecialchars($_GET['phone_number']) 
    : 'not provided';
$city = isset($_GET['city']) ? htmlspecialchars($_GET['city']) : 'not provided';
$street = isset($_GET['street']) ? htmlspecialchars($_GET['street']) : 'not provided';
$address_line = isset($_GET['address_line']) ? htmlspecialchars($_GET['address_line']) : 'not provided';
$delivery_price = get_country_delivery_no_ajax();
if($first_name == 'not provided'):
?>
<div class='rrstore-cart-page-container'>
    <div class = "rrstore-cart-table-container">
    </div>
    <form class='rrstore-cart-user-actions-container'>
        <h1 class="rrstore-cart-user-actions-title">Checkout</h1>
        <p class="text-xl font-bold" id="total-price">
            Subtotal:
            <br>
            <span class="text-blue-800" id = "total-price-num">$0</span>
        </p>
        <h1 class="rrstore-cart-user-actions-title">Address</h1>
        <p id = "checkout-error-message" class = "test-sm text-red-500 hidden">
        </p>
        <div class="flex flex-col w-full h-max mb-3 space-y-4">
            <div class="flex flex-row w-full h-max space-x-2 items-center justify-center">
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="firstname" class="w-full text-sm required-field">First Name:</label>
                    <input name ="first_name" type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="lastname" class="w-full text-sm ">Last Name:</label>
                    <input name = "last_name" type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
            </div>
            <div class="flex flex-row w-full h-max space-x-2 items-center justify-center">
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="email" class="w-full text-sm required-field">Email:</label>
                    <input name="email" id ="email-input" type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="country" class="w-full text-sm required-field ">Country:</label>
                    <select name="country" id="country-select" class="w-full h-8 border-2 border-gray-200 rounded-md pl-2">
                        <option value="" disabled selected class = "text-sm text-gray-300" >Select your country</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col w-full h-max">
                <label for ="phone_num" class = "w-full h-max required-field">Phone number:</label>
                <div class = "flex flex-row w-full h-max space-x-2">
                    <input name="country_code" placeholder="961" type = "number" class ="w-1/4 h-8 border-2 border-gray-200 rounded-md"/>
                    <input name="phone_number" placeholder="70123456" type = "number" class ="w-3/4 h-8 border-2 border-gray-200 rounded-md"/>
                </div>
            </div>
            <div class="flex flex-row w-full h-max space-x-2 items-center justify-center">
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="city" class="w-full text-sm required-field">City:</label>
                    <input name ="city" type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
                <div class="flex flex-col w-1/2 items-center justify-center">
                    <label for="street" class="w-full text-sm required-field">street:</label>
                    <input name = "street" type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
                </div>
            </div>
            <div class="flex flex-col w-full h-max">
                <label for="adress2" class="w-1/2 required-field">Adress Line</label>
                <input name = "address line" type="text" class="w-full h-8 border-2 border-gray-200 rounded-md" />
            </div>
        </div>
        <div class="rrstore-cart-user-actions-buttons-container">
            <button type = "submit" class="rrstore-cart-user-actions-checkout" id = "main-checkout-button">
                Checkout
            </button>
            <button class="rrstore-cart-user-actions-save-address">
                Save Address
            </button>
        </div>
    </form>
</div>
<?php
else :
?>
<div class="w-full h-full space-y-8 p-4 flex flex-col justify-center items-center">
    <h1 class="font-bold text-3xl mb-8 w-2/3">
        Order summary:
    </h1>
    <div class="grid text-xl grid-cols-2 gap-x-32 gap-y-4 w-2/3 max-w-2/3">
        <p><strong>First Name:</strong> <?php echo $first_name; ?></p>
        <p><strong>Last Name:</strong> <?php echo $last_name; ?></p>

        <p><strong>Email:</strong> <?php echo $email; ?></p>
        <p><strong>Country:</strong> <?php echo $country; ?></p>

        <p><strong>Phone Number:</strong> <?php echo $country_code . '+' . $phone_number; ?></p>
        <p><strong>City:</strong> <?php echo $city; ?></p>

        <p><strong>Street:</strong> <?php echo $street; ?></p>
        <p><strong>Address Line:</strong> <?php echo $address_line; ?></p>
    </div>
    <div class = "w-2/3 max-w-2/3 border border-black flex flex-col p-4" id = "reciept-cart">
        <div class = "w-full h-max p-2 flex justify-between">
            <p class = "font-bold text-lg ">Item</p>
            <p class = "font-bold text-lg">Price</p>
        </div>
        <div class = "w-full h-max py-2 px-2 flex justify-end items-end" id = "reciept-cart-entry">

        </div>
    </div>
    <div class="flex flex-col border-yellow-custom border rounded-md justify-center items-center p-8 max-w-2/3 w-2/3">
        <h2 class="font-bold mt-6 mb-2 text-3xl text-yellow-custom ">After clicking confirm below. Pay through the following to process your order: </h2>
        <div class = "flex flex-col spacey-y-4>">
            <!-- <?php 
            $payment_methods = get_option('payment_methods', []);
            if (!empty($payment_methods)): 
                foreach ($payment_methods as $method): ?>
                    <div class = "flex flex-row space-x-2">
                        <a class = "font-bold text-black text-2xl"> <?php echo esc_html($method['name']).": "; ?> </a>
                        <a href="<?php echo esc_url($method['link']); ?>" target="_blank" class=" text-2xl font-semibold text-blue-400 underline">
                                <?php echo esc_url($method['link']); ?>
                        </a>
                    </div>
                <?php endforeach; 
            else: ?>
                <li>No payment methods available. If youre admin, add them from wp-admin under products</li>
            <?php endif; ?> -->
            <div class = " flex flex-row space-x-2">
                <p class = "font-bold text-black text-2xl"> OMT: </p>
                <p class=" text-2xl font-semibold text-blue-400 underline" > Chadi Faraj </p>
            </div>
            <div class = " flex flex-row space-x-2">
                <p class = "font-bold text-black text-2xl"> Whish: </p>
                <p class=" text-2xl font-semibold text-blue-400 underline" > 03 142 379 </p>
            </div>
            <?php if($delivery_price != -1): ?>
            <div class = "flex flex-row space-x-2 justify-center items-center mt-4">
                <button class = "px-4 py-2 w-max bg-yellow-custom text-lg font-bold text-white" id = "confirm-order-button">Confirm order</button>
            </div>
            <?php else : ?>
                <div class = "flex flex-row space-x-2 justify-center items-center mt-4">
                    <button class = "px-4 py-2 w-max bg-gray-600 text-lg font-bold text-gray-300 cursor-not-allowed" disabled id = "confirm-order-button">Confirm order</button>
                    <p class = "text-sm text-gray-400">No delivery options </p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

</div>
<?php
endif;
rrstore_plugin_footer();?>