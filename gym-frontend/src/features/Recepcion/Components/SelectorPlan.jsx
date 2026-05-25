// src/features/Recepcion/Components/SelectorPlan.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { recepcionServices } from '../Services/RecepcionServices';
import { FaPlus } from 'react-icons/fa';

const SelectorPlan = ({ onAgregarItem }) => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    setLoading(true);
    try {
      const response = await recepcionServices.obtenerPlanes();
      if (response.success) {
        setPlanes(response.data);
      } else {
        setError('No se pudieron cargar los planes');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="rounded-3">{error}</Alert>;

  return (
    <div className="selector-plan mt-3">
      <Row className="g-3">
        {planes.map((plan) => (
          <Col md={6} key={plan.PlanId}>
            <Card className="h-100 border border-light shadow-sm rounded-3 hover-effect">
              <Card.Body className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold text-dark mb-1">{plan.PlanName}</div>
                  <div className="small text-muted fw-semibold">
                    ${plan.Price} <span className="fw-normal">· {plan.DurationDays} días</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: '35px', height: '35px' }}
                  onClick={() => onAgregarItem(plan, 'PLAN')}
                >
                  <FaPlus size={12} />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SelectorPlan;