import express from 'express';

const router = express.Router();

// Rutas de autenticación
router.post('/login', (req, res) => {
  // Aquí iría tu lógica de login
  res.json({ message: '🔐 Login no implementado aún' });
});

router.post('/register', (req, res) => {
  // Aquí iría tu lógica de registro
  res.json({ message: '📝 Registro no implementado aún' });
});

export default router;
