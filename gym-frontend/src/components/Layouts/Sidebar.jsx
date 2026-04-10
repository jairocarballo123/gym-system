import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaCreditCard, FaClock, FaCog, FaDumbbell, 
  FaClipboardList, FaHandHoldingUsd 
} from 'react-icons/fa';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar bg-dark text-white d-flex flex-column p-3" style={{ width: '260px', height: '100vh' }}>
      <NavLink
        to="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <FaDumbbell className="me-2 fs-2" />
        <span className="fs-4 fw-bold">Gym System</span>
      </NavLink>
      <hr />
      <Nav className="flex-column mb-auto">
        <Nav.Item>
          <NavLink to="/dashboard" className="nav-link text-white d-flex align-items-center">
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/recepcion" className="nav-link text-white d-flex align-items-center">
            <FaHandHoldingUsd className="me-2" />
            Recepción / Ventas
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/miembros" className="nav-link text-white d-flex align-items-center">
            <FaUsers className="me-2" />
            Miembros
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/empleados" className="nav-link text-white d-flex align-items-center">
            <FaClock className="me-2" />
            Empleados
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/planes" className="nav-link text-white d-flex align-items-center">
            <FaDumbbell className="me-2" /> 
            Planes
          </NavLink>
        </Nav.Item>
         <Nav.Item>
          <NavLink to="/Stock" className="nav-link text-white d-flex align-items-center">
            <FaDumbbell className="me-2" /> 
            Stock
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/pagos" className="nav-link text-white d-flex align-items-center">
            <FaCreditCard className="me-2" />
            Pagos
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/asistencias" className="nav-link text-white d-flex align-items-center">
            <FaClipboardList className="me-2" /> 
            Asistencias
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/configuracion" className="nav-link text-white d-flex align-items-center">
            <FaCog className="me-2" />
            Configuración
          </NavLink>
        </Nav.Item>
      </Nav>
      <hr />
      <div className="sidebar-footer text-white text-center mt-4">
        <p className='text-white'>Usuario conectado: {user ? user.FullName : 'usuario'}</p>
      </div>
    </div>
  );
};

export default Sidebar;