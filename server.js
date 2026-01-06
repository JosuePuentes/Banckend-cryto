import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API de Criptomoneda funcionando correctamente',
    version: '1.0.0'
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    mongodb: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

// Configuración de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI no está definido en las variables de entorno');
  console.error('Por favor, configura MONGODB_URI en tu archivo .env o variables de entorno');
  process.exit(1);
}

// Opciones de conexión mejoradas para producción
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
  socketTimeoutMS: 45000, // Cierra sockets después de 45s de inactividad
  family: 4, // Usar IPv4, saltar IPv6
};

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    
    // Iniciar servidor solo después de conectar a MongoDB
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error.message);
    console.error('🔍 Verifica que:');
    console.error('   1. MONGODB_URI esté correctamente configurado');
    console.error('   2. La base de datos esté accesible');
    console.error('   3. Las credenciales sean correctas');
    console.error('   4. El firewall permita la conexión');
    process.exit(1);
  });

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose desconectado de MongoDB');
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Conexión a MongoDB cerrada por terminación de la aplicación');
  process.exit(0);
});

export default app;

