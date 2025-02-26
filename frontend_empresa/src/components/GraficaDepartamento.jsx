import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { apiUrl } from "../config"; // Asegúrate de que la ruta de la API esté correctamente configurada

const GraficaDepartamento = () => {
  const [chartData, setChartData] = useState([]); // Datos para la gráfica
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Colores para los segmentos de la gráfica
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF0080", "#00FF00", "#FF0000"];

  // Función para obtener los datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/departamentos/grafica`); // Ruta del backend
        if (!response.ok) throw new Error("Error al obtener los datos");

        const result = await response.json();

        // Verificar si la respuesta es exitosa y tiene datos
        if (result.ok && result.datos) {
          // Convertir los presupuestos de string a número
          const formattedData = result.datos.map((item) => ({
            ...item,
            presupuesto: parseFloat(item.presupuesto), // Convertir a número
          }));

          setChartData(formattedData); // Guardar los datos formateados
        } else {
          throw new Error("Datos no disponibles");
        }
      } catch (err) {
        setError(err.message); // Manejar errores
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchData();
  }, []);

  // Mostrar un spinner mientras se cargan los datos
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar un mensaje de error si algo falla
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Distribución de Presupuestos por Departamento
      </Typography>

      <Paper elevation={3} sx={{ p: 3, height: "600px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Gráfica circular */}
            <Pie
              data={chartData}
              dataKey="presupuesto" // Usa el presupuesto como valor
              nameKey="nombre" // Usa el nombre del departamento como etiqueta
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ nombre, presupuesto }) => `${nombre}: €${presupuesto.toLocaleString()}`} // Etiqueta personalizada
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // Colores personalizados
              ))}
            </Pie>

            {/* Leyenda */}
            <Legend
              formatter={(value) => {
                const item = chartData.find((d) => d.nombre === value);
                return `${value} (€${item.presupuesto.toLocaleString()})`;
              }}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => `€${value.toLocaleString()}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default GraficaDepartamento;