import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: '✅ Producto creado', data: newProduct });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al crear producto', error });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ Producto actualizado', data: updated });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al actualizar producto', error });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Producto eliminado' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al eliminar producto', error });
  }
});

export default router;
