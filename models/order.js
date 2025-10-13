import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  total: Number
});

// Evita OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
