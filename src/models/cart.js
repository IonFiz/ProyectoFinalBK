import mongoose from "mongoose";

const cartsCollection = 'carritos';


const CartSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now, required: true },
    products: { type: Array, required: true }
})

export const cartModel = mongoose.model(cartsCollection, CartSchema);