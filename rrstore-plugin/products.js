//all post info related to a specific product has the following format: {slug}_{property}
//  for example, a given producti mage has "test-product-5"_img id
let selected_category_filter = "";
function showProductInfo(e)
{
    debugger;
    let slug =  get_slug(e.currentTarget.id);
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
        this.minprice = Math.min(this.minprice, this.maxprice);
        this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
      },
      maxtrigger() {
        this.validation();
        this.maxprice = Math.max(this.maxprice, this.minprice);
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
      if($('.rrstore-product-card').length > 0)
      {
        debugger;
        var width = $(window).width();
        $('.rrstore-product-card').removeClass('four three two one');
        if (width >= 4 * 360) {
            $('.rrstore-product-card').addClass('four');
        } else if (width >= 3 * 360) {
            $('.rrstore-product-card').addClass('three');
        } else if (width >= 2 * 360) {
            $('.rrstore-product-card').addClass('two');
        } else {
            $('.rrstore-product-card').addClass('one');
        }
      }
      else if($('.rrstore-product-page-container').length > 0)
      {
        debugger;
        var width = $(window).width();
        $('.rrstore-product-page-container').removeClass('vertical');
        $('.rrstore-product-page-info-container').removeClass('vertical');
        $('.rrstore-product-page-image-container').removeClass('vertical');
        if(width <= 600)
        {
          $('.rrstore-product-page-container').addClass('vertical');
          $('.rrstore-product-page-info-container').addClass('vertical');
          $('.rrstore-product-page-image-container').addClass('vertical');
        }
        else 
        {
          $('.rrstore-product-page-container').removeClass('vertical');
          $('.rrstore-product-page-container').removeClass('vertical');
          $('.rrstore-product-page-info-container').removeClass('vertical');
          $('.rrstore-product-page-image-container').removeClass('vertical');
        }
      }
    }
    function handleMinWidths(){
        let cardWidth = $('.rrstore-product-card').first().outerWidth(true);
        let minWidth = cardWidth * 2;
      
    }
    function setEventHandlersProductsPage()
    {
        $('#open-filter-menu-button').click((e)=>{
            $('.rrstore-categories-container').toggleClass('show');
            let page_children = $('.rrstore-products-page-container').children().each(function(){
                if(!$(this).hasClass('rrstore-categories-container'))
                {
                    $(this).addClass('disabled');
                }
            });
            $('.rrstore-products-page-container').addClass('bg-gray-300');
            $('.rrstore-qty-text-input').addClass('bg-gray-300');
        });
        $('#close-filter-menu-button').click((e)=>{
            $('.rrstore-categories-container').toggleClass('show');
            let page_children = $('.rrstore-products-page-container').children().each(function(){
                if(!$(this).hasClass('rrstore-categories-container'))
                {
                    $(this).removeClass('disabled');
                }
            });
            $('.rrstore-products-page-container').removeClass('bg-gray-300')
            $('.rrstore-qty-text-input').removeClass('bg-gray-300');
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
        $('.rrstore-product-card-details').on('click',(e)=>{
          showProductInfo(e);
        });
    }
    function maintainValidPriceRange(){
        $('#max-price-filter').attr('max', 10000);
        $('#max-price-filter').attr('min', $('#price-input-low').val());
        $('#min-price-filter').attr('max', $('price-input-high').val());
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
    handleResponsiveness();
    setEventHandlersProductsPage();
    maintainValidPriceRange();
});