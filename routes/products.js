const express = require('express');
const router = express.Router();

// Aquí tus productos de ejemplo o importación de modelo MongoDB
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

module.exports = router;
