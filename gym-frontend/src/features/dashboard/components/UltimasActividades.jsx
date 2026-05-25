// src/features/Dashboard/components/UltimasActividades.jsx
import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { FaCircle } from 'react-icons/fa';

const UltimasActividades = ({ actividades = [] }) => {
  if (!actividades || actividades.length === 0) {
    return (
      <div className="bg-white rounded-3 shadow-sm border p-5 text-center text-muted">
        <p className="mb-0 fw-medium">No se registraron movimientos comerciales o de acceso hoy</p>
      </div>
    );
  }

  // Identificador de categoría basado en el texto de la descripción
  const categorizarActividad = (desc) => {
    const texto = desc.toLowerCase();
    if (texto.includes('pago') || texto.includes('factura') || texto.includes('monto') || texto.includes('c$')) {
      return { bg: 'success', label: 'Finanzas' };
    }
    if (texto.includes('asistencia') || texto.includes('ingresó') || texto.includes('entró') || texto.includes('marcó')) {
      return { bg: 'info', label: 'Acceso' };
    }
    if (texto.includes('stock') || texto.includes('producto') || texto.includes('inventario')) {
      return { bg: 'warning', label: 'Inventario' };
    }
    return { bg: 'primary', label: 'Sistema' };
  };

  return (
    <div className="bg-white rounded-3 shadow-sm border overflow-hidden">
      <Table hover responsive className="align-middle mb-0 table-borderless">
        <thead className="bg-light border-bottom text-secondary small fw-bold text-uppercase">
          <tr>
            <th className="px-4 py-3" style={{ width: '180px' }}>Fecha y Hora</th>
            <th className="py-3" style={{ width: '130px' }}>Categoría</th>
            <th className="py-3">Descripción de la Actividad</th>
            <th className="px-4 py-3 text-end" style={{ width: '150px' }}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((act, idx) => {
            const categoria = categorizarActividad(act.descripcion);
            return (
              <tr key={idx} className="border-bottom last-border-0">
                {/* Fecha formateada limpia */}
                <td className="px-4 py-3 text-muted small fw-medium">
                  {new Date(act.fecha).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                {/* Categoría Inteligente */}
                <td className="py-3">
                  <Badge 
                    bg={categoria.bg} 
                    className={`bg-opacity-10 text-${categoria.bg} rounded-pill px-2.5 py-1.5 fw-semibold`}
                    style={{ fontSize: '11px' }}
                  >
                    <FaCircle size={5} className="me-1 align-middle" /> {categoria.label}
                  </Badge>
                </td>
                {/* Descripción */}
                <td className="py-3 fw-medium text-dark">{act.descripcion}</td>
                {/* Monto Positivo Dinámico */}
                <td className="px-4 py-3 text-end fw-bold">
                  {act.monto ? (
                    <span className="text-success">+ C$ {Number(act.monto).toFixed(2)}</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default UltimasActividades;