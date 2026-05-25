// src/features/Empleados/components/EmpleadoList.jsx
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { FaUsers, FaUserCheck, FaDumbbell, FaUserShield, FaSearch, FaPlus } from 'react-icons/fa';
import { useEmpleados } from '../hooks/useEmpleados';
import EmpleadoTable from './EmpleadoTable';
import EmpleadoForm from './EmpleadoForm';

const EmpleadoList = () => {
  // Consumimos limpia y puramente lo que expone tu Hook
  const { empleados, loading, error, crearEmpleado, actualizarEmpleado, desactivarEmpleado } = useEmpleados();
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // 1. Estadísticas rápidas calculadas en memoria
  const stats = useMemo(() => {
    return {
      total: empleados.length,
      activos: empleados.filter(e => e.statusId === 1).length,
      entrenadores: empleados.filter(e => e.roleId === 2).length,
      administradores: empleados.filter(e => e.roleId === 1).length,
    };
  }, [empleados]);

  // 2. Filtro de búsqueda en tiempo real (Frontend)
  const empleadosFiltrados = useMemo(() => {
    return empleados.filter(emp => 
      emp.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (emp.telefono && emp.telefono.includes(busqueda))
    );
  }, [empleados, busqueda]);

  // 3. Orquestación de Guardado utilizando las bondades del Hook
  const handleSave = async (data) => {
    try {
      if (editing) {
        await actualizarEmpleado(editing.id, data);
      } else {
        await crearEmpleado(data);
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      // Los errores ya los maneja el hook mediante toast, detenemos la UI de forma segura
      console.error("Error capturado en vista:", err);
    }
  };

  const handleOpenDelete = async (emp) => {
    if (window.confirm(`¿Seguro que deseas desactivar a el empleado ${emp.nombre}?`)) {
      try {
        await desactivarEmpleado(emp.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <p className="text-muted small fw-medium">Cargando personal del centro...</p>
        </div>
      </div>
    );
  }

  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Encabezado Principal */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestión de Empleados</h2>
          <p className="text-muted small mb-0">Control operativo, rendimiento mensual y asignación de horarios.</p>
        </div>
        <Button variant="primary" className="fw-semibold px-4 shadow-sm" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Nuevo Empleado
        </Button>
      </div>

      {/* Tarjetas de Indicadores */}
      <Row className="mb-4 g-3">
        {[
          { title: 'Total', value: stats.total, icon: <FaUsers size={22} />, color: 'primary' },
          { title: 'Activos', value: stats.activos, icon: <FaUserCheck size={22} />, color: 'success' },
          { title: 'Entrenadores', value: stats.entrenadores, icon: <FaDumbbell size={22} />, color: 'info' },
          { title: 'Administradores', value: stats.administradores, icon: <FaUserShield size={22} />, color: 'danger' }
        ].map((card, i) => (
          <Col key={i} xs={12} sm={6} md={3}>
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="d-flex align-items-center justify-content-between p-3">
                <div>
                  <span className="text-muted small text-uppercase fw-bold tracking-wider">{card.title}</span>
                  <h3 className="fw-bold text-dark mb-0 mt-1">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-circle bg-${card.color} bg-opacity-10 text-${card.color}`}>
                  {card.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Barra de Herramientas (Filtros) */}
      <Card className="border-0 shadow-sm mb-4 p-3 bg-white rounded-3">
        <Row className="align-items-center">
          <Col md={6} lg={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <FaSearch size={14} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                className="bg-light border-start-0 ps-1"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Card>

      {/* Renderizado de la Tabla */}
      <EmpleadoTable
        empleados={empleadosFiltrados}
        onEdit={(emp) => { setEditing(emp); setShowModal(true); }}
        onDelete={handleOpenDelete}
      />

      {/* Formulario Modal Modular */}
      <EmpleadoForm
        show={showModal}
        handleClose={() => { setShowModal(false); setEditing(null); }}
        onSubmit={handleSave}
        initialData={editing}
      />
    </Container>
  );
};

export default EmpleadoList;