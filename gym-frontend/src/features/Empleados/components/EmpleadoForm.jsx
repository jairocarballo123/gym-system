// src/features/Empleados/components/EmpleadoForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

const ROLES = { ADMIN: 1, ENTRENADOR: 2, RECEPCIONISTA: 3 };

const INITIAL_STATE = {
  nombre: '',
  telefono: '',
  roleId: ROLES,
  especialidad: '',
  disponibilidad: '',
  password: '',
};

const EmpleadoForm = ({ show, handleClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validated, setValidated] = useState(false);
  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || initialData.fullName || '',
        telefono: initialData.telefono || initialData.phone || '',
        roleId: initialData.roleId || ROLES.ENTRENADOR,
        especialidad: initialData.especialidad || '',
        disponibilidad: initialData.disponibilidad || '',
        password: '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setValidated(false);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };


  const handleSubmit = (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.stopPropagation();
    setValidated(true);
    return;
  }

 
  const payload = {
    nombre: formData.nombre,
    telefono: formData.telefono,
    roleId: formData.roleId,
    statusId: 1,
  };

  if (formData.roleId === 2) {
    if (formData.especialidad) payload.especialidad = formData.especialidad;
    if (formData.disponibilidad) payload.disponibilidad = formData.disponibilidad;
  }

  if (formData.password) payload.password = formData.password;

  onSubmit(payload);
};
 

  const isEntrenador = formData.roleId === ROLES.ENTRENADOR;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Rol *</Form.Label>
                <Form.Select name="roleId" value={formData.roleId} onChange={handleChange} required>
                  <option value={ROLES.ENTRENADOR}>Entrenador</option>
                  <option value={ROLES.RECEPCIONISTA}>Recepcionista</option>
                  <option value={ROLES.ADMIN}>Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {isEntrenador && (
              <>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control
                      type="text"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      placeholder="Ej. Musculación, Crossfit, Yoga"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Disponibilidad (horario)</Form.Label>
                    <Form.Control
                      type="text"
                      name="disponibilidad"
                      value={formData.disponibilidad}
                      onChange={handleChange}
                      placeholder="Ej. Lun-Vie 8-12, 15-19"
                    />
                  </Form.Group>
                </Col>
              </>
            )}

            {(!isEditing || (isEditing && formData.roleId === ROLES.ADMIN)) && (
              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    Contraseña {!isEditing && formData.roleId === ROLES.ADMIN && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditing && formData.roleId === ROLES.ADMIN}
                  />
                  <Form.Text className="text-muted">
                    {isEditing ? 'Dejar vacío para no cambiar' : 'Obligatoria para administradores'}
                  </Form.Text>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FaTimes /> Cancelar
          </Button>
          <Button variant="primary" type="submit">
            <FaSave /> {isEditing ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EmpleadoForm;