import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/auth.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// Importar modelos y rutas
import { Product } from "./models/product.js";
import { Order } from "./models/order.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import { authenticateJWT } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas abiertas
app.use("/api/auth", authRouter);

// Rutas protegidas con JWT
app.use("/api/products", authenticateJWT, productRoutes(Product));
app.use("/api/orders", authenticateJWT, orderRoutes(Order));

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
