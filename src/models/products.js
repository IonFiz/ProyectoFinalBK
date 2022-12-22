import mongoose from "mongoose";

const productsCollection = 'productos';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 250 },
    code: {
        type: String, required: true, unique: true, default: Math.floor(100000000 + Math.random() * 90000000000).toString().slice(2, 11)
    },
    image: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
})

export const productModel = mongoose.model(productsCollection, ProductSchema);