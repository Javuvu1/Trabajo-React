// Importar librería para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo empleado
const Empleado = models.empleado;

class EmpleadoController {
  // Crear un nuevo empleado
  async createEmpleado(req, res) {
    const empleado = req.body;

    try {
      const empleadoNuevo = await Empleado.create(empleado);
      res.status(201).json({ ok: true, mensaje: "Empleado insertado", datos: empleadoNuevo });
      console.log("Empleado insertado:", empleadoNuevo);
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear un empleado nuevo: ${empleado}`));
    }
  }

  // Recuperar todos los empleado
  async getAllempleado(req, res) {
    try {
      const data = await Empleado.findAll(); // Recuperar todos los empleado
      res.json(Respuesta.exito(data, "Datos de empleado recuperados"));
    } catch (err) {
      // Manejo de errores durante la llamada al modelo
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los empleado: ${req.originalUrl}`
          )
        );
    }
  }

  // Eliminar un empleado por su ID
  async deleteEmpleado(req, res) {
    const idEmpleado = req.params.id;
    try {
      const numFilas = await Empleado.destroy({
        where: {
          id_empleado: idEmpleado,
        },
      });
      if (numFilas == 0) {
        // No se ha encontrado lo que se quería borrar
        res
          .status(404)
          .json(Respuesta.error(null, "Empleado no encontrado: " + idEmpleado));
      } else {
        res.status(200).json({ ok: true, mensaje: "Empleado eliminado correctamente" });
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  // Obtener un empleado por su ID
  async getEmpleadoById(req, res) {
    const idEmpleado = req.params.id;
    try {
      const fila = await Empleado.findByPk(idEmpleado);
      if (fila) {
        // Si se ha recuperado un empleado
        res.json(Respuesta.exito(fila, "Empleado recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Empleado no encontrado"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  // Actualizar un empleado por su ID
  async updateEmpleado(req, res) {
    const empleado = req.body; // Recuperamos datos para actualizar
    const idEmpleado = req.params.id; // dato de la ruta

    // Petición errónea, no coincide el id del empleado de la ruta con el del objeto a actualizar
    if (idEmpleado != empleado.id_empleado) {
      return res
        .status(400)
        .json(Respuesta.error(null, "El id del empleado no coincide"));
    }

    try {
      const numFilas = await Empleado.update({ ...empleado }, { where: { id_empleado: idEmpleado } });

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(Respuesta.error(null, "Empleado no encontrado o no modificado: " + idEmpleado));
      } else {
        res.status(200).json({ ok: true, mensaje: "Empleado actualizado correctamente" });
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar los datos: ${req.originalUrl}`
          )
        );
    }
  }
}

module.exports = new EmpleadoController();
