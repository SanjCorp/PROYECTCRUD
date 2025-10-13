import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "./routes/auth.js"; // rutas de autenticación
// import productRoutes from "./routes/products.js"; // si agregas productos

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Inicio del servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
