const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 📦 Conexión a MongoDB (usa variable de entorno en Render)
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/w03crud';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Importar rutas
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Swagger
const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta base
app.get('/', (req, res) => {
    res.send('🚀 API CRUD funcionando! Visita /api-docs para ver Swagger');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
