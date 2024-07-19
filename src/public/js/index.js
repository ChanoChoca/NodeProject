// 'io()' establece una conexión con el servidor de Socket.IO, permitiendo la comunicación en tiempo real.
const socket = io();

// Se añade un evento que se activa cuando se envía el formulario con el ID 'product-form'.
// 'event.preventDefault()' evita que el formulario se envíe de la manera tradicional (recargando la página).
document.getElementById('product-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // 'event.target' se refiere al formulario que se envió, y FormData permite obtener los valores de los campos del formulario.
    const formData = new FormData(event.target);
    // Se obtienen los valores del formulario y se convierten al tipo adecuado ('parseFloat', 'parseInt', y booleano para 'discontinued').
    const product = {
        name: formData.get('name'),
        unitPrice: parseFloat(formData.get('unitPrice')),
        unitsInStock: parseInt(formData.get('unitsInStock'), 10),
        discontinued: formData.get('discontinued') === 'on'
    };
    // 'fetch' realiza una solicitud POST a '/add-product' con los datos del producto en formato 'application/x-www-form-urlencoded'.
    // Después de enviar la solicitud, se resetea el formulario para limpiar los campos.
    fetch('/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(product)
    }).then(() => {
        event.target.reset();
    })
})

// Se añade un evento que se activa cuando se envía el formulario con el ID 'delete-form'.
// 'event.preventDefault()' evita el comportamiento predeterminado de envío del formulario.
document.getElementById('delete-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // 'FormData' se usa para extraer el valor del campo name del formulario.
    const formData = new FormData(event.target);
    const name = formData.get('name');
    // 'fetch' realiza una solicitud POST a '/delete-product' con el nombre del producto en formato 'application/x-www-form-urlencoded'.
    // Después de enviar la solicitud, se resetea el formulario.
    fetch('/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name })
    }).then(() => {
        event.target.reset();
    });
});

// Cuando el servidor emite un evento 'productAdded', el cliente recibe los datos del producto y actualiza la lista de productos en tiempo real.
// Se crea un nuevo elemento '<tr>' y se añade <td> para visualizar los detalles del producto.
socket.on('productAdded', (product) => {
    const productTable = document.querySelector('table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.unitPrice}</td>
        <td>${product.unitsInStock}</td>
        <td>${product.discontinued}</td>
    `;
    productTable.appendChild(row);
});

// Cuando el servidor emite un evento 'productDeleted', el cliente recibe el nombre del producto eliminado y actualiza la lista de productos en tiempo real.
// Busca el producto en la fila de la tabla ('<tr>') y elimina el elemento correspondiente si encuentra una coincidencia.
socket.on('productDeleted', (productName) => {
    const productTable = document.querySelector('table tbody');
    const rows = productTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].textContent === productName) {
            productTable.removeChild(rows[i]);
            break;
        }
    }
});
