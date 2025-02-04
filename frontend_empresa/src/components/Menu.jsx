import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function Menu() {
  const [openBasic, setOpenBasic] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Cargar desde localStorage
  });

  // Efecto para aplicar el tema al cargar la página
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    }
    localStorage.setItem("darkMode", darkMode); // Guardar preferencia en localStorage
  }, [darkMode]);

  return (
    <MDBNavbar expand="lg" light={!darkMode} dark={darkMode} bgColor={darkMode ? "dark" : "light"}>
      <MDBContainer fluid>
        <MDBNavbarBrand href="#">
          <DeviceHubIcon fontSize="large" sx={{ marginRight: 1 }} />
          Software Tremendo Inc
        </MDBNavbarBrand>

        {/* Botón para activar/desactivar modo oscuro */}
        <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ ml: 2 }}>
          {darkMode ? <LightModeIcon sx={{ color: "yellow" }} /> : <DarkModeIcon />}
        </IconButton>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openBasic}>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
            {/* Menú de Departamentos */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag="a" className="nav-link" role="button">
                  Departamentos
                </MDBDropdownToggle>
                <MDBDropdownMenu style={{ backgroundColor: darkMode ? "#333" : "white" }}>
                  <Link to="/altadepartamento" style={{ color: darkMode ? "white" : "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Alta de Departamentos</MDBDropdownItem>
                  </Link>
                  <Link to="/listadodepartamentos" style={{ color: darkMode ? "white" : "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Listado de Departamentos</MDBDropdownItem>
                  </Link>
                  <Link to="/buscardepartamento" style={{ color: darkMode ? "white" : "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Buscar Departamento</MDBDropdownItem>
                  </Link>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Menú de Empleados */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag="a" className="nav-link" role="button">
                  Empleados
                </MDBDropdownToggle>
                <MDBDropdownMenu style={{ backgroundColor: darkMode ? "#333" : "white" }}>
                  <Link to="/altaempleado" style={{ color: darkMode ? "white" : "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Alta de Empleados</MDBDropdownItem>
                  </Link>
                  <Link to="/listadoempleado" style={{ color: darkMode ? "white" : "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Listado de Empleado</MDBDropdownItem>
                  </Link>
                  <Link to="/buscarempleado" style={{ color: darkMode ? "white" : "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Buscar Empleado</MDBDropdownItem>
                  </Link>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Menu;
