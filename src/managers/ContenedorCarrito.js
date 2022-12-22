const fs = require('fs');
const path = require('path');
const Contenedor = require('./Contenedor');

class ContenedorCarrito {

    constructor(filename) {
        this.filename = path.join(__dirname, "..", `files/${filename}`);
    }

    async save(product) {

        try {
            const products = await this.getAll();

            if (products.length > 0) {
                const lastId = products[products.length - 1].id + 1;
                product.id = lastId;
                product.timestamp = Date.now();
                products.push(product);
                await fs.promises.writeFile(this.filename, JSON.stringify(products, null, 2));
            } else {
                product.id = 1;
                product.timestamp = Date.now();
                await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
            }


        } catch (err) {
            console.log(err);
        }
    }

    async getAll() {

        try {
            const content = await fs.promises.readFile(this.filename, 'utf-8');
            if (content.length > 0) {
                let array = JSON.parse(content);
                return array;
            } else {
                return [];
            }

        }
        catch (err) {
            return "Cannot read file";
        }


    }

    async deleteById(id) {
        try {
            const products = await this.getAll();

            const newProducts = products.filter(product => product.id !== id);
            console.log('Deleted product successfully');

            await fs.promises.writeFile(this.filename, JSON.stringify(newProducts, null, 2));
        } catch (err) {
            return console.log(err);
        }
    }

    async getById(id) {
        try {
            const products = await this.getAll();

            let item = products.find(product => product.id === id);
            return item;

        } catch (err) {
            console.log(err);
        }

    }

}

module.exports = ContenedorCarrito;