// src/features/planes/components/PlanStatsCards.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaTag, FaDollarSign, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const PlanStatsCards = ({ resumen, masVendido }) => {
  return (
    <Row className="mb-4 g-3">
      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Total Planes</span>
                <h2 className="fw-bold mt-2 mb-0">{resumen?.total || 0}</h2>
                <small className="text-success">{resumen?.activos || 0} activos</small>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <FaTag className="text-primary" size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Precio Promedio</span>
                <h2 className="fw-bold mt-2 mb-0">${Number(resumen?.precio_promedio || 0).toFixed(2)}</h2>
                <small className="text-muted">Min: ${resumen?.precio_minimo} / Max: ${resumen?.precio_maximo}</small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded">
                <FaDollarSign className="text-success" size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Más Vendido</span>
                <h5 className="fw-bold mt-2 mb-0">{masVendido?.PlanName || 'N/A'}</h5>
                <small className="text-warning">{masVendido?.total_vendido || 0} membresías</small>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded">
                <FaTrophy className="text-warning" size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Complementarios</span>
                <h2 className="fw-bold mt-2 mb-0">{resumen?.addOns || 0}</h2>
                <small className="text-muted">Planes adicionales</small>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded">
                <FaCalendarAlt className="text-info" size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PlanStatsCards;