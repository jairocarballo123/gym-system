import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaSearch, FaUsers, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

import MemberTable from './components/MemberTable'; 
import MemberForm from './memberForm'
import { useMembers } from './hooks/usemember';

const MemberList = () => {
  const { 
    members, loading, error, 
    createMember, updateMember, deleteMember, refreshMembers 
  } = useMembers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // --- FILTRADO (Por Nombre o ID) ---
  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(m => 
      (m.nombre && m.nombre.toLowerCase().includes(term)) || 
      (m.id && m.id.toLowerCase().includes(term)) 
    );
  }, [members, searchTerm]);

  const stats = useMemo(() => {
    const total = members.length;
    const activos = members.filter(m => m.estado_membresia === 'activo').length;
    const inactivos = total - activos;
    return { total, activos, inactivos };
  }, [members]);

  // --- MANEJADORES ---
  const handleSave = async (formData) => {
    try {
      Swal.fire({ title: 'Procesando...', didOpen: () => Swal.showLoading() });
      if (editingMember) {
        await updateMember(editingMember.id, formData);
        Swal.fire('¡Actualizado!', 'Datos guardados correctamente.', 'success');
      } else {
        await createMember(formData);
        Swal.fire('¡Registrado!', 'Miembro creado exitosamente.', 'success');
      }
      refreshMembers();
      setShowModal(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Error al guardar";
      Swal.fire('Error', msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar miembro?', text: "No podrás revertir esto",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#d33'
    });
    if (res.isConfirmed) {
      try {
        await deleteMember(id);
        Swal.fire('Eliminado', 'El miembro ha sido eliminado.', 'success');
        refreshMembers();
      } catch (err) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
    }
  };

  const handleOpenCreate = () => { setEditingMember(null); setShowModal(true); };
  const handleOpenEdit = (m) => { setEditingMember(m); setShowModal(true); };

  return (
    <Container fluid className="p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Gestión de Miembros</h2>
          <p className="text-muted small">Administra accesos y membresías</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shadow-sm">
          <FaPlus className="me-2"/> Nuevo Miembro
        </Button>
      </div>

      {/* ESTADÍSTICAS */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-primary border-4">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                <FaUsers size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Miembros</h6>
                <h3 className="fw-bold mb-0">{stats.total}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-success border-4">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                <FaUserCheck size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Activos</h6>
                <h3 className="fw-bold mb-0">{stats.activos}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-danger border-4">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3 text-danger">
                <FaUserTimes size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Inactivos / Vencidos</h6>
                <h3 className="fw-bold mb-0">{stats.inactivos}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BARRA DE BÚSQUEDA Y TABLA */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <InputGroup style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-light border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por ID o Nombre..."
              className="border-start-0 bg-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        
        <Card.Body className="p-0">
          {/* LOADING */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Cargando miembros...</p>
            </div>
          )}

  
          {error && (
            <div className="text-center py-5">
              <Alert variant="danger">
                {typeof error === 'string' ? error : 'Error al cargar miembros'}
              </Alert>
            </div>
          )}

          {/* TABLA */}
          {!loading && !error && (
            <MemberTable 
              members={filteredMembers} 
              onEdit={handleOpenEdit} 
              onDelete={handleDelete} 
            />
          )}
        </Card.Body>
      </Card>

      <MemberForm 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onSubmit={handleSave} 
        initialData={editingMember} 
      />
    </Container>
  );
};

export default MemberList;
