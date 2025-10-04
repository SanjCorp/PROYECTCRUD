const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

// GET all
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'ID inválido' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) return res.status(400).json({ error: 'Cuerpo vacío' });

    const newOrder = new Order(body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'ID inválido' });
    if (!update || Object.keys(update).length === 0) return res.status(400).json({ error: 'Cuerpo vacío' });

    const updated = await Order.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Orden no encontrada' });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'ID inválido' });

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Orden no encontrada' });
    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
