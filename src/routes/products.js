import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

export default (io) => {
    router.get('/', async (req, res) => {
        try {
            // Extraer los parámetros de consulta y asignar valores predeterminados
            const { limit = 10, page = 1, sort, query } = req.query;
            const limitNumber = parseInt(limit, 10) || 10; // Default to 10 if not a number
            const pageNumber = parseInt(page, 10) || 1; // Default to 1 if not a number

            // Manejar opciones de ordenamiento
            const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

            // Manejar opciones de búsqueda
            let queryOption = {};
            if (query) {
                // Interpretar `query` como categoría o disponibilidad
                queryOption = { $or: [{ category: query }, { status: query === 'true' }] };
            }

            // Calcular el valor de `skip` asegurando que sea >= 0
            const skip = Math.max((pageNumber - 1) * limitNumber, 0);

            // Obtener los productos de la base de datos
            const products = await Product.find(queryOption)
                .sort(sortOption)
                .limit(limitNumber)
                .skip(skip);

            // Contar el número total de productos que coinciden con la búsqueda
            const totalProducts = await Product.countDocuments(queryOption);
            const totalPages = Math.ceil(totalProducts / limitNumber);
            const hasPrevPage = pageNumber > 1;
            const hasNextPage = pageNumber < totalPages;

            // Construir los enlaces de paginación
            const prevLink = hasPrevPage ? `/api/products?limit=${limitNumber}&page=${pageNumber - 1}&sort=${sort || ''}&query=${query || ''}` : null;
            const nextLink = hasNextPage ? `/api/products?limit=${limitNumber}&page=${pageNumber + 1}&sort=${sort || ''}&query=${query || ''}` : null;

            // Enviar la respuesta
            res.json({
                status: 'success',
                payload: products,
                totalPages,
                prevPage: hasPrevPage ? pageNumber - 1 : null,
                nextPage: hasNextPage ? pageNumber + 1 : null,
                page: pageNumber,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
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
            io.emit('updateProducts', await Product.find());
            res.json(updatedProduct);
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.pid);
            io.emit('updateProducts', await Product.find());
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    return router;
};
