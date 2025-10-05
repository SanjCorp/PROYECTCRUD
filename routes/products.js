const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// ✅ GET - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ GET - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ POST - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const newProduct = new Product({ name, price, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ PUT - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ DELETE - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
