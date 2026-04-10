// src/features/planes/components/PlanIngresosReales.jsx
import React from 'react';
import { Card, Table, ProgressBar } from 'react-bootstrap';
import { FaMoneyBillWave } from 'react-icons/fa';

const PlanIngresosReales = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center text-muted py-5">
          <FaMoneyBillWave size={40} className="mb-2 opacity-50" />
          <p>No hay datos de ingresos</p>
        </Card.Body>
      </Card>
    );
  }

  const totalIngresos = data.reduce((sum, p) => sum + p.total_ingresos, 0);

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white border-0 pt-3">
        <div className="d-flex align-items-center">
          <FaMoneyBillWave className="text-success me-2" />
          <h6 className="fw-bold mb-0">Ingresos por Plan</h6>
        </div>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Ingresos</th>
              <th>% del total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((plan) => {
              const porcentaje = (plan.total_ingresos / totalIngresos) * 100;
              return (
                <tr key={plan.PlanId}>
                  <td className="fw-bold">{plan.PlanName}</td>
                  <td className="text-success fw-bold">${plan.total_ingresos.toFixed(2)}</td>
                  <td style={{ width: '200px' }}>
                    <div className="d-flex align-items-center">
                      <ProgressBar now={porcentaje} label={`${porcentaje.toFixed(0)}%`} className="w-100" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="text-end mt-2">
          <strong>Total general: ${totalIngresos.toFixed(2)}</strong>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlanIngresosReales;