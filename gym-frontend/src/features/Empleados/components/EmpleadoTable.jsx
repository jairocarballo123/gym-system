import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserShield, FaDumbbell } from 'react-icons/fa';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  // Función auxiliar para pintar el badge del rol
  const getRoleBadge = (rol) => {
    switch(rol) {
        case 'admin': return <Badge bg="danger"><FaUserShield className="me-1"/>Admin</Badge>;
        case 'entrenador': return <Badge bg="primary"><FaDumbbell className="me-1"/>Coach</Badge>;
        default: return <Badge bg="secondary">{rol}</Badge>;
    }
  };

  return (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr className="text-muted text-uppercase small">
            <th>Nombre / ID</th>
            <th>Rol</th>
            <th>Contacto</th>
            <th>Especialidad / Dispon.</th>
            <th>Estado</th>
             <th>Fecha ingreso</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.length === 0 && (
            <tr><td colSpan="6" className="text-center py-5 text-muted">No hay empleados registrados.</td></tr>
          )}

          {empleados.map((e) => (
            <tr key={e.id}>
              <td>
                <div className="fw-bold">{e.nombre}</div>
                <div className="small text-muted">ID: {e.id}</div>
              </td>
              <td>{getRoleBadge(e.rol)}</td>
              <td>{e.telefono}</td>
              <td>
                <div className="small fw-bold">{e.especialidad || '-'}</div>
                <div className="small text-muted fst-italic ">{e.disponibilidad}</div>
              </td>
              <td>
                <Badge bg={e.activo ? 'success' : 'dark'}>
                  {e.activo ? 'activo' : 'inactivo'}
                </Badge>
              </td>

              <td>
                {e.fecha_ingreso}
              </td>
              <td className="text-end">
                <Button variant="light" size="sm" className="me-2 text-primary" onClick={() => onEdit(e)}>
                  <FaEdit />
                </Button>
                <Button variant="light" size="sm" className="text-danger" onClick={() => onDelete(e.id)}>
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

export default EmpleadoTable;