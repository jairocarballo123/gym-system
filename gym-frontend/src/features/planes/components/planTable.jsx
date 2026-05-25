// src/features/planes/components/PlanTable.jsx
import React from 'react';
import { Table, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const PlanTable = ({ planes, onEdit, onDelete }) => {
  if (!planes || planes.length === 0) {
    return (
      <div className="text-center py-5 text-muted bg-light rounded-3 border-dashed">
        <p className="mb-0 fw-medium">No hay planes registrados actualmente</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table borderless hover className="align-middle mb-0">
        <thead className="border-bottom text-muted small text-uppercase">
          <tr>
            <th className="fw-semibold pb-3">Nombre del Plan</th>
            <th className="fw-semibold pb-3">Precio</th>
            <th className="fw-semibold pb-3">Duración</th>
            <th className="fw-semibold pb-3">Tipo</th>
            <th className="fw-semibold pb-3 text-center">Estado</th>
            <th className="fw-semibold pb-3 text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planes.map((plan) => (
            <tr key={plan.PlanId} className="border-bottom border-light">
              <td className="py-3">
                <span className="fw-bold text-dark d-block">{plan.PlanName}</span>
                <span className="small text-muted">ID: #{plan.PlanId}</span>
              </td>
              <td className="py-3 fw-bold text-success">
                ${Number(plan.Price).toFixed(2)}
              </td>
              <td className="py-3 text-muted">
                {plan.DurationDays} días
              </td>
              <td className="py-3">
                <Badge bg={plan.IsAddOn ? 'info-subtle' : 'secondary-subtle'} text={plan.IsAddOn ? 'info' : 'secondary'} className="px-2 py-1">
                  {plan.IsAddOn ? 'Complementario' : 'Principal'}
                </Badge>
              </td>
              <td className="py-3 text-center">
                <Badge bg={plan.StatusId === 1 ? 'success-subtle' : 'danger-subtle'} text={plan.StatusId === 1 ? 'success' : 'danger'} pill className="px-3">
                  {plan.StatusId === 1 ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="py-3 text-end">
                <OverlayTrigger placement="top" overlay={<Tooltip>Editar plan</Tooltip>}>
                  <Button
                    variant="light"
                    size="sm"
                    className="text-primary rounded-circle p-2 me-2 shadow-sm"
                    onClick={() => onEdit(plan)}
                  >
                    <FaEdit />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Desactivar plan</Tooltip>}>
                  <Button
                    variant="light"
                    size="sm"
                    className="text-danger rounded-circle p-2 shadow-sm"
                    onClick={() => onDelete(plan)}
                  >
                    <FaTrashAlt />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PlanTable;