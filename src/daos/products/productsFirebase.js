import { ContenedorFirestore } from "../../managers/ContenedorFirebase.js";

class ProductsDaoFirebase extends ContenedorFirestore {
    constructor() {
        super('productos')
    }
}

export { ProductsDaoFirebase }