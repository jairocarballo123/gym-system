// src/features/planes/components/PlanProximosVencer.jsx
import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { FaClockRotateLeft } from 'react-icons/fa6';

const PlanProximosVencer = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center text-muted p-5">
          <FaClockRotateLeft size={40} className="mb-3 opacity-25" />
          <p className="mb-0 fw-medium">No hay membresías por vencer (7 días)</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
        <div className="d-flex align-items-center">
          <div className="bg-warning text-dark rounded p-2 me-3 shadow-sm">
            <FaClockRotateLeft size={18} />
          </div>
          <h6 className="fw-bold mb-0 text-dark">Próximos a Vencer</h6>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table borderless hover className="align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="ps-4 fw-semibold">Miembro</th>
                <th className="fw-semibold">Plan</th>
                <th className="pe-4 text-end fw-semibold">Vence</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.MembershipId} className="border-bottom border-light">
                  <td className="ps-4 fw-bold text-dark">{item.MemberName}</td>
                  <td className="text-muted small">{item.PlanName}</td>
                  <td className="pe-4 text-end">
                    <Badge bg="warning-subtle" text="warning-emphasis" className="px-2 py-1">
                      {new Date(item.EndDate).toLocaleDateString()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlanProximosVencer;