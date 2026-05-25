// src/features/asistencias/components/AsistenciasList.jsx
import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { FaClipboardCheck } from 'react-icons/fa';
import { useAsistencias } from '../hooks/useAsistencias';
import RegistrarEntrada from './RegistrarEntrada';
import AsistenciasTable from './AsistenciaTable';
import AsistenciasStats from './AsistenciasStats';

const AsistenciasList = () => {
  const { asistenciasHoy, stats, loading, loadingStats, registrarEntrada } = useAsistencias();

  if (loading || loadingStats) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-3 mb-0 small">Cargando datos de asistencia...</p>
      </div>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="mb-4 d-flex align-items-center">
        <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
          <FaClipboardCheck className="text-primary fs-4" />
        </div>
        <div>
          <h2 className="fw-bold text-dark mb-0">Control de Asistencias</h2>
          <p className="text-muted small mb-0">Registro de entradas y estadísticas de afluencia</p>
        </div>
      </div>

      <RegistrarEntrada onRegistrar={registrarEntrada} loading={loading} />

      <AsistenciasStats stats={stats} />

      <div className="mt-5">
        <h5 className="fw-bold mb-3 text-dark d-flex align-items-center">
          <FaClipboardCheck className="text-secondary me-2" /> Asistencias de Hoy
        </h5>
        <AsistenciasTable asistencias={asistenciasHoy} />
      </div>
    </Container>
  );
};

export default AsistenciasList;