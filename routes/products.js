const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

// GET all
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
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

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(product);
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

    // Puedes agregar validaciones específicas aquí si lo deseas
    const newProduct = new Product(body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    // si es error de validación de mongoose, responde 400
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PUT update (PATCH-like, admite actualizar cualquier campo validado por el esquema)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'ID inválido' });
    if (!update || Object.keys(update).length === 0) return res.status(400).json({ error: 'Cuerpo vacío' });

    const updated = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
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

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
