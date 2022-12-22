import { ContenedorMongoDb } from "../../managers/ContenedorMongoDb.js";
import { productModel } from "../../models/products.js";

class ProductsDaoMongo extends ContenedorMongoDb {
    constructor() {
        super(productModel)
    }
}

export { ProductsDaoMongo }