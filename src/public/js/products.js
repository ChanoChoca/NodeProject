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
