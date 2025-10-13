import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/auth.js";

// Cargar variables de entorno lo antes posible
dotenv.config();

// Debug: verificar que MONGO_URI se esté leyendo correctamente
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

// 👇 Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use("/api/auth", authRouter);

// Ruta principal de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
