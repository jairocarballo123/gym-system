// src/features/planes/components/PlanIngresosReales.jsx
import React from 'react';
import { Card, Table, ProgressBar } from 'react-bootstrap';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';

const PlanIngresosReales = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center text-muted p-5">
          <FaMoneyBillTrendUp size={40} className="mb-3 opacity-25" />
          <p className="mb-0 fw-medium">No hay datos de ingresos</p>
        </Card.Body>
      </Card>
    );
  }

  const totalIngresos = data.reduce((sum, p) => sum + p.total_ingresos, 0);

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
        <div className="d-flex align-items-center">
          <div className="bg-success text-white rounded p-2 me-3 shadow-sm">
            <FaMoneyBillTrendUp size={18} />
          </div>
          <h6 className="fw-bold mb-0 text-dark">Ingresos por Plan</h6>
        </div>
      </Card.Header>
      <Card.Body className="p-0 d-flex flex-column">
        <div className="table-responsive flex-grow-1">
          <Table borderless hover className="align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="ps-4 fw-semibold">Plan</th>
                <th className="fw-semibold">Ingreso</th>
                <th className="pe-4 fw-semibold">Participación</th>
              </tr>
            </thead>
            <tbody>
              {data.map((plan) => {
                const porcentaje = (plan.total_ingresos / totalIngresos) * 100;
                return (
                  <tr key={plan.PlanId} className="border-bottom border-light">
                    <td className="ps-4 fw-bold text-dark text-truncate" style={{ maxWidth: '100px' }}>
                      {plan.PlanName}
                    </td>
                    <td className="text-success fw-bold">${plan.total_ingresos.toFixed(2)}</td>
                    <td className="pe-4">
                      <div className="d-flex align-items-center gap-2">
                        <ProgressBar 
                          now={porcentaje} 
                          variant="success" 
                          className="flex-grow-1 bg-success-subtle" 
                          style={{ height: '6px' }} 
                        />
                        <span className="small text-muted">{porcentaje.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="p-3 bg-light text-end border-top mt-auto rounded-bottom-4">
          <span className="text-muted small text-uppercase fw-semibold me-2">Total Generado:</span>
          <span className="fs-5 fw-bolder text-dark">${totalIngresos.toFixed(2)}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlanIngresosReales;