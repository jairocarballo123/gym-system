import { Navbar, Container, Nav, Dropdown, Badge } from "react-bootstrap";
import { FaUserCircle, FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const titles = {
    "/": "dashboard",
    "/recepcion": "Recepción / Ventas",
    "/miembros": "Gestión de Miembros",
    "/empleados": "Gestión de Empleados",
    "/planes": "Gestión de Planes",
    "/Stock": "Gestion de stock",
    "/pagos": "Gestión de Pagos",
    "/asistencias": "Control de Asistencias",
    "/configuracion": "Configuración",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom py-2 w-100">
      <Container fluid className="px-4">
        <Navbar.Brand className="fw-bold text-primary fs-4">
          {titles[location.pathname] || "Gym System"}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="topbar-nav" />

        <Navbar.Collapse id="topbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3">
            {/* Notificaciones */}
            <Nav.Link className="position-relative text-secondary p-0">
              <FaBell size={18} />
              <Badge 
                pill 
                bg="danger" 
                className="position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle"
                style={{ fontSize: '0.6rem' }}
              >
                <span className="visually-hidden">notificaciones</span>
              </Badge>
            </Nav.Link>

            {/* Dropdown usuario */}
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                id="user-dropdown"
                className="d-flex align-items-center gap-2 text-dark text-decoration-none cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                <FaUserCircle size={28} className="text-primary" />
                <span className="fw-semibold d-none d-md-block">
                  {user?.nombre || "Usuario"}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm mt-2">
                <Dropdown.Item>
                  <FaUser className="me-2" /> Mi Perfil
                </Dropdown.Item>
                <Dropdown.Item>
                  <FaBell className="me-2" /> Notificaciones
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" /> Cerrar Sesión
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