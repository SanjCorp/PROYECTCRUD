import express from 'express';

export default (Product) => {
  const router = express.Router();

  // Obtener todos los productos
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: '❌ Error al obtener productos', error });
    }
  });

  // Crear un producto
  router.post('/', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json({ message: '✅ Producto creado', data: newProduct });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al crear producto', error });
    }
  });

  // Actualizar un producto
  router.put('/:id', async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: '✅ Producto actualizado', data: updated });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al actualizar producto', error });
    }
  });

  // Eliminar un producto
  router.delete('/:id', async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: '🗑️ Producto eliminado' });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al eliminar producto', error });
    }
  });

  return router;
};
