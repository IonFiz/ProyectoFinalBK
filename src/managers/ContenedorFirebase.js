import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//path.join(__dirname, "..", `db/firebaseKey.json`)
const serviceAccount = await JSON.parse(readFileSync(path.join(__dirname, "..", `db/firebaseKey.json`)));

admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://coderback32175.firebase.io"
    }
);

const db = admin.firestore();

console.log("Connected to Firebase database");

class ContenedorFirestore {

    constructor(collection) {
        this.collection = db.collection(collection)
        console.log(`Base de datos conectada con la collection ${collection}`);
    }



    async getById(id) {

        let result = await this.collection.get()
        result = result.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))
        let item = result.find(elem => elem.id == id)
        return item
    }

    async getAll() {

        try {
            let result = await this.collection.get()
            result = result.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
            return result;
        } catch (error) {
            console.log(error)
        }
    }

    async save(data) {

        try {
            let item = await this.collection.doc().create(data)
            return item;
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, data) {

        let doc = this.collection.doc(`${id}`);

        if (doc) {
            let item = await doc.update(data)
            return item;
        } else {
            return ({ Error: 'no se encontro el elemento' })
        }
    }

    async deleteById(id) {
        let doc = this.collection.doc(`${id}`)
        let item = await doc.delete()
        return ({ status: `Producto eliminado ${item}` })
    }

}

export { ContenedorFirestore }