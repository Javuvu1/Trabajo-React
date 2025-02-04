// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo departamento
const Departamento = models.departamentos;

class DepartamentoController {
  // Crear un nuevo departamento
  async createDepartamento(req, res) {
    const departamento = req.body;

    try {
      const departamentoNuevo = await Departamento.create(departamento);
      res.status(201).json({ ok: true, mensaje: "Departamento insertado", datos: departamentoNuevo });
      console.log("Departamento insertado:", departamentoNuevo);
          } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear un departamento nuevo: ${departamento}`));
    }
  }

  // Recuperar todos los departamentos
  async getAllDepartamento(req, res) {
    try {
      const data = await Departamento.findAll(); // Recuperar todos los departamentos
      res.json(Respuesta.exito(data, "Datos de departamentos recuperados"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los departamentos: ${req.originalUrl}`
          )
        );
    }
  }

  // Eliminar un departamento por su ID
  async deleteDepartamento(req, res) {
    const iddepartamento = req.params.iddepartamento;
    try {
      const numFilas = await Departamento.destroy({
        where: {
          iddepartamento: iddepartamento,
        },
      });
      if (numFilas == 0) {
        // No se ha encontrado lo que se quería borrar
        res
          .status(404)
          .json(Respuesta.error(null, "No encontrado: " + iddepartamento));
      } else {
        res.status(200).json({ ok: true, mensaje: "Departamento eliminado correctamente" });
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

  // Obtener un departamento por su ID
  async getDepartamentoById(req, res) {
    const iddepartamento = req.params.iddepartamento;
    try {
      const fila = await Departamento.findByPk(iddepartamento);
      if (fila) {
        // Si se ha recuperado un departamento
        res.json(Respuesta.exito(fila, "Departamento recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Departamento no encontrado"));
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

  // Actualizar un departamento por su ID
  async updateDepartamento(req, res) {
    const departamento = req.body; // Recuperamos datos para actualizar
    const iddepartamento = req.params.iddepartamento; // dato de la ruta

    // Petición errónea, no coincide el id del departamento de la ruta con el del objeto a actualizar
    if (iddepartamento != departamento.iddepartamento) {
      return res
        .status(400)
        .json(Respuesta.error(null, "El id del departamento no coincide"));
    }

    try {
      const numFilas = await Departamento.update({ ...departamento }, { where: { iddepartamento } });

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(Respuesta.error(null, "No encontrado o no modificado: " + iddepartamento));
      } else {
        res.status(200).json({ ok: true, mensaje: "Departamento actualizado correctamente" });
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

module.exports = new DepartamentoController();
