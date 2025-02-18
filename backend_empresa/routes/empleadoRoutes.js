const express = require("express");
const router = express.Router(); // Importar operadores de Sequelize
const db = require("../models");
const Empleado = db.Empleado; // Aquí se mantiene como está
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize"); // Añade esta línea

// 🔹 Obtener cantidad de empleados por departamento (GET /api/empleado/grafica)
router.get('/grafica', async (req, res) => {
  try {
    const empleadosPorDepartamento = await Empleado.findAll({
      attributes: [
        [sequelize.col("departamento.nombre"), "nombre"], // Usar sequelize.col
        [sequelize.fn("COUNT", sequelize.col("id_empleado")), "cantidad"] // Usar sequelize.fn
      ],
      include: {
        model: db.Departamento,
        as: "departamento",
        attributes: []
      },
      group: ["departamento.nombre"],
      raw: true
    });
    res.json({ ok: true, datos: empleadosPorDepartamento });
  } catch (error) {
    console.error("Error al obtener datos de la gráfica:", error);
    res.status(500).json({ ok: false, mensaje: "Error al recuperar los datos" });
  }
});




// 🔹 Buscar empleados por nombre (GET /api/empleados/buscar?nombre=Juan)
router.get("/buscar", async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ mensaje: "Debe proporcionar un nombre." });
    }

    const empleados = await Empleado.findAll({
      where: {
        nombre: { [Op.like]: `%${nombre}%` }, // Búsqueda parcial
      },
      include: {
        model: db.Departamento, // Incluimos la relación con el modelo Departamento
        as: "departamento", // Aseguramos que el alias sea correcto
        attributes: ["nombre"], // Solo traemos el campo 'nombre' del departamento
      },
    });

    if (empleados.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron empleados." });
    }

    res.json({ datos: empleados });
  } catch (error) {
    console.error("Error al buscar empleados:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});


// 🔹 Obtener todos los empleados (GET /api/empleado)
router.get("/", async (req, res) => {
  try {
    console.log("Ruta GET /api/empleados llamada");
    const empleados = await Empleado.findAll({
      include: {
        model: db.Departamento, // Incluimos el modelo Departamento
        as: "departamento", // Alias de la relación
        attributes: ["nombre"], // Solo traemos el nombre del departamento
      },
    });
    console.log(empleados); // Verifica los resultados obtenidos
    res.json({ ok: true, datos: empleados });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    res.status(500).json({ ok: false, mensaje: "Error al recuperar los datos" });
  }
});


// 🔹 Obtener un empleado por ID (GET /api/empleado/:id)
router.get("/:id", async (req, res) => {
  try {
    console.log("Ruta GET /api/empleado/:id llamada");
    const id = req.params.id;
    const resultado = await Empleado.findByPk(id);

    if (!resultado) {
      return res.status(404).json({ ok: false, mensaje: "Empleado no encontrado" });
    }

    res.json({ ok: true, datos: resultado });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ ok: false, mensaje: "Error al recuperar los datos" });
  }
});

// 🔹 Crear un nuevo empleado (POST /api/empleado)
router.post("/", async (req, res) => {
  try {
    console.log("Ruta POST /api/empleado llamada");

    const { nombre, email, salario, fecha_contratacion, id_departamento } = req.body;

    // Verificar que los campos obligatorios estén presentes
    if (!nombre || !email || !fecha_contratacion) {
      return res.status(400).json({
        ok: false,
        mensaje: "Los campos nombre, email y fecha_contratacion son obligatorios",
      });
    }

    // Validar formato de la fecha de contratación
    const fechaContratacion = new Date(fecha_contratacion);
    if (isNaN(fechaContratacion.getTime())) {
      return res.status(400).json({ ok: false, mensaje: "Fecha de contratación inválida" });
    }

    // Crear el nuevo empleado
    const nuevoEmpleado = await Empleado.create({
      nombre,
      email,
      salario,
      fecha_contratacion: fechaContratacion,  // Asegurarse de que la fecha esté en formato adecuado
      id_departamento,
    });

    res.status(201).json({ ok: true, mensaje: "Empleado creado correctamente", datos: nuevoEmpleado });

  } catch (error) {
    console.error("Error al crear el empleado:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el empleado",
      error: error.message,
    });
  }
});

// 🔹 Actualizar un empleado por ID (PUT /api/empleado/:id)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, salario, fecha_contratacion, id_departamento } = req.body;

    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ ok: false, mensaje: "Empleado no encontrado" });
    }

    // Validar formato de la fecha de contratación
    const fechaContratacion = new Date(fecha_contratacion);
    if (isNaN(fechaContratacion.getTime())) {
      return res.status(400).json({ ok: false, mensaje: "Fecha de contratación inválida" });
    }

    // Actualizar los datos
    await empleado.update({
      nombre,
      email,
      salario,
      fecha_contratacion: fechaContratacion,
      id_departamento,
    });

    res.json({ ok: true, datos: empleado });
  } catch (error) {
    console.error("Error al actualizar el empleado:", error);
    res.status(500).json({ ok: false, mensaje: "Error al actualizar el empleado" });
  }
});

// 🔹 Eliminar un empleado por ID (DELETE /api/empleado/:id)
router.delete("/:id", async (req, res) => {
  try {
    console.log("Ruta DELETE /api/empleado/:id llamada");
    const id = req.params.id;

    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ ok: false, mensaje: "Empleado no encontrado" });
    }

    await empleado.destroy();
    res.json({ ok: true, mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el empleado:", error);
    res.status(500).json({ ok: false, mensaje: "Error al eliminar el empleado" });
  }
});

module.exports = router;
