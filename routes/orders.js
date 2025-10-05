const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// ✅ GET - Obtener todas las órdenes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ GET - Obtener una orden por ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.status(200).json(order);
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ POST - Crear nueva orden
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customer } = req.body;
    if (!productId || !quantity || !customer) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const newOrder = new Order({ productId, quantity, customer });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ PUT - Actualizar una orden
router.put('/:id', async (req, res) => {
  try {
    const { productId, quantity, customer } = req.body;
    if (!productId || !quantity || !customer) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { productId, quantity, customer },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ DELETE - Eliminar una orden
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
