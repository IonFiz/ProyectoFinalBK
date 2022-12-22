import mongoose from "mongoose";

class ContenedorMongoDb {

    constructor(model) {
        mongoose.connect('mongodb+srv://fabri:1234@coderback.rkmnlko.mongodb.net/ecommerce?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => console.log('Connected to database'));

        this.model = model;
    }

    async getById(id) {

        try {
            let data = await this.model.find({ _id: id });
            let object = data.find(element => element.id == id)
            console.log(object);
            return object
        } catch (error) {
            console.log(error);
        }


    }

    async getAll() {

        try {
            let data = await this.model.find({});
            return data
        } catch (error) {
            console.log(error);
        }
    }

    async save(data) {

        try {
            let documentSave = await new this.model(data).save();
            console.log(documentSave);
            return documentSave;
        } catch (error) {
            console.log(error);
        }
    }

    async updateById(id, data) {
        try {

            let dataUpdated = await this.model.updateOne(
                { _id: id },
                { $set: data }
            );

            console.log(dataUpdated);
            return dataUpdated;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {

            let dataDelete = await this.model.deleteOne(
                { _id: id }
            );
            console.log(dataDelete);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll() {
        try {
            let dataDelete = await this.model.deleteMany({});
            console.log(dataDelete);
        } catch (error) {
            console.log(error);
        }
    }
}

export { ContenedorMongoDb }