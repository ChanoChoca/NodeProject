const express = require('express');

const app = express();

//Now the server will be able to receive jsons at the time of the request
app.use(express.json());
//Allows you to send information also from the URL
app.use(express.urlencoded({ extended: true }));

const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
