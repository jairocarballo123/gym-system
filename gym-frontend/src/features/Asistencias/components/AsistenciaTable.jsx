import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaTrash, FaClock, FaUser } from 'react-icons/fa';

const AsistenciaTable = ({ asistencias, onDelete }) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr className="text-muted text-uppercase small">
            <th>Fecha y Hora</th>
            <th>Miembro</th>
            <th>ID Socio</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.length === 0 && (
            <tr><td colSpan="4" className="text-center py-5 text-muted">No hay registros de asistencia hoy.</td></tr>
          )}

          {asistencias.map((a) => {
            const fecha = new Date(a.fecha_entrada);
            return (
              <tr key={a.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3 text-primary">
                        <FaClock />
                    </div>
                    <div>
                        <div className="fw-bold">{fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <small className="text-muted">{fecha.toLocaleDateString()}</small>
                    </div>
                  </div>
                </td>
                <td className="fw-bold text-dark">{a.miembro_nombre}</td>
                <td><Badge bg="secondary">{a.miembro_id}</Badge></td>
                <td className="text-end">
                  <Button variant="light" size="sm" className="text-danger" onClick={() => onDelete(a.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default AsistenciaTable;