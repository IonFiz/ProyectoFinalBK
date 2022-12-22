import { ContenedorArchivo } from "../../managers/ContenedorArchivo.js";

class CartsDAOArchivos extends ContenedorArchivo {
    constructor(filepath) {
        super(filepath);
    }
}

export { CartsDAOArchivos };