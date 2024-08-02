import { Router } from 'express';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ products: [] });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        const product = await Product.findById(req.params.pid);

        if (!cart || !product) {
            return res.status(404).send('Cart or Product not found');
        }

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        req.app.get('io').emit('updateCarts', await Cart.find().populate('products.product')); // Emitir evento de actualización
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;
