import express from 'express'; // Importa el módulo Express para crear el servidor
import handlebars from 'express-handlebars'; // Importa el motor de plantillas Handlebars
import { Server } from 'socket.io'; // Importa Socket.IO para manejo de WebSockets
import productsRouter from './routes/products.js'; // Importa el enrutador para productos
import cartsRouter from './routes/carts.js'; // Importa el enrutador para carritos
import viewsRouter from './routes/views.router.js'; // Importa el enrutador para vistas
import __dirname, { readProducts, writeProducts, readCarts, writeCarts } from './utils.js'; // Importa utilidades y datos

const app = express(); // Crea una instancia de Express
const PORT = 8080; // Define el puerto en el que se ejecutará el servidor

const products = readProducts(); // Lee los productos desde el archivo
const carts = readCarts(); // Lee los carritos desde el archivo

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine()); // Configura Handlebars como motor de plantillas
app.set('view engine', 'handlebars'); // Establece Handlebars como motor de vistas
app.set('views', __dirname + '/views'); // Define el directorio de vistas

// Middleware para servir archivos estáticos
app.use(express.static('src/public')); // Sirve archivos estáticos desde el directorio 'src/public'
app.use(express.json()); // Middleware para parsear cuerpos de solicitud en formato JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitud con codificación URL

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Inicia el servidor HTTP y muestra un mensaje en consola
const io = new Server(httpServer); // Crea una instancia de Socket.IO vinculada al servidor HTTP

// Rutas API
app.use('/api/products', productsRouter(io)); // Configura las rutas para la API de productos
app.use('/api/carts', cartsRouter(io)); // Configura las rutas para la API de carritos

// Rutas de vistas
app.use('/', viewsRouter); // Configura las rutas para las vistas

// Manejo de eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected'); // Muestra mensaje cuando un nuevo cliente se conecta

    // Envía los productos actuales al nuevo cliente
    socket.emit('updateProducts', products);

    // Maneja el evento para agregar un nuevo producto
    socket.on('addProduct', (product) => {
        product.id = products.length ? products[products.length - 1].id + 1 : 1; // Asigna un ID único al nuevo producto
        products.push(product); // Añade el producto a la lista
        writeProducts(products); // Guarda los productos actualizados en el archivo
        io.emit('updateProducts', products); // Notifica a todos los clientes sobre el nuevo producto
    });

    // Maneja el evento para eliminar un producto
    socket.on('deleteProduct', (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId); // Filtra el producto eliminado
        writeProducts(updatedProducts); // Guarda los productos actualizados en el archivo
        io.emit('updateProducts', updatedProducts); // Notifica a todos los clientes sobre el producto eliminado
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected'); // Muestra mensaje cuando un cliente se desconecta
    });
});
