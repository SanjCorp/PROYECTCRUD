const express = require('express');
const router = express.Router();

// Tus órdenes de ejemplo o modelo MongoDB
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

module.exports = router;

