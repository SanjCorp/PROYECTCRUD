const express = require('express');
const router = express.Router();

let products = [
  { id: 1, name: 'Filamento PLA', price: 20 },
  { id: 2, name: 'PLA Negro', price: 22 }
];

// GET /api/products?name=...
router.get('/', (req, res) => {
  const { name } = req.query;
  let filtered = products;
  if (name) {
    filtered = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  }
  res.json(filtered);
});

// POST /api/products - Crear un producto
router.post('/', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json({ message: 'Producto creado', product: newProduct });
});

// DELETE /api/products/:id - Eliminar un producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id == id);
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });
  const deleted = products.splice(index, 1);
  res.json({ message: 'Producto eliminado', product: deleted[0] });
});

module.exports = router;
