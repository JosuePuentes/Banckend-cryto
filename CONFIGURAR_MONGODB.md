# 🔌 Cómo Conectar MongoDB a tu Backend

## Opción 1: MongoDB Atlas (Recomendado - Gratis y funciona en Render)

### Paso 1: Crear cuenta y cluster

1. **Ve a MongoDB Atlas:**
   - https://www.mongodb.com/cloud/atlas
   
2. **Crea una cuenta gratuita:**
   - Click en "Try Free"
   - Regístrate con email o Google

3. **Crea un cluster:**
   - Elige el plan **M0 Sandbox (FREE)**
   - Selecciona tu región más cercana (ej: AWS / N. Virginia)
   - Nombre del cluster: déjalo por defecto o ponle "Cluster0"
   - Click en "Create Cluster"
   - Espera 2-3 minutos mientras se crea

### Paso 2: Configurar acceso

#### 2.1. Crear usuario de base de datos

1. En el menú lateral, click en **"Database Access"**
2. Click en **"Add New Database User"**
3. Configurar usuario:
   ```
   Authentication Method: Password
   Username: admin
   Password: [Genera una contraseña o crea una]
   ```
4. Database User Privileges: **"Read and write to any database"**
5. Click en **"Add User"**
6. **¡GUARDA EL USERNAME Y PASSWORD!** Los necesitarás

#### 2.2. Configurar acceso de red

1. En el menú lateral, click en **"Network Access"**
2. Click en **"Add IP Address"**
3. Para desarrollo/Render: Click en **"Allow Access from Anywhere"**
   - Esto agregará `0.0.0.0/0`
4. Click en **"Confirm"**

### Paso 3: Obtener cadena de conexión

1. En el menú lateral, click en **"Database"**
2. En tu cluster, click en **"Connect"**
3. Selecciona **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copia la cadena de conexión, se verá así:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 4: Configurar variables de entorno

#### En desarrollo local:

1. **Crea el archivo `.env`** en la raíz del proyecto (al lado de `server.js`):
   ```bash
   # En la terminal:
   # Windows PowerShell:
   New-Item .env -ItemType File
   
   # O simplemente créalo con tu editor de código
   ```

2. **Agrega el siguiente contenido al archivo `.env`:**
   ```env
   PORT=5000
   
   MONGODB_URI=mongodb+srv://admin:TU_PASSWORD_AQUI@cluster0.xxxxx.mongodb.net/cripto-db?retryWrites=true&w=majority
   
   JWT_SECRET=mi-clave-secreta-super-segura-cambiar-en-produccion
   JWT_EXPIRES_IN=7d
   ```

3. **IMPORTANTE: Reemplaza en MONGODB_URI:**
   - `admin` con tu username (si usaste otro)
   - `TU_PASSWORD_AQUI` con la contraseña que creaste
   - `cluster0.xxxxx.mongodb.net` con tu URL de cluster real
   - `/cripto-db` es el nombre de tu base de datos (puedes cambiarlo)

   **Ejemplo completo:**
   ```
   MONGODB_URI=mongodb+srv://admin:MiPassword123@cluster0.abc123.mongodb.net/cripto-db?retryWrites=true&w=majority
   ```

#### En Render (producción):

1. Ve a tu servicio en Render
2. Click en **"Environment"** en el menú lateral
3. Agrega las variables:
   ```
   MONGODB_URI = mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/cripto-db?retryWrites=true&w=majority
   JWT_SECRET = clave-secreta-diferente-a-desarrollo
   JWT_EXPIRES_IN = 7d
   ```
4. Click en **"Save Changes"**

### Paso 5: Probar la conexión

1. **Inicia el servidor:**
   ```bash
   npm start
   ```

2. **Deberías ver en la consola:**
   ```
   ✅ Conectado a MongoDB
   📊 Base de datos: cripto-db
   🚀 Servidor corriendo en el puerto 5000
   ```

3. **Prueba el health check:**
   ```bash
   # En otra terminal o en el navegador:
   curl http://localhost:5000/health
   ```
   
   O abre en el navegador: http://localhost:5000/health
   
   Debería responder:
   ```json
   {
     "status": "ok",
     "mongodb": "connected",
     "timestamp": "2024-01-06T..."
   }
   ```

---

## Opción 2: MongoDB Local (Solo para desarrollo)

### Requisitos:
- MongoDB instalado en tu computadora
- **⚠️ NO funciona en Render u otros servicios en la nube**

### Paso 1: Instalar MongoDB

**Windows:**
1. Descarga MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Instala con las opciones por defecto
3. MongoDB se ejecutará automáticamente como servicio

**Mac (con Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Paso 2: Configurar variables de entorno

Crea el archivo `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cripto-db
JWT_SECRET=mi-clave-secreta-super-segura
JWT_EXPIRES_IN=7d
```

### Paso 3: Verificar que MongoDB esté corriendo

```bash
# Windows:
# Abre "Services" y busca "MongoDB"

# Mac/Linux:
sudo systemctl status mongodb
# o
mongosh --version
```

### Paso 4: Iniciar el servidor

```bash
npm start
```

---

## ⚠️ Errores Comunes

### Error: "MONGODB_URI no está definido"
**Solución:** Asegúrate de que el archivo `.env` existe y contiene `MONGODB_URI`

### Error: "Authentication failed"
**Solución:** 
- Verifica que el username y password sean correctos
- Asegúrate de reemplazar `<password>` con tu contraseña real (sin los `<>`)

### Error: "IP not whitelisted"
**Solución:** En MongoDB Atlas → Network Access → Agrega `0.0.0.0/0`

### Error: "connect ECONNREFUSED"
**Solución:**
- Para MongoDB Atlas: Verifica que la cadena de conexión sea correcta
- Para MongoDB local: Asegúrate de que MongoDB esté corriendo

---

## 🔐 Seguridad

### ✅ Hacer:
- Usar contraseñas seguras
- Guardar `.env` en `.gitignore` (ya está configurado)
- Usar diferentes JWT_SECRET en desarrollo y producción
- En producción, limitar IPs permitidas en MongoDB Atlas

### ❌ NO hacer:
- Subir el archivo `.env` a Git
- Usar la misma contraseña en desarrollo y producción
- Dejar la contraseña por defecto

---

## 📝 Checklist

- [ ] Cuenta de MongoDB Atlas creada
- [ ] Cluster creado
- [ ] Usuario de base de datos creado
- [ ] Acceso de red configurado (0.0.0.0/0)
- [ ] Cadena de conexión obtenida
- [ ] Archivo `.env` creado
- [ ] Variables configuradas correctamente
- [ ] Contraseña reemplazada en MONGODB_URI
- [ ] Servidor inicia sin errores
- [ ] Health check responde "connected"

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Comparte el error completo que ves en la consola
2. Verifica que hayas seguido todos los pasos
3. Asegúrate de que `.env` exista y tenga el formato correcto
4. Intenta acceder a http://localhost:5000/health

