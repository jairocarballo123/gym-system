// src/features/Miembros/components/MiembroTabla.jsx
import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MiembroTabla = ({ miembros, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const verDetalle = (id) => {
    navigate(`/miembros/${id}`);
  };

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Entrenador asignado</th>
          <th>Días restantes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {miembros.map((m) => (
          <tr key={m.id}>
            <td>{m.id}</td>
            <td>{m.fullName}</td>
            <td>{m.phone || '—'}</td>
            <td>
              <Badge bg={m.statusId === 1 ? 'success' : 'danger'}>
                {m.statusId === 1 ? 'Activo' : 'Inactivo'}
              </Badge>
            </td>
            <td className='text-center'>{m.trainerName || '-'}</td> 
            <td>{m.diasRestantes}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-1"
                onClick={() => verDetalle(m.id)}
                title="Ver detalle"
              >
                <FaEye />
              </Button>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-1"
                onClick={() => onEdit(m)}
                title="Editar"
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(m)}
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

export default MiembroTabla;