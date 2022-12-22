import { options } from "../config/databaseConfig.js";



let ContenedorDaoProductos;
let ContenedorDaoCarts;

let databaseType = "firebase";

switch (databaseType) {
    case "filesystem":
        const { ProductsDAOArchivos } = await import("./products/productsArchivo.js");
        const { CartsDAOArchivos } = await import("./carts/cartsArchivos.js");
        ContenedorDaoProductos = new ProductsDAOArchivos(options.fileSystem.pathProducts);
        ContenedorDaoCarts = new CartsDAOArchivos(options.fileSystem.pathCarts);
        break;
    case "mongo":
        const { ProductsDaoMongo } = await import("./products/productsMongo.js");
        const { CartsDaoMongo } = await import("./carts/cartsMongo.js");
        ContenedorDaoProductos = new ProductsDaoMongo();
        ContenedorDaoCarts = new CartsDaoMongo();
        break;
    case "firebase":
        const { ProductsDaoFirebase } = await import("./products/productsFirebase.js");
        const { CartsDaoFirebase } = await import("./carts/cartsFirebase.js");
        ContenedorDaoProductos = new ProductsDaoFirebase();
        ContenedorDaoCarts = new CartsDaoFirebase();
        break;
}

export { ContenedorDaoProductos, ContenedorDaoCarts };