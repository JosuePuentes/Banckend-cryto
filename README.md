# Backend Criptomoneda - API de Registro

Backend completo para plataforma de nueva criptomoneda con sistema de registro y autenticación de usuarios.

## 🚀 Características

- ✅ Registro de usuarios
- ✅ Inicio de sesión con JWT
- ✅ Autenticación protegida
- ✅ Validación de datos
- ✅ Encriptación de contraseñas
- ✅ CORS habilitado
- ✅ Estructura modular y escalable

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
   - Copia el archivo `.env.example` a `.env`
   - Edita `.env` con tus configuraciones:
     - `MONGODB_URI`: URL de conexión a MongoDB (⚠️ **REQUERIDO**)
     - `JWT_SECRET`: Clave secreta para JWT (cambiar en producción)
     - `PORT`: Puerto del servidor (opcional, por defecto 5000)

3. **Iniciar servidor:**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 🚀 Despliegue en Render.com

Para desplegar en Render, consulta la guía completa en **[CONFIGURACION_RENDER.md](./CONFIGURACION_RENDER.md)**

**Resumen rápido:**
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
2. Obtén tu cadena de conexión MongoDB
3. En Render, configura las variables de entorno:
   - `MONGODB_URI` (requerido)
   - `JWT_SECRET` (requerido)
   - `JWT_EXPIRES_IN` (opcional, default: 7d)
   - `PORT` (Render lo asigna automáticamente)

## 📡 Endpoints de la API

### Base URL
```
http://localhost:5000/api
```

### 1. Registro de Usuario
**POST** `/api/auth/register`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "+1234567890"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "...",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "+1234567890",
      "fechaRegistro": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Inicio de Sesión
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "...",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "+1234567890",
      "fechaRegistro": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obtener Perfil (Protegido)
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "+1234567890",
      "fechaRegistro": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 4. Verificar Token (Protegido)
**GET** `/api/auth/verify`

**Headers:**
```
Authorization: Bearer <token>
```

### 5. Health Check
**GET** `/health`

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2024-01-06T00:00:00.000Z"
}
```

## 🔒 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <tu-token-jwt>
```

## 📝 Notas para el Frontend

- El token JWT debe guardarse (localStorage, sessionStorage, o cookies)
- Incluir el token en todas las peticiones protegidas
- El token expira en 7 días (configurable en `.env`)
- Manejar errores 401 (no autorizado) para redirigir al login

## 🛠️ Tecnologías Utilizadas

- Express.js
- MongoDB con Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (encriptación de contraseñas)
- express-validator (validación de datos)
- CORS

## 📦 Estructura del Proyecto

```
backend-cripto/
├── controllers/
│   └── auth.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   └── User.js
├── routes/
│   └── auth.routes.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

