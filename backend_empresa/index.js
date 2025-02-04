// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");
// Importar gestores de rutas
const departamentoRoutes = require("./routes/departamentoRoutes");  // <-- Importa las rutas de departamento
const empleadoRoutes = require("./routes/empleadoRoutes");  // <-- Importa las rutas de empleado

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());
// Configurar CORS para admitir cualquier origen
app.use(cors());

// Configurar rutas de la API Rest
app.use("/api/departamentos", departamentoRoutes);  // <-- Agregar la ruta de departamentos
app.use("/api/empleado", empleadoRoutes);  // <-- Agregar la ruta de empleado

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
