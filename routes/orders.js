import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

// Obtener todas las órdenes
router.get('/', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Crear orden
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: '✅ Orden creada', data: newOrder });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al crear orden', error });
  }
});

// Actualizar orden
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ Orden actualizada', data: updated });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al actualizar orden', error });
  }
});

// Eliminar orden
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Orden eliminada' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al eliminar orden', error });
  }
});

export default router;
