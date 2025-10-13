import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/auth.js";

dotenv.config();
const app = express();

// 👇 Esto es vital para que req.body funcione
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
