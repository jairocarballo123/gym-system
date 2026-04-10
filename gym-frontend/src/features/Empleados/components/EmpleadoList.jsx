// src/features/Empleados/components/EmpleadoList.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaUsers, FaUserCheck, FaDumbbell, FaUserShield } from 'react-icons/fa';
import { useEmpleados } from '../hooks/useEmpleados';
import { empleadoServices } from '../services/empleadoServices';
import EmpleadoTable from './EmpleadoTable';
import EmpleadoForm from './EmpleadoForm';
import toast from 'react-hot-toast';

const EmpleadoList = () => {
  const { empleados, loading, error, refresh } = useEmpleados();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const stats = {
    total: empleados.length,
    activos: empleados.filter(e => e.statusId === 1).length,
    entrenadores: empleados.filter(e => e.roleId === 2).length,
    administradores: empleados.filter(e => e.roleId === 1).length,
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setShowModal(true);
  };

  const handleDelete = async (emp) => {
    if (window.confirm(`¿Desactivar a ${emp.nombre}?`)) {
      try {
        await empleadoServices.delete(emp.id);
        toast.success('Empleado desactivado');
        refresh();
      } catch (err) {
        toast.error('Error al desactivar');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await empleadoServices.update(editing.id, data);
        toast.success('Empleado actualizado');
      } else {
        await empleadoServices.create(data);
        toast.success('Empleado creado');
      }
      setShowModal(false);
      setEditing(null);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Empleados</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Empleado
        </Button>
      </div>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <FaUsers size={30} className="text-primary mb-2" />
              <Card.Title>Total</Card.Title>
              <h3>{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <FaUserCheck size={30} className="text-success mb-2" />
              <Card.Title>Activos</Card.Title>
              <h3>{stats.activos}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <FaDumbbell size={30} className="text-info mb-2" />
              <Card.Title>Entrenadores</Card.Title>
              <h3>{stats.entrenadores}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <FaUserShield size={30} className="text-warning mb-2" />
              <Card.Title>Administradores</Card.Title>
              <h3>{stats.administradores}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EmpleadoTable
        empleados={empleados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EmpleadoForm
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

export default EmpleadoList;