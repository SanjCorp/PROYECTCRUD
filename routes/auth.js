// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default (User) => {
  const router = express.Router();

  // Registro de usuario
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: '❌ Usuario ya registrado' });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: '✅ Usuario registrado', data: newUser });
    } catch (error) {
      res.status(500).json({ message: '❌ Error en registro', error });
    }
  });

  // Login de usuario
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: '❌ Usuario no encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: '❌ Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ message: '✅ Login exitoso', token });
    } catch (error) {
      res.status(500).json({ message: '❌ Error en login', error });
    }
  });

  return router;
};
