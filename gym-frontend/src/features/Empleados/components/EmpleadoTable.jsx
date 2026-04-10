// src/features/Empleados/components/EmpleadoTable.jsx
import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const verDetalle = (id) => {
    navigate(`/empleados/${id}`);
  };

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {empleados.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.nombre}</td>
            <td>{emp.telefono || '—'}</td>
            <td>
              {emp.roleId === 1 ? 'Admin' : emp.roleId === 2 ? 'Entrenador' : 'Recepcionista'}
            </td>
            <td>
              <Badge bg={emp.statusId === 1 ? 'success' : 'danger'}>
                {emp.statusId === 1 ? 'Activo' : 'Inactivo'}
              </Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-1"
                onClick={() => verDetalle(emp.id)}
                title="Ver detalle"
              >
                <FaEye />
              </Button>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-1"
                onClick={() => onEdit(emp)}
                title="Editar"
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(emp)}
                title="Desactivar"
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default EmpleadoTable;