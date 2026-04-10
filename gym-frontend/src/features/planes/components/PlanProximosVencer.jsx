// src/features/planes/components/PlanProximosVencer.jsx
import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { FaClock } from 'react-icons/fa';

const PlanProximosVencer = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center text-muted py-5">
          <FaClock size={40} className="mb-2 opacity-50" />
          <p>No hay membresías próximas a vencer</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white border-0 pt-3">
        <div className="d-flex align-items-center">
          <FaClock className="text-warning me-2" />
          <h6 className="fw-bold mb-0">Próximos a Vencer (próximos 7 días)</h6>
        </div>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Miembro</th>
              <th>Fecha de vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.MembershipId}>
                <td>{item.PlanName}</td>
                <td className="fw-bold">{item.MemberName}</td>
                <td>
                  <Badge bg="warning" text="dark">
                    {new Date(item.EndDate).toLocaleDateString()}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PlanProximosVencer;