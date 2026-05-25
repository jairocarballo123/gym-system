// src/components/layout/Topbar.jsx
import React from "react";
import { Navbar, Container, Nav, Dropdown, Badge } from "react-bootstrap";
import { FaUserCircle, FaBell, FaSignOutAlt, FaUser, FaCircle, FaBoxes, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Diccionario de títulos corregido y mapeado con exactitud
  const titles = {
    "/": "Dashboard Principal",
    "/dashboard": "Dashboard Principal",
    "/recepcion": "Recepción / Ventas",
    "/miembros": "Gestión de Miembros",
    "/empleados": "Gestión de Empleados",
    "/planes": "Gestión de Planes",
    "/Stock": "Gestión de Stock",
    "/pagos": "Gestión de Pagos",
    "/asistencias": "Control de Asistencias",
    "/configuracion": "Configuración del Sistema",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Datos simulados de notificaciones operativas rápidas
  const notificacionesAlertas = [
    { id: 1, tipo: 'stock', texto: 'Stock bajo: Proteína Whey Fresa (2 u.)', tiempo: 'Hace 10 min', icon: <FaBoxes />, color: 'warning' },
    { id: 2, tipo: 'membresia', texto: '3 miembros expiraron el día de hoy', tiempo: 'Hace 1 hora', icon: <FaExclamationTriangle />, color: 'danger' },
  ];

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom py-2 w-100 sticky-top">
      <Container fluid className="px-4">
        {/* Título de la sección actual */}
        <Navbar.Brand className="fw-bold text-dark fs-5 mb-0 align-self-center">
          {titles[location.pathname] || "Gym System"}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="topbar-nav" className="border-0" />

        <Navbar.Collapse id="topbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3 mt-2 mt-lg-0">
            
            {/* COMPONENTE NUEVO: Dropdown de Notificaciones Reales */}
            <Dropdown align="end">
              <Dropdown.Toggle 
                as="div" 
                role="button"
                className="position-relative text-secondary p-2 rounded-circle hover-bg-light cursor-pointer d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', transition: 'all 0.2s' }}
              >
                <FaBell size={18} className="text-muted" />
                {notificacionesAlertas.length > 0 && (
                  <Badge 
                    pill 
                    bg="danger" 
                    className="position-absolute p-1 border border-white rounded-circle"
                    style={{ top: '6px', right: '6px', width: '8px', height: '8px' }}
                  >
                    <span className="visually-hidden">Alertas</span>
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0 mt-2 p-0 rounded-3 overflow-hidden" style={{ width: '320px' }}>
                <div className="bg-light px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark small">Centro de Alertas</span>
                  <Badge bg="danger" bg-opacity-10 className="text-danger rounded-pill px-2 py-0.5" style={{ fontSize: '10px' }}>
                    {notificacionesAlertas.length} urgentes
                  </Badge>
                </div>
                {notificacionesAlertas.map((notif) => (
                  <Dropdown.Item key={notif.id} className="p-3 border-bottom d-flex gap-3 align-items-start text-wrap">
                    <div className={`bg-${notif.color} bg-opacity-10 text-${notif.color} rounded-3 p-2 d-flex fs-6 mt-1`}>
                      {notif.icon}
                    </div>
                    <div className="w-100">
                      <p className="mb-0 text-dark fw-medium" style={{ fontSize: '13px', lineHeight: '1.4' }}>{notif.texto}</p>
                      <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>{notif.tiempo}</small>
                    </div>
                  </Dropdown.Item>
                ))}
                <div className="p-2 text-center bg-light">
                  <small className="text-primary fw-medium cursor-pointer" style={{ fontSize: '12px' }}>Marcar todas como leídas</small>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* Separador vertical sutil en pantallas grandes */}
            <div className="d-none d-lg-block bg-gray-200" style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>

            {/* Dropdown de Usuario Estilizado */}
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                id="user-dropdown"
                className="d-flex align-items-center gap-2 text-dark text-decoration-none cursor-pointer rounded-3 p-1 pe-2 hover-bg-light"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <FaUserCircle size={32} className="text-primary" />
                <div className="d-none d-md-block text-start" style={{ lineHeight: '1.2' }}>
                  <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{user?.nombre || "Usuario Admin"}</div>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Administrador</small>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0 mt-2 rounded-3">
                <Dropdown.Item className="py-2 small text-secondary d-flex align-items-center gap-2">
                  <FaUser size={13} /> Mi Perfil
                </Dropdown.Item>
                <Dropdown.Divider className="my-1 border-light" />
                <Dropdown.Item onClick={handleLogout} className="py-2 small text-danger d-flex align-items-center gap-2 fw-medium">
                  <FaSignOutAlt size={13} /> Cerrar Sesión
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