// views.router.js
import express from 'express';
import Product from '../models/product.js';
import Cart from "../models/Cart.js";

const router = express.Router();

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

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const limitNumber = parseInt(limit, 10) || 10;
        const pageNumber = parseInt(page, 10) || 1;

        // Configurar opciones de ordenamiento
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        // Configurar opciones de consulta
        const queryOption = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        // Obtener productos según la consulta con paginación
        const options = {
            page: pageNumber,
            limit: limitNumber,
            sort: sortOption
        };

        const result = await Product.paginate(queryOption, options);

        res.render('index', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limitNumber}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limitNumber}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

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
