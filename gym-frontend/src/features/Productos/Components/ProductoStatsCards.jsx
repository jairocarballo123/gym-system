// src/features/productos/components/ProductoStatsCards.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBoxes, FaBoxOpen, FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';

const ProductoStatsCards = ({ resumen }) => {
  return (
    <Row className="mb-4 g-3">
      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Total Productos</span>
                <h2 className="fw-bold mt-2 mb-0">{resumen?.total || 0}</h2>
                <small className="text-success">{resumen?.activos || 0} activos</small>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <FaBoxes className="text-primary" size={28} />
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
                <span className="text-muted small text-uppercase fw-bold">Valor Inventario</span>
                <h2 className="fw-bold mt-2 mb-0">${Number(resumen?.valorInventario || 0).toFixed(2)}</h2>
                <small className="text-muted">Precio de venta</small>
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
                <span className="text-muted small text-uppercase fw-bold">Sin Stock</span>
                <h2 className="fw-bold mt-2 mb-0">{resumen?.sinStock || 0}</h2>
                <small className="text-danger">Productos agotados</small>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded">
                <FaBoxOpen className="text-danger" size={28} />
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
                <span className="text-muted small text-uppercase fw-bold">Stock Bajo</span>
                <h2 className="fw-bold mt-2 mb-0">{resumen?.stockBajo || 0}</h2>
                <small className="text-warning">≤ 5 unidades</small>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded">
                <FaExclamationTriangle className="text-warning" size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductoStatsCards;