import { Box, Typography } from "@mui/material";
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

function GraficaEmpleados() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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

  if (cargando) return <Typography variant="h6">Cargando gráfica...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        p: 4,
        height: "100vh"
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Empleados por Departamento
      </Typography>

      <BarChart
        width={800}
        height={500}
        data={datos}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="nombre"
          angle={-45}
          textAnchor="end"
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="cantidad"
          name="Número de empleados"
          fill="#1976D2"
          activeBar={<Rectangle fill="#82ca9d" stroke="#1976D2" />}
        />
      </BarChart>
    </Box>
  );
}

export default GraficaEmpleados;