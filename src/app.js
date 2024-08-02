import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
const PORT = 8080;

mongoose.connect('mongodb+srv://chano:chano@cluster.rarbbce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB', error);
});

const hbs = handlebars.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const io = new Server(httpServer);
app.set('io', io); // Añade Socket.IO al objeto app para que pueda ser accedido en las rutas

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
