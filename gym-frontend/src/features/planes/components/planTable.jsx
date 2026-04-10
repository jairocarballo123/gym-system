// src/features/planes/components/PlanTable.jsx
import React from 'react';
import { Table, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

const PlanTable = ({ planes, onEdit, onDelete }) => {
  if (!planes || planes.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No hay planes registrados</p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Duración</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {planes.map((plan) => (
          <tr key={plan.PlanId}>
            <td>{plan.PlanId}</td>
            <td className="fw-bold">{plan.PlanName}</td>
            <td>
              <span className="text-success fw-bold">
                <FaDollarSign className="me-1" /> {Number(plan.Price).toFixed(2)}
              </span>
            </td>
            <td>
              <FaCalendarAlt className="me-1 text-primary" /> {plan.DurationDays} días
            </td>
            <td>
              <Badge bg={plan.IsAddOn ? 'info' : 'secondary'}>
                {plan.IsAddOn ? 'Complementario' : 'Principal'}
              </Badge>
            </td>
            <td>
              <Badge bg={plan.StatusId === 1 ? 'success' : 'danger'}>
                {plan.StatusId === 1 ? 'Activo' : 'Inactivo'}
              </Badge>
            </td>
            <td>
              <OverlayTrigger placement="top" overlay={<Tooltip>Editar plan</Tooltip>}>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-1"
                  onClick={() => onEdit(plan)}
                >
                  <FaEdit />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Desactivar plan</Tooltip>}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(plan)}
                >
                  <FaTrash />
                </Button>
              </OverlayTrigger>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PlanTable;