// src/features/planes/components/PlanMiembrosActivos.jsx
import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';

const PlanMiembrosActivos = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center text-muted p-5">
          <FaUsers size={40} className="mb-3 opacity-25" />
          <p className="mb-0 fw-medium">No hay datos de miembros</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded p-2 me-3 shadow-sm">
            <FaUsers size={18} />
          </div>
          <h6 className="fw-bold mb-0 text-dark">Miembros por Plan</h6>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table borderless hover className="align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="ps-4 fw-semibold">Plan</th>
                <th className="text-center fw-semibold">Total</th>
                <th className="pe-4 text-end fw-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((plan) => (
                <tr key={plan.PlanId} className="border-bottom border-light">
                  <td className="ps-4 fw-bold text-dark">{plan.PlanName}</td>
                  <td className="text-center">
                    <Badge bg="primary-subtle" text="primary" pill className="px-3">
                      {plan.cantidad_miembros}
                    </Badge>
                  </td>
                  <td className="pe-4 text-end text-muted fw-medium">{plan.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlanMiembrosActivos;