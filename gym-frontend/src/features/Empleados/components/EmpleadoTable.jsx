// src/features/Empleados/components/EmpleadoTable.jsx
import React from 'react';
import { Table, Badge, Button, Dropdown } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaEllipsisV, FaUserCircle, FaDumbbell, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Color personalizado por Rol
  const getRoleBadge = (roleId, roleName) => {
    switch (roleId) {
      case 1: return <Badge bg="danger" className="px-2 py-1">Admin</Badge>;
      case 2: return <Badge bg="violet" style={{ backgroundColor: '#6f42c1' }} className="px-2 py-1">Entrenador</Badge>;
      case 3: return <Badge bg="warning" text="dark" className="px-2 py-1">Recepcionista</Badge>;
      default: return <Badge bg="secondary">{roleName || 'Personal'}</Badge>;
    }
  };

  // Renderiza el KPI de rendimiento calculado por el Backend en tiempo real
  const renderImpacto = (emp) => {
    if (emp.roleId === 2) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold text-dark">{emp.ClientesAsignados || 0}</span>
          <span className="text-muted small">Alumnos</span>
        </div>
      );
    }
    if (emp.roleId === 3 || emp.roleId === 1) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold text-dark">{emp.FacturasProcesadas || 0}</span>
          <span className="text-muted small">Ventas</span>
        </div>
      );
    }
    return <span className="text-muted small">—</span>;
  };

  return (
    <div className="bg-white rounded-3 shadow-sm border overflow-hidden">
      <Table hover responsive className="align-middle mb-0 text-nowrap">
        <thead className="bg-light table-light border-bottom">
          <tr>
            <th className="ps-4" style={{ width: '70px' }}>ID</th>
            <th>Empleado</th>
            <th>Contacto</th>
            <th>Cargo</th>
            <th>Rendimiento (Mes)</th>
            <th>Estado</th>
            <th className="text-center" style={{ width: '100px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-5 text-muted">
                No se encontraron registros coincidentes.
              </td>
            </tr>
          ) : (
            empleados.map((emp) => (
              <tr key={emp.id}>
                {/* ID */}
                <td className="ps-4 fw-semibold text-muted">#{emp.id}</td>

                {/* Info Personal con Avatar e Información Secundaria */}
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <FaUserCircle size={36} className="text-secondary opacity-50" />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{emp.nombre}</h6>
                      {emp.Especialidad && (
                        <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>
                          <FaDumbbell className="text-warning me-1" size={11} /> {emp.Especialidad}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contacto */}
                <td>
                  <span className="text-dark d-block">{emp.telefono || '—'}</span>
                  {emp.Disponibilidad && (
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                       {emp.Disponibilidad}
                    </span>
                  )}
                </td>

                {/* Rol */}
                <td>{getRoleBadge(emp.roleId, emp.Rol)}</td>

                {/* Rendimiento Dinámico */}
                <td>{renderImpacto(emp)}</td>

                {/* Estado */}
                <td>
                  <Badge 
                    bg={emp.statusId === 1 ? 'success' : 'danger'}
                    className="bg-opacity-10 px-2 py-1 text-capitalize"
                    style={{ color: emp.statusId === 1 ? '#198754' : '#dc3545' }}
                  >
                    ● {emp.statusId === 1 ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>

                {/* Acciones compactas */}
                <td className="text-center pe-3">
                  <div className="d-flex justify-content-center gap-1">
                    <Button 
                      variant="light" 
                      size="sm" 
                      className="text-primary bg-transparent border-0"
                      onClick={() => navigate(`/empleados/${emp.id}`)}
                    >
                      <FaEye size={15} />
                    </Button>

                    <Dropdown align="end">
                      <Dropdown.Toggle variant="light" size="sm" className="no-caret border-0 bg-transparent text-muted p-1">
                        <FaEllipsisV size={13} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="shadow-sm border">
                        <Dropdown.Item onClick={() => onEdit(emp)}>
                          Editar datos
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger" onClick={() => onDelete(emp)}>
                          Dar de baja
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default EmpleadoTable;