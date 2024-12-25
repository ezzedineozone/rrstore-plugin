var user_cart = new Map();
var table;
var table_data;
let page_vertical = false;
let payment_method = "";
const omtFees = new Map([
    [50, 2],
    [100, 3],
    [300, 5],
    [500, 7],
    [1000, 8],
    [2000, 12],
    [3000, 18],
    [4000, 25],
    [5000, 35]
]);

const whishFees = new Map([
    [100, 1],
    [200, 2],
    [300, 3],
    [1000, 5],
    [2000, 10],
    [3000, 15],
    [4000, 20],
    [5000, 25]
]);
//NOTE FOR FUTURE SELF: every function postfixd by _PHP makes a call to the php client to get or modify information about
//the cart from the session cookie
console.log('cart-js loaded');
jQuery(document).ready(async function($){ 
    console.log($);
async function sendEmail(htmlContent, recipientEmail) {
    debugger;
    await $.ajax({
        url: ajax_object.ajax_url,
        type: 'POST',
        data: {
            action: 'send_html_email',
            html_content: htmlContent,
            recipient_email: recipientEmail
        },
        success: function(response) {
        },
        error: function() {
            alert('An error occurred while sending the email.');
        }
    });
} 
async function getCart_PHP() {
    return $.ajax({
        url: ajax_object.ajax_url,
        type: 'GET',
        dataType: 'json',
        data: { action: 'get_cart' },
        success: function(response) {
            if (response.success) {
                console.log('Cart contents:', response.data);
                create_user_cart_map(response.data);
            } else {
                console.error('Error:', response.data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

async function addToCart_PHP(slug, quantity) {
    return await $.ajax({
        url: ajax_object.ajax_url,
        type: 'POST',
        dataType: 'json',
        data: { 
            action: 'add_to_cart', 
            slug: slug,
            quantity: quantity
        },
        success: function(response) {
            if (response.success) {
                if(user_cart.has(slug))
                    user_cart.set(slug, user_cart.get(slug) + quantity);
                else 
                    user_cart.set(slug, quantity);
            } else {
                console.error('Error:', response.data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

async function removeFromCartSingle(slug) {
    return await $.ajax({
        url: ajax_object.ajax_url,
        type: 'POST',
        dataType: 'json',
        data: { action: 'remove_from_cart_single', slug: slug },
        success: function(response) {
            if (response.success) {
                console.log('Item removed from cart:', response.data);
                if(user_cart.get(slug) == 1)
                    user_cart.delete(slug);
                else
                    user_cart.set(slug, user_cart.get(slug) - 1);
            } else {
                console.error('Error:', response.data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
async function removeFromCartAll(slug){
    return $.ajax({
        url: ajax_object.ajax_url,
        type: 'POST',
        dataType: 'json',
        data: {action: 'remove_from_cart_all', slug:slug},
        success: function (response){
            if(response.success)
            {
                console.log('succesfully removed all ' + slug);
                user_cart.delete(slug);
            }
        }
    })
}
async function clearCart_PHP() {
    return $.ajax({
        url: ajax_object.ajax_url,
        type: 'POST',
        dataType: 'json',
        data: { action: 'clear_cart' },
        success: function(response) {
            if (response.success) {
                console.log('Cart cleared:', response.data);
                user_cart = [];
            } else {
                console.error('Error:', response.data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

async function getProductPrice_PHP(slug) {
    try {
        let response = await $.ajax({
            url: ajax_object.ajax_url,
            type: 'GET',
            dataType: 'json',
            data: {
                action: 'prdct_price',
                slug: slug
            }
        });

        if (response.success) {
            console.log("Product price is: " + response.data);
            return response.data; 
        } else {
            console.error("Error fetching product price: ", response.data);
            return null;
        }
    } catch (error) {
        console.log(slug);
        console.error("AJAX Error: ", error);
        return null;
    }
}
async function remove_from_cart(slug, qty){
    
    return await $.ajax({
        url: ajax_object.ajax_url,
        type: 'POST',
        dataType: 'json',
        data: { action: 'remove_from_cart', slug: slug, qty: qty },
        success: function(response) {
            if (response.success) {
                console.log('Items removed from cart:', response.data);
                if(user_cart.get(slug) == 1)
                    user_cart.delete(slug);
                else
                    user_cart.set(slug, user_cart.get(slug) - qty);
                update_page_UI();
            } else {
                console.error('Error:', response.data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
function getItemQty(slug)
{
    if(user_cart.has(slug))
        return user_cart.get(slug);
    else 
        return 0;
}
function create_user_cart_map(arr)
{
    user_cart.clear();
    for(let element of arr)
    {
        if(!user_cart.has(element))
            user_cart.set(element,1);
        else 
            user_cart.set(element, user_cart.get(element) + 1);
    }
};
async function getCountryDeliveryPrice(country) {
    try {
        let response = await $.ajax({
            url: ajax_object.ajax_url,
            type: 'GET',
            dataType: 'json',
            data: {
                action: 'get_country_delivery',
                country: country
            }
        });

        if (response.success) {
            console.log("country delivery price is: " + response.data);
            return response.data; 
        } else {
            console.error("Error fetching country delivery price: ", response.data);
            return null;
        }
    } catch (error) {
        console.log(slug);
        console.error("AJAX Error: ", error);
        return null;
    }
}

function add_to_cart_logic(){

}

function setEventHandlers()
{
    if($('.rrstore-products-container').length > 0)
        {
            $('.rrstore-product-card-actions-details').on('click', async (e)=>{
                debugger;
                swal_loading();
                await clearCart_PHP();
                await addToCart_PHP(get_slug(e.currentTarget.id), 1);
                swal_loading();
                window.location.href = cartUrl;
              });
            $('.rrstore-product-card-actions-cart').click(async (e) => {
                debugger;
                swal_loading();
                let slug  = get_slug(e.currentTarget.id);
                let info_btn_id = '#' + slug + '_info';
                let old_qty = getItemQty(slug);
                let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                await addToCart_PHP(slug, qty-old_qty);
                let old_html_info = $(info_btn_id).clone(true);
                $(info_btn_id).replaceWith(`
                    <div class="relative flex items-center items-stretch h-full" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                        <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-12 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                            <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-12 text-center text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 qty-text-input" value="${qty}" min ="1" max = "999" required />
                        <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-12 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                            <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                `);
                let text_input_element_id = `#${slug}_qty`;
                let decrement_button_id = `#${slug}_decrement-button`;
                let increment_button_id = `#${slug}_increment-button`;
                $(increment_button_id).click(async() => {
                    swal_loading();
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue != 99) {
                        await addToCart_PHP(slug,1);
                        $(text_input_element_id).val(currentValue + 1);
                        swal_loading();
                    }
                    else 
                        swal_loading();
                });
                
                $(decrement_button_id).click(async () => {
                    swal_loading();
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue > 1) {
                        debugger;
                        await removeFromCartSingle(slug);
                        $(text_input_element_id).val(currentValue - 1);
                        swal_loading();
                    }
                    else 
                        swal_loading();
                });
                $(text_input_element_id).on('change',async ()=>{
                    swal_loading();
                    let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                    let old_qty = getItemQty(in_slug);
                    let qty = $(text_input_element_id).val();
                    if(old_qty < qty)
                    {
                        await addToCart_PHP(slug, qty-old_qty);
                    }
                    else if(old_qty> qty)
                    {
                        await remove_from_cart(slug, old_qty - qty);
                    }
                    else 
                        swal_loading();
                    swal_loading();
                });
                debugger;
                let cart_button_id = '#' + slug + '_cart';
                let old_html_cart = $(cart_button_id).clone(true);
                
                $(cart_button_id).replaceWith(`
                    <button class = "p-2 bg-red-600 h-full w-16 flex items-center justify-center rounded-md cursor-pointer" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                        <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                    </button>`);
                
                $(cart_button_id).click(async ()=>{
                    swal_loading();
                    await removeFromCartAll(slug);
                    $(cart_button_id).replaceWith(old_html_cart);
                    $(info_btn_id).replaceWith(old_html_info);
                    swal_loading();
                    swal_removeFromCart();
                });
                swal_loading();
                swal_addToCart();
                }

            );
        }
        else if($('.rrstore-cart-page-container').length > 0 || $('#reciept-cart').length > 0)
        {
            $('.rrstore-delete-button').click(async (e)=>{
                debugger;
                let slug = get_slug(e.currentTarget.id);
                activate_checkout_button();
                await removeFromCartAll(slug);
                await update_page_UI();
                swal_removeFromCart();
            });
            $('.increment-qty').click(async(e) => {
                
                swal_loading();
                let slug = get_slug(e.currentTarget.id);
                let text_input_element_id = '#' + slug + '_qty';
                let currentValue = parseInt($(text_input_element_id).val(), 10);
                if (!isNaN(currentValue) && currentValue != 99) {
                    await addToCart_PHP(slug,1);
                    $(text_input_element_id).val(currentValue + 1);
                    let new_total = parseFloat($('#total-price-num').text().replace(/[$,]/g, '').trim()) + parseFloat(await getProductPrice_PHP(slug));
                    let price_str = "Subtotal: " + "<p class = \"text-blue-800\" id = \"total-price-num\">$" + new_total + "</p>";
                    $('#total-price').html(price_str);
                }
                swal_loading();
            });
            
            $('.decrement-qty').click(async (e) => {
                swal_loading();
                activate_checkout_button();
                let slug = get_slug(e.currentTarget.id);
                let text_input_element_id = '#' + slug + '_qty';
                let currentValue = parseInt($(text_input_element_id).val(), 10);
                if (!isNaN(currentValue) && currentValue > 1) {
                    await removeFromCartSingle(slug);
                    $(text_input_element_id).val(currentValue - 1);
                    let new_total = parseFloat($('#total-price-num').text().replace(/[$,]/g, '').trim()) - parseFloat(await getProductPrice_PHP(slug));
                    let price_str = "Subtotal: " + "<p class = \"text-blue-800\" id = \"total-price-num\">$" + new_total + "</p>";
                    $('#total-price').html(price_str);
                }
                swal_loading();
            });
            $('.qty-text-input').on('change', async (e)=>{
                activate_checkout_button();
                swal_loading();
                let slug = get_slug(e.currentTarget.id);
                let text_input_element_id = '#' + slug + '_qty';
                let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                let old_qty = getItemQty(in_slug);
                let qty = $(text_input_element_id).val();
                if(old_qty < qty)
                {
                    let new_total = parseFloat($('#total-price-num').text().replace(/[$,]/g, '').trim()) + (qty - old_qty) * parseFloat(await getProductPrice_PHP(slug));
                    let price_str = "Subtotal: " + "<p class = \"text-blue-800\" id = \"total-price-num\">$" + ((parseFloat($('#total-price-num').text().replace(/[$,]/g, '').trim()))+ (qty - old_qty) * await getProductPrice_PHP(slug)) + "</p>";
                    $('#total-price').html(price_str);
                    await addToCart_PHP(slug, qty-old_qty);
                }
                else if(old_qty> qty)
                {
                    let new_total = parseFloat($('#total-price-num').text().replace(/[$,]/g, '').trim()) - (old_qty - qty) * parseFloat(await getProductPrice_PHP(slug));
                    let price_str = "Subtotal: " + "<p class = \"text-blue-800\" id = \"total-price-num\">$"+new_total+"</p>";
                    $('#total-price').html(price_str);
                    await remove_from_cart(slug, old_qty - qty);
                }
                swal_loading();
            })
            if($('#reciept-cart').length > 0)
            {
                $('#confirm-order-button').click(async ()=>{
                    await confirm_order();
                    clearCart_PHP();
                });
            }
            $('#omt').click(()=>{
                payment_method = "omt";
                populate_reciept();
            });
            $('#whish').click(()=>{
                payment_method = "whish";
                populate_reciept();
            });
        }
        else if($('.rrstore-product-page-container').length > 0)
        {
            debugger;
            $('.rrstore-product-page-actions-cart').on('click', async (e)=>{
                swal_loading();
                let slug  = get_slug(e.currentTarget.id);
                let info_btn_id = '#' + slug + '_info';
                let old_qty = await getItemQty(slug);
                let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                await addToCart_PHP(slug, qty-old_qty);
                let old_html_info = $(info_btn_id).clone(true);
                $(info_btn_id).replaceWith(`
                    <div class="relative flex items-center max-w-[10rem] h-full w-1/2" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                        <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                            <svg class="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input min ="1" max = "999" type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-full w-full text-center text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block py-2.5  qty-text-input" value="${qty}" required />
                        <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                            <svg class="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                `);
                let text_input_element_id = `#${slug}_qty`;
                let decrement_button_id = `#${slug}_decrement-button`;
                let increment_button_id = `#${slug}_increment-button`;
                $(increment_button_id).click(async() => {
                    swal_loading();
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue != 99) {
                        await addToCart_PHP(slug,1);
                        $(text_input_element_id).val(currentValue + 1);
                    }
                    swal_loading();
                });
                
                $(decrement_button_id).click(async () => {
                    debugger;
                    swal_loading();
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue > 1) {
                        await removeFromCartSingle(slug);
                        $(text_input_element_id).val(currentValue - 1);
                    }
                    swal_loading();
                });
                $(text_input_element_id).on('change',async ()=>{
                    swal_loading();
                    let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                    let old_qty = getItemQty(in_slug);
                    let qty = $(text_input_element_id).val();
                    if(old_qty < qty)
                    {
                        await addToCart_PHP(slug, qty-old_qty);
                    }
                    else if(old_qty> qty)
                    {
                        await remove_from_cart(slug, old_qty - qty);
                    }
                    swal_loading();
                });
                
                let cart_button_id = '#' + slug + '_cart';
                let old_html_cart = $(cart_button_id).clone(true);
                $(cart_button_id).replaceWith(`
                            <button class = "p-2 bg-red-600 h-full w-auto h-full flex items-center justify-center rounded-md cursor-pointer" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                                <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                </svg>
                            </button>`);
                $(cart_button_id).click(async ()=>{
                    swal_loading();
                    await removeFromCartAll(slug);
                    $(cart_button_id).replaceWith(old_html_cart);
                    $(info_btn_id).replaceWith(old_html_info);
                    swal_loading();
                    swal_removeFromCart();
                });
                debugger;
                swal_loading();
                swal_addToCart();
            });
            debugger;
            $('#back-home-button').click(()=>{
                window.location.href = productsUrl;
            })
        }
}
async function update_page_UI()
{
    debugger;
    await getCart_PHP();
    if($('.rrstore-products-container').length > 0)
    {
        for(let [key, value] of user_cart)
        {
            let slug  = key;
            let info_btn_id = '#' + slug + '_info';
            let old_html_info = $(info_btn_id).clone(true);
            $(info_btn_id).replaceWith(`
                <div class="relative flex items-center w-full items-stretch h-full" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                    <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class=" decrement-qty bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-12 focus:ring-gray-100 focus:ring-2 focus:outline-none">
                        <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                        </svg>
                    </button>
                    <input min ="1" max = "999" type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-12 w-1/2 text-center text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block qty-text-input" value="${value}" required />
                    <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="  increment-qty bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-12 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                        <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                        </svg>
                    </button>
                </div>
            `);
            let text_input_element_id = `#${slug}_qty`;
            let decrement_button_id = `#${slug}_decrement-button`;
            let increment_button_id = `#${slug}_increment-button`;
            $(increment_button_id).click(async() => {
                swal_loading();
                let currentValue = parseInt($(text_input_element_id).val(), 10);
                if (!isNaN(currentValue) && currentValue != 99) {
                    await addToCart_PHP(slug,1);
                    $(text_input_element_id).val(currentValue + 1);
                    swal_loading();
                }
            });
            
            $(decrement_button_id).click(async () => {
                swal_loading();
                let currentValue = parseInt($(text_input_element_id).val(), 10);
                if (!isNaN(currentValue) && currentValue > 1) {
                    await removeFromCartSingle(slug);
                    $(text_input_element_id).val(currentValue - 1);
                }
                swal_loading();
            });
            $(text_input_element_id).on('change',async ()=>{
                swal_loading();
                let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                let old_qty = getItemQty(in_slug);
                let qty = $(text_input_element_id).val();
                if(old_qty < qty)
                {
                    await addToCart_PHP(slug, qty-old_qty);
                }
                else if(old_qty> qty)
                {
                    await remove_from_cart(slug, old_qty - qty);
                }
                swal_loading();
            });

            let cart_button_id = '#' + slug + '_cart';
            let old_html_cart = $(cart_button_id).clone(true);
            
            $(cart_button_id).replaceWith(`
                <button class = "p-2 bg-red-600 h-full w-16 flex items-center justify-center rounded-md cursor-pointer" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                    <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>
                </button>`);
            
            $(cart_button_id).click(async ()=>{
                swal_loading();
                await removeFromCartAll(slug);
                $(cart_button_id).replaceWith(old_html_cart);
                $(cart_button_id).click(async ()=>{
                    debugger;
                    swal_loading();
                    let slug  = get_slug(e.currentTarget.id);
                    let info_btn_id = '#' + slug + '_info';
                    let old_qty = getItemQty(slug);
                    let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                    await addToCart_PHP(slug, qty-old_qty);
                    let old_html_info = $(info_btn_id).clone(true);
                    $(info_btn_id).replaceWith(`
                        <div class="relative flex items-center max-w-[10rem] h-full" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                            <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                                <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                                </svg>
                            </button>
                            <input type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-full text-center text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 qty-text-input" value="${qty}" min ="1" max = "999" required />
                            <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                                <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </button>
                        </div>
                    `);
                    let text_input_element_id = `#${slug}_qty`;
                    let decrement_button_id = `#${slug}_decrement-button`;
                    let increment_button_id = `#${slug}_increment-button`;
                    $(increment_button_id).click(async() => {
                        swal_loading();
                        let currentValue = parseInt($(text_input_element_id).val(), 10);
                        if (!isNaN(currentValue) && currentValue != 99) {
                            await addToCart_PHP(slug,1);
                            $(text_input_element_id).val(currentValue + 1);
                            swal_loading();
                        }
                        else 
                            swal_loading();
                    });
                    
                    $(decrement_button_id).click(async () => {
                        swal_loading();
                        let currentValue = parseInt($(text_input_element_id).val(), 10);
                        if (!isNaN(currentValue) && currentValue > 1) {
                            debugger;
                            await removeFromCartSingle(slug);
                            $(text_input_element_id).val(currentValue - 1);
                            swal_loading();
                        }
                        else 
                            swal_loading();
                    });
                    $(text_input_element_id).on('change',async ()=>{
                        swal_loading();
                        let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                        let old_qty = getItemQty(in_slug);
                        let qty = $(text_input_element_id).val();
                        if(old_qty < qty)
                        {
                            await addToCart_PHP(slug, qty-old_qty);
                        }
                        else if(old_qty> qty)
                        {
                            await remove_from_cart(slug, old_qty - qty);
                        }
                        else 
                            swal_loading();
                        swal_loading();
                    });
                    debugger;
                    let cart_button_id = '#' + slug + '_cart';
                    let old_html_cart = $(cart_button_id).clone(true);
                    
                    $(cart_button_id).replaceWith(`
                        <button class = "p-2 bg-red-600 h-full w-16 flex items-center justify-center rounded-md cursor-pointer" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                            <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </button>`);
                    
                    $(cart_button_id).click(async ()=>{
                        swal_loading();
                        await removeFromCartAll(slug);
                        $(cart_button_id).replaceWith(old_html_cart);
                        $(info_btn_id).replaceWith(old_html_info);
                        swal_loading();
                        swal_removeFromCart();
                    });
                    swal_loading();
                    swal_addToCart();
                        
                })
                $(info_btn_id).replaceWith(old_html_info);
                swal_loading();
                swal_removeFromCart();
            });
        }
    }
    else if($('.rrstore-cart-page-container').length > 0 || $('#reciept-cart').length > 0)
    {
        debugger;
        activate_checkout_button();
        swal_loading("updating cart...");
        await getCart_PHP();
        await update_table_data();
        let total_price = 0;
        for(let [key,value] of user_cart)
        {
            total_price += await getProductPrice_PHP(key) * value;
        }
        let price_str = "Subtotal: " + "<p class = \"text-blue-800\" id = \"total-price-num\">$" + total_price+ "</p>";
        $('#total-price').html(price_str);
        swal_loading();
        const requiredFields = [
            'input[name="first_name"]',
            'input[name="country_code"]',
            'input[name="phone_number"]',
            'input[name="city"]',
            'input[name="street"]',
            'input[name="address line"]',
            'input[name="email"]',
            '#country-select'
        ];
        requiredFields.forEach(function (selector) {
            $(selector).attr('required', true);
        });
        $('.rrstore-cart-user-actions-container').on('submit', function (event) {
            let isValid = true;

            requiredFields.forEach(function (selector) {
                if (!$(selector).val()) {
                    $(selector).addClass('border-red-500');
                    isValid = false;
                } else {
                    $(selector).removeClass('border-red-500');
                }
            });
            let email = $('#email-input').val();
            let email_valid = validate_email(email);
            $('#checkout-error-message').text("");
            debugger;
            if(!isValid)
            {
                event.preventDefault();
                $('#checkout-error-message').toggleClass('hidden');
                $('#checkout-error-message').append("Please enter all * fields");
            }
            else if (!email_valid) {
                event.preventDefault();
                $('#checkout-error-message').toggleClass('hidden');
                $('#checkout-error-message').append("Invalid email");
            }

        });
        $('input, select').on('input change', function () {
            $(this).removeClass('border-red-500');
        });
        if($('#reciept-cart').length>0)
        {
            await populate_reciept();
        }
    }
    else if($('.rrstore-product-page-container').length > 0)
    {
        debugger;
        let slug = $('.rrstore-product-page-actions-cart').attr('id')?.split('_')[0] || null;
        let info_btn_id = '#' + slug + '_info';
        let old_html_info = $(info_btn_id).clone(true);
        let value = await getItemQty(slug);
        if(value > 0)
        {
            $(info_btn_id).replaceWith(`
                <div class=" flex items-center w-1/2 h-full" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                    <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class=" decrement-qty bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-full focus:ring-gray-100 focus:ring-2 focus:outline-none">
                        <svg class="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                        </svg>
                    </button>
                    <input min ="1" max = "999" type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-full w-full text-center text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block py-2.5  qty-text-input" value="${value}" required />
                    <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="increment-qty bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                        <svg class="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                        </svg>
                    </button>
                </div>
            `);
            let text_input_element_id = `#${slug}_qty`;
                let decrement_button_id = `#${slug}_decrement-button`;
                let increment_button_id = `#${slug}_increment-button`;
                $(increment_button_id).click(async() => {
                    swal_loading();
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue != 99) {
                        await addToCart_PHP(slug,1);
                        $(text_input_element_id).val(currentValue + 1);
                        swal_loading();
                    }
                });
                
                $(decrement_button_id).click(async () => {
                    swal_loading();
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue > 1) {
                        await removeFromCartSingle(slug);
                        $(text_input_element_id).val(currentValue - 1);
                    }
                    swal_loading();
                });
                $(text_input_element_id).on('change',async ()=>{
                    swal_loading();
                    let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                    let old_qty = getItemQty(in_slug);
                    let qty = $(text_input_element_id).val();
                    if(old_qty < qty)
                    {
                        await addToCart_PHP(slug, qty-old_qty);
                    }
                    else if(old_qty> qty)
                    {
                        await remove_from_cart(slug, old_qty - qty);
                    }
                    swal_loading();
                });
    
                let cart_button_id = '#' + slug + '_cart';
                let old_html_cart = $(cart_button_id).clone(true);
                
                $(cart_button_id).replaceWith(`
                    <button class = "p-2 bg-red-600 h-full w-auto flex items-center justify-center rounded-md cursor-pointer" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                        <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                    </button>`);
                
                $(cart_button_id).click(async ()=>{
                    debugger;
                    swal_loading();
                    await removeFromCartAll(slug);
                    $(cart_button_id).replaceWith(old_html_cart);
                    $(cart_button_id).click(async (e)=>{
                        debugger;
                        swal_loading();
                        let slug  = get_slug(e.currentTarget.id);
                        let info_btn_id = '#' + slug + '_info';
                        let old_qty = getItemQty(slug);
                        let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                        await addToCart_PHP(slug, qty-old_qty);
                        let old_html_info = $(info_btn_id).clone(true);
                        $(info_btn_id).replaceWith(`
                            <div class="relative flex items-center max-w-[10rem] h-full" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                                <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                                    <svg class="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                                    </svg>
                                </button>
                                <input type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-full text-center text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 qty-text-input" value="${qty}" min ="1" max = "999" required />
                                <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-full focus:ring-gray-100  focus:ring-2 focus:outline-none">
                                    <svg class="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                                    </svg>
                                </button>
                            </div>
                        `);
                        let text_input_element_id = `#${slug}_qty`;
                        let decrement_button_id = `#${slug}_decrement-button`;
                        let increment_button_id = `#${slug}_increment-button`;
                        $(increment_button_id).click(async() => {
                            swal_loading();
                            let currentValue = parseInt($(text_input_element_id).val(), 10);
                            if (!isNaN(currentValue) && currentValue != 99) {
                                await addToCart_PHP(slug,1);
                                $(text_input_element_id).val(currentValue + 1);
                                swal_loading();
                            }
                            else 
                                swal_loading();
                        });
                        
                        $(decrement_button_id).click(async () => {
                            swal_loading();
                            let currentValue = parseInt($(text_input_element_id).val(), 10);
                            if (!isNaN(currentValue) && currentValue > 1) {
                                debugger;
                                await removeFromCartSingle(slug);
                                $(text_input_element_id).val(currentValue - 1);
                                swal_loading();
                            }
                            else 
                                swal_loading();
                        });
                        $(text_input_element_id).on('change',async ()=>{
                            swal_loading();
                            let in_slug = get_slug(text_input_element_id.substring(1, text_input_element_id.length));
                            let old_qty = getItemQty(in_slug);
                            let qty = $(text_input_element_id).val();
                            if(old_qty < qty)
                            {
                                await addToCart_PHP(slug, qty-old_qty);
                            }
                            else if(old_qty> qty)
                            {
                                await remove_from_cart(slug, old_qty - qty);
                            }
                            else 
                                swal_loading();
                            swal_loading();
                        });
                        debugger;
                        let cart_button_id = '#' + slug + '_cart';
                        let old_html_cart = $(cart_button_id).clone(true);
                        
                        $(cart_button_id).replaceWith(`
                            <button class = "p-2 bg-red-600 h-full w-auto h-full flex items-center justify-center rounded-md cursor-pointer" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                                <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                </svg>
                            </button>`);
                        
                        $(cart_button_id).click(async ()=>{
                            swal_loading();
                            await removeFromCartAll(slug);
                            $(cart_button_id).replaceWith(old_html_cart);
                            $(info_btn_id).replaceWith(old_html_info);
                            swal_loading();
                            swal_removeFromCart();
                        });
                        swal_loading();
                        swal_addToCart();
                            
                    })
                    $(info_btn_id).replaceWith(old_html_info);
                    $(info_btn_id).click(()=>{
                        
                    })
                    swal_loading();
                    swal_removeFromCart();
                });
        } 
    }
    setEventHandlers();
}


async function update_table_data()
{
    table_data = [];
    let to_replace = `
        <div class = "rrstore-cart-table-entry-titles">
            <div class="rrstore-cart-table-entry-title">
                Product name
            </div>
            <div class="rrstore-cart-table-entry-price ">
                <p style="color: black;">Price</p>
            </div>
            <div class="rrstore-cart-table-entry-actions">
                Actions
            </div>
        </div>`;
    for(let [key, value] of user_cart)
    {        
        let prod_price = await getProductPrice_PHP(key);
        table_data.push([key, value, value * prod_price]);
        let info_btn_id = '#'+key+'_info';
        let qty =  getItemQty(key);
        let cartEntry = `
        <div class="rrstore-cart-table-entry">
            <div class="rrstore-cart-table-entry-title">
                ${get_title_from_slug(key)}
            </div>
            <div class="rrstore-cart-table-entry-price">
                ${value * prod_price}$
            </div>
            <div class="rrstore-cart-table-entry-actions" id = '${key}_actions'>
                <button class="rrstore-delete-button" id = '${key}_delete'>
                        <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                </button>
                <div class="relative flex items-center max-w-[8rem]" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                    <button type="button" id="${key}_decrement-button" data-input-counter-decrement="quantity-input" class="decrement-qty bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                        <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                        </svg>
                    </button>
                    <input type="text" id = '${key}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 qty-text-input" value="${qty}" min ="1" max = "999" required />
                    <button type="button" id="${key}_increment-button" data-input-counter-increment="quantity-input" class="increment-qty bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                        <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                        </svg>
                    </button>
                </div>
                </button>
            </div>
        </div>
        `;
        to_replace += cartEntry;
    }
    $('.rrstore-cart-table-container').html(to_replace);
}

function get_slug(id)
{
    return id.split('_')[0];
}
function get_title_from_slug(slug)
{
        let title = slug.replace(/-/g, ' ');
        title = title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return title;
}
function handleCartPageResponsiveness()
{
    let min_width_for_user_actions = $('.rrstore-cart-user-actions-container')[0].scrollWidth;
    let min_width_user_cart = 500
    debugger;
    function handleCartContainer(){
        let window_width = $(window).width();
        let sum_widths = min_width_for_user_actions + min_width_user_cart;
        $('.rrstore-cart-page-container').removeClass('vertical');
        $('.rrstore-cart-user-actions-container').removeClass('vertical');
        $('.rrstore-cart-table-container').removeClass('vertical');
        if(window_width <= sum_widths)
        {
            $('.rrstore-cart-page-container').addClass('vertical');
            $('.rrstore-cart-user-actions-container').addClass('vertical');
            $('.rrstore-cart-table-container').addClass('vertical');
        }
    }
    const debounce_handleCart = debounce(handleCartContainer,200);
    debounce_handleCart();
    $(window).resize(debounce_handleCart);
    var userActionsHeight = $('.rrstore-cart-user-actions-container').outerHeight();
    $('.rrstore-cart-table-container').css('height', userActionsHeight);
}
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
await update_page_UI();
handleCartPageResponsiveness();





function get_code_from_country(country)
{
    country = country.toLowerCase();
    let start = 0; end = countries.length-1;
    country = country.charAt(0).toUpperCase() + country.substring(1);
    let mid_point = -1;
    while(start <= end)
    {
        mid_point = Math.floor((start+end)/2);
        let temp_country = countries[mid_point].name;
        if(temp_country < country)
        {
            start = mid_point+1;
        }
        else if(temp_country > country)
            end = mid_point-1;
        else 
            return countries[mid_point].code;
    }
    return null;
}

function validate_email(email)
{
    var reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (reg.test(email) == false) 
    {
        return false;
    }
    return true;
}
function activate_checkout_button(){
    if(is_cart_empty())
        $('#main-checkout-button').addClass('disabled');
    else 
        $('#main-checkout-button').removeClass('disabled');
}
function is_cart_empty(){
    for(let [key,value] of user_cart)
    {
        if(value > 0)
            return false;
    }
    return true;
}
const countries = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazil" },
    { code: "BN", name: "Brunei" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "CV", name: "Cabo Verde" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo, Republic of the" },
    { code: "CD", name: "Congo, Democratic Republic of the" },
    { code: "CR", name: "Costa Rica" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "SZ", name: "Eswatini" },
    { code: "ET", name: "Ethiopia" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GR", name: "Greece" },
    { code: "GD", name: "Grenada" },
    { code: "GT", name: "Guatemala" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HN", name: "Honduras" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KI", name: "Kiribati" },
    { code: "KR", name: "Korea, South" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MH", name: "Marshall Islands" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "MX", name: "Mexico" },
    { code: "FM", name: "Micronesia" },
    { code: "MD", name: "Moldova" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "MK", name: "North Macedonia" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua New Guinea" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "QA", name: "Qatar" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" },
    { code: "RW", name: "Rwanda" },
    { code: "WS", name: "Samoa" },
    { code: "SM", name: "San Marino" },
    { code: "ST", name: "Sao Tome and Principe" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapore" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" },
    { code: "SZ", name: "Eswatini" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syria" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TH", name: "Thailand" },
    { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TV", name: "Tuvalu" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "YE", name: "Yemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" }
];
countries.forEach(country => {
    $('#country-select').append(new Option(country.name, country.code));
});
async function confirm_order(){
    debugger;
    let html_email = await create_html_for_email();
    await sendEmail(html_email, $('#user_email').text().split(':')[1]);
    await sendEmail(html_email, "Hello@ridersrights.me");
    swal_confirmOrder();
}
function createUserDetailsHtml() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const firstName = urlParams.get("first_name") || "N/A";
    const lastName = urlParams.get("last_name") || "N/A";
    const email = urlParams.get("email") || "N/A";
    const country = urlParams.get("country") || "N/A";
    const phoneNumber = urlParams.get("phone_number") || "N/A";
    const city = urlParams.get("city") || "N/A";
    const street = urlParams.get("street") || "N/A";
    const rawAddressLine = queryString.match(/address\+line=([^&]*)/);
    const addressLine = rawAddressLine ? decodeURIComponent(rawAddressLine[1].replace(/\+/g, ' ')) : "N/A";
    const userDetailsHtml = `
    <div style="display: grid; font-size: 1.25rem; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 66%;">
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p id="user_email"><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Street:</strong> ${street}</p>
        <p><strong>Address Line:</strong> ${addressLine}</p>
    </div>
    `;

    return userDetailsHtml;
}
async function create_html_for_email() {

    const userDetailsHtml = createUserDetailsHtml();
    let receiptItemsHtml = "";
    for (const [product, count] of user_cart) {
        const price = count * await getProductPrice_PHP(product);
        receiptItemsHtml += `
        <tr>
            <td style="padding: 8px; font-weight: bold;">${product}</td>
            <td style="padding: 8px; font-weight: bold; text-align: right;">$${price}</td>
        </tr>
        `;
    }
    let sub_total = 0;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const countryParam = params.get('country');
    let delivery_price = await getCountryDeliveryPrice(countryParam);
    for (let [key, value] of user_cart) {
        sub_total += await getProductPrice_PHP(key) * value;
    }
    const prices = `
    <tr>
        <td style="padding: 8px; font-weight: bold; text-align: right;">Subtotal:</td>
        <td style="padding: 8px; font-weight: bold; text-align: right;">$${sub_total}</td>
    </tr>
    <tr>
        <td style="padding: 8px; font-weight: bold; text-align: right;">Delivery:</td>
        <td style="padding: 8px; font-weight: bold; text-align: right;">${delivery_price ? "$" + delivery_price : "We do not deliver to this country."}</td>
    </tr>
    <tr>
        <td style="padding: 8px; font-weight: bold; text-align: right;">Payment fees:</td>
        <td style="padding: 8px; font-weight: bold; text-align: right;">${(payment_method === "") ? "Select a payment method" : "$" + calculateFees(Number(sub_total) + Number(delivery_price))}</td>
    </tr>
    <tr>
        <td style="padding: 8px; font-weight: bold; text-align: right;">Total:</td>
        <td style="padding: 8px; font-weight: bold; text-align: right;">${(delivery_price && payment_method) ? "$" + (Number(sub_total) + Number(delivery_price) + Number(calculateFees(Number(sub_total) + Number(delivery_price)))) : "NA"}</td>
    </tr>
    `;

    const receiptHtml = `
    <table style="width: 100%; max-width: 600px; border-collapse: collapse; border: 1px solid #000; font-family: Arial, sans-serif;">
        <thead>
            <tr>
                <th style="padding: 8px; border-bottom: 1px solid #000; text-align: left; font-size: 16px;">Item</th>
                <th style="padding: 8px; border-bottom: 1px solid #000; text-align: right; font-size: 16px;">Price</th>
            </tr>
        </thead>
        <tbody>
            ${receiptItemsHtml}
            ${prices}
        </tbody>
    </table>
    `;
    let payment_details = "";
    if (payment_method === 'omt') {
        payment_details = `<p style="font-weight: bold;">You selected OMT. Pay the above amount to Account name: Chadi Faraj through OMT.</p>`;
    } else if (payment_method === 'whish') {
        payment_details = `<p style="font-weight: bold;">You selected Whish. Pay the above amount to 03 142 379 through Whish.</p>`;
    }

    const fullHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333;">
        ${userDetailsHtml}
        <div style="margin: 20px 0;">
            ${receiptHtml}
        </div>
        <div style="margin-top: 20px;">
            ${payment_details}
        </div>
    </div>
    `;
    return fullHtml;
}

function getFee(amount, feeMap) {
    for (const [maxAmount, fee] of feeMap.entries()) {
        if (amount <= maxAmount) {
            return fee;
        }
    }
    return 0;
}

function calculateFees(amount) {
    let fee = 0;

    if (payment_method === "omt") {
        fee = getFee(amount, omtFees);
    } else if (payment_method === "whish") {
        fee = getFee(amount, whishFees);
    } else {
        console.log("Invalid payment method. Please choose 'omt' or 'whish'.");
    }
    return fee;
}
async function populate_reciept(){
    swal_loading();
    const defaultHTML = `
    <div class="w-full h-max p-2 flex justify-between">
    <p class="font-bold text-lg">Item</p>
    <p class="font-bold text-lg">Price</p>
    </div>
    <div class="w-full h-max py-2 px-2 flex justify-end items-end" id="reciept-cart-entry"></div>
    `;
    $('#reciept-cart').html(defaultHTML);
    let sub_total = 0;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const countryParam = params.get('country');
    let delivery_price = await getCountryDeliveryPrice(countryParam);
    for(let [key,value] of user_cart)
    {
        sub_total += await getProductPrice_PHP(key) * value;
    }
    for(let [key, value] of user_cart){
        const entry = `
            <div class="flex justify-between w-full py-2 border-b">
                <span>${key}</span>
                <span>$${await getProductPrice_PHP(key) * value}</span>
            </div>
        `;
        $('#reciept-cart').append(entry);
    }
    $('#reciept-cart').append(`
        <div class = "w-full flex flex-col justify-end items-end space-y-2 mt-4 text-lg font-bold">
            <p>Subtotal: $${sub_total}</p>
            <p>Delivery: $${(delivery_price)?delivery_price:"We do not deliver to this country."}</p>
            <p>Payment fees:${(payment_method === "")?" select a payment method":"$"+calculateFees(Number(sub_total) + Number(delivery_price))}<p>
            <p>Total: $${(delivery_price && payment_method)?Number(sub_total) + Number(delivery_price) + Number(calculateFees(Number(sub_total) + Number(delivery_price))):"NA"}</p>                    
        </div>
    `);
    if(delivery_price && payment_method){
        $('#confirm-order-button').removeClass('rrstore-disabled bg-gray-400');
        $('#confirm-order-button').addClass('bg-yellow-custom');
        $('#missing-input-checkout').text("");
    }
    else{
        $('#confirm-order-button').removeClass('bg-yellow-custom');
        $('#confirm-order-button').addClass('rrstore-disabled bg-gray-400');
        $('#missing-input-checkout').text("Select payment first");
    }
    swal_loading();
}
});
