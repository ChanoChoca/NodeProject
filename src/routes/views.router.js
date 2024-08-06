import express from 'express';
import Product from '../models/product.js';
import Cart from "../models/Cart.js";

const router = express.Router();

/**
 *
 * Ruta para obtener un carrito específico por ID, incluyendo los productos relacionados.
 *
 * @route GET /carts/:cid
 * @param {string} cid - ID del carrito a obtener.
 * @returns {Object} - Renderiza la vista del carrito si se encuentra, o un mensaje de error si no se encuentra.
 * @throws {500} - Error interno del servidor.
 *
 */
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (cart) {
            res.render('cart', { cart });
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Ruta para obtener una lista de productos con paginación, ordenamiento y filtrado por categoría y disponibilidad.
 *
 * @route GET /products
 * @param {string} limit - Número máximo de productos a devolver por página (opcional, por defecto 10).
 * @param {string} page - Número de página a devolver (opcional, por defecto 1).
 * @param {string} sort - Ordenamiento por precio ('asc' o 'desc') (opcional).
 * @param {string} category - Categoría para filtrar productos (opcional).
 * @param {string} availability - Disponibilidad para filtrar productos ('true' o 'false') (opcional).
 * @returns {Object} - Renderiza la vista con la lista de productos y la información de paginación.
 * @throws {500} - Error interno del servidor.
 *
 */
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', category = '', availability = '' } = req.query;
        const limitNumber = parseInt(limit, 10) || 10;
        const pageNumber = parseInt(page, 10) || 1;

        // Configurar opciones de ordenamiento
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        // Configurar opciones de consulta
        const queryOption = {};
        if (category) {
            queryOption.category = { $regex: category.trim(), $options: 'i' };
        }
        if (availability) {
            queryOption.status = availability === 'true';
        }

        // Obtener productos según la consulta con paginación
        const options = {
            page: pageNumber,
            limit: limitNumber,
            sort: sortOption
        };

        const result = await Product.paginate(queryOption, options);

        // Renderizar la vista
        res.render('index', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limitNumber}&page=${result.prevPage}&sort=${sort}&category=${category}&availability=${availability}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limitNumber}&page=${result.nextPage}&sort=${sort}&category=${category}&availability=${availability}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Ruta para obtener un producto específico por ID.
 *
 * @route GET /products/:pid
 * @param {string} pid - ID del producto a obtener.
 * @returns {Object} - Renderiza la vista del producto si se encuentra, o un mensaje de error si no se encuentra.
 * @throws {500} - Error interno del servidor.
 *
 */
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product) {
            res.render('product', { product });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
