import { Typography, TextField, Stack, Button } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

function ModificarDepartamento() {
  const { id_departamento } = useParams();
  const navigate = useNavigate();

  // Estado para almacenar los datos del departamento
  const [datos, setDatos] = useState({
    nombre: "",
    ubicacion: "",
    presupuesto: "",
    fecha_creacion: "", // Ahora será editable
  });

  // Cargar los datos del departamento al montar el componente
  useEffect(() => {
    async function fetchDepartamento() {
      try {
        const response = await fetch(`${apiUrl}/departamentos/${id_departamento}`);
        if (response.ok) {
          const data = await response.json();
          if (data.datos) {
            // Convertir la fecha a formato YYYY-MM-DD para el input tipo "date"
            const fechaFormateada = data.datos.fecha_creacion
              ? new Date(data.datos.fecha_creacion).toISOString().split("T")[0]
              : "";

            setDatos({
              ...data.datos,
              fecha_creacion: fechaFormateada, // Asignar fecha formateada
            });
          } else {
            alert("Departamento no encontrado.");
            navigate("/");
          }
        } else {
          const errorData = await response.json();
          alert(errorData?.mensaje || "Error al cargar los datos.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
        navigate("/");
      }
    }

    if (id_departamento) {
      fetchDepartamento();
    }
  }, [id_departamento, navigate]);

  // Enviar los datos modificados al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosFinales = {
      ...datos,
      presupuesto: datos.presupuesto ? parseFloat(datos.presupuesto) : null,
    };

    try {
      const response = await fetch(`${apiUrl}/departamentos/${id_departamento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFinales),
      });

      if (response.ok) {
        const respuesta = await response.json();
        alert(respuesta?.mensaje || "Departamento actualizado correctamente.");
        if (respuesta.ok) {
          navigate(-1);
        }
      } else {
        const errorData = await response.json();
        alert(errorData?.mensaje || "Error al actualizar el departamento.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Modificar Departamento
      </Typography>
      <Grid2 container spacing={2} sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}>
        <Grid2 item xs={12} sm={6} md={4}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ mx: 2 }}>
            <TextField label="Nombre" name="nombre" value={datos.nombre} onChange={handleChange} required />
            <TextField label="Ubicación" name="ubicacion" value={datos.ubicacion} onChange={handleChange} />
            <TextField label="Presupuesto" name="presupuesto" type="number" step="0.01" value={datos.presupuesto} onChange={handleChange} />
            <TextField
              label="Fecha de Creación"
              name="fecha_creacion"
              type="date" // Ahora es un input de tipo fecha
              value={datos.fecha_creacion}
              onChange={handleChange}
            />
            <Button variant="contained" type="submit">Guardar Cambios</Button>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  );
}

export default ModificarDepartamento;
