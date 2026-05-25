// src/features/Miembros/components/MiembroTabla.jsx
import React from 'react';
import { Table, Badge, Dropdown, Button } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaEllipsisV, FaUser, FaCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MiembroTabla = ({ miembros, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!miembros || miembros.length === 0) {
    return (
      <div className="bg-white rounded-3 shadow-sm border p-5 text-center text-muted">
        <FaUser size={40} className="mb-3 text-secondary opacity-50" />
        <p className="mb-0 fw-medium">No se encontraron miembros registrados</p>
      </div>
    );
  }

  // Helper para pintar de forma inteligente los días restantes
  const getDiasBadge = (dias) => {
    const numDias = Number(dias) || 0;
    if (numDias <= 0) {
      return <Badge bg="danger" className="bg-opacity-10 text-danger rounded-pill px-2.5 py-1.5 fw-bold">Vencido</Badge>;
    }
    if (numDias <= 7) {
      return <Badge bg="warning" className="bg-opacity-10 text-warning text-dark rounded-pill px-2.5 py-1.5 fw-bold">⚠️ {numDias} días</Badge>;
    }
    return <Badge bg="light" className="text-secondary border rounded-pill px-2.5 py-1.5 fw-medium">{numDias} días</Badge>;
  };

  return (
    <div className="bg-white rounded-3 shadow-sm border overflow-hidden">
      <Table hover responsive className="align-middle mb-0 table-borderless">
        <thead className="bg-light border-bottom text-secondary small fw-bold text-uppercase">
          <tr>
            <th className="px-4 py-3" style={{ width: '80px' }}>ID</th>
            <th className="py-3">Miembro</th>
            <th className="py-3">Contacto</th>
            <th className="py-3">Estado</th>
            <th className="py-3">Coach Asignado</th>
            <th className="py-3">Vencimiento</th>
            <th className="px-4 py-3 text-end" style={{ width: '100px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {miembros.map((m) => (
            <tr key={m.id} className="border-bottom last-border-0">
              {/* ID */}
              <td className="px-4 py-3 text-muted fw-medium">#{m.id}</td>

              {/* Nombre con Avatar Plano */}
              <td className="py-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <FaUser size={12} />
                  </div>
                  <span className="fw-semibold text-dark">{m.fullName}</span>
                </div>
              </td>

              {/* Teléfono */}
              <td className="py-3 text-secondary">{m.phone || '—'}</td>

              {/* Estado */}
              <td className="py-3">
                <Badge 
                  bg={m.statusId === 1 ? 'success' : 'secondary'} 
                  className={`bg-opacity-10 ${m.statusId === 1 ? 'text-success' : 'text-secondary'} rounded-pill px-2.5 py-1.5 fw-semibold`}
                >
                  <FaCircle size={6} className="me-1 align-middle" /> {m.statusId === 1 ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>

              {/* Entrenador */}
              <td className="py-3">
                <span className="text-dark fw-medium">{m.trainerName || 'Sin asignar'}</span>
              </td>

              {/* Días Restantes */}
              <td className="py-3">{getDiasBadge(m.diasRestantes)}</td>

              {/* Acciones Dropdown */}
              <td className="px-4 py-3 text-end">
                <Dropdown align="end">
                  <Dropdown.Toggle as={Button} variant="light" size="sm" className="border-0 bg-transparent p-1 shadow-none">
                    <FaEllipsisV className="text-muted" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow border-0 dropdown-menu-end rounded-3">
                    <Dropdown.Item onClick={() => navigate(`/miembros/${m.id}`)} className="py-2 text-secondary">
                      <FaEye className="me-2 text-info" /> Ver expediente
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onEdit(m)} className="py-2 text-secondary">
                      <FaEdit className="me-2 text-warning" /> Editar datos
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => onDelete(m)} className="py-2 text-danger">
                      <FaTrash className="me-2" /> Desactivar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MiembroTabla;