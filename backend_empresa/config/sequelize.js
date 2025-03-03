// config/sequelize.js
// const { Sequelize } = require("sequelize");
// const { db } = require("./config");

// // Instanciar sequelize  para conectar a mysql
// const sequelize = new Sequelize(
//   "empresa_informatica", // nombre bd
//   "root", // usuario
//   "test", // password
//   {
//     // objeto con opciones de conexion
//     host: "localhost", // Cambia esto por la dirección del servidor MySQL
//     port: 3306, // Cambia esto por el puerto del servidor MySql
//     dialect: "mysql", // Especificar el dialecto de la base de datos
//     // logging: false, // Desactiva el logging de las consultas SQL
//     logging: (msg) => {
//       if (msg.includes("ERROR")) {
//         console.error("Error de Sequelize:", msg);
//       }
//     },
//   }
// );

// // Probar la conexión
// (async () => {
//   try {
//     await sequelize.authenticate();
//     if (process.env.NODE_ENV !== "test") {
//       console.log("Conexión exitosa a la base de datos MySQL");
//     }
//   } catch (error) {
//     console.error("Error de conexión:", error);
//   }
// })();

// module.exports = sequelize; // Exportar la instancia de Sequelize para usarla en otros archivos

const { Sequelize } = require("sequelize");
const { db } = require("../config/config"); // Importamos la configuración de la BD

// Instanciar sequelize para conectar a MySQL
const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: "mysql",
  logging: (msg) => {
    if (msg.includes("ERROR")) {
      console.error("Error de Sequelize:", msg);
    }
  },
});

// Probar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa a la base de datos MySQL");
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error);
  }
})();

module.exports = sequelize; // Exportar la instancia de Sequelize