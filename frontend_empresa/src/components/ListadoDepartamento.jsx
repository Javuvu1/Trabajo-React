import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Grid2 from "@mui/material/Grid2";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import { generateDepartmentPDF } from "../utils/GeneratePDF";

function ListadoDepartamento() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getDepartamentos() {
      let response = await fetch(apiUrl + "/departamentos");
      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }
    getDepartamentos();
  }, []);

  const handleDelete = async (idDepartamento) => {
    let response = await fetch(apiUrl + "/departamentos/" + idDepartamento, {
      method: "DELETE",
    });
    if (response.ok) {
      setRows(rows.filter((departamento) => departamento.id_departamento !== idDepartamento));
    }
  };

  const handleGeneratePDF = () => {
    const columns = [
      "ID Departamento",
      "Nombre",
      "Ubicación", 
      "Presupuesto",
      "Fecha de Creación"
    ];
    
    const rowsData = rows.map(departamento => [
      departamento.id_departamento,
      departamento.nombre,
      departamento.ubicacion,
      `${departamento.presupuesto} €`,
      new Date(departamento.fecha_creacion).toLocaleDateString("es-ES")
    ]);

    generateDepartmentPDF(columns, rowsData);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mx: 4 }}>
        <Typography variant="h4">Listado de Departamentos</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleGeneratePDF}
          startIcon={<i className="fas fa-file-pdf"></i>}
        >
          Exportar a PDF
        </Button>
      </Box>

      <Grid2 sm={12} md={6} lg={4} mx={4}>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">ID DEPARTAMENTO</TableCell>
                <TableCell>NOMBRE</TableCell>
                <TableCell>UBICACIÓN</TableCell>
                <TableCell align="right">PRESUPUESTO</TableCell>
                <TableCell align="right">FECHA DE CREACIÓN</TableCell>
                <TableCell align="center">ELIMINAR</TableCell>
                <TableCell align="center">EDITAR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id_departamento} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="right">{row.id_departamento}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell align="right">{row.presupuesto + " €"}</TableCell>
                  <TableCell align="right">{new Date(row.fecha_creacion).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleDelete(row.id_departamento)} color="error">
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => navigate("/modificardepartamento/" + row.id_departamento)}>
                      <EditNoteIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>
    </>
  );
}

export default ListadoDepartamento;
