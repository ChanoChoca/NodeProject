import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const queryOption = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        const products = await Product.find(queryOption)
            .sort(sortOption)
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        const totalProducts = await Product.countDocuments(queryOption);
        const totalPages = Math.ceil(totalProducts / limitNumber);
        const hasPrevPage = pageNumber > 1;
        const hasNextPage = pageNumber < totalPages;

        res.render('index', {
            products,
            totalPages,
            prevPage: hasPrevPage ? pageNumber - 1 : null,
            nextPage: hasNextPage ? pageNumber + 1 : null,
            page: pageNumber,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/products?limit=${limit}&page=${pageNumber - 1}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/products?limit=${limit}&page=${pageNumber + 1}&sort=${sort}&query=${query}` : null,
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
