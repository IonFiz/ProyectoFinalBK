import express from "express";
import { ContenedorDaoCarts, ContenedorDaoProductos } from "../daos/index.js";


const productosApi = ContenedorDaoProductos;
const carritosApi = ContenedorDaoCarts;

//router carritos
const cartsRouter = express.Router();

cartsRouter.get('/', async (req, res) => {
    const response = await carritosApi.getAll();
    res.json(response);

})

cartsRouter.post('/', async (req, res) => {
    const response = await carritosApi.save({ products: [], timestamp: new Date().toLocaleDateString() });
    res.json(response);
})

cartsRouter.delete('/:id', async (req, res) => {
    const cartId = req.params.id;
    res.json(await carritosApi.deleteById(cartId));
})

cartsRouter.get('/:id/productos', async (req, res) => {
    const cartId = req.params.id;
    const carritoResponse = await carritosApi.getById(cartId);
 

    //Mongo - Firebase
    let cart = await carritosApi.getAllProducts(req.params.id);
    res.json({ result: 'Productos en el carrito', products: cart });
})

cartsRouter.post('/:id/productos', async (req, res) => {
    // const cartId = req.params.id;
    const productId = req.body.id;


   
    //Mongo - Firebase
    const cartId = req.params.id;


    if (cartId && productId) {
        let cart = await carritosApi.addProductToCart(cartId, productId);
        res.json({ result: 'Producto agregado al carrito', cart: cart });
    } else {
        res.json({ result: 'No se pudo agregar el producto' })
    }
})

cartsRouter.delete('/:id/productos/:idProd', async (req, res) => {
    const cartId = req.params.id;
    const productId = req.params.idProd;
  

    //Mongo - Firebase
    if (cartId) {
        let cart = carritosApi.deleteProduct(cartId, productId)
        res.json({ result: 'Producto eliminado', carrito: cart })
    } else {
        res.json({ result: 'No se pudo eliminar el producto' })
    }
})

export { cartsRouter }