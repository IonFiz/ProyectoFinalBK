import { ContenedorFirestore } from "../../managers/ContenedorFirebase.js";

class CartsDaoFirebase extends ContenedorFirestore {
    constructor() {
        super('carritos');
    }

    async addCart() {
        let timestamp = Date.now();
        let cart = { timestamp: timestamp, products: [] };
        this.save(cart);
        return cart
    }

    async getAllProducts(id) {
        try {
            let carts = await this.getAll();
            let product = null;

            if (carts.length > 0) {
                let element = await this.getById(`${id}`)

                if (element) {
                    product = element.data.products;
                    console.log(product);
                    return product
                } else {
                    console.log('No se encontraron productos');
                }
            } else {
                console.log('No se encontró el carrito');
            }

            return product
        } catch (error) {
            console.log(error);
        }

    }


    async addProductToCart(idCarrito, product) {
        try {
            let result = await this.collection.get()
            result = result.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
            let item = result.find(elem => elem.id == idCarrito)

            if (item) {
                let cart = item.data.products;

                cart.push(product);
                let carritoUpdated = await this.collection.doc(`${idCarrito}`).update({ products: cart })
                console.log(carritoUpdated);
                return await this.getById(idCarrito);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error)
        }

    }

    async deleteProduct(idCarrito, idProd) {
        let result = await this.collection.get()
        result = result.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))
        let item = result.find(elem => elem.id == idCarrito)

        if (item) {
            let product = item.data.products.find(prod => prod.id == idProd)
            if (product) {
                let productsUpdated = item.data.products.filter(elem => elem.id != idProd);
                let carritoUpdated = await this.collection.doc(`${idCarrito}`).update({ products: productsUpdated })
                return carritoUpdated
            } else {
                console.log('No se encontro el producto');
            }
        } else {
            console.log('No hay productos');
        }


    }
}

export { CartsDaoFirebase }