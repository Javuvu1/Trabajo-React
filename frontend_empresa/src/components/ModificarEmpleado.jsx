import { Typography, TextField, Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

function ModificarEmpleado() {
  const { id_empleado } = useParams(); // Obtiene el ID del empleado desde la URL
  const navigate = useNavigate();

  // Estado para los datos del empleado
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    salario: "",
    fecha_contratacion: "",
    id_departamento: "",
  });

  // Estado para la lista de departamentos
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Obtener los departamentos
        const resDepartamentos = await fetch(`${apiUrl}/departamentos`);
        const dataDepartamentos = await resDepartamentos.json();
        setDepartamentos(dataDepartamentos.datos || []);

        // 2️⃣ Obtener los datos del empleado
        const resEmpleado = await fetch(`${apiUrl}/empleado/${id_empleado}`);
        console.log(`Fetching empleado from: ${apiUrl}/empleado/${id_empleado}`);  // Depuración de URL

        if (resEmpleado.ok) {
          const dataEmpleado = await resEmpleado.json();
          console.log("Empleado data:", dataEmpleado);  // Depuración de respuesta del servidor
          
          // Asegurarse de que los datos están en la estructura correcta
          if (dataEmpleado.datos) {
            setDatos({
              nombre: dataEmpleado.datos.nombre,
              email: dataEmpleado.datos.email,
              salario: dataEmpleado.datos.salario.toString(), // Convertir salario a string
              fecha_contratacion: dataEmpleado.datos.fecha_contratacion,
              id_departamento: dataEmpleado.datos.id_departamento,
            });
          } else {
            alert("Empleado no encontrado.");
            navigate("/listadoempleado");
          }
        } else {
          alert("Error: Empleado no encontrado.");
          navigate("/listadoempleado");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
      }
    }

    fetchData();
  }, [id_empleado, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosFinales = {
      ...datos,
      salario: datos.salario ? parseFloat(datos.salario) : null, // Asegúrate de que el salario sea un número válido
      id_departamento: datos.id_departamento ? parseInt(datos.id_departamento) : null, // ID del departamento como entero
    };

    try {
      const response = await fetch(`${apiUrl}/empleado/${id_empleado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFinales),
      });

      if (response.ok) {
        alert("Empleado actualizado correctamente.");
        navigate("/listadoempleado");
      } else {
        const errorData = await response.json();  // Obtener el cuerpo de la respuesta con el error
        alert(`Error al modificar el empleado: ${errorData.mensaje || "Error desconocido"}`);
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
        Modificar Empleado
      </Typography>
      <Grid2 container spacing={2} sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}>
        <Grid2 item xs={12} sm={6} md={4}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ mx: 2 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={datos.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Salario"
              variant="outlined"
              name="salario"
              type="number"
              step="0.01"
              value={datos.salario}
              onChange={handleChange}
            />
            <TextField
              label="Fecha de Contratación"
              variant="outlined"
              name="fecha_contratacion"
              type="date"
              value={datos.fecha_contratacion}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            {/* SELECT para seleccionar departamento */}
            <FormControl fullWidth>
              <InputLabel>Departamento</InputLabel>
              <Select
                name="id_departamento"
                value={datos.id_departamento || ""}
                onChange={handleChange}
                required
              >
                {departamentos.map((dep) => (
                  <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
                    {dep.nombre} {/* Muestra el nombre del departamento */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" type="submit">
              Guardar Cambios
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  );
}

export default ModificarEmpleado;
