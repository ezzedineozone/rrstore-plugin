var user_cart = new Map();
var table;
var table_data;
let page_vertical = false;
//NOTE FOR FUTURE SELF: every function postfixd by _PHP makes a call to the php client to get or modify information about
//the cart from the session cookie
console.log('cart-js loaded');
jQuery(document).ready(function($){ 
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
                update_page_UI();
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

async function getItemQty_PHP(slug) // CURRENTLY BROKEN, FIX LATER
{
    try{
        let response = await $.ajax({
            url: ajax_object.ajax_url,
            type: 'GET',
            dataType: 'json',
            data: {action: 'get_item_qty_cart',
                slug: slug
            }
        })
        if(response.success)
        {
            return response.data;
        }
        else 
        {
            console.error('Error:', response.data);
            return null;
        }
    }
    catch(error)
    {
        console.error(error);
    }

}

async function getProductPrice_PHP(slug) {
    try {
        const response = await $.ajax({
            url: ajax_object.ajax_url,  // Define the URL for the AJAX request
            type: 'GET',
            dataType: 'json',
            data: {
                action: 'get_product_price',
                slug: slug
            }
        });

        if (response.success) {
            console.log("Product price is: " + response.data);
            return response.data;  // Return the data for further use
        } else {
            console.error("Error fetching product price: ", response.data);
            return null;
        }
    } catch (error) {
        console.error("AJAX Error: ", error);
        return null;
    }
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
async function updateUserCart()
{
    await getCart_PHP();
    await update_page_UI();
}


function setEventHandlers()
{
    console.log("running");
    if($('.rrstore-products-container').length > 0)
        {
            $('.rrstore-product-card-actions-details').on('click', (e)=>{
                showProductInfo(e);
              });
            $('.rrstore-product-card-actions-cart').click(async (e) => {
                let slug  = get_slug(e.currentTarget.id);
                let info_btn_id = '#' + slug + '_info';
                let old_qty = getItemQty(slug);
                let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                await addToCart_PHP(slug, qty-old_qty);
                let old_html_info = $(info_btn_id).clone(true);
                $(info_btn_id).replaceWith(`
                    <div class="relative flex items-center max-w-[8rem]" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                        <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                            <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 qty-text-input" value="${qty}" required />
                        <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
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
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue != 99) {
                        await addToCart_PHP(slug,1);
                        $(text_input_element_id).val(currentValue + 1);
                    }
                });
                
                $(decrement_button_id).click(async () => {
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue > 1) {
                        await removeFromCartSingle(slug);
                        $(text_input_element_id).val(currentValue - 1);
                    }
                });
                $(text_input_element_id).on('change',async ()=>{
                    if(old_qty < qty)
                    {
                        await addToCart_PHP(slug, qty-old_qty);
                    }
                    else if(old_qty> qty)
                    {
                        for(let i = 0 ; i < old_qty - qty; i++)
                        {
                            await removeFromCartSingle(slug);
                        }
                    }
                });
                let cart_button_id = '#' + slug + '_cart';
                let old_html_cart = $(cart_button_id).clone(true);
                $(cart_button_id).replaceWith(`
                    <button class = "rrstore-delete-button" id = \'${cart_button_id.substring(1,cart_button_id.length)}\'>
                        <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                    </button>`);
                $(cart_button_id).click(async ()=>{
                    await removeFromCartAll(slug);
                    $(cart_button_id).replaceWith(old_html_cart);
                    $(info_btn_id).replaceWith(old_html_info);
                });
                }
            );
        }
        else if(window.location.href === cartUrl)
        {
        }
        else if($('.rrstore-product-container'))
        {
            $('.rrstore-product-page-actions-cart').on('click', async (e)=>{
                let slug  = get_slug(e.currentTarget.id);
                let info_btn_id = '#' + slug + '_info';
                let old_qty = getItemQty(slug);
                let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                await addToCart_PHP(slug, qty-old_qty);
                let old_html_info = $(info_btn_id).clone(true);
                $(info_btn_id).replaceWith(`
                    <div class="relative flex items-center max-w-[8rem]" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                        <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
                            <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 qty-text-input" value="${qty}" required />
                        <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
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
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue != 99) {
                        await addToCart_PHP(slug,1);
                        $(text_input_element_id).val(currentValue + 1);
                    }
                });
                
                $(decrement_button_id).click(async () => {
                    let currentValue = parseInt($(text_input_element_id).val(), 10);
                    if (!isNaN(currentValue) && currentValue > 1) {
                        await removeFromCartSingle(slug);
                        $(text_input_element_id).val(currentValue - 1);
                    }
                });
                $(text_input_element_id).on('change',async ()=>{
                    if(old_qty < qty)
                    {
                        await addToCart_PHP(slug, qty-old_qty);
                    }
                    else if(old_qty> qty)
                    {
                        for(let i = 0 ; i < old_qty - qty; i++)
                        {
                            await removeFromCartSingle(slug);
                        }
                    }
                });
                let cart_button_id = '#' + slug + '_cart';
                let old_html_cart = $(cart_button_id).clone(true);
                $(cart_button_id).replaceWith(`
                    <button class = "rrstore-delete-button" id = \'${cart_button_id.substring(1,cart_button_id.length)}\'>
                        <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                    </button>`);
                $(cart_button_id).click(async ()=>{
                    await removeFromCartAll(slug);
                    $(cart_button_id).replaceWith(old_html_cart);
                    $(info_btn_id).replaceWith(old_html_info);
                });
            });
        }
}
async function update_page_UI()
{
    await getCart_PHP();
    if(window.location.href === productsUrl)
    {
        for(let [key, value] of user_cart)
        {
            let slug  = key;
            let info_btn_id = '#' + slug + '_info';
            let old_html_info = $(info_btn_id).clone(true);
            $(info_btn_id).replaceWith(`
                <div class="relative flex items-center max-w-[8rem]" id = '${info_btn_id.substring(1, info_btn_id.length)}'>
                    <button type="button" id="${slug}_decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none">
                        <svg class="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                        </svg>
                    </button>
                    <input type="text" id = '${slug}_qty' data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5  qty-text-input" value="${value}" required />
                    <button type="button" id="${slug}_increment-button" data-input-counter-increment="quantity-input" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none">
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
                let currentValue = parseInt($(text_input_element_id).val(), 10);
                if (!isNaN(currentValue) && currentValue != 99) {
                    await addToCart_PHP(slug,1);
                    $(text_input_element_id).val(currentValue + 1);
                }
            });
            
            $(decrement_button_id).click(async () => {
                let currentValue = parseInt($(text_input_element_id).val(), 10);
                if (!isNaN(currentValue) && currentValue > 1) {
                    await removeFromCartSingle(slug);
                    $(text_input_element_id).val(currentValue - 1);
                }
            });
            $(text_input_element_id).on('change',async ()=>{
                if(old_qty < qty)
                {
                    await addToCart_PHP(slug, qty-old_qty);
                }
                else if(old_qty> qty)
                {
                    for(let i = 0 ; i < old_qty - qty; i++)
                    {
                        await removeFromCartSingle(slug);
                    }
                }
            });

            let cart_button_id = '#' + slug + '_cart';
            let old_html_cart = $(cart_button_id).clone(true);
            $(cart_button_id).replaceWith(`
                <button class = "rrstore-delete-button" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                    <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>
                </button>`);
            $(cart_button_id).click(async ()=>{
                debugger;
                await removeFromCartAll(slug);
                $(cart_button_id).replaceWith(old_html_cart);
                $(info_btn_id).replaceWith(old_html_info);
            });
        }
    }
    else if(window.location.href === cartUrl)
    {
        await getCart_PHP();
        update_table_data();
        let total_price = 0;
        for(let [key,value] of user_cart)
        {
            total_price += await getProductPrice_PHP(key) * value;
        }
        let price_str = "Subtotal: " + "<p class = \"text-blue-800\">$" + total_price+ "</p>";
        $('#total-price').html(price_str);
    }
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
                <button class ="rrstore-edit-button" id = '${key}_delete'>
                <svg class="w-6 h-6 text-white aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                </svg>
                </button>
            </div>
        </div>
        `;
        to_replace += cartEntry;
    }
    $('.rrstore-cart-table-container').html(to_replace);
    $('.rrstore-delete-button').click(async (e)=>{
        let slug = get_slug(e.currentTarget.id);
        await removeFromCartAll(slug);
    });
    $('.rrstore-edit-button').click((e)=>{
        let slug = get_slug(e.currentTarget.id);
        window.location.href = baseUrl + "/" + slug;
    });
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
    $('.rrstore-cart-user-actions-container').css('min-width',$('.rrstore-cart-user-actions-container').outerWidth(true));
    function handleCartContainer(){
        let min_width = 510;
        let user_actions_min_width = $('.rrstore-cart-user-actions-container').outerWidth(true);
        if((($('.rrstore-cart-page-container').width()-user_actions_min_width) < min_width) && page_vertical == false)
        {
            $('.rrstore-cart-page-container').addClass('vertical');
            $('.rrstore-cart-user-actions-container').addClass('vertical');
            $('.rrstore-cart-table-container').addClass('vertical');
            page_vertical = true;
        }
        else
        {
            $('.rrstore-cart-page-container').removeClass('vertical');
            $('.rrstore-cart-user-actions-container').removeClass('vertical');
            $('.rrstore-cart-table-container').removeClass('vertical');
            page_vertical = false;
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


update_page_UI();
handleCartPageResponsiveness();
setEventHandlers();
});
