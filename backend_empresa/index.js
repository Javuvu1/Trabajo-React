// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar librería CORS
const cors = require("cors");
// Importar gestores de rutas
const departamentoRoutes = require("./routes/departamentoRoutes");  // Rutas de departamento
const empleadoRoutes = require("./routes/empleadoRoutes");  // Rutas de empleado

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());
// Configurar CORS para admitir cualquier origen
// app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",  // Para desarrollo local
  "https://empresa-production-479f.up.railway.app", // Para producción
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (por ejemplo, desde Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS no permitido"));
    },
    credentials: true, // Permite envío de cookies y headers autenticados
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  })
);

// Configurar rutas de la API Rest
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/empleado", empleadoRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta catch-all para la SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

// Exportamos la aplicación para poder hacer pruebas
module.exports = app;
