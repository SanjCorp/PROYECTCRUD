import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
import cors from 'cors';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor corriendo en puerto ${PORT}`));


// Esquemas y Modelos
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
});

const orderSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  total: Number
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Rutas API
// ---------- PRODUCTOS ----------
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: '✅ Producto creado', data: newProduct });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al crear producto', error });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ Producto actualizado', data: updated });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al actualizar producto', error });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Producto eliminado' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al eliminar producto', error });
  }
});

// ---------- ÓRDENES ----------
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: '✅ Orden creada', data: newOrder });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al crear orden', error });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ Orden actualizada', data: updated });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al actualizar orden', error });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Orden eliminada' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error al eliminar orden', error });
  }
});

// ---------- SWAGGER ----------
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---------- RUTA RAÍZ ----------
app.get('/', (req, res) => {
  res.send('🚀 API funcionando correctamente - Visita /api-docs para ver la documentación.');
});

