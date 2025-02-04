import { useState } from "react";
import { TextField, Button, Typography, Grid2, Card, CardContent, CardActions } from "@mui/material";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function BuscarEmpleado() {
  const [nombre, setNombre] = useState("");
  const [idEmpleado, setIdEmpleado] = useState(""); // Nuevo estado para buscar por ID
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Buscar por nombre
  const handleBuscarPorNombre = async () => {
    setError("");
    setResultados([]);

    if (!nombre.trim()) {
      setError("Por favor, ingrese un nombre de empleado.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/empleado/buscar?nombre=${encodeURIComponent(nombre)}`);
      const data = await response.json();

      if (response.ok && data.datos && data.datos.length > 0) {
        setResultados(data.datos);
      } else {
        setError(data.mensaje || "No se encontró ningún empleado con ese nombre.");
      }
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  // Buscar por ID
  const handleBuscarPorId = async () => {
    setError("");
    setResultados([]);

    if (!idEmpleado.trim()) {
      setError("Por favor, ingrese un ID de empleado.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/empleado/${idEmpleado}`);
      const data = await response.json();

      if (response.ok && data.datos) {
        setResultados([data.datos]); // Convertimos el objeto en array para reusar el mismo renderizado
      } else {
        setError(data.mensaje || "No se encontró ningún empleado con ese ID.");
      }
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  // Redirigir a la pantalla de modificación
  const handleModificar = (id) => {
    navigate(`/modificarempleado/${id}`);
  };

  // Eliminar un empleado
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este empleado?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${apiUrl}/empleado/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setResultados(resultados.filter((empleado) => empleado.id_empleado !== id));
        alert("Empleado eliminado correctamente.");
      } else {
        setError(data.mensaje || "No se pudo eliminar al empleado.");
      }
    } catch (err) {
      console.error("Error al eliminar el empleado:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <Grid2 container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
      <Grid2 item xs={12} sm={8} md={6}>
        <Typography variant="h5" align="center">Buscar Empleado</Typography>

        {/* Búsqueda por Nombre */}
        <TextField
          fullWidth
          label="Nombre del Empleado"
          variant="outlined"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button fullWidth variant="contained" onClick={handleBuscarPorNombre} sx={{ mt: 2 }}>
          Buscar por Nombre
        </Button>

        {/* Búsqueda por ID */}
        <TextField
          fullWidth
          label="ID del Empleado"
          variant="outlined"
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button fullWidth variant="contained" color="secondary" onClick={handleBuscarPorId} sx={{ mt: 2 }}>
          Buscar por ID
        </Button>

        {/* Muestra errores */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* Mostrar Resultados */}
        {resultados.length > 0 ? (
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {resultados.map((empleado) => (
              <Grid2 item xs={12} sm={6} md={4} key={empleado.id_empleado}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{empleado.nombre}</Typography>
                    <Typography><strong>Email:</strong> {empleado.email}</Typography>
                    <Typography><strong>Salario:</strong> ${empleado.salario}</Typography>
                    <Typography><strong>Fecha de Contratación:</strong> {new Date(empleado.fecha_contratacion).toLocaleDateString()}</Typography>
                    <Typography><strong>Departamento:</strong> {empleado.departamento?.nombre || 'N/A'}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="outlined" onClick={() => handleModificar(empleado.id_empleado)}>
                      Modificar
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleEliminar(empleado.id_empleado)}>
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Typography color="textSecondary" sx={{ mt: 2 }}>
            No se encontraron empleados con los criterios de búsqueda.
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
}

export default BuscarEmpleado;
