// src/features/asistencias/components/AsistenciasTable.jsx
import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const AsistenciasTable = ({ asistencias }) => {
  if (!asistencias || asistencias.length === 0) {
    return <p className="text-muted text-center">No hay asistencias registradas hoy</p>;
  }

  return (
    <Table striped bordered hover responsive size="sm">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Miembro</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        {asistencias.map((a) => (
          <tr key={a.AttendanceId}>
            <td>{a.AttendanceId}</td>
            <td className="fw-bold">{a.nombre} (ID: {a.MemberId})</td>
            <td><Badge bg="success">{a.hora}</Badge></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AsistenciasTable;