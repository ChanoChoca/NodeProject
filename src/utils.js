// Esta función convierte una URL de tipo file: a una ruta de archivo del sistema de archivos.
// Se utiliza para obtener la ruta del archivo actual en entornos de módulos ES.
import {fileURLToPath} from 'url'
// Esta función devuelve el directorio del nombre de archivo especificado.
// Es útil para construir rutas absolutas en el sistema de archivos.
import {dirname} from 'path'
// 'import.meta.url' proporciona la URL del módulo actual, y 'fileURLToPath' convierte esta URL en una ruta de archivo del sistema.
// '__filename' contiene la ruta absoluta al archivo actual.
const __filename = fileURLToPath(import.meta.url)
// 'dirname' toma la ruta del archivo ('__filename') y devuelve el directorio que contiene el archivo.
// '__dirname' contiene la ruta absoluta al directorio del archivo actual.
const __dirname = dirname(__filename)

const products = [];

// Esta función agrega un producto al array 'products'. El producto es un objeto que se añade al final de la lista.
export function addProduct(product) {
    products.push(product);
}

// Esta función elimina un producto del array 'products' basado en su nombre.
// Utiliza 'findIndex' para encontrar el índice del producto en la lista y 'splice' para eliminarlo si se encuentra (es decir, si 'index' no es '-1').
export function deleteProduct(name) {
    const index = products.findIndex(p => p.name === name);
    if (index !== -1) {
        products.splice(index, 1);
    }
}

// Esta función devuelve el array 'products'. Permite obtener la lista actual de productos.
export function getProducts() {
    return products;
}

// '__dirname' se exporta como el valor por defecto del módulo, proporcionando la ruta del directorio en el que se encuentra el archivo actual.
// Esto es útil para construir rutas absolutas basadas en la ubicación del módulo.
export default __dirname
