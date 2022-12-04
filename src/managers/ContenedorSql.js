const knex = require("knex");

// const database = knex(options)

class ContenedorSQL {
    constructor(options, tableName) {
        this.database = knex(options);
        this.table = tableName;
    }

    async getAll() {
        try {
            //obtenemos los registros de la tabla
            const response = await this.database.from(this.table).select("*");
            return response;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }

    async save(object) {
        try {
            const [id] = await this.database.from(this.table).insert(object);
            return `save successfully with id ${id}`;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }

    async getById(id) {
        try {
            const response = await this.database.from(this.table).where("id", id);
            return response;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }

    async deleteById(id) {
        try {
            const response = await this.database.from(this.table).where("id", id).del();
            return `product with id ${response} deleted successfully`;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }

    async updateById(id, title, price, thumbnail) {
        try {
            //const response = await this.database.from(this.table).where("id", id).update({ object }) -> el object seria el segundo parametro que recibe pero tira error que esta nulo
            const response = await this.database.from(this.table).where("id", id).update({
                title: title,
                price: price,
                thumbnail: thumbnail
            });

            //update({ thumbnail: "https://www.mobygames.com/images/covers/l/630320-dark-souls-iii-the-fire-fades-edition-playstation-4-front-cover.jpg" });
            return response;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }

    async deleteAll() {
        try {
            const response = await this.database.from(this.table).del();
            return response;
        } catch (error) {
            return `Hubo un error ${error}`;
        }
    }
}

module.exports = { ContenedorSQL };