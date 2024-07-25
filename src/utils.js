import fs from 'fs'; // Importa el módulo para operaciones con el sistema de archivos
import path from 'path'; // Importa el módulo para manipulación de rutas
import { fileURLToPath } from 'url'; // Importa el módulo para convertir URLs en rutas de archivos

// Obtener la ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url); // Obtiene el nombre del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

// Ruta al archivo JSON de productos
const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Función para leer los productos desde el archivo JSON
export function readProducts() {
    if (fs.existsSync(productsFilePath)) { // Verifica si el archivo de productos existe
        return JSON.parse(fs.readFileSync(productsFilePath, 'utf8')); // Lee y parsea el contenido del archivo
    }
    return []; // Retorna un array vacío si el archivo no existe
}

// Función para guardar productos en el archivo JSON
export function writeProducts(products) {
    if (!products) { // Verifica que los productos no sean undefined
        throw new Error('Cannot write undefined products'); // Lanza un error si es undefined
    }
    const data = JSON.stringify(products, null, 2); // Convierte los productos a formato JSON
    if (data === undefined) { // Verifica que los datos no sean undefined
        throw new Error('Cannot stringify products'); // Lanza un error si es undefined
    }
    fs.writeFileSync(productsFilePath, data, 'utf8'); // Escribe los datos en el archivo
}

// Ruta al archivo JSON de carritos
const cartsFilePath = path.join(__dirname, 'data', 'carts.json');

// Función para leer los carritos desde el archivo JSON
export function readCarts() {
    if (fs.existsSync(cartsFilePath)) { // Verifica si el archivo de carritos existe
        return JSON.parse(fs.readFileSync(cartsFilePath, 'utf8')); // Lee y parsea el contenido del archivo
    }
    return []; // Retorna un array vacío si el archivo no existe
}

// Función para guardar carritos en el archivo JSON
export function writeCarts(carts) {
    if (!carts) { // Verifica que los carritos no sean undefined
        throw new Error('Cannot write undefined products'); // Lanza un error si es undefined
    }
    const data = JSON.stringify(carts, null, 2); // Convierte los carritos a formato JSON
    if (data === undefined) { // Verifica que los datos no sean undefined
        throw new Error('Cannot stringify products'); // Lanza un error si es undefined
    }
    fs.writeFileSync(cartsFilePath, data, 'utf8'); // Escribe los datos en el archivo
}

// Exporta el directorio actual para su uso en otros módulos
export default __dirname;
