var baseUrl = wpData.baseUrl;
var cartUrl = baseUrl + "/" + "cart/";
var productsUrl = baseUrl + "/" +"products/";
var aboutusUrl = baseUrl + "/" + "about-us/";
var mobile_modal_open = false;

function onCartButtonClicked(){
    window.location.href = cartUrl;
};
document.addEventListener('DOMContentLoaded', function() {
    document.body.className = 'ignore-css body-class-products';
    const images = document.querySelectorAll('img[id$="_img"]');
    
});

jQuery(document).ready(($)=>{
    function handleHeaderResponsiveness(){
        let min_width_to_display_nav = $('.navigation-container').outerWidth(true) +$('.logo-container').outerWidth(true) + 2*parseInt($('.header').css('padding-left'))+10;
        function mainHandleResponsiveness(){
            if($(window).width() < min_width_to_display_nav)
            {
                $('.navigation-container').hide();
                $('#mobile-navigation-button-container').addClass('flex');
                $('#mobile-navigation-button-container').removeClass('hidden');
            }
            else
            {
                $('#mobile-navigation-button-container').removeClass('flex');
                $('#mobile-navigation-button-container').addClass('hidden');
                $('.navigation-container').show();
            }
        }
        $(window).resize(function() 
        {
            mainHandleResponsiveness();
        });
        mainHandleResponsiveness();
    }
    function setMainEventHandlers(){
        $('.mobile-navigation-button').click(()=>{
            if(mobile_modal_open == false)
            {
                $('#mobile-navigation-modal').show();
                mobile_modal_open = true;
            }
            else 
            {
                $('#mobile-navigation-modal').hide();
                mobile_modal_open = false;
            }
        });
        // Handle dropdown toggle for menu items with children
        $('.menu-item-has-children > a').click(function(e) {
            e.preventDefault(); // Prevent default link behavior

            const parentLi = $(this).parent();
            
            // Toggle the 'menu-item-active' class on click
            if (parentLi.hasClass('menu-item-active')) {
                parentLi.removeClass('menu-item-active');
                parentLi.find('.sub-menu').slideUp(); // Hide the sub-menu
            } else {
                parentLi.addClass('menu-item-active');
                parentLi.find('.sub-menu').slideDown(); // Show the sub-menu
            }
        });
    }
    handleHeaderResponsiveness();
    setMainEventHandlers();
});