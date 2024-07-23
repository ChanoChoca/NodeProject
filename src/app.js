// Este módulo es un framework para Node.js que simplifica la creación y manejo de servidores HTTP.
import express from 'express'

// Este módulo proporciona una forma de usar Handlebars como motor de plantillas con Express.
import handlebars from 'express-handlebars'
// '__dirname' es una variable que contiene el directorio actual del archivo.
// Se utiliza para construir rutas absolutas en el sistema de archivos.
import __dirname from './utils.js'
// 'viewsRouter' es un enrutador Express que maneja las solicitudes HTTP relacionadas con las vistas (rutas) de la aplicación.
import viewsRouter from './routes/views.router.js'
// Este módulo se utiliza para configurar y manejar conexiones WebSocket en el servidor.
import { Server } from 'socket.io'

// 'app' es el objeto principal que manejará las solicitudes HTTP y configurará los middleware y rutas.
const app = express()
// El servidor escuchará en el puerto 8080
const PORT = 8080

// 'express.static' sirve archivos estáticos (como JavaScript, CSS y imágenes) desde el directorio src/public.
app.use(express.static('src/public'))

app.use(express.json())
// 'express.urlencoded' permite que el servidor analice datos de formularios HTML (en formato URL-encoded).
app.use(express.urlencoded({ extended: true }))

// 'app.engine' define que los archivos '.handlebars' se procesen con 'express-handlebars'.
// 'defaultLayout: null' indica que no se utilizará una plantilla de diseño por defecto.
app.engine('handlebars', handlebars.engine())
// Define el directorio donde Express buscará los archivos de plantillas ('handlebars').
// '__dirname + '/views'' construye la ruta absoluta al directorio 'views'.
app.set('views', __dirname + '/views')
// Esto permite que Express use Handlebars para procesar y renderizar vistas.
app.set('view engine', 'handlebars')

// 'app.listen' hace que la aplicación escuche en el puerto especificado ('PORT').
// Cuando el servidor está en funcionamiento, se ejecuta la función de callback que imprime un mensaje en la consola.
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
// Esto establece una conexión WebSocket en el servidor HTTP. io manejará las conexiones WebSocket y emitirá eventos.
const io = new Server(httpServer)

// 'app.use' aplica el enrutador 'viewsRouter' a todas las solicitudes que comienzan con /.
// El enrutador se inicializa con la instancia de Socket.IO ('io') para permitir la comunicación en tiempo real.
app.use('/', viewsRouter(io))

// 'io.on('connection')' es un evento que se activa cuando un cliente se conecta al servidor WebSocket.
// Dentro de este manejador, se imprime un mensaje en la consola al conectar y desconectar clientes.
io.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})
