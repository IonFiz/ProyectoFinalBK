import { ContenedorMongoDb } from "../../managers/ContenedorMongoDb.js";
import { cartModel } from "../../models/carts.js";

class CartsDaoMongo extends ContenedorMongoDb {
    constructor() {
        super(cartModel)
    }

    async getContent() {
        try {
            let data = await this.model.find({});
            return data
        } catch (error) {
            console.log(error)
        }

    }

    async getAllProducts(id) {
        try {
            let carts = await this.getContent();
            let product = null;
            if (carts.length > 0) {
                let element = await this.model.findOne({ _id: id });
                if (element) {
                    product = element.products;
                    return product
                } else {
                    console.log('No se encontraron productos');
                }
            } else {
                console.log('No se encontró el carrito');
            }

            return product
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(idCarrito, producto) {
        try {
            let item = await this.model.findOne(
                { _id: idCarrito },
                { products: 1 }
            );
            console.log(item.products);
            if (item) {
                let carrito = item.products;
                carrito.push(producto);
                //console.log(carrito);
                let dataUpdated = await this.model.updateOne(
                    { _id: idCarrito },
                    { $set: { products: carrito } }
                );
                console.log(dataUpdated);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error)
        }

    }

    async deleteProduct(idCarrito, idProd) {
        let item = await this.model.findOne({ _id: idCarrito });
        if (item) {
            let product = item.products.find(prod => prod._id == idProd)
            console.log(product);
            if (product) {
                let productsUpdated = item.products.filter(elem => elem._id != idProd);
                let dataUpdated = await this.model.updateOne(
                    { _id: idCarrito },
                    { $set: { products: productsUpdated } }
                );
                console.log(dataUpdated);
                return dataUpdated;
            } else {
                console.log('No se encontro el producto');
            }
        } else {
            console.log('No hay productos');
        }


    }
}

export { CartsDaoMongo }