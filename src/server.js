const express = require('express');
const { Router } = require('express');
const Contenedor = require('./managers/Contenedor');
const ContenedorCarrito = require('./managers/ContenedorCarrito');

let container = new Contenedor('productos.txt');
let cartContainer = new ContenedorCarrito('carrito.txt');

const app = express();

const PORT = 8080;

app.listen(PORT, () => { console.log(`Server Port ${PORT}`); })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routerProducts = Router();

const routerCart = Router();

const isAdmin = true;



//Productos

routerProducts.get('/', async (req, res) => {
    const products = await container.getAll();

    res.json({
        products
    })
})

routerProducts.get('/:id', async (req, res) => {

    const id = parseInt(req.params.id);

    const item = await container.getById(id);

    if (isNaN(id)) {
        res.json({
            error: "El parametro ingresado no es un numero"
        })
    } else {
        item == undefined ? res.json({ error: "El id esta fuera de rango" }) : res.json({ item });
    }
})

routerProducts.post('/', async (req, res) => {

    if (isAdmin) {
        let product = req.body;
        await container.save(product)

        res.json({
            product
        })
    } else {
        res.json({
            error: "Usted no tiene los permisos para ejecutar esta accion"
        })
    }

})

routerProducts.put('/:id', async (req, res) => {

    if (isAdmin) {
        let { name, description, image, price, stock } = req.body;

        const id = parseInt(req.params.id);
        //console.log(id);
        let item = await container.getById(id);
        item["name"] = name;
        item["description"] = description;
        item["image"] = image;
        item["price"] = price;
        item["stock"] = stock;

        //Spread
        const newItem = {
            "name": name,
            "description": description,
            "image": image,
            "price": price,
            "stock": stock,
            ...item
        }

        await container.deleteById(item.id);
        await container.overwrite(newItem);

        if (isNaN(id)) {
            res.json({
                error: "El parametro ingresado no es un numero"
            })
        } else {
            item == undefined ? res.json({ error: "El id esta fuera de rango" }) : res.json({ newItem });
        }


    } else {
        res.json({
            error: "Usted no tiene los permisos para ejecutar esta accion"
        })
    }
})

routerProducts.delete('/:id', async (req, res) => {

    if (isAdmin) {
        const id = parseInt(req.params.id);
        const item = await container.deleteById(id);

        if (isNaN(id)) {
            res.json({
                error: "El parametro ingresado no es un numero"
            })
        } else {
            item == undefined && res.json({ msg: "El producto fue borrado exitosamente" });
        }
    } else {
        res.json({
            error: "Usted no tiene los permisos para ejecutar esta accion"
        })
    }


})

///////////////////////////////////////////////////////////////////////

//Carrito

routerCart.post('/', async (req, res) => {

    let cart = req.body;

    const products = await container.getAll();

    const newCart = {
        products,
        ...cart
    }

    await cartContainer.save(newCart);

    res.json({
        newCart
    })
})

routerCart.delete('/:id', async (req, res) => {

    if (isAdmin) {
        const id = parseInt(req.params.id);
        const item = await cartContainer.deleteById(id);

        if (isNaN(id)) {
            res.json({
                error: "El parametro ingresado no es un numero"
            })
        } else {
            item == undefined && res.json({ msg: "El producto fue borrado exitosamente" });
        }
    } else {
        res.json({
            error: "Usted no tiene los permisos para ejecutar esta accion"
        })
    }

})

routerCart.get('/:id/productos', async (req, res) => {


    const id = parseInt(req.params.id);

    const cart = await cartContainer.getById(id);

    let { products } = cart;

    res.json({
        products
    })
})

routerCart.post('/:id/productos', async (req, res) => {


    const id = parseInt(req.params.id);
    let product = req.body;

    const cart = await cartContainer.getById(id);
    let { products } = cart;

    if (products.length > 0) {
        const lastId = products[products.length - 1].id + 1;
        product.id = lastId;
        product.timestamp = Date.now();
        products.push(product);
    } else {
        product.id = 1;
        product.timestamp = Date.now();
        products.push(product);
    }

    const newCart = {
        products,
        ...cart
    }
    await cartContainer.deleteById(id);
    await cartContainer.save(newCart);

    res.json({
        products
    })
})

routerCart.delete('/:id/productos/:id_prod', async (req, res) => {

    const id = parseInt(req.params.id);
    const idProd = parseInt(req.params.id_prod);

    const cart = await cartContainer.getById(id);

    let { products } = cart;

    const newProducts = products.splice(products.findIndex(function (i) {
        return i.idProd === idProd;
    }), 1);

    const newCart = {
        products: newProducts,
        ...cart
    }

    await cartContainer.deleteById(id);
    await cartContainer.save(newCart);

    res.json({
        products
    })
})


app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);

const express = require('express');
const { productsRouter, products } = require('./routes/products');
const handlebars = require('express-handlebars');
const { Server } = require("socket.io");
const { options } = require("./config/databaseConfig");
// const Contenedor = require("./managers/contenedorProductos");
// const ContenedorChat = require('./managers/contenedorChat');
const { ContenedorSQL } = require("./managers/contenedorSQL");

//service
// const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorSQL(options.mariaDB, "productos");
// const chatApi = new ContenedorChat("chat.txt");
const chatApi = new ContenedorSQL(options.sqliteDB, "chat");

//server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// routes
//view routes
app.get('/', async (req, res) => {
    res.render('home')
})

app.get('/productos', async (req, res) => {
    res.render('products', { products: await productosApi.getAll() })
})

//api routes
app.use('/api/products', productsRouter);


//express server
const server = app.listen(8080, () => {
    console.log('listening on port 8080')
})


//websocket server
const io = new Server(server);

//configuracion websocket
io.on("connection", async (socket) => {
    //PRODUCTOS
    //envio de los productos al socket que se conecta.
    io.sockets.emit("products", await productosApi.getAll())

    //recibimos el producto nuevo del cliente y lo guardamos con filesystem
    socket.on("newProduct", async (data) => {
        await productosApi.save(data);
        //despues de guardar un nuevo producto, enviamos el listado de productos actualizado a todos los sockets conectados
        io.sockets.emit("products", await productosApi.getAll())
    })

    //CHAT
    //Envio de todos los mensajes al socket que se conecta.
    io.sockets.emit("messages", await chatApi.getAll());

    //recibimos el mensaje del usuario y lo guardamos en el archivo chat.txt
    socket.on("newMessage", async (newMsg) => {
        await chatApi.save(newMsg);
        io.sockets.emit("messages", await chatApi.getAll());
    })
});