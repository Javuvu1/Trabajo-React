const express = require("express");
const router = express.Router();
const db = require("../models");
const Departamento = db.Departamento;
const { Op } = require("sequelize");


// 🔹 Buscar un departamento por nombre (GET /api/departamentos/buscar?nombre=xxx)
router.get("/buscar", async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ mensaje: "Debe proporcionar un nombre." });
    }

    const departamentos = await Departamento.findAll({
      where: {
        nombre: { [Op.like]: `%${nombre}%` }, // Búsqueda parcial
      },
    });

    if (departamentos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron departamentos." });
    }

    res.json({ datos: departamentos });
  } catch (error) {
    console.error("Error al buscar departamentos:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});



// 🔹 Obtener todos los departamentos (GET /api/departamentos)
router.get("/", async (req, res) => {
  try {
    console.log("Ruta GET /api/departamentos llamada");
    const departamentos = await Departamento.findAll();
    res.json({ ok: true, datos: departamentos });
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
    res.status(500).json({ ok: false, mensaje: "Error al recuperar los datos" });
  }
});

// 🔹 Obtener un departamento por ID (GET /api/departamentos/:id)
router.get("/:id", async (req, res) => {
  try {
    console.log("Ruta GET /api/departamentos/:id llamada");
    const id = req.params.id;
    const resultado = await Departamento.findByPk(id);

    if (!resultado) {
      return res.status(404).json({ ok: false, mensaje: "Departamento no encontrado" });
    }

    res.json({ ok: true, datos: resultado });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ ok: false, mensaje: "Error al recuperar los datos" });
  }
});

// 🔹 Crear un nuevo departamento (POST /api/departamentos)
router.post("/", async (req, res) => {
  try {
    console.log("Ruta POST /api/departamentos llamada");
    const { nombre, ubicacion, presupuesto } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio" });
    }

    const nuevoDepartamento = await Departamento.create({
      nombre,
      ubicacion,
      presupuesto,
    });

    res.status(201).json({ ok: true, datos: nuevoDepartamento });
  } catch (error) {
    console.error("Error al crear el departamento:", error);
    res.status(500).json({ ok: false, mensaje: "Error al crear el departamento" });
  }
});

// 🔹 Actualizar un departamento por ID (PUT /api/departamentos/:id)
router.put("/:id", async (req, res) => {
  try {
    console.log("Ruta PUT /api/departamentos/:id llamada");
    const id = req.params.id;
    const { nombre, ubicacion, presupuesto } = req.body;

    const departamento = await Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ ok: false, mensaje: "Departamento no encontrado" });
    }

    await departamento.update({
      nombre: nombre || departamento.nombre,
      ubicacion: ubicacion || departamento.ubicacion,
      presupuesto: presupuesto || departamento.presupuesto,
    });

    res.json({ ok: true, datos: departamento });
  } catch (error) {
    console.error("Error al actualizar el departamento:", error);
    res.status(500).json({ ok: false, mensaje: "Error al actualizar el departamento" });
  }
});

// 🔹 Eliminar un departamento por ID (DELETE /api/departamentos/:id)
router.delete("/:id", async (req, res) => {
  try {
    console.log("Ruta DELETE /api/departamentos/:id llamada");
    const id = req.params.id;

    const departamento = await Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ ok: false, mensaje: "Departamento no encontrado" });
    }

    await departamento.destroy();
    res.json({ ok: true, mensaje: "Departamento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el departamento:", error);
    res.status(500).json({ ok: false, mensaje: "Error al eliminar el departamento" });
  }
});



module.exports = router;
