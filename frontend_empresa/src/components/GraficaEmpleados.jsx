import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function GraficaEmpleados() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/empleado/grafica");
        if (!response.ok) throw new Error("Error al obtener datos");
        const { datos } = await response.json();
        setDatos(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  // Función para generar PDF
  const handleGenerarPDF = async () => {
    const input = document.getElementById("pdf-content");

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("landscape");
      const imgWidth = 280; // Ajustado para página horizontal
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(18);
      pdf.text("Distribución de Empleados por Departamento", 15, 15);
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      pdf.save("grafica-empleados.pdf");
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  // Estados de carga y error
  if (cargando) return <Typography variant="h6" sx={{ p: 3 }}>Cargando gráfica...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Error: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Botón para exportar a PDF */}
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleGenerarPDF}
        sx={{ mb: 3 }}
      >
        Exportar a PDF
      </Button>

      {/* Contenedor de la gráfica */}
      <Box
        id="pdf-content"
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
          Distribución de Empleados por Departamento
        </Typography>

        <BarChart
          width={900}
          height={500}
          data={datos}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="cantidad"
            name="Número de empleados"
            fill="#1976D2"
            activeBar={<Rectangle fill="#82ca9d" stroke="#1976D2" />}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>

        <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: "center" }}>
          Actualizado: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default GraficaEmpleados;
