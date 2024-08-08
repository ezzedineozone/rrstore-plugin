//all post info related to a specific product has the following format: {slug}_{property}
//  for example, a given producti mage has "test-product-5"_img id
function showProductInfo(e)
{
    let slug =  get_slug(e.id);
    window.location.href = baseUrl + "/" + slug;
};
function get_slug(id)
{
    return id.split('_')[0];
};