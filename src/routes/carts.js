const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

let carts = [];
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Helper to read and write data to file
const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    carts = JSON.parse(data);
};

const writeCarts = () => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Load carts from file on server start
readCarts();

// id (auto increment), products (array)
// products = [productId, quantity]
// POST create new cart
router.post('/', (req, res) => {
    const { products } = req.body;

    // Check that products (array) is an array
    if (!Array.isArray(products)) {
        return res.status(400).send('Products must be an array');
    }

    // Validate each product to ensure it has a valid productId
    for (let i = 0; i < products.length; i++) {
        if (!products[i].hasOwnProperty('productId')) { //hasOwnProperty returns a boolean indicating whether the object has the specified property.
            return res.status(400).send(`Product at index ${i} does not have a productId`);
        }
        if (!products[i].hasOwnProperty('quantity')) {
            return res.status(400).send(`Product at index ${i} does not have a quantity`);
        }
        if (typeof products[i].quantity !== "number" || products[i].quantity <= 0) {
            return res.status(400).send('Invalid number& for product fields');
        }
    }

    const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: products.map(p => ({ productId: p.productId, quantity: p.quantity }))
    };

    carts.push(newCart);
    writeCarts();
    res.status(201).json(newCart);
});


// GET cart by ID
router.get('/:cid', (req, res) => {
    const cid = parseInt(req.params.cid, 10); //decimal system (base 10)
    const cart = carts.find(c => c.id === cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

// id (auto increment), products (array)
// products = [productId, quantity]
// POST add product to cart
router.post('/:cid/product/:pid', (req, res) => {
    const cid = parseInt(req.params.cid, 10);
    const cart = carts.find(c => c.id === cid);

    if (cart) {
        const pid = parseInt(req.params.pid, 10);
        const product = cart.products.find(p => p.productId === pid);

        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ productId: pid, quantity: 1 });
        }

        writeCarts();
        res.status(201).json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

module.exports = router;
