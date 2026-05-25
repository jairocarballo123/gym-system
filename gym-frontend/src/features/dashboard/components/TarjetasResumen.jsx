// src/features/Dashboard/components/TarjetasResumen.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaDollarSign, FaBoxes, FaCalendarCheck } from 'react-icons/fa';

const TarjetasResumen = ({ data }) => {
  const items = [
    { titulo: 'Miembros Activos', valor: data?.miembrosActivos || 0, icono: <FaUsers />, color: 'primary' },
    { titulo: 'Ingresos Hoy', valor: data?.ingresosHoy ? `C$ ${Number(data.ingresosHoy).toFixed(2)}` : 'C$ 0.00', icono: <FaDollarSign />, color: 'success' },
    { titulo: 'Asistencias Hoy', valor: data?.asistenciasHoy || 0, icono: <FaCalendarCheck />, color: 'info' },
    { titulo: 'Stock Bajo', valor: data?.stockBajo || 0, icono: <FaBoxes />, color: 'warning' },
  ];

  return (
    <Row className="g-3 mb-4">
      {items.map((item, idx) => (
        <Col sm={6} xl={3} key={idx}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-3 p-3 fs-3 d-inline-flex`}>
                {item.icono}
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.03em' }}>
                  {item.titulo}
                </h6>
                <h3 className="text-dark fw-bold mb-0">{item.valor}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TarjetasResumen;