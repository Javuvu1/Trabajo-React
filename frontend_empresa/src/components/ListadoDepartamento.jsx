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
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DepartamentoReport from "../reports/DepartamentoReport";

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

  // (a) Imprimir con el navegador
  const handlePrint = () => {
    window.print();
  };

  // (b) Exportar a PDF desde la imagen del listado (jsPDF + html2canvas)
  const handleGeneratePDF = async () => {
    const input = document.getElementById("pdf-listado");

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const imgWidth = 280; // Ajuste para página horizontal
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(18);
      pdf.text("Listado de Departamentos", 15, 15);
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      pdf.save("listado-departamentos.pdf");
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, mx: 4 }}>
        <Typography variant="h4">Listado de Departamentos</Typography>
        <Box>
          {/* Botón para imprimir con window.print() */}
          <Button variant="contained" color="secondary" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ mr: 1 }}>
            Imprimir
          </Button>

          {/* Botón para exportar a PDF (imagen) */}
          <Button variant="contained" color="primary" onClick={handleGeneratePDF} startIcon={<PictureAsPdfIcon />} sx={{ mr: 1 }}>
            Exportar PDF
          </Button>

          {/* Botón para exportar a PDF con diseño usando react-pdf */}
          <PDFDownloadLink document={<DepartamentoReport departamentos={rows} />} fileName="reporte-departamentos.pdf">
            {({ loading }) => (
              <Button variant="contained" color="success" startIcon={<PictureAsPdfIcon />} sx={{ mr: 1 }}>
                {loading ? "Generando PDF..." : "Exportar PDF (Diseñado)"}
              </Button>
            )}
          </PDFDownloadLink>
        </Box>
      </Box>

      <Grid2 sm={12} md={6} lg={4} mx={4}>
        <TableContainer component={Paper} sx={{ mt: 2 }} id="pdf-listado">
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
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => handleDelete(row.id_departamento)} color="error">
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
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
