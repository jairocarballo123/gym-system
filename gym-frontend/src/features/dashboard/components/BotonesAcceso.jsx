// src/features/Dashboard/components/BotonesAcceso.jsx
import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUserTie, FaLayerGroup, FaBoxes, FaCreditCard, FaCalendarCheck } from 'react-icons/fa';

const BotonesAcceso = () => {
  const navigate = useNavigate();
  const modulos = [
    { nombre: 'Miembros', ruta: '/miembros', color: 'primary', icono: <FaUsers /> },
    { nombre: 'Empleados', ruta: '/empleados', color: 'success', icono: <FaUserTie /> },
    { nombre: 'Planes', ruta: '/planes', color: 'info', icono: <FaLayerGroup /> },
    { nombre: 'Stock', ruta: '/Stock', color: 'warning', icono: <FaBoxes /> },
    { nombre: 'Pagos', ruta: '/pagos', color: 'danger', icono: <FaCreditCard /> },
    { nombre: 'Asistencias', ruta: '/asistencias', color: 'secondary', icono: <FaCalendarCheck /> },
  ];

  return (
    <div className="mb-4">
      <h6 className="text-muted small fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>Accesos Rápidos</h6>
      <Row className="g-2">
        {modulos.map(mod => (
          <Col key={mod.ruta} xs={6} md={4} lg={2}>
            <Button 
              variant="light" 
              className="w-100 py-2.5 px-3 border bg-white rounded-3 text-start d-flex align-items-center gap-2 text-secondary shadow-sm transition-all custom-action-btn"
              onClick={() => navigate(mod.ruta)}
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              <span className={`text-${mod.color} d-flex fs-6`}>{mod.icono}</span>
              <span className="text-dark">{mod.nombre}</span>
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BotonesAcceso;