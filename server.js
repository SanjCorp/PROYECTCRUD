import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Swagger
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conexión MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/miDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`✅ Conectado a MongoDB: ${mongoURI.includes('localhost') ? 'LOCAL' : 'REMOTO'}`);
})
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// MODELOS (evitan OverwriteModelError)
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
}));

const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
}));

// Rutas
app.use('/api/products', productRoutes(Product));
app.use('/api/orders', orderRoutes(Order));
app.use('/api/auth', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🚀 API funcionando - Visita /api-docs para ver la documentación');
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor corriendo en puerto ${PORT}`));
