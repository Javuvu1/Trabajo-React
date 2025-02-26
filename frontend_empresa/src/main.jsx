import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './pages/Home';
import ListadoDepartamento from './components/ListadoDepartamento';
import ModificarDepartamento from './components/ModificarDepartamento';
import AltaDepartamento from './components/AltaDepartamento';
import BuscarDepartamento from './components/BuscarDepartamento';
import ListadoEmpleado from './components/ListadoEmpleado';
import ModificarEmpleado from './components/ModificarEmpleado';
import AltaEmpleado from './components/AltaEmpleado';
import BuscarEmpleado from './components/BuscarEmpleado';
import GraficaEmpleados from './components/GraficaEmpleados';
import GraficaDepartamento from './components/GraficaDepartamento';

import PaginaError from './pages/PaginaError';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PaginaError />,
    children: [
      {
        path: "listadodepartamentos",
        element: <ListadoDepartamento />,
      },
      {
        path: "altadepartamento",
        element: <AltaDepartamento />,
      },
      {
        path: "modificardepartamento/:id_departamento",
        element: <ModificarDepartamento />,
      },
      {
        path: "buscardepartamento",
        element: <BuscarDepartamento />,
      },
      {
        path: "listadoempleado",
        element: <ListadoEmpleado />,
      },
      {
        path: "graficadepartamento",
        element: <GraficaDepartamento />,
      },
      {
        path: "altaempleado",
        element: <AltaEmpleado />,
      },
      {
        path: "modificarempleado/:id_empleado",
        element: <ModificarEmpleado />,
      },
      {
        path: "buscarempleado",
        element: <BuscarEmpleado />,
      },
      {
        path: "graficaempleados",
        element: <GraficaEmpleados />,
      }
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
