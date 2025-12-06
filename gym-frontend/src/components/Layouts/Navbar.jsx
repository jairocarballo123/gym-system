import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useAuth } from "../../Hooks/useauth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Topbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const titles = {
    "/": "Dashboard",
    "/miembros": "Gestión de Miembros",
     "/Empleados": "Gestión de Empleados",
      "/planes": "Gestión de planes",
    "/pagos": "Gestión de Pagos",
    "/asistencias": "Control de Asistencias",
    "/configuracion": "Configuración",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm border-bottom w-100">
      <Container className="contenedor-topbar">
        <Navbar.Brand className="fw-bold text-dark ms-2">
          {titles[location.pathname] || "Gym System"}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end pl-2">
          <Nav className="align-items-center">
            <Nav.Link className="me-3 position-relative text-secondary">
              <FaBell size={15} />
              <span className="position-absolute top-10 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </Nav.Link>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                className="d-flex align-items-center border-0 bg-transparent"
              >
                <FaUserCircle size={15} className="me-2 text-primary" />
                <span className="fw-semibold">Admin</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Mi Perfil</Dropdown.Item>
                <Dropdown.Item>Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topbar;
