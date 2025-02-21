import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid2 from "@mui/material/Grid2";
import { Typography, Box, CircularProgress, Alert, Button } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

function ListadoEmpleado() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getempleado() {
      try {
        const response = await fetch(`${apiUrl}/empleado`);

        if (!response.ok) {
          throw new Error("Error al obtener empleados");
        }

        const data = await response.json();

        if (data.datos) {
          setRows(data.datos);
        } else {
          setError("No se encontraron empleados");
        }

        setLoading(false);
      } catch (error) {
        setError("Hubo un error al cargar los empleados.");
        setLoading(false);
        console.error("Error en la carga de empleados:", error);
      }
    }

    getempleado();
  }, []);

  const handleDelete = async (idEmpleado) => {
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este empleado?");
    if (!confirmation) return;

    try {
      const response = await fetch(`${apiUrl}/empleado/${idEmpleado}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar empleado");
      }

      setRows((rows) => rows.filter((empleado) => empleado.id_empleado !== idEmpleado));
    } catch (error) {
      console.error("Error eliminando empleado:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Listado de Empleados</Typography>

      <Grid2 container justifyContent="center">
        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info">No hay empleados disponibles.</Alert>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table aria-label="simple table">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell align="right" sx={{ color: 'white' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Salario</TableCell>
                  <TableCell sx={{ color: 'white' }}>Fecha Contratación</TableCell>
                  <TableCell sx={{ color: 'white' }}>Departamento</TableCell>
                  <TableCell align="center" sx={{ color: 'white' }}>Eliminar</TableCell>
                  <TableCell align="center" sx={{ color: 'white' }}>Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id_empleado}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell align="right">{row.id_empleado}</TableCell>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.salario} €</TableCell>
                    <TableCell>{new Date(row.fecha_contratacion).toLocaleDateString()}</TableCell>
                    <TableCell>{row.departamento?.nombre || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(row.id_empleado)}
                        color="error"
                        size="small"
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/modificarempleado/${row.id_empleado}`)}
                        color="primary"
                        size="small"
                      >
                        <EditNoteIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid2>
    </Box>
  );
}

export default ListadoEmpleado;
