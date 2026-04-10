// src/features/Miembros/components/MiembroList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useMiembro } from '../hooks/usemember';
import { miembroServices } from '../Services/MiembroServices';
import { FaUsers, FaUserCheck, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
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

  // Función para cargar el resumen (puede reutilizarse)
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

  // Cargar resumen al montar el componente
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
        refresh();        // Recargar lista de miembros
        fetchResumen();   // Recargar resumen (tarjetas)
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
      refresh();        // Recargar lista de miembros
      fetchResumen();   // Recargar resumen (tarjetas)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loadingResumen || loadingMiembros) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (errorResumen || errorMiembros) {
    return <Alert variant="danger">{errorResumen || errorMiembros}</Alert>;
  }

  return (
    <div>
      {/* Tarjetas de resumen */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center border-primary shadow-sm">
            <Card.Body>
              <FaUsers size={30} className="text-primary mb-2" />
              <Card.Title className="text-muted">Total Miembros</Card.Title>
              <h2 className="text-primary fw-bold">{resumen?.total || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success shadow-sm">
            <Card.Body>
              <FaUserCheck size={30} className="text-success mb-2" />
              <Card.Title className="text-muted">Activos</Card.Title>
              <h2 className="text-success fw-bold">{resumen?.activos || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning shadow-sm">
            <Card.Body>
              <FaExclamationTriangle size={30} className="text-warning mb-2" />
              <Card.Title className="text-muted">Próximos a vencer</Card.Title>
              <h2 className="text-warning fw-bold">{resumen?.proximosAVencer || 0}</h2>
              <small className="text-muted">en 7 días</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-danger shadow-sm">
            <Card.Body>
              <FaMoneyBillWave size={30} className="text-danger mb-2" />
              <Card.Title className="text-muted">Deudores</Card.Title>
              <h2 className="text-danger fw-bold">{resumen?.deudores || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de miembros */}
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
    </div>
  );
};

export default MiembroList;