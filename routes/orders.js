import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const uri = "mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@<TU_CLUSTER>/crudDB?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// ----------------------
// ESQUEMAS Y MODELOS
// ----------------------
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  product: String,
  quantity: Number,
  totalPrice: Number,
});

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

// ----------------------
// RUTAS DE PRODUCTS
// ----------------------
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const newProduct = new Product({ name, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al crear producto", error });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar producto", error });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Producto eliminado" });
});

// ----------------------
// RUTAS DE ORDERS
// ----------------------
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, product, quantity, totalPrice } = req.body;
    const newOrder = new Order({ customerName, product, quantity, totalPrice });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: "Error al crear orden", error });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar orden", error });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Orden eliminada" });
});

// ----------------------
// INICIO DEL SERVIDOR
// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor corriendo en puerto ${PORT}`));
