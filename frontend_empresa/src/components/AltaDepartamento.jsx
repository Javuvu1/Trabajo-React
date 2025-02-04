import { Typography, TextField, Stack, Button } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function AltaDepartamento() {
  const [datos, setDatos] = useState({
    nombre: "",
    ubicacion: "",
    presupuesto: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertimos presupuesto a número (float) si tiene valor
    const datosFinales = {
      ...datos,
      presupuesto: datos.presupuesto ? parseFloat(datos.presupuesto) : null,
    };

    try {
      const response = await fetch(`${apiUrl}/departamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFinales),
      });

      if (response.ok) {
        const respuesta = await response.json();
        alert(respuesta?.mensaje || "Departamento creado correctamente.");

        if (respuesta.ok) {
          navigate("/"); // Volver a la página principal
        }
      } else {
        alert("Error al crear el departamento.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de Departamento
      </Typography>
      <Grid2
        container
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid2 item xs={12} sm={6} md={4}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ mx: 2 }}
          >
            <TextField
              label="Nombre"
              variant="outlined"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              required
            />
            <TextField
              label="Ubicación"
              variant="outlined"
              name="ubicacion"
              value={datos.ubicacion}
              onChange={handleChange}
            />
            <TextField
              label="Presupuesto"
              variant="outlined"
              name="presupuesto"
              type="number"
              step="0.01"
              value={datos.presupuesto}
              onChange={handleChange}
            />
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  );
}

export default AltaDepartamento;
