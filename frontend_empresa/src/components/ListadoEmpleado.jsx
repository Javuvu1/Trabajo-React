import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid2 from "@mui/material/Grid2";
import { Typography, Box, Button, CircularProgress, Alert } from "@mui/material";
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

        // Verificar qué estructura tiene el objeto 'data' que devuelve la API
        console.log("Respuesta de la API:", data);

        // Asegurarnos de que la propiedad 'datos' existe
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

      // Filtramos la lista para eliminar el empleado borrado
      setRows((rows) => rows.filter((empleado) => empleado.id_empleado !== idEmpleado));
    } catch (error) {
      console.error("Error eliminando empleado:", error);
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Listado de Empleados
      </Typography>

      <Grid2 sm={12} md={6} lg={4} mx={4}>
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
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">ID EMPLEADO</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell>CORREO</TableCell>
                  <TableCell>SALARIO</TableCell>
                  <TableCell>FECHA DE CONTRATACIÓN</TableCell>
                  <TableCell>DEPARTAMENTO</TableCell>
                  <TableCell align="center">ELIMINAR</TableCell>
                  <TableCell align="center">EDITAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id_empleado}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{row.id_empleado}</TableCell>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.salario} €</TableCell>
                    <TableCell>{row.fecha_contratacion}</TableCell>
                    <TableCell>{row.departamento?.nombre || 'N/A'}</TableCell> {/* Aquí cambiamos a row.departamento.nombre */}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(row.id_empleado)}
                        color="error"
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/modificarempleado/${row.id_empleado}`)}
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
    </>
  );
}

export default ListadoEmpleado;
