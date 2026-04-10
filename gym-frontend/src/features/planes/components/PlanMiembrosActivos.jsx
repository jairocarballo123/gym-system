// src/features/planes/components/PlanMiembrosActivos.jsx
import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';

const PlanMiembrosActivos = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center text-muted py-5">
          <FaUsers size={40} className="mb-2 opacity-50" />
          <p>No hay datos de miembros por plan</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white border-0 pt-3">
        <div className="d-flex align-items-center">
          <FaUsers className="text-primary me-2" />
          <h6 className="fw-bold mb-0">Miembros Activos por Plan</h6>
        </div>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Miembros Activos</th>
              <th>% del total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((plan) => (
              <tr key={plan.PlanId}>
                <td className="fw-bold">{plan.PlanName}</td>
                <td>
                  <Badge bg="success" pill>
                    {plan.cantidad_miembros}
                  </Badge>
                </td>
                <td>{plan.porcentaje}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PlanMiembrosActivos;