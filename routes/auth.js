import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default (User) => {
  const router = express.Router();

  // Registrar usuario
  router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: '✅ Usuario registrado', data: newUser });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al registrar usuario', error });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: '❌ Usuario no encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: '❌ Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ message: '✅ Login exitoso', token });
    } catch (error) {
      res.status(500).json({ message: '❌ Error en login', error });
    }
  });

  return router;
};
