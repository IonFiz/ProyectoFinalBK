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

