# 📱 Instrucciones para el Frontend

## 🎯 Endpoints Disponibles

### Base URL
```
http://localhost:5000/api
```

## 🔐 Endpoints de Autenticación

### 1. **Registro de Usuario**
```javascript
POST http://localhost:5000/api/auth/register

Headers:
Content-Type: application/json

Body:
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "+1234567890" // Opcional
}

Respuesta exitosa (201):
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

### 2. **Inicio de Sesión**
```javascript
POST http://localhost:5000/api/auth/login

Headers:
Content-Type: application/json

Body:
{
  "email": "juan@example.com",
  "password": "password123"
}

Respuesta exitosa (200):
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. **Obtener Perfil (Requiere Autenticación)**
```javascript
GET http://localhost:5000/api/auth/profile

Headers:
Authorization: Bearer <token>
Content-Type: application/json
```

### 4. **Verificar Token (Requiere Autenticación)**
```javascript
GET http://localhost:5000/api/auth/verify

Headers:
Authorization: Bearer <token>
```

## 💻 Ejemplo de Implementación en React

### Configuración de API
```javascript
// src/config/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  },
};
```

### Servicio de Autenticación
```javascript
// src/services/authService.js
import { api } from '../config/api';

export const authService = {
  // Registro
  async register(userData) {
    const response = await api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Login
  async login(email, password) {
    const response = await api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener perfil
  async getProfile() {
    return await api.request('/auth/profile');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
```

### Componente de Registro
```javascript
// src/components/Register.jsx
import { useState } from 'react';
import { authService } from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      
      if (response.success) {
        // Redirigir al dashboard o página principal
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Únete a la Revolución Cripto</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        name="nombre"
        placeholder="Nombre completo"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <input
        type="password"
        name="password"
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
      />
      
      <input
        type="tel"
        name="telefono"
        placeholder="Teléfono (opcional)"
        value={formData.telefono}
        onChange={handleChange}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}

export default Register;
```

### Componente de Login
```javascript
// src/components/Login.jsx
import { useState } from 'react';
import { authService } from '../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </button>
    </form>
  );
}

export default Login;
```

### Protección de Rutas
```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

## 🎨 Ejemplo de Uso en Rutas (React Router)
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

## ⚠️ Manejo de Errores

### Errores Comunes

1. **401 Unauthorized**: Token inválido o expirado
   - Solución: Redirigir al login y limpiar localStorage

2. **400 Bad Request**: Datos inválidos
   - Solución: Mostrar mensajes de error del backend

3. **500 Server Error**: Error del servidor
   - Solución: Mostrar mensaje genérico al usuario

### Interceptor para Manejar Errores 401
```javascript
// En tu configuración de API
const response = await fetch(url, config);
const data = await response.json();

if (response.status === 401) {
  // Token inválido o expirado
  authService.logout();
  window.location.href = '/login';
  throw new Error('Sesión expirada. Por favor inicia sesión nuevamente');
}

if (!response.ok) {
  throw new Error(data.message || 'Error en la petición');
}
```

## 📝 Validaciones del Frontend

- **Email**: Debe ser un email válido
- **Password**: Mínimo 6 caracteres
- **Nombre**: Mínimo 2 caracteres
- **Teléfono**: Opcional, pero si se proporciona debe ser válido

## 🔑 Almacenamiento del Token

Recomendaciones:
- **localStorage**: Para persistencia entre sesiones
- **sessionStorage**: Para sesión solo mientras el navegador está abierto
- **Cookies httpOnly**: Más seguro, pero requiere configuración adicional

## 🚀 Próximos Pasos

1. Instalar dependencias del backend: `npm install`
2. Configurar MongoDB (local o Atlas)
3. Crear archivo `.env` con las variables de entorno
4. Iniciar el servidor: `npm run dev`
5. Implementar el frontend usando los ejemplos anteriores
6. Probar los endpoints con Postman o similar

## 📞 Códigos de Estado HTTP

- **200**: Éxito
- **201**: Creado exitosamente (registro)
- **400**: Error de validación o datos inválidos
- **401**: No autorizado (token inválido o faltante)
- **500**: Error del servidor

