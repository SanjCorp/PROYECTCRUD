const express = require('express');
const router = express.Router();

let orders = [
  { id: 1, customerName: 'Ricardo Sanjines', product: 'Filamento PLA', quantity: 2 },
  { id: 2, customerName: 'Juan Pérez', product: 'PLA Negro', quantity: 1 }
];

// GET /api/orders?customer=...
router.get('/', (req, res) => {
  const { customer } = req.query;
  let filtered = orders;
  if (customer) {
    filtered = orders.filter(o => o.customerName.toLowerCase().includes(customer.toLowerCase()));
  }
  res.json(filtered);
});

// POST /api/orders - Crear una orden
router.post('/', (req, res) => {
  const { customerName, product, quantity } = req.body;
  const newOrder = { id: orders.length + 1, customerName, product, quantity };
  orders.push(newOrder);
  res.status(201).json({ message: 'Orden creada', order: newOrder });
});

// DELETE /api/orders/:id - Eliminar una orden
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(o => o.id == id);
  if (index === -1) return res.status(404).json({ message: 'Orden no encontrada' });
  const deleted = orders.splice(index, 1);
  res.json({ message: 'Orden eliminada', order: deleted[0] });
});

module.exports = router;
