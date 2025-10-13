import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("📩 Datos recibidos en /register:", req.body);

    const { name, email, password } = req.body;

    // Verificación de datos vacíos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe usuario con ese email o nombre
    const existingUser = await User.findOne({
      $or: [{ name: name }, { email: email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Usuario o email ya existe" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "✅ Usuario registrado correctamente" });

  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "❌ Error al registrar usuario", error: err.message });
  }
});
