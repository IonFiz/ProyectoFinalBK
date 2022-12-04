const express = require('express');
const { options } = require("../config/databaseConfig");
const { ContenedorSQL } = require("../managers/ContenedorSql");

const router = express.Router();

const productosApi = new ContenedorSQL(options.mariaDB, "productos");

router.get('/', async (req, res) => {
    const productos = await productosApi.getAll();
    res.send(productos);
})

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await productosApi.getById(parseInt(productId));
    if (product) {
        return res.send(product)
    } else {
        return res.send({ error: 'producto no encontrado' })
    }
})

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const result = await productosApi.save(newProduct);
    res.send(result);
})

router.put('/:id', async (req, res) => {
    //No puedo hacer que el PUT tome los  parametros del body y haga el cambio
    const { title, price, thumbnail } = req.body;
    const productId = req.params.id;
    const result = await productosApi.updateById(parseInt(productId), title, price, thumbnail);
    //const result = await productosApi.updateById(parseInt(productId));
    res.json({ result });
})

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    const result = await productosApi.deleteById(parseInt(productId));
    res.send(result);
})


module.exports = { productsRouter: router };