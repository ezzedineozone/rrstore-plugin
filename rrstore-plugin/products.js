//all post info related to a specific product has the following format: {slug}_{property}
//  for example, a given producti mage has "test-product-5"_img id
let selected_category_filter = "";
function showProductInfo(e)
{
    let slug =  get_slug(e.id);
    window.location.href = baseUrl + "/" + slug;
};
function get_slug(id)
{
    return id.split('_')[0];
};
function range() {
    return {
      minprice: 0,
      maxprice: 10000,
      min: 0,
      max: 10000,
      minthumb: 0,
      maxthumb: 0,
      mintrigger() {
        this.validation();
        this.minprice = Math.min(this.minprice, this.maxprice - 500);
        this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
      },
      maxtrigger() {
        this.validation();
        this.maxprice = Math.max(this.maxprice, this.minprice + 200);
        this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);
      },
      validation() {
        if (/^\d*$/.test(this.minprice)) {
          if (this.minprice > this.max) {
            this.minprice = 9500;
          }
          if (this.minprice < this.min) {
            this.minprice = this.min;
          }
        } else {
          this.minprice = 0;
        }
        if (/^\d*$/.test(this.maxprice)) {
          if (this.maxprice > this.max) {
            this.maxprice = this.max;
          }
          if (this.maxprice < this.min) {
            this.maxprice = 200;
          }
        } else {
          this.maxprice = 10000;
        }
      }
    }
  }
function handleCategoryClick(url){
    selected_category_filter = url;
    let category = getCategoryFromUrl(url);
    document.getElementById('dropdownDelayButton').innerHTML = category + `                <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>`;
    document.getElementById('dropdownDelay').classList.add('hidden');
    document.getElementById('category-slug-input').value = getSlugFromUrl(url);
}
function getCategoryFromUrl(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/category\/category-(\d+)\/$/);

    if (match) {
        const categoryNumber = match[1];
        return `Category ${categoryNumber}`;
    }

    return null;
}
function getSlugFromUrl(url)
{
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const segments = pathname.split('/');
    const slug = segments[segments.length - 2];

    return slug;
}
jQuery(document).ready(function($){
    let maxwidth = screen.width;
    function handleResponsiveness(){
        let min_width = 2*$('.product-card').first().outerWidth(true) + $('.categories-container').outerWidth(true) +2*parseInt($('.products-container').css('padding-left'));
        if($(window).width() <= min_width)
            $('.categories-container').hide();
        else
            $('.categories-container').show();

        if($(window).width() < min_width *1.333)
        {
            $('.products-container').addClass('justify-center');
        }
        else
            $('.products-container').removeClass('justify-center');
    }
    function handleMinWidths(){
        let cardWidth = $('.product-card').first().outerWidth(true);
        let minWidth = cardWidth * 2;
        
        $('.products-container').css('min-width', minWidth);
    }
    function setEventHandlersProductsPage()
    {
        $('#open-filter-menu-button').click((e)=>{
            $('.categories-container').toggleClass('show');
            let page_children = $('.products-page-container').children().each(function(){
                if(!$(this).hasClass('categories-container'))
                {
                    $(this).addClass('disabled');
                }
            });
            $('.products-page-container').addClass('bg-gray-300');
            $('.qty-text-input').addClass('bg-gray-300');
        });
        $('#close-filter-menu-button').click((e)=>{
            $('.categories-container').toggleClass('show');
            let page_children = $('.products-page-container').children().each(function(){
                if(!$(this).hasClass('categories-container'))
                {
                    $(this).removeClass('disabled');
                }
            });
            $('.products-page-container').removeClass('bg-gray-300')
            $('.qty-text-input').removeClass('bg-gray-300');
        });
        $('#filter-apply-button').click(()=>{
            if(selected_category_filter !== '')
            {
                window.location.href = selected_category_filter;
            }
        });
        $('#filter-reset-button').click(()=>
        {
            window.location.href = productsUrl;
        });
    }
    function maintainValidPriceRange(){
        $('#max-price-filter').attr('max', 10000);
        $('#max-price-filter').attr('min', $('#price-input-low').attr('min'));
        $('#min-price-filter').attr('max', $('price-input-high').attr('max'));
        $('#min-price-filter').attr('min',0);
    }
    $('#min-price-filter').on('input', ()=>{
        maintainValidPriceRange();
    });
    $('#max-price-filter').on('input', ()=>{
        maintainValidPriceRange();
    });
    $(window).resize(function() 
    {
        handleResponsiveness();
    });
    handleMinWidths();
    setEventHandlersProductsPage();
    maintainValidPriceRange();
});