// src/features/planes/components/PlanList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { usePlanes } from '../hooks/usePlanes';
import { planApi } from '../Services/PlanServices';
import PlanTable from './PlanTable';
import PlanForm from './PlanForm';
import PlanStatsCards from './PlanStatsCards';
import PlanMiembrosActivos from './PlanMiembrosActivos';
import PlanProximosVencer from './/PlanProximosVencer';
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
    if (window.confirm(`¿Desactivar el plan "${plan.PlanName}"?`)) {
      try {
        await planApi.delete(plan.PlanId);
        toast.success('Plan desactivado');
        refresh();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al desactivar');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await planApi.update(editing.PlanId, data);
        toast.success('Plan actualizado');
      } else {
        await planApi.create(data);
        toast.success('Plan creado');
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
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestión de Planes</h2>
          <p className="text-muted small mb-0">Administra las membresías y servicios del gimnasio</p>
        </div>
        <OverlayTrigger placement="left" overlay={<Tooltip>Registrar nuevo plan</Tooltip>}>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Nuevo Plan
          </Button>
        </OverlayTrigger>
      </div>

      <PlanStatsCards resumen={resumen} masVendido={masVendido} />

      <PlanMiembrosActivos data={miembrosPorPlan} />
      <PlanProximosVencer data={proximosVencer} />
      <PlanIngresosReales data={ingresosPorPlan} />

      <PlanTable planes={planes} onEdit={handleEdit} onDelete={handleDelete} />

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