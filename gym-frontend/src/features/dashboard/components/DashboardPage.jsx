// src/features/Dashboard/components/DashboardPage.jsx
import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useDashboard } from '../Hooks/useDashboard';
import SaludoUsuario from './SaludoUsuario';
import BotonesAcceso from './BotonesAcceso';
import TarjetasResumen from './TarjetasResumen';
import UltimasActividades from './UltimasActividades';

const DashboardPage = () => {
  const { user, resumen, actividades, loading } = useDashboard();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="p-4 bg-light bg-opacity-25" style={{ minHeight: '100vh' }}>
      {/* Encabezado e identificación */}
      <SaludoUsuario nombre={user?.nombre || 'Usuario'} />
      
      {/* Secciones del Dashboard */}
      <BotonesAcceso />
      <TarjetasResumen data={resumen} />
      
      {/* Título de la Bitácora */}
      <div className="mt-4 mb-2">
        <h5 className="fw-bold text-dark mb-1">Monitoreo de Actividades</h5>
        <p className="text-muted small mb-3">Flujo operativo y transaccional registrado de manera automática el día de hoy</p>
      </div>
      
      <UltimasActividades actividades={actividades} />
    </Container>
  );
};

export default DashboardPage;