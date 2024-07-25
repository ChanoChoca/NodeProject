import express from 'express'; // Importa el módulo Express para crear el enrutador
import { readCarts, writeCarts } from '../utils.js'; // Importa funciones para leer y escribir carritos

const router = express.Router(); // Crea una instancia de un enrutador Express

// Función para obtener todos los carritos
const getCarts = () => readCarts();

export default (io) => {
    // Ruta para obtener todos los carritos
    router.get('/', (req, res) => {
        try {
            const carts = getCarts(); // Obtiene todos los carritos
            res.json(carts); // Devuelve los carritos como JSON
        } catch (error) {
            console.error('Error reading carts:', error);
            res.status(500).send('Internal Server Error'); // Maneja errores de servidor
        }
    });

    // Ruta para obtener un carrito por ID
    router.get('/:id', (req, res) => {
        const cartId = parseInt(req.params.id, 10); // Convierte el ID del carrito a número
        if (isNaN(cartId)) {
            return res.status(400).send('Invalid cart ID'); // Maneja IDs de carrito inválidos
        }

        try {
            const carts = getCarts(); // Obtiene todos los carritos
            const cart = carts.find(c => c.id === cartId); // Busca el carrito por ID
            if (!cart) {
                return res.status(404).send('Cart not found'); // Maneja carritos no encontrados
            }
            res.json(cart); // Devuelve el carrito encontrado como JSON
        } catch (error) {
            console.error('Error reading cart:', error);
            res.status(500).send('Internal Server Error'); // Maneja errores de servidor
        }
    });

    // Ruta para crear un nuevo carrito
    router.post('/', (req, res) => {
        const { products } = req.body; // Obtiene productos del cuerpo de la solicitud

        if (!Array.isArray(products)) {
            return res.status(400).send('Products must be an array'); // Maneja datos de productos inválidos
        }

        // Valida cada producto para asegurarse de que tenga un productId y una cantidad válida
        for (let i = 0; i < products.length; i++) {
            if (!products[i].hasOwnProperty('productId')) {
                return res.status(400).send(`Product at index ${i} does not have a productId`);
            }
            if (!products[i].hasOwnProperty('quantity')) {
                return res.status(400).send(`Product at index ${i} does not have a quantity`);
            }
            if (typeof products[i].quantity !== "number" || products[i].quantity <= 0) {
                return res.status(400).send('Invalid quantity for product');
            }
        }

        const carts = getCarts(); // Obtiene todos los carritos
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1, // Asigna un ID autoincremental
            products: products.map(p => ({ productId: p.productId, quantity: p.quantity })) // Crea un nuevo carrito con productos
        };

        try {
            carts.push(newCart); // Agrega el nuevo carrito a la lista
            writeCarts(carts); // Guarda los cambios en el archivo
            io.emit('updateCarts', carts); // Notifica a todos los clientes sobre el nuevo carrito
            res.status(201).json(newCart); // Devuelve el nuevo carrito como JSON
        } catch (error) {
            console.error('Error writing carts:', error);
            res.status(500).send('Internal Server Error'); // Maneja errores de servidor
        }
    });

    // Ruta para agregar un producto a un carrito existente
    router.post('/:id/product/:pid', (req, res) => {
        const cartId = parseInt(req.params.id, 10); // Convierte el ID del carrito a número
        const productId = parseInt(req.params.pid, 10); // Convierte el ID del producto a número

        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).send('Invalid cart or product ID'); // Maneja IDs inválidos
        }

        try {
            const carts = getCarts(); // Obtiene todos los carritos
            const cart = carts.find(c => c.id === cartId); // Busca el carrito por ID

            if (cart) {
                const product = cart.products.find(p => p.productId === productId); // Busca el producto en el carrito

                if (product) {
                    product.quantity += 1; // Incrementa la cantidad del producto
                } else {
                    cart.products.push({ productId: productId, quantity: 1 }); // Agrega el producto con cantidad inicial de 1
                }

                writeCarts(carts); // Guarda los cambios en el archivo
                io.emit('updateCarts', carts); // Notifica a todos los clientes sobre la actualización del carrito
                res.status(201).json(cart); // Devuelve el carrito actualizado como JSON
            } else {
                res.status(404).send('Cart not found'); // Maneja carritos no encontrados
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).send('Internal Server Error'); // Maneja errores de servidor
        }
    });

    return router; // Exporta el enrutador configurado
};
