var user_cart = new Map();
var table;
var table_data;

//NOTE FOR FUTURE SELF: every function postfixd by _PHP makes a call to the php client to get or modify information about
//the cart from the session cookie

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
                update_table_data();
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
    return $.ajax({
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
                update_table_data();
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
                update_table_data();
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
    if(window.location.href === productsUrl)
        {
            $('.product-card-actions-cart').click((e) => {
                    let slug  = get_slug(e.currentTarget.id);
                    let info_btn_id = '#' + slug + '_info';
                    let old_qty = getItemQty(slug);
                    let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                    console.log('old quantity: ' + old_qty + '\n qty to add: ' + qty - old_qty);

                    addToCart_PHP(slug, qty-old_qty);
                    let old_html_info = $(info_btn_id).clone(true);
                    $(info_btn_id).replaceWith('<input type=\'number\' class = \'product-card-actions-number\' min = \'1\' max = \'99\' value = \''+ qty +'\' id = \'' + info_btn_id.substring(1,info_btn_id.length) + '\' />');
                    $(info_btn_id).on('change',async ()=>{
                        if(old_qty < qty)
                            await addToCart_PHP(slug, qty-old_qty);
                        else if(old_qty> qty)
                        {
                            for(let i = 0 ; i < old_qty - qty; i++)
                                await removeFromCartSingle(slug);
                        }
                    });

                    let cart_button_id = '#' + slug + '_cart';
                    let old_html_cart = $(cart_button_id).clone(true);
                    $(cart_button_id).replaceWith(`
                        <button class = "delete-button" id = \'${cart_button_id.substring(1,cart_button_id.length)}\'>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
            $('.delete-button').click((e)=>{
                let slug = get_slug(e.currentTarget.id);
                removeFromCartAll(slug);
                $(cart_button_id).replaceWith(old_html_cart);
                $(info_btn_id).replaceWith(old_html_info);
            });
        }
}
async function update_page_UI()
{
    setEventHandlers();
    if(window.location.href === productsUrl)
    {
        await getCart_PHP();
        for(let [key, value] of user_cart)
        {
            let slug  = key;
            let info_btn_id = '#' + slug + '_info';
            debugger;
            let old_html_info = $(info_btn_id).clone(true);
            $(info_btn_id).replaceWith(`<input class="product-card-actions-number" type="number" id="${info_btn_id.substring(1)}" max="99" value="${value}" />`);
            $(info_btn_id).on('change',async ()=>{
                let old_qty = await getItemQty(slug);
                let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                if(old_qty < qty)
                    await addToCart_PHP(slug, qty-old_qty);
                else if(old_qty> qty)
                {
                    for(let i = 0 ; i < old_qty - qty; i++)
                        await removeFromCartSingle(slug);
                }
            });

            let cart_button_id = '#' + slug + '_cart';
            let old_html_cart = $(cart_button_id).clone(true);
            $(cart_button_id).replaceWith(`
                <button class = "delete-button" id = "${cart_button_id.substring(1,cart_button_id.length)}">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
        debugger;
        update_table_data();
        if(!table)
        {
            table = $('#cart-table').DataTable({
                dom: 'rtip',
                ajax:function(data, callback, settings){
                    callback({
                        data: table_data
                    });
                },
                columns: [{title: 'Product Name'}, {title: 'Ammount'}, {title:'Price'} , {title: 'Actions',
                    render: function(data,type,row)
                    {
                        var slug = row[0];
                        var edit_btn_id = '\''+ slug +'_edit-button\'';
                        var delete_btn_id = '\''+ slug +'_delete-button\'';
                        return `<div class = 'cart-item-actions'>
                                    <button class = 'edit-button' id = ${edit_btn_id}>
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                                        <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <button class = 'delete-button' id = ${delete_btn_id}>
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                        </svg>
                                    </button>
                                </div>`
                    }
                }],
                searching: true
            });  
        }
    }
}


async function update_table_data()
{
    table_data = [];
    for(let [key, value] of user_cart)
    {
        debugger;
        let prod_price = await getProductPrice_PHP(key);
        table_data.push([key, value, value * prod_price]);
    }
    if(table)
        table.ajax.reload();
}
function get_slug(id)
{
    return id.split('_')[0];
}




update_page_UI();
$('#cart-table').on('draw.dt', function() {
    setEventHandlers();
});
});
