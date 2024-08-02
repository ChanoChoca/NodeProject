import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

export default (io) => {
    router.get('/', async (req, res) => {
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

            // Emitir actualización de productos
            io.emit('updateProducts', result.docs);

            // Enviar la respuesta
            res.json({
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?limit=${limitNumber}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/api/products?limit=${limitNumber}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const product = await Product.findById(req.params.pid);
            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails } = req.body;
            if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
                return res.status(400).json({ status: 'error', message: 'Invalid input data' });
            }

            const newProduct = new Product({ title, description, code, price, stock, category, thumbnails });
            await newProduct.save();

            // Emitir actualización de productos
            io.emit('updateProducts', await Product.find());

            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails } = req.body;
            if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
                return res.status(400).json({ status: 'error', message: 'Invalid input data' });
            }

            const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true, runValidators: true });

            // Emitir actualización de productos
            io.emit('updateProducts', await Product.find());

            res.json(updatedProduct);
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.pid);

            // Emitir actualización de productos
            io.emit('updateProducts', await Product.find());

            res.status(204).end();
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    return router;
};
