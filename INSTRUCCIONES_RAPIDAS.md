# 🚀 INSTRUCCIONES RÁPIDAS - Ejecutar el Backend

## ⚡ Inicio Rápido (3 pasos)

### Paso 1: Instalar Node.js (si no lo tienes)
Descarga e instala desde: https://nodejs.org/ (versión LTS)

### Paso 2: Configurar MongoDB Atlas

**Opción A - Usar MongoDB Atlas (Recomendado):**

1. **Ir a MongoDB Atlas:**
   ```
   https://www.mongodb.com/cloud/atlas
   ```

2. **Crear cuenta gratis** (2 minutos)
   - Click en "Try Free"
   - Regístrate con tu email

3. **Crear cluster gratis** (3 minutos)
   - Plan: M0 Sandbox (FREE) ✅
   - Provider: AWS
   - Region: N. Virginia (o más cercana)
   - Click "Create"

4. **Configurar acceso:**
   
   a) Crear usuario:
   - Menú: Database Access → Add New Database User
   - Username: `admin`
   - Password: `Admin123456` (o la que prefieras)
   - Privileges: Read and write to any database
   - Click "Add User"
   
   b) Permitir conexiones:
   - Menú: Network Access → Add IP Address
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

5. **Obtener URL de conexión:**
   - Menú: Database → Connect
   - "Connect your application"
   - Copia la URL (se ve así):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Opción B - Instalar MongoDB localmente:**
- Descarga: https://www.mongodb.com/try/download/community
- Instala y ejecuta
- Tu URL será: `mongodb://localhost:27017/cripto-db`

### Paso 3: Configurar el Proyecto

**3.1. Abrir terminal en la carpeta del proyecto:**
```powershell
cd C:\Users\Alejandro\Desktop\banckend-cripto
```

**3.2. Instalar dependencias:**
```powershell
npm install
```

**3.3. Crear archivo de configuración:**
```powershell
# Copiar el ejemplo
Copy-Item .env.example .env

# Abrir el archivo para editarlo
notepad .env
```

**3.4. Editar el archivo `.env`:**

Reemplaza esta línea:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/cripto-db?retryWrites=true&w=majority
```

Con tu URL real de MongoDB Atlas. Ejemplo:
```
MONGODB_URI=mongodb+srv://admin:Admin123456@cluster0.abc123.mongodb.net/cripto-db?retryWrites=true&w=majority
```

**Cambia también:**
```
JWT_SECRET=tu-clave-super-secreta-y-unica-123456789
```

Guarda y cierra el archivo.

**3.5. Iniciar el servidor:**
```powershell
npm start
```

### ✅ Si todo funciona verás:
```
✅ Conectado a MongoDB
📊 Base de datos: cripto-db
🚀 Servidor corriendo en el puerto 5000
```

### 🌐 Probar que funciona:

Abre el navegador en:
```
http://localhost:5000/health
```

Deberías ver:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2024-01-06T..."
}
```

---

## 🧪 Probar el Registro de Usuarios

### Opción 1: Usar el navegador con una extensión

Instala "REST Client" o "Thunder Client" en VS Code, o usa Postman.

### Opción 2: Usar PowerShell

```powershell
# Registrar un usuario
$body = @{
    nombre = "Juan Pérez"
    email = "juan@test.com"
    password = "password123"
    telefono = "+1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Opción 3: Crear un archivo HTML de prueba

He creado `test-frontend.html` para probar rápidamente.

---

## ❌ Errores Comunes

### Error: "npm no se reconoce"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "MONGODB_URI no está definido"
**Solución:** 
1. Verifica que existe el archivo `.env` (no `.env.example`)
2. Abre `.env` y verifica que tenga `MONGODB_URI=...`

### Error: "Authentication failed"
**Solución:** 
1. Reemplaza `<password>` con tu contraseña real (sin los `<>`)
2. Verifica que el usuario y contraseña sean correctos en MongoDB Atlas

### Error: "connect ECONNREFUSED"
**Solución:**
- Si usas Atlas: Verifica la URL de conexión
- Si usas local: Asegúrate de que MongoDB esté corriendo

### Error: "IP not whitelisted"
**Solución:** 
- Ve a MongoDB Atlas → Network Access
- Agrega `0.0.0.0/0` (Allow from anywhere)

---

## 📞 Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Iniciar servidor (producción)
npm start

# Iniciar servidor (desarrollo con auto-reload)
npm run dev

# Ver si el servidor responde
Invoke-RestMethod http://localhost:5000/health

# Ver logs en tiempo real
# (los verás automáticamente en la terminal donde ejecutaste npm start)
```

---

## 🎯 Próximos Pasos

Una vez que el backend funcione:

1. **Ver la base de datos:**
   - Ve a MongoDB Atlas → Database → Collections
   - Verás los usuarios registrados

2. **Crear el frontend:**
   - Consulta `GUIA_FRONTEND.md` para crear la interfaz web

3. **Desplegar en Render:**
   - Consulta `CONFIGURACION_RENDER.md`

---

## 🆘 Si Nada Funciona

Comparte:
1. El error completo que ves en la terminal
2. El contenido de tu archivo `.env` (SIN mostrar las contraseñas)
3. Qué paso seguiste

Y te ayudaré a solucionarlo. ✨

