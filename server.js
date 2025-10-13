// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// Rutas
import { router as authRouter } from "./routes/auth.js";
import createProductRouter from "./routes/products.js";
import createOrderRouter from "./routes/orders.js";
import { authenticateJWT } from "./middleware/auth.js";

// Modelos
import { User } from "./models/user.js";
import { Product } from "./models/product.js";
import { Order } from "./models/order.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/products", createProductRouter(Product));
app.use("/api/orders", createOrderRouter(Order));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
