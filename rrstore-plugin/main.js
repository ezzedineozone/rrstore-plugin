var baseUrl = wpData.baseUrl;
var cartUrl = baseUrl + "/" + "cart/";
var productsUrl = baseUrl + "/" +"products/";
var aboutusUrl = baseUrl + "/" + "about-us/";

function onCartButtonClicked(){
    window.location.href = cartUrl;
};
document.addEventListener('DOMContentLoaded', function() {
    document.body.className = 'ignore-css body-class-products';
    const images = document.querySelectorAll('img[id$="_img"]');
    
    images.forEach(function(img) {
        img.src = 'https://localhost/wordpress/wp-content/plugins/rrstore%20plugin/rrstore-plugin/images/sample-product.png'; // Replace with the desired new image source URL
    });
});

