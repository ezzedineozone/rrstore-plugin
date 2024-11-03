function swal_addToCart(){
    Swal.fire({
        icon: "success",
        title: "Added to cart",
        showConfirmButton: false,
        timer: 1500,
        iconColor: '#2563EB',
        customClass: {
            popup: 'swal-add-to-cart',
            icon: 'swal-add-to-cart-icon',
            title: 'swal-add-to-cart-title'
        },
      });
}
function swal_removeFromCart(){
    Swal.fire({
        icon: "warning",
        title: "Removed from cart",
        showConfirmButton: false,
        timer: 1500,
        iconColor: '#d33',
        customClass: {
            popup: 'swal-add-to-cart',
            icon: 'swal-add-to-cart-icon',
            title: 'swal-add-to-cart-title'
        },
      });
}
let swalLoadingVisible = false;
function swal_loading(custom_msg =  'loading...') {
    if (!swalLoadingVisible) {
        Swal.fire({
            html: `<div class="loader"></div><p>${custom_msg}</p>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            background: 'transparent',
            customClass: {
                popup: 'swal-loading-modal',
            },
            willOpen: () => {
                const loader = document.querySelector('.loader');
                loader.classList.add('loading-animation');
            }
        });

        swalLoadingVisible = true;
    } else {
        Swal.close();
        swalLoadingVisible = false;
    }
}
function swal_confirmOrder() {
    Swal.fire({
        title: 'Order Received',
        text: 'A receipt has been sent to your email. Make sure to pay through the instructions on this page or your email.',
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing by clicking outside
        backdrop: true,
        position: 'center',
        showCloseButton: true,
        customClass: {
            popup: 'swal-popup', // Custom class for styling if needed
        }
    });
}
