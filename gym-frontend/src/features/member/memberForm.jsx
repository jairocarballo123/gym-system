import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const MemberForm = ({ show, handleClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    plan_id: '', 
    estadoMembresia: 'activo',
    entrenadorId: ''
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nombre: '', direccion: '', telefono: '', 
        plan_id: '' , fechaVencimiento: new Date().toISOString().split('T')[0] , estadoMembresia: '', entrenadorId: ''
      });
    }
  }, [initialData, show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="h5">{initialData ? 'Editar Miembro' : 'Nuevo Registro'}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                placeholder="Ej: Juan Pérez"
              />
            </Col>
            
            <Col md={6} className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                required 
              />
            </Col>
            
            <Col md={6} className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Plan ID (Ej: P01)</Form.Label>
              <Form.Control 
                name="plan_id" 
                value={formData.plan_id || ''} 
                onChange={handleChange} 
              />
            </Col>

            <Col md={6} className="mb-3">
               <Form.Label>Entrenador ID</Form.Label>
               <Form.Control 
                 name="entrenadorId" 
                 value={formData.entrenadorId|| ''} 
                 onChange={handleChange} 
               />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Guardar Cambios' : 'Registrar Miembro'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MemberForm;