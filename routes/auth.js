import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

// ================= Registro =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones básicas
    if (!name || !email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Email inválido" });

    if (password.length < 6)
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });

    // Verificar si ya existe usuario
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser)
      return res.status(400).json({ message: "Usuario o email ya existe" });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "✅ Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "❌ Error al registrar usuario", error: err.message });
  }
});

// ================= Login =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "❌ Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "❌ Contraseña incorrecta" });

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "✅ Login exitoso", token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "❌ Error en login", error: err.message });
  }
});

export { router };
