import express from 'express'
// 'body': Es una función del paquete 'express-validator' que se utiliza para definir validaciones en los campos del cuerpo de las solicitudes HTTP.
// 'validationResult': Es una función que se utiliza para recolectar y manejar los resultados de las validaciones realizadas por los validadores.
import { body, validationResult } from 'express-validator';
// Estas funciones ('addProduct', 'deleteProduct', y 'getProducts') se utilizan para manejar la lógica de productos, como agregar, eliminar y obtener productos.
import { addProduct, deleteProduct, getProducts } from '../utils.js'

// 'router' es una instancia de 'Router' que se utiliza para definir rutas específicas para este enrutador, en lugar de definirlas directamente en la aplicación principal.
const router = express.Router()

// Esta función toma una instancia de Socket.IO ('io') como argumento y devuelve el enrutador configurado para manejar las rutas relacionadas con las vistas y la lógica de productos.
export default function viewsRouter(io) {
    // Renderiza la vista 'home' y pasa los productos obtenidos de la función 'getProducts' como datos a la plantilla.
    // Esto muestra la lista de productos en la vista 'home.handlebars'.
    router.get('/', (req, res) => {
        res.render('home', { products: getProducts() })
    })

    // Renderiza la vista 'realTimeProducts' y pasa los productos obtenidos de 'getProducts' como datos a la plantilla.
    // Esto muestra la lista de productos en la vista 'realTimeProducts.handlebars'.
    router.get('/realtimeproducts', (req, res) => {
        res.render('realTimeProducts', { products: getProducts() })
    })

    // Extrae los datos del cuerpo de la solicitud ('req.body'), crea un nuevo objeto de producto, agrega el producto usando 'addProduct',
    // emite un evento WebSocket ('productAdded') para actualizar a los clientes conectados, y redirige al cliente a la vista de productos en tiempo real ('/realtimeproducts').
    router.post(
        '/add-product',
        [
            body('name').isString().withMessage('Name must be a string'),
            body('unitPrice').isFloat().withMessage('Unit Price must be a number'),
            body('unitsInStock').isInt().withMessage('Units In Stock must be an integer'),
            body('discontinued').isBoolean().withMessage('Discontinued must be a boolean')
        ],
        (req, res) => {

            // validationResult toma el objeto de solicitud (req) como argumento y devuelve un objeto que contiene los errores de validación encontrados en los datos de la solicitud
            const errors = validationResult(req);
            // errors.isEmpty(): Verifica si el objeto errors contiene algún error de validación. Devuelve true si no hay errores y false si hay errores.
            if (!errors.isEmpty()) {
                // .json({ errors: errors.array() }): Envía una respuesta en formato JSON que incluye los errores de validación.
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, unitPrice, unitsInStock, discontinued } = req.body;
            const newProduct = {
                name,
                unitPrice: parseFloat(unitPrice),
                unitsInStock: parseInt(unitsInStock, 10),
                discontinued: discontinued === true
            };
            addProduct(newProduct);
            io.emit('productAdded', newProduct);
            res.redirect('/realtimeproducts');
        }
    );

    // Extrae el nombre del producto del cuerpo de la solicitud, elimina el producto usando 'deleteProduct',
    // emite un evento WebSocket ('productDeleted') para actualizar a los clientes conectados, y redirige al cliente a la vista de productos en tiempo real ('/realtimeproducts').
    router.post(
        '/delete-product',
        [
            body('name').isString().withMessage('Name must be a string')
        ],
        (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name } = req.body;
            deleteProduct(name);
            io.emit('productDeleted', name);
            res.redirect('/realtimeproducts');
        }
    );

    // La función 'viewsRouter' devuelve el enrutador ('router') que ahora maneja las rutas definidas y está configurado para trabajar con la instancia de Socket.IO proporcionada.
    return router
}
