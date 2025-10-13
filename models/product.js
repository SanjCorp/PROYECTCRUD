import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true },
});

export const Product = mongoose.model("Product", productSchema);
