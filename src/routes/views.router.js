import express from 'express'; // Importa el módulo Express para crear el enrutador
import { readProducts } from '../utils.js'; // Importa la función para leer productos

const router = express.Router(); // Crea una instancia de un enrutador Express

// Función para obtener todos los productos
const getProducts = () => readProducts();

// Ruta para la vista principal (home)
router.get('/', (req, res) => {
    const products = getProducts(); // Obtiene todos los productos
    res.render('home', { products }); // Renderiza la vista 'home' con los productos
});

// Ruta para la vista de productos en tiempo real (realTimeProducts)
router.get('/realtimeproducts', (req, res) => {
    const products = getProducts(); // Obtiene todos los productos
    res.render('realTimeProducts', { products }); // Renderiza la vista 'realTimeProducts' con los productos
});

export default router; // Exporta el enrutador configurado
