// src/features/planes/components/PlanStatsCards.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaTag, FaDollarSign, FaTrophy, FaCalendarPlus } from 'react-icons/fa';

const PlanStatsCards = ({ resumen, masVendido }) => {
  return (
    <Row className="mb-4 g-4">
      <Col md={6} lg={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Total Planes</span>
                <h2 className="fw-bolder mt-2 mb-1 text-dark">{resumen?.total || 0}</h2>
                <span className="badge bg-success-subtle text-success rounded-pill fw-semibold">
                  {resumen?.activos || 0} activos
                </span>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <FaTag className="text-primary fs-4" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Precio Promedio</span>
                <h2 className="fw-bolder mt-2 mb-1 text-dark">${Number(resumen?.precio_promedio || 0).toFixed(2)}</h2>
                <small className="text-muted fw-medium">Rango: ${resumen?.precio_minimo} - ${resumen?.precio_maximo}</small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <FaDollarSign className="text-success fs-4" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Más Vendido</span>
                <h5 className="fw-bolder mt-2 mb-1 text-dark text-truncate" style={{ maxWidth: '140px' }} title={masVendido?.PlanName || 'N/A'}>
                  {masVendido?.PlanName || 'N/A'}
                </h5>
                <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill fw-semibold">
                  {masVendido?.total_vendido || 0} membresías
                </span>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <FaTrophy className="text-warning fs-4" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Complementarios</span>
                <h2 className="fw-bolder mt-2 mb-1 text-dark">{resumen?.addOns || 0}</h2>
                <small className="text-muted fw-medium">Planes adicionales</small>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <FaCalendarPlus className="text-info fs-4" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PlanStatsCards;