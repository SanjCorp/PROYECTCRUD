import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sanjcrud", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log("Error MongoDB:", err));

// Rutas
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";
import { router as authRoutes } from "./routes/auth.js";


app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
