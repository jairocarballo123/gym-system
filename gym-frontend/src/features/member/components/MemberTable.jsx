import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MemberTable = ({ members, onEdit, onDelete }) => {
  return (
    <div className="table-responsive ">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr className="text-muted text-uppercase small">
            <th className="ps-4">ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Fecha Registro</th>
            <th>Plan Actual</th>
            <th>Fecha Vencimiento</th>
            <th>Estado</th>
            <th>Entrenador ID</th>
            <th className="text-end pe-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center py-5 text-muted">
                No se encontraron miembros.
              </td>
            </tr>
          )}

          {members.map((m) => (
            <tr key={m.id}>
              <td className="ps-4">{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.direccion || 'Sin dirección'}</td>
              <td>{m.telefono}</td>
              <td>{new Date(m.fecha_registro).toLocaleDateString()}</td>
              <td>{m.plan_actual_id || '-'}</td>
              <td>
                {m.fecha_vencimiento
                  ? new Date(m.fecha_vencimiento).toLocaleDateString()
                  : '-'}
              </td>
              <td>
                <Badge bg={m.estado_membresia === 'activo' ? 'success' : 'danger'}>
                  {m.estado_membresia?.toUpperCase() || 'INACTIVO'}
                </Badge>
              </td>
              <td>{m.entrenador_id || '-'}</td>
              <td className="text-end pe-4">
                <Button
                  variant="light"
                  size="sm"
                  className="me-2 text-primary"
                  onClick={() => onEdit(m)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="text-danger"
                  onClick={() => onDelete(m.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MemberTable;
