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
import { useState } from "react";
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { Link } from "react-router-dom"; 

function Menu() {
  const [openBasic, setOpenBasic] = useState(false);

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid>
        <MDBNavbarBrand href="#">
          <DeviceHubIcon fontSize="large" sx={{ marginRight: 1 }} />
          Software Tremendo Inc
        </MDBNavbarBrand>

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
                <MDBDropdownMenu>
                  <Link to="/altadepartamento" style={{ color: "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Alta de Departamentos</MDBDropdownItem>
                  </Link>
                  <Link to="/listadodepartamentos" style={{ color: "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Listado de Departamentos</MDBDropdownItem>
                  </Link>
                  <Link to="/buscardepartamento" style={{ color: "#4f4f4f", textDecoration: "none" }}>
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
                <MDBDropdownMenu>
                  <Link to="/altaempleado" style={{ color: "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Alta de Empleados</MDBDropdownItem>
                  </Link>
                  <Link to="/listadoempleado" style={{ color: "#4f4f4f", textDecoration: "none" }}>
                    <MDBDropdownItem link>Listado de Empleado</MDBDropdownItem>
                  </Link>
                  <Link to="/buscarempleado" style={{ color: "#4f4f4f", textDecoration: "none" }}>
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
