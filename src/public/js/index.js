document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(searchForm);
            const queryParams = new URLSearchParams();

            for (const [key, value] of formData.entries()) {
                if (value) {
                    queryParams.append(key, value);
                }
            }

            const queryString = queryParams.toString();

            // Redirigir a la nueva URL
            window.location.href = `/products?${queryString}`;
        });
    }

    // Añadir event listeners a los botones de "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
});

function addToCart(productId) {
    fetch(`/api/carts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Product added to cart!');
            } else {
                alert('Error adding product to cart.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
