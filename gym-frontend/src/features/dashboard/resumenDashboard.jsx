// src/features/Dashboard/components/ResumenDashboard.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Users, Briefcase, ClipboardList, DollarSign, CalendarCheck, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const modulos = [
  { nombre: 'Miembros', ruta: '/miembros', icono: <Users size={32} />, total: 0 },
  { nombre: 'Empleados', ruta: '/empleados', icono: <Briefcase size={32} />, total: 0 },
  { nombre: 'Planes', ruta: '/planes', icono: <ClipboardList size={32} />, total: 0 },
  { nombre: 'Pagos', ruta: '/pagos', icono: <DollarSign size={32} />, total: 0 },
  { nombre: 'Asistencias', ruta: '/asistencias', icono: <CalendarCheck size={32} />, total: 0 },
  { nombre: 'Configuración', ruta: '/configuracion', icono: <Settings size={32} />, total: null },
];

const ResumenDashboard = ({ conteos }) => {
  const navigate = useNavigate();

  return (
    <Row className="mt-4">
      {modulos.map((modulo, idx) => (
        <Col key={idx} md={4} className="mb-3">
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center mb-2">
                  {modulo.icono}
                  <Card.Title className="ms-2">{modulo.nombre}</Card.Title>
                </div>
                <Card.Text>
                  {modulo.total !== null
                    ? `Total: ${conteos[modulo.nombre.toLowerCase()] ?? 0}`
                    : 'Sin conteo'}
                </Card.Text>
              </div>
              <Button
                variant="outline-primary"
                onClick={() => navigate(modulo.ruta)}
              >
                Ir a {modulo.nombre}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ResumenDashboard;
