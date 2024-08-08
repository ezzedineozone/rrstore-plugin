var user_cart = new Map();

//NOTE FOR FUTURE SELF: every function postfixd by _PHP makes a call to the php client to get information about
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
    return $.ajax({
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
                console.log('Item added to cart:', response.data);
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
                console.log('succesfully removed all ' + slug);
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
async function update_page_UI()
{
    if(window.location.href === productsUrl)
    {
        await getCart_PHP();
        for(let [key, value] of user_cart)
        {
            let info_btn_id = '#' + key + '_info';
            $(info_btn_id).replaceWith('<input type=\'number\' id = \'' + info_btn_id.substring(1,info_btn_id.length) +  '\' class = \'product-card-actions-number\' min = \'1\' max = \'99\' value = \'' + value +  '\' />');
        }
    }
    else if(window.location.href === cartUrl)
    {
        await getCart_PHP();
        for(let [key, value] of user_cart)
        {
            //js library for inserting values into table
        }
    }
}
function setEventHandlers()
{
    if(window.location.href === productsUrl)
        {
            $('.product-card-actions-cart').click(
                (e) => {
                    debugger;
                    let slug  = get_slug(e.currentTarget.id);
                    let info_btn_id = '#' + slug + '_info';
                    let old_qty = getItemQty(slug);
                    let qty = $(info_btn_id).is('input')?$(info_btn_id).val():1;
                    console.log('old quantity: ' + old_qty + '\n qty to add: ' + qty - old_qty);
                    addToCart_PHP(slug, qty-old_qty);
                    updateUserCart();
                    $(info_btn_id).replaceWith('<input type=\'number\' class = \'product-card-actions-number\' min = \'1\' max = \'99\' value = \''+ qty +'\' id = \'' + info_btn_id.substring(1,info_btn_id.length) + '\' />');
                }
            );
        }
        else if(window.location.href === cartUrl)
        {

            getCart_PHP();
            $('#cart_clear').click(
                (e) => {
        
                    clearCart_PHP();
                    updateUserCart();
                }
            );
        }
}
async function updateUserCart()
{
    await getCart_PHP();
    update_page_UI();
}





update_page_UI();
setEventHandlers();




$('#cart-table').DataTable();
});
