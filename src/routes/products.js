const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

let products = [];
const productsFilePath = path.join(__dirname, '../data/products.json');

// Helper to read and write data to file
const readProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    products = JSON.parse(data);
};

const writeProducts = () => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Load products from file on server start
readProducts();

// GET all products with optional limit
router.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// GET product by ID
router.get('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid, 10); //decimal system (base 10)
    const product = products.find(p => p.id === pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// id (auto increment), title (string), description (string), code (string), price (number), status (boolean, optional, default true), stock (number), category (string), thumbnails (array, optional)
// POST add new product
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    // Checking required fields and data types
    if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof code !== 'string' ||
        typeof price !== 'number' ||
        typeof stock !== 'number' ||
        typeof category !== 'string' ||
        !Array.isArray(thumbnails)
    ) {
        return res.status(400).send('Invalid data format for product fields');
    }

    // If status is not of type boolean, true is assigned by default
    const newStatus = typeof status === 'boolean' ? status : true;

    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        title,
        description,
        code,
        price,
        status: newStatus,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    writeProducts();
    res.status(201).json(newProduct);
});

// PUT update product by ID
router.put('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid, 10); // Convert to base 10 integer
    const product = products.find(p => p.id === pid);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    // Validate and apply updates only to allowed properties of the correct type
    const allowedUpdates = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    const updates = req.body;

    // Check and filter invalid updates by data type
    const isValidOperation = Object.keys(updates).every(key => {
        if (!allowedUpdates.includes(key)) {
            return false; // Do not allow updates for disallowed keys
        }
        if (key === 'title' || key === 'description' || key === 'code' || key === 'category') {
            return typeof updates[key] === 'string'; // Verify that the type is string for these fields
        }
        if (key === 'price' || key === 'stock') {
            return typeof updates[key] === 'number'; // Verify that the type is number for these fields
        }
        if (key === 'status') {
            return typeof updates[key] === 'boolean'; // Verify that the type is boolean for status
        }
        if (key === 'thumbnails') {
            return Array.isArray(updates[key]); // Verify that it is an array for thumbnails
        }
        return true; // Allow other data types by default
    });

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!');
    }

    // Update allowed properties on the found product
    Object.assign(product, updates);

    writeProducts();
    res.json(product);
});

// DELETE product by ID
router.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid, 10); //decimal system (base 10)
    const index = products.findIndex(p => p.id === pid);
    if (index !== -1) {
        products.splice(index, 1);
        writeProducts();
        res.status(204).send('Product successfully removed');
    } else {
        res.status(404).send('Product not found');
    }
});

module.exports = router;
