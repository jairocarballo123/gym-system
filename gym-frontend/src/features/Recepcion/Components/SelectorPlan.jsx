// src/features/Recepcion/Components/SelectorPlan.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
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

  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="selector-plan">
      <h6 className="fw-semibold text-primary small mb-2">Planes disponibles</h6>
      <div className="d-flex flex-column gap-2">
        {planes.map((plan) => (
          <Card key={plan.PlanId} className="border-0 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center p-3">
              <div>
                <div className="fw-bold">{plan.PlanName}</div>
                <div className="small text-muted">
                  ${plan.Price} · {plan.DurationDays} días
                </div>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onAgregarItem(plan, 'PLAN')}
              >
                <FaPlus />
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SelectorPlan;