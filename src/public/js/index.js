document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Conecta con el servidor de Socket.IO

    const productForm = document.getElementById('productForm'); // Obtiene el formulario de productos
    const productTable = document.getElementById('productTable'); // Obtiene la tabla de productos

    // Actualiza la tabla cuando el servidor envíe una actualización de productos
    socket.on('updateProducts', (products) => {
        productTable.innerHTML = ''; // Limpia la tabla antes de actualizar

        // Crear encabezado de la tabla
        const thead = document.createElement('thead');
        thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Category</th>
            <th>Thumbnails</th>
        </tr>
    `;
        productTable.appendChild(thead);

        const tbody = document.createElement('tbody');
        products.forEach(product => {
            const row = tbody.insertRow(); // Crea una nueva fila para cada producto
            row.insertCell(0).textContent = product.id; // ID del producto
            row.insertCell(1).textContent = product.title; // Título del producto
            row.insertCell(2).textContent = product.description; // Descripción del producto
            row.insertCell(3).textContent = product.price; // Precio del producto
            row.insertCell(4).textContent = product.stock; // Stock del producto
            row.insertCell(5).textContent = product.status ? 'Active' : 'Inactive'; // Estado del producto
            row.insertCell(6).textContent = product.category; // Categoría del producto

            // Agrega miniaturas del producto
            const thumbnailsCell = row.insertCell(7);
            product.thumbnails.forEach(thumbnail => {
                const img = document.createElement('img');
                img.src = thumbnail;
                img.alt = 'thumbnail';
                img.style.maxWidth = '100px'; // Estilo para la miniatura
                img.style.maxHeight = '100px'; // Estilo para la miniatura
                thumbnailsCell.appendChild(img); // Agrega la imagen a la celda
            });
        });
        productTable.appendChild(tbody); // Agrega el cuerpo de la tabla a la tabla
    });

    // Maneja el envío del formulario para agregar un producto
    productForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        // Obtiene los datos del formulario y crea un objeto de producto
        const formData = new FormData(productForm);
        const product = {
            title: formData.get('title'),
            description: formData.get('description'),
            code: formData.get('code'),
            price: parseFloat(formData.get('price')),
            status: formData.get('status') === 'true',
            stock: parseInt(formData.get('stock'), 10),
            category: formData.get('category'),
            thumbnails: formData.get('thumbnails').split(',').map(url => url.trim()) // Convierte la cadena de miniaturas a un array de URLs
        };

        socket.emit('addProduct', product); // Envía el nuevo producto al servidor
        productForm.reset(); // Resetea el formulario
    });

    // Maneja la eliminación de productos al hacer clic en el botón de eliminar
    productTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteButton')) {
            const productId = parseInt(event.target.dataset.productId, 10); // Obtiene el ID del producto desde el atributo de datos
            socket.emit('deleteProduct', productId); // Envía el ID del producto para eliminarlo
        }
    });
});
