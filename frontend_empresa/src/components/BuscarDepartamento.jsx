import { useState } from "react";
import { TextField, Button, Typography, Grid2 } from "@mui/material";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function BuscarDepartamento() {
  const [nombre, setNombre] = useState("");
  const [idDepartamento, setIdDepartamento] = useState(""); // Nuevo estado para buscar por ID
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Buscar por nombre
  const handleBuscarPorNombre = async () => {
    setError("");
    setResultado(null);

    if (!nombre.trim()) {
      setError("Por favor, ingrese un nombre de departamento.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/departamentos/buscar?nombre=${encodeURIComponent(nombre)}`);
      const data = await response.json();

      if (response.ok && data.datos && data.datos.length > 0) {
        setResultado(data.datos[0]); // Tomar el primer resultado encontrado
      } else {
        setError(data.mensaje || "No se encontró ningún departamento con ese nombre.");
      }
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  // Buscar por ID
  const handleBuscarPorId = async () => {
    setError("");
    setResultado(null);

    if (!idDepartamento.trim()) {
      setError("Por favor, ingrese un ID de departamento.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/departamentos/${idDepartamento}`);
      const data = await response.json();

      if (response.ok && data.datos) {
        setResultado(data.datos);
      } else {
        setError(data.mensaje || "No se encontró ningún departamento con ese ID.");
      }
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  // Redirigir a la pantalla de modificación si se encuentra el departamento
  const handleModificar = () => {
    if (resultado?.id_departamento) {
      navigate(`/modificardepartamento/${resultado.id_departamento}`);
    }
  };

  return (
    <Grid2 container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
      <Grid2 item xs={12} sm={8} md={6}>
        <Typography variant="h5" align="center">Buscar Departamento</Typography>

        {/* Búsqueda por Nombre */}
        <TextField
          fullWidth
          label="Nombre del Departamento"
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
          label="ID del Departamento"
          variant="outlined"
          value={idDepartamento}
          onChange={(e) => setIdDepartamento(e.target.value)}
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
        {resultado && (
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            <Grid2 item xs={12}>
              <Typography variant="h6">Departamento encontrado:</Typography>
              <Typography><strong>Nombre:</strong> {resultado.nombre}</Typography>
              <Typography><strong>Ubicación:</strong> {resultado.ubicacion}</Typography>
              <Typography><strong>Presupuesto:</strong> ${resultado.presupuesto}</Typography>
              <Typography><strong>Fecha de Creación:</strong> {new Date(resultado.fecha_creacion).toLocaleDateString()}</Typography>
            </Grid2>
            <Grid2 item xs={12}>
              <Button fullWidth variant="outlined" onClick={handleModificar}>
                Modificar Departamento
              </Button>
            </Grid2>
          </Grid2>
        )}
      </Grid2>
    </Grid2>
  );
}

export default BuscarDepartamento;
