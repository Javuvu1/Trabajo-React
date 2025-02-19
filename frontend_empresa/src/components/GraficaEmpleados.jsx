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
import generatePDF from "../utils/GeneratePDF";

function GraficaEmpleados() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Función para manejar la generación del PDF
  const handleGenerarPDF = () => {
    generatePDF('pdf-content', 'grafica-empleados')
      .catch(err => setError("Error al generar el PDF: " + err.message));
  };

  // Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/empleado/grafica');
        if (!response.ok) throw new Error('Error al obtener datos');
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

  // Estados de carga y error
  if (cargando) return <Typography variant="h6" sx={{ p: 3 }}>Cargando gráfica...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Error: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Botón para generar PDF */}
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleGenerarPDF}
        sx={{ mb: 3 }}
        startIcon={<i className="fas fa-file-pdf"></i>}
      >
        Exportar a PDF
      </Button>

      {/* Contenedor de la gráfica */}
      <Box
        id="pdf-content"
        sx={{
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: '1000px',
          mx: 'auto'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
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
            bottom: 60, // Más espacio para etiquetas rotadas
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            interval={0} // Muestra todas las etiquetas
          />
          <YAxis />
          <Tooltip />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px' // Espacio para la leyenda
            }}
          />
          <Bar
            dataKey="cantidad"
            name="Número de empleados"
            fill="#1976D2" // Color principal de Material-UI
            activeBar={<Rectangle fill="#82ca9d" stroke="#1976D2" />} // Efecto hover
            radius={[4, 4, 0, 0]} // Esquinas redondeadas
          />
        </BarChart>

        <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
          Actualizado: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default GraficaEmpleados;