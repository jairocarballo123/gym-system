// src/features/asistencias/components/AsistenciasList.jsx
import React from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useAsistencias } from '../hooks/useAsistencias';
import RegistrarEntrada from './RegistrarEntrada';
import AsistenciasTable from './AsistenciaTable';
import AsistenciasStats from './AsistenciasStats';

const AsistenciasList = () => {
  const { asistenciasHoy, stats, loading, loadingStats, registrarEntrada } = useAsistencias();

  if (loading || loadingStats) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Control de Asistencias</h2>
        <p className="text-muted small mb-0">Registro de entradas y estadísticas de afluencia</p>
      </div>

      <RegistrarEntrada onRegistrar={registrarEntrada} loading={loading} />

      <AsistenciasStats stats={stats} />

      <h5 className="mt-4 mb-3"> Asistencias de hoy</h5>
      <AsistenciasTable asistencias={asistenciasHoy} />
    </Container>
  );
};

export default AsistenciasList;