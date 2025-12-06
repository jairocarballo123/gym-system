import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap';
import { FaPlus, FaSearch, FaUserTie, FaDumbbell } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

import EmpleadoTable from './components/EmpleadoTable';
import EmpleadoForm from './components/EmpleadoForm';
import { useEmpleados } from './hooks/useEmpleados';

const EmpleadosList = () => {
  const { empleados, loading, error, createEmpleado, updateEmpleado, deleteEmpleado, refreshEmpleados } = useEmpleados();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  // --- ESTADÍSTICAS ---
  const stats = useMemo(() => {
    return {
      total: empleados.length,
      entrenadores: empleados.filter(e => e.rol === 'entrenador').length,
      admins: empleados.filter(e => e.rol === 'admin').length
    };
  }, [empleados]);

  // --- FILTRO ---
  const filteredEmpleados = useMemo(() => {
    if (!searchTerm) return empleados;
    const term = searchTerm.toLowerCase();
    return empleados.filter(e => 
      e.nombre.toLowerCase().includes(term) || 
      e.id?.toString().toLowerCase().includes(term) ||
      e.rol?.toLowerCase().includes(term)
    );
  }, [empleados, searchTerm]);

  // --- HANDLERS ---
  const handleSave = async (formData) => {
    try {
      Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
      if (editingEmpleado) {
        await updateEmpleado(editingEmpleado.id, formData);
        Swal.fire('¡Actualizado!', 'Datos guardados correctamente.', 'success');
      } else {
        await createEmpleado(formData);
        Swal.fire('¡Registrado!', 'Empleado creado exitosamente.', 'success');
      }
      setShowModal(false);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar empleado?', text: "Esta acción no se puede deshacer", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33'
    });
    if (res.isConfirmed) {
      try {
        await deleteEmpleado(id);
        Swal.fire('Eliminado', 'Empleado eliminado.', 'success');
      } catch (err) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
    }
  };

  const handleOpenCreate = () => { setEditingEmpleado(null); setShowModal(true); };
  const handleOpenEdit = (e) => { setEditingEmpleado(e); setShowModal(true); };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Gestión de Personal</h2>
          <Button variant="primary" onClick={handleOpenCreate}>
            <FaPlus className="me-2"/> Nuevo Empleado
          </Button>
      </div>

      {/* TARJETAS DE INFO */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-primary border-4">
            <Card.Body>
              <h6 className="text-muted">Total Personal</h6>
              <h3 className="fw-bold">{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-info border-4">
            <Card.Body className="d-flex align-items-center">
              <FaDumbbell className="text-info me-3" size={24}/>
              <div>
                <h6 className="text-muted mb-0">Entrenadores</h6>
                <h3 className="fw-bold mb-0">{stats.entrenadores}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-danger border-4">
            <Card.Body className="d-flex align-items-center">
              <FaUserTie className="text-danger me-3" size={24}/>
              <div>
                <h6 className="text-muted mb-0">Administrativos</h6>
                <h3 className="fw-bold mb-0">{stats.admins}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* TABLA Y FILTRO */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <InputGroup style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-light"><FaSearch /></InputGroup.Text>
            <Form.Control 
              placeholder="Buscar por Nombre, ID o Rol..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
           <EmpleadoTable empleados={filteredEmpleados} onEdit={handleOpenEdit} onDelete={handleDelete} /> 
        </Card.Body>
      </Card>

      <EmpleadoForm 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onSubmit={handleSave} 
        initialData={editingEmpleado} 
      />
    </Container>
  );
};

export default EmpleadosList;