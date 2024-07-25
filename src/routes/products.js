import express from 'express'; // Importa el módulo Express para crear el enrutador
import { readProducts, writeProducts } from '../utils.js'; // Importa funciones para leer y escribir productos

const router = express.Router(); // Crea una instancia de un enrutador Express

// Función para obtener todos los productos
const getProducts = () => readProducts();

// Exporta el enrutador con el soporte para WebSockets
export default (io) => {
    // Ruta para obtener todos los productos
    router.get('/', (req, res) => {
        try {
            const products = getProducts(); // Obtiene todos los productos
            res.json(products); // Envía los productos como respuesta JSON
        } catch (error) {
            console.error('Error reading products:', error); // Muestra error en consola
            res.status(500).send('Internal Server Error'); // Envía un error 500 si ocurre un problema
        }
    });

    // Ruta para obtener un producto por ID
    router.get('/:id', (req, res) => {
        const productId = parseInt(req.params.id, 10); // Obtiene el ID del producto de los parámetros de la URL
        if (isNaN(productId)) {
            return res.status(400).send('Invalid product ID'); // Envía un error 400 si el ID es inválido
        }

        try {
            const products = getProducts(); // Obtiene todos los productos
            const product = products.find(p => p.id === productId); // Busca el producto por ID
            if (!product) {
                return res.status(404).send('Product not found'); // Envía un error 404 si el producto no se encuentra
            }
            res.json(product); // Envía el producto como respuesta JSON
        } catch (error) {
            console.error('Error reading product:', error); // Muestra error en consola
            res.status(500).send('Internal Server Error'); // Envía un error 500 si ocurre un problema
        }
    });

    // Ruta para agregar un nuevo producto
    router.post('/', (req, res) => {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        // Validación de datos del producto
        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof code !== 'string' ||
            typeof price !== 'number' || price < 0 ||
            typeof stock !== 'number' || stock < 0 ||
            typeof category !== 'string' ||
            (thumbnails !== undefined && !Array.isArray(thumbnails))
        ) {
            return res.status(400).send('Invalid data format for product fields'); // Envía un error 400 si los datos son inválidos
        }

        const newStatus = typeof status === 'boolean' ? status : true; // Asigna un valor predeterminado para el estado

        const newProduct = {
            id: getProducts().length ? getProducts()[getProducts().length - 1].id + 1 : 1, // Asigna un ID único al nuevo producto
            title,
            description,
            code,
            price,
            status: newStatus,
            stock,
            category,
            thumbnails: thumbnails || [] // Asigna una lista vacía si no se proporcionan miniaturas
        };

        try {
            const products = getProducts(); // Obtiene todos los productos
            products.push(newProduct); // Añade el nuevo producto a la lista
            writeProducts(products); // Guarda los productos actualizados en el archivo
            io.emit('updateProducts', products); // Notifica a todos los clientes sobre el nuevo producto
            res.status(201).json(newProduct); // Envía el nuevo producto como respuesta JSON con estado 201
        } catch (error) {
            console.error('Error writing products:', error); // Muestra error en consola
            res.status(500).send('Internal Server Error'); // Envía un error 500 si ocurre un problema
        }
    });

    // Ruta para actualizar un producto existente
    router.put('/:id', (req, res) => {
        const productId = parseInt(req.params.id, 10); // Obtiene el ID del producto de los parámetros de la URL
        if (isNaN(productId)) {
            return res.status(400).send('Invalid product ID'); // Envía un error 400 si el ID es inválido
        }

        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        // Validación de datos del producto
        if (
            (title && typeof title !== 'string') ||
            (description && typeof description !== 'string') ||
            (code && typeof code !== 'string') ||
            (price !== undefined && (typeof price !== 'number' || price < 0)) ||
            (stock !== undefined && (typeof stock !== 'number' || stock < 0)) ||
            (category && typeof category !== 'string') ||
            (thumbnails !== undefined && !Array.isArray(thumbnails))
        ) {
            return res.status(400).send('Invalid data format for product fields'); // Envía un error 400 si los datos son inválidos
        }

        try {
            const products = getProducts(); // Obtiene todos los productos
            const index = products.findIndex(p => p.id === productId); // Encuentra el índice del producto a actualizar
            if (index === -1) {
                return res.status(404).send('Product not found'); // Envía un error 404 si el producto no se encuentra
            }

            // Crea el producto actualizado con los nuevos datos
            const updatedProduct = {
                ...products[index],
                title: title || products[index].title,
                description: description || products[index].description,
                code: code || products[index].code,
                price: price !== undefined ? price : products[index].price,
                status: status !== undefined ? status : products[index].status,
                stock: stock !== undefined ? stock : products[index].stock,
                category: category || products[index].category,
                thumbnails: thumbnails !== undefined ? thumbnails : products[index].thumbnails
            };

            products[index] = updatedProduct; // Reemplaza el producto antiguo por el actualizado
            writeProducts(products); // Guarda los productos actualizados en el archivo
            io.emit('updateProducts', products); // Notifica a todos los clientes sobre el producto actualizado
            res.json(updatedProduct); // Envía el producto actualizado como respuesta JSON
        } catch (error) {
            console.error('Error updating product:', error); // Muestra error en consola
            res.status(500).send('Internal Server Error'); // Envía un error 500 si ocurre un problema
        }
    });

    // Ruta para eliminar un producto
    router.delete('/:id', (req, res) => {
        const productId = parseInt(req.params.id, 10); // Obtiene el ID del producto de los parámetros de la URL
        if (isNaN(productId)) {
            return res.status(400).send('Invalid product ID'); // Envía un error 400 si el ID es inválido
        }

        try {
            const products = getProducts(); // Obtiene todos los productos
            const newProducts = products.filter(p => p.id !== productId); // Filtra el producto a eliminar
            if (products.length === newProducts.length) {
                return res.status(404).send('Product not found'); // Envía un error 404 si el producto no se encuentra
            }

            writeProducts(newProducts); // Guarda los productos actualizados en el archivo
            io.emit('updateProducts', newProducts); // Notifica a todos los clientes sobre el producto eliminado
            res.status(204).send(); // Envía un estado 204 (sin contenido) indicando que el producto fue eliminado exitosamente
        } catch (error) {
            console.error('Error deleting product:', error); // Muestra error en consola
            res.status(500).send('Internal Server Error'); // Envía un error 500 si ocurre un problema
        }
    });

    return router; // Retorna el enrutador configurado
};
