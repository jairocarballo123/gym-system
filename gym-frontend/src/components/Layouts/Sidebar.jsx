// src/components/layout/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaCreditCard, FaUserTie, FaCog, FaDumbbell, 
  FaClipboardList, FaHandHoldingUsd, FaBoxes, FaLayerGroup 
} from 'react-icons/fa';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  // Mapeo unificado de rutas e íconos exactos coincidentes con el Dashboard
  const enlacesNav = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/recepcion", label: "Recepción / Ventas", icon: <FaHandHoldingUsd /> },
    { to: "/miembros", label: "Miembros", icon: <FaUsers /> },
    { to: "/empleados", label: "Empleados", icon: <FaUserTie /> },
    { to: "/planes", label: "Planes", icon: <FaLayerGroup /> },
    { to: "/Stock", label: "Stock / Inventario", icon: <FaBoxes /> },
    { to: "/pagos", label: "Control de Pagos", icon: <FaCreditCard /> },
    { to: "/asistencias", label: "Asistencias", icon: <FaClipboardList /> },
    { to: "/configuracion", label: "Configuración", icon: <FaCog /> },
  ];

  return (
    <div 
      className="sidebar text-white d-flex flex-column p-3 sticky-top" 
      style={{ width: '260px', height: '100vh', backgroundColor: '#1e293b', borderRight: '1px solid #334155' }}
    >
      {/* Logotipo o Cabecera de Marca */}
      <NavLink
        to="/dashboard"
        className="d-flex align-items-center gap-2 mb-4 mt-2 px-2 text-white text-decoration-none"
      >
        <div className="bg-primary rounded-3 p-2 d-flex text-white shadow-sm">
          <FaDumbbell className="fs-4" />
        </div>
        <span className="fs-5 fw-bold tracking-tight">Gym System</span>
      </NavLink>

      <hr style={{ borderColor: '#334155', opacity: '0.6' }} />

      {/* Menú de Navegación con estados activos estilizados */}
      <Nav className="flex-column mb-auto gap-1">
        {enlacesNav.map((link) => (
          <Nav.Item key={link.to}>
            <NavLink 
              to={link.to} 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium transition-all text-decoration-none ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-secondary-nav hover-bg-slate text-white-50'
                }`
              }
              style={({ isActive }) => ({
                fontSize: '14px',
                backgroundColor: isActive ? '#4f46e5' : 'transparent',
                transition: 'all 0.2s ease'
              })}
            >
              <span className="d-flex fs-5 opacity-75">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          </Nav.Item>
        ))}
      </Nav>

      <hr style={{ borderColor: '#334155', opacity: '0.6' }} />
      
      {/* Footer del Sidebar: Tarjeta de Operador Conectado */}
      <div className="p-2 rounded-3 bg-slate-800" style={{ backgroundColor: '#0f172a' }}>
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px', minWidth: '8px' }}></div>
          <div className="text-truncate">
            <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sesión Activa</small>
            <span className="fw-medium text-white-50 small text-truncate d-block">
              {user?.nombre || user?.FullName || 'Operador'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;