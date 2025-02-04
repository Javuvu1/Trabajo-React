import { Typography, TextField, Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function AltaEmpleado() {
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    salario: "",
    fecha_contratacion: "",
    id_departamento: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [errorSalario, setErrorSalario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDepartamentos() {
      try {
        const response = await fetch(`${apiUrl}/departamentos`);
        if (response.ok) {
          const data = await response.json();
          setDepartamentos(data.datos);
        } else {
          alert("Error al cargar los departamentos.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
      }
    }

    fetchDepartamentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (datos.salario < 2000) {
      alert("El salario no puede ser menor a 2000");
      return;
    }

    const datosFinales = {
      ...datos,
      salario: datos.salario ? parseFloat(datos.salario) : 0,
      id_departamento: datos.id_departamento ? parseInt(datos.id_departamento) : 0,
    };

    console.log("Enviando datos:", datosFinales);

    try {
      const response = await fetch(`${apiUrl}/empleado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFinales),
      });

      const respuesta = await response.json();
      console.log("Respuesta del servidor:", respuesta);

      if (response.ok) {
        alert(respuesta?.mensaje || "Empleado creado correctamente.");
        if (respuesta.ok) {
          navigate("/listadoempleado");
        }
      } else {
        alert(respuesta?.mensaje || "Error al crear el empleado.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });

    if (name === "salario") {
      if (value < 2000) {
        setErrorSalario("El salario no puede ser menor a 2000");
      } else {
        setErrorSalario("");
      }
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de Empleado
      </Typography>
      <Grid2 container spacing={2} sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}>
        <Grid2 item xs={12} sm={6} md={4}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ mx: 2 }}>
            <TextField label="Nombre" variant="outlined" name="nombre" value={datos.nombre} onChange={handleChange} required />
            <TextField label="Email" variant="outlined" name="email" value={datos.email} onChange={handleChange} required />
            <TextField label="Salario" variant="outlined" name="salario" type="number" step="0.01" value={datos.salario} onChange={handleChange} required />
            {errorSalario && <Typography color="error">{errorSalario}</Typography>}
            <TextField label="Fecha de Contratación" variant="outlined" name="fecha_contratacion" type="date" value={datos.fecha_contratacion} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            <FormControl>
              <InputLabel>Departamento</InputLabel>
              <Select name="id_departamento" value={datos.id_departamento} onChange={handleChange} required>
                {departamentos.map((dep) => (
                  <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
                    {dep.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  );
}

export default AltaEmpleado;
