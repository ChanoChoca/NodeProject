import path from 'path'; // Importa el módulo para manipulación de rutas
import { fileURLToPath } from 'url'; // Importa el módulo para convertir URLs en rutas de archivos

// Obtener la ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url); // Obtiene el nombre del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

// Exporta el directorio actual para su uso en otros módulos
export default __dirname;
