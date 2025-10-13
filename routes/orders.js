import express from 'express';
import Order from '../models/order.js';
import Product from '../models/product.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
  const orders = await Order.find().populate('items.product');
  res.json(orders);
});

router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { orderNumber, customerName, items } = req.body;
    let subtotal = 0;

    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(400).json({ error: 'Producto no encontrado' });
      if (product.stock < it.quantity) return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      subtotal += product.price * it.quantity;
    }

    const tax = +(subtotal * 0.13).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const order = new Order({ orderNumber, customerName, items, subtotal, tax, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json({ message: 'Orden eliminada' });
});

export default router;
