# 🚀 Configuración para Render.com

## ⚠️ Problema Común

Si ves este error:
```
connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**Causa:** Estás intentando conectarte a `localhost:27017`, pero en Render no puedes usar MongoDB local. Necesitas usar **MongoDB Atlas** (gratis) o un servicio de MongoDB externo.

---

## 📋 Pasos para Configurar en Render

### 1. Crear Base de Datos MongoDB Atlas (Gratis)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (elige el plan **FREE**)
4. Espera a que se cree el cluster (2-3 minutos)

### 2. Configurar Acceso a la Base de Datos

1. En MongoDB Atlas, ve a **Database Access** (menú lateral)
2. Click en **Add New Database User**
3. Crea un usuario:
   - Username: `admin` (o el que prefieras)
   - Password: Genera una contraseña segura (guárdala)
   - Database User Privileges: `Read and write to any database`
4. Click en **Add User**

### 3. Configurar Network Access

1. En MongoDB Atlas, ve a **Network Access** (menú lateral)
2. Click en **Add IP Address**
3. Para desarrollo: Click en **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ En producción, agrega solo las IPs de Render
4. Click en **Confirm**

### 4. Obtener la Cadena de Conexión

1. En MongoDB Atlas, ve a **Database** (menú lateral)
2. Click en **Connect** en tu cluster
3. Selecciona **Connect your application**
4. Copia la cadena de conexión, se verá así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Reemplaza `<username>` y `<password>` con tus credenciales:
   ```
   mongodb+srv://admin:tuPassword123@cluster0.xxxxx.mongodb.net/cripto-db?retryWrites=true&w=majority
   ```
   - Nota: Agrega el nombre de la base de datos antes del `?` (ej: `/cripto-db`)

### 5. Configurar Variables de Entorno en Render

1. En tu servicio de Render, ve a **Environment**
2. Agrega las siguientes variables:

   ```
   MONGODB_URI=mongodb+srv://admin:tuPassword123@cluster0.xxxxx.mongodb.net/cripto-db?retryWrites=true&w=majority
   JWT_SECRET=tu-clave-secreta-super-segura-y-larga-para-produccion
   JWT_EXPIRES_IN=7d
   PORT=10000
   ```

   ⚠️ **IMPORTANTE:**
   - Reemplaza `admin` y `tuPassword123` con tus credenciales reales
   - Reemplaza `cluster0.xxxxx.mongodb.net` con tu URL de cluster
   - Usa una `JWT_SECRET` fuerte y única (puedes generar una con: `openssl rand -base64 32`)

3. Click en **Save Changes**

### 6. Redesplegar

1. Render debería redeplegar automáticamente
2. O ve a **Manual Deploy** → **Deploy latest commit**

---

## 🔍 Verificar que Funciona

1. Ve a los **Logs** de tu servicio en Render
2. Deberías ver:
   ```
   ✅ Conectado a MongoDB
   📊 Base de datos: cripto-db
   🚀 Servidor corriendo en el puerto 10000
   ```

3. Prueba el endpoint de health check:
   ```
   https://tu-app.onrender.com/health
   ```
   Debería responder:
   ```json
   {
     "status": "ok",
     "mongodb": "connected",
     "timestamp": "2024-01-06T00:00:00.000Z"
   }
   ```

---

## 🛠️ Solución de Problemas

### Error: "MONGODB_URI no está definido"
- **Solución:** Verifica que agregaste la variable `MONGODB_URI` en Render → Environment

### Error: "Authentication failed"
- **Solución:** Verifica que el usuario y contraseña en `MONGODB_URI` sean correctos
- Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "IP not whitelisted"
- **Solución:** En MongoDB Atlas → Network Access, agrega `0.0.0.0/0` temporalmente para desarrollo

### Error: "Connection timeout"
- **Solución:** Verifica que la cadena de conexión esté correcta
- Asegúrate de que el cluster esté activo en MongoDB Atlas

### El servidor se cae después de unos minutos
- **Solución:** Render puede poner servicios gratuitos en "sleep" después de inactividad
- Considera usar un servicio de "ping" para mantenerlo activo

---

## 📝 Ejemplo de Cadena de Conexión Completa

```
mongodb+srv://usuario:password123@cluster0.abc123.mongodb.net/cripto-db?retryWrites=true&w=majority
```

Desglose:
- `mongodb+srv://` - Protocolo
- `usuario:password123@` - Credenciales
- `cluster0.abc123.mongodb.net` - URL del cluster
- `/cripto-db` - Nombre de la base de datos
- `?retryWrites=true&w=majority` - Opciones de conexión

---

## 🔐 Seguridad en Producción

1. **JWT_SECRET:** Usa una clave larga y aleatoria
2. **MongoDB Password:** Usa una contraseña fuerte
3. **Network Access:** En producción, limita las IPs permitidas
4. **Variables de Entorno:** Nunca subas el archivo `.env` a Git

---

## ✅ Checklist

- [ ] Cluster de MongoDB Atlas creado
- [ ] Usuario de base de datos creado
- [ ] Network Access configurado (0.0.0.0/0 para desarrollo)
- [ ] Cadena de conexión obtenida
- [ ] Variables de entorno configuradas en Render
- [ ] Servicio redesplegado
- [ ] Logs muestran "✅ Conectado a MongoDB"
- [ ] Health check responde correctamente

---

¡Con esto deberías poder desplegar tu backend en Render sin problemas! 🎉

