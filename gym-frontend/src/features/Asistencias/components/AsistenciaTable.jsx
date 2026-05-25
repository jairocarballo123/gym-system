// src/features/asistencias/components/AsistenciaTable.jsx
import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const AsistenciasTable = ({ asistencias }) => {
  if (!asistencias || asistencias.length === 0) {
    return (
      <div className="text-center py-5 bg-white border-0 shadow-sm rounded-4">
        <p className="text-muted mb-0">No hay asistencias registradas hoy</p>
      </div>
    );
  }

  return (
    <div className="table-responsive border-0 shadow-sm rounded-4 bg-white">
      <Table borderless hover size="sm" className="mb-0 align-middle">
        <thead className="bg-light text-muted small text-uppercase">
          <tr>
            <th className="ps-4 py-3 fw-semibold" style={{ width: '10%' }}>ID</th>
            <th className="py-3 fw-semibold">Miembro</th>
            <th className="pe-4 py-3 fw-semibold text-end">Hora de Registro</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((a) => (
            <tr key={a.AttendanceId} className="border-top border-light">
              <td className="ps-4 py-3 text-muted small">{a.AttendanceId}</td>
              <td className="py-3">
                <span className="fw-bold text-dark">{a.nombre}</span>
                <span className="text-muted ms-2 small">(ID: {a.MemberId})</span>
              </td>
              <td className="pe-4 py-3 text-end">
                <Badge bg="success-subtle" text="success" pill className="px-3 py-2 fw-medium">
                  {a.fecha}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AsistenciasTable;