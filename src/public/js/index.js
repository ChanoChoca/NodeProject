document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(searchForm);
            const queryString = new URLSearchParams(formData).toString();
            window.location.href = `/products?${queryString}`;
        });
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            fetch(`/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Producto agregado al carrito');
                    } else {
                        alert('Error al agregar el producto al carrito');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al agregar el producto al carrito');
                });
        });
    });
});
