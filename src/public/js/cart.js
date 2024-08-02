document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#add-product').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartId = event.target.getAttribute('data-cart-id');
            const productId = event.target.getAttribute('data-product-id');
            await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.reload();
        });
    });

    document.querySelectorAll('#delete-product').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartId = event.target.getAttribute('data-cart-id');
            const productId = event.target.getAttribute('data-product-id');
            await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.reload();
        });
    });
});
