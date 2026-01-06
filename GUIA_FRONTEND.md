# 🎨 Guía Completa para el Frontend

## 📋 Pasos para Implementar el Frontend

### Paso 1: Crear el Proyecto Frontend

**Si usas React:**
```bash
npx create-react-app frontend-cripto
cd frontend-cripto
```

**Si usas Vite (más rápido):**
```bash
npm create vite@latest frontend-cripto -- --template react
cd frontend-cripto
npm install
```

**Si usas Next.js:**
```bash
npx create-next-app@latest frontend-cripto
cd frontend-cripto
```

### Paso 2: Instalar Dependencias Adicionales

```bash
npm install axios react-router-dom
```

### Paso 3: Estructura de Carpetas Recomendada

```
frontend-cripto/
├── src/
│   ├── components/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── auth.js
│   ├── App.jsx
│   └── index.js
```

---

## 🔧 Implementación Paso a Paso

### 1. Configurar el Cliente API

Crea `src/services/api.js`:

```javascript
import axios from 'axios';

// URL base del backend
const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authAPI = {
  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default api;
```

### 2. Utilidades de Autenticación

Crea `src/utils/auth.js`:

```javascript
export const authUtils = {
  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};
```

### 3. Componente de Registro

Crea `src/components/Register.jsx`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Register.css'; // Estilos opcionales

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    // Validaciones básicas
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error al registrar usuario. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🚀 Únete a la Revolución Cripto</h1>
        <p className="subtitle">La criptomoneda que cambiará el juego</p>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ¡Registro exitoso! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (Opcional)</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="+1234567890"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
```

### 4. Componente de Login

Crea `src/components/Login.jsx`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css'; // Estilos opcionales

function Login() {
  const navigate = useNavigate();
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Credenciales inválidas. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Iniciar Sesión</h1>
        <p className="subtitle">Accede a tu cuenta</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
```

### 5. Componente Dashboard (Protegido)

Crea `src/components/Dashboard.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { authUtils } from '../utils/auth';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = authUtils.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Opcional: Verificar token con el backend
          await authAPI.verifyToken();
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        authUtils.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    authUtils.logout();
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>💰 Bienvenido a la Revolución Cripto</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      {user && (
        <div className="user-info">
          <h2>Tu Perfil</h2>
          <div className="info-card">
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.telefono && (
              <p><strong>Teléfono:</strong> {user.telefono}</p>
            )}
            <p><strong>Fecha de Registro:</strong> {
              new Date(user.fechaRegistro).toLocaleDateString('es-ES')
            }</p>
          </div>
        </div>
      )}

      <div className="crypto-info">
        <h2>🚀 La Criptomoneda del Futuro</h2>
        <p>Próximamente: Funcionalidades de trading, wallet, y más...</p>
      </div>
    </div>
  );
}

export default Dashboard;
```

### 6. Componente de Ruta Protegida

Crea `src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router-dom';
import { authUtils } from '../utils/auth';

function ProtectedRoute({ children }) {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

### 7. Configurar Rutas en App.jsx

Actualiza `src/App.jsx`:

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
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
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🎨 Estilos Básicos (Opcional)

### src/components/Register.css

```css
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-card h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
```

### src/components/Login.css

```css
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Reutiliza los mismos estilos de Register.css */
```

### src/components/Dashboard.css

```css
.dashboard-container {
  min-height: 100vh;
  padding: 40px;
  background: #f5f5f5;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logout-button {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.logout-button:hover {
  background: #c82333;
}

.user-info, .crypto-info {
  background: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-card {
  margin-top: 20px;
}

.info-card p {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 20px;
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear proyecto frontend (React/Vite/Next.js)
- [ ] Instalar dependencias (axios, react-router-dom)
- [ ] Crear estructura de carpetas
- [ ] Implementar `api.js` con axios
- [ ] Crear componente Register
- [ ] Crear componente Login
- [ ] Crear componente Dashboard
- [ ] Crear ProtectedRoute
- [ ] Configurar rutas en App.jsx
- [ ] Agregar estilos CSS
- [ ] Probar registro de usuario
- [ ] Probar inicio de sesión
- [ ] Verificar protección de rutas

---

## 🚀 Comandos para Ejecutar

```bash
# En el directorio del frontend
npm install
npm start  # o npm run dev si usas Vite
```

---

## 🔗 URLs del Frontend

- `/register` - Página de registro
- `/login` - Página de login
- `/dashboard` - Dashboard protegido (requiere autenticación)

---

## ⚠️ Importante

1. **Asegúrate de que el backend esté corriendo** en `http://localhost:5000`
2. **CORS está habilitado** en el backend, así que no deberías tener problemas
3. **El token se guarda en localStorage** - en producción considera usar cookies httpOnly
4. **Maneja los errores** apropiadamente para mejor UX

---

¡Listo! Con esto tienes un frontend completo y funcional. 🎉

