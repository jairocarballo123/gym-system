// src/features/planes/components/PlanList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert, OverlayTrigger, Tooltip, Row, Col, Card } from 'react-bootstrap';
import { FaPlus, FaClipboardList } from 'react-icons/fa';
import { usePlanes } from '../hooks/useplanes';
import { planApi } from '../Services/PlanServices';
import PlanTable from '../components/planTable';
import PlanForm from '../components/planForm';
import PlanStatsCards from './PlanStatsCards';
import PlanMiembrosActivos from './PlanMiembrosActivos';
import PlanProximosVencer from './PlanProximosVencer';
import PlanIngresosReales from './PlanIngresos'; 
import toast from 'react-hot-toast';

const PlanList = () => {
  const { planes, loading, error, refresh } = usePlanes();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [masVendido, setMasVendido] = useState(null);
  const [miembrosPorPlan, setMiembrosPorPlan] = useState([]);
  const [proximosVencer, setProximosVencer] = useState([]);
  const [ingresosPorPlan, setIngresosPorPlan] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      setLoadingStats(true);
      try {
        const [res, mas, miembros, proximos, ingresos] = await Promise.all([
          planApi.getResumen(),
          planApi.getMasVendido(),
          planApi.getMiembrosPorPlan(),
          planApi.getProximosVencer(),
          planApi.getIngresosPorPlan(),
        ]);
        setResumen(res);
        setMasVendido(mas);
        setMiembrosPorPlan(miembros || []);
        setProximosVencer(proximos || []);
        setIngresosPorPlan(ingresos || []);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    cargarEstadisticas();
  }, []);

  const handleEdit = (plan) => {
    setEditing(plan);
    setShowModal(true);
  };

  const handleDelete = async (plan) => {
    if (window.confirm(`¿Estás seguro de desactivar el plan "${plan.PlanName}"?`)) {
      try {
        await planApi.delete(plan.PlanId);
        toast.success('Plan desactivado exitosamente');
        refresh();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al desactivar el plan');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await planApi.update(editing.PlanId, data);
        toast.success('Plan actualizado correctamente');
      } else {
        await planApi.create(data);
        toast.success('Nuevo plan creado');
      }
      refresh();
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger" className="rounded-3 shadow-sm">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-0">Gestión de Planes</h2>
          <p className="text-muted mb-0">Administra membresías, precios y métricas</p>
        </div>
        <OverlayTrigger placement="left" overlay={<Tooltip>Registrar nuevo plan</Tooltip>}>
          <Button variant="primary" className="rounded-pill px-4 py-2 shadow-sm fw-bold" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Nuevo Plan
          </Button>
        </OverlayTrigger>
      </div>

      {/* Tarjetas Superiores (KPIs) */}
      <PlanStatsCards resumen={resumen} masVendido={masVendido} />

      {/* Fila de Widgets (3 columnas) */}
      <Row className="g-4 mb-4">
        <Col lg={4} md={12}>
          <PlanMiembrosActivos data={miembrosPorPlan} />
        </Col>
        <Col lg={4} md={12}>
          <PlanIngresosReales data={ingresosPorPlan} />
        </Col>
        <Col lg={4} md={12}>
          <PlanProximosVencer data={proximosVencer} />
        </Col>
      </Row>

      {/* Tabla Principal */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            <FaClipboardList className="me-2 text-primary" /> Catálogo de Planes
          </h5>
        </Card.Header>
        <Card.Body className="p-4">
          <PlanTable planes={planes} onEdit={handleEdit} onDelete={handleDelete} />
        </Card.Body>
      </Card>

      {/* Modal de Formulario */}
      <PlanForm
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
        initialData={editing}
      />
    </Container>
  );
};

export default PlanList;