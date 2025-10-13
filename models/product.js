import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
});

// Evita OverwriteModelError
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
