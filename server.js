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

// Verifica que la variable de entorno exista
if (!process.env.MONGODB_URI) {
  console.error('❌ La variable de entorno MONGODB_URI no está definida');
  process.exit(1); // Detiene la app si no hay URI
}

// Conexión MongoDB remota
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB remoto'))
.catch(err => console.error('❌ Error de conexión a MongoDB remoto:', err));

// MODELOS (evita OverwriteModelError)
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
}));

const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  productId: String,
  quantity: Number,
  total: Number
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
