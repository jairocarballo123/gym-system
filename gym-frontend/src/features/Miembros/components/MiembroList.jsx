// src/features/Miembros/components/MiembroList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Spinner, Alert, Button, Container } from 'react-bootstrap';
import { useMiembro } from '../hooks/usemember';
import { miembroServices } from '../Services/MiembroServices';
import { FaUsers, FaUserCheck, FaExclamationTriangle, FaMoneyBillWave, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import MiembroTabla from './MiembroTabla'; 
import MiembroForm from './miembroForm';    

const MiembroList = () => {
  const { miembros, loading: loadingMiembros, error: errorMiembros, refresh } = useMiembro();
  const [resumen, setResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errorResumen, setErrorResumen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchResumen = useCallback(async () => {
    setLoadingResumen(true);
    try {
      const response = await miembroServices.getResumen();
      setResumen(response.data);
      setErrorResumen(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar resumen';
      setErrorResumen(msg);
      toast.error(msg);
    } finally {
      setLoadingResumen(false);
    }
  }, []);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen]);

  const handleEdit = (miembro) => {
    setEditing(miembro);
    setShowModal(true);
  };

  const handleDelete = async (miembro) => {
    if (window.confirm(`¿Desactivar a ${miembro.fullName}?`)) {
      try {
        await miembroServices.delete(miembro.id);
        toast.success('Miembro desactivado');
        refresh();
        fetchResumen();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al desactivar');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await miembroServices.update(editing.id, data);
        toast.success('Miembro actualizado');
      } else {
        await miembroServices.create(data);
        toast.success('Miembro registrado');
      }
      setShowModal(false);
      setEditing(null);
      refresh();
      fetchResumen();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loadingResumen || loadingMiembros) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (errorResumen || errorMiembros) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger" className="rounded-3 shadow-sm">{errorResumen || errorMiembros}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Encabezado Principal */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Módulo de Miembros</h2>
          <p className="text-muted small mb-0">Listado de atletas, control de asistencias y estados de cuenta</p>
        </div>
        <Button variant="primary" className="rounded-3 px-4 py-2 fw-medium shadow-sm" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Nuevo Miembro
        </Button>
      </div>

      {/* Tarjetas de Métricas Rediseñadas */}
      <Row className="mb-4 g-3">
        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 fs-3 d-inline-flex">
                <FaUsers />
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-bold text-uppercase">Total Atletas</h6>
                <h3 className="text-dark fw-bold mb-0">{resumen?.total || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-3 fs-3 d-inline-flex">
                <FaUserCheck />
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-bold text-uppercase">Activos</h6>
                <h3 className="text-dark fw-bold mb-0">{resumen?.activos || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 text-warning text-dark rounded-3 p-3 fs-3 d-inline-flex">
                <FaExclamationTriangle />
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-bold text-uppercase">Por Vencer <span className="text-secondary text-none capitalize fw-normal">(7d)</span></h6>
                <h3 className="text-dark fw-bold mb-0">{resumen?.proximosAVencer || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
            <Card.Body className="p-4 d-flex align-items-center gap-3">
              <div className="bg-danger bg-opacity-10 text-danger rounded-3 p-3 fs-3 d-inline-flex">
                <FaMoneyBillWave />
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-bold text-uppercase">Deudores</h6>
                <h3 className="text-dark fw-bold mb-0">{resumen?.deudores || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contenedor de la Tabla */}
      <MiembroTabla
        miembros={miembros}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de formulario */}
      <MiembroForm
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

export default MiembroList;