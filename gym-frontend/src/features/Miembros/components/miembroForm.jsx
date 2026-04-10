// src/features/Miembros/components/MiembroForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { empleadoServices } from '../../Empleados/services/empleadoServices';

const INITIAL_STATE = {
  fullName: '',
  phone: '',
  address: '',
  trainerId: null,
};

const MiembroForm = ({ show, handleClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validated, setValidated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [entrenadores, setEntrenadores] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchEntrenadores = async () => {
        try {
          const res = await empleadoServices.listarEntrenadores();
          setEntrenadores(res.data);
        } catch (err) {
          console.error('Error al cargar entrenadores', err);
        }
      };
      fetchEntrenadores();
    }
  }, [show]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        trainerId: initialData.trainerId || null,
      });
      setIsEditing(true);
    } else {
      setFormData(INITIAL_STATE);
      setIsEditing(false);
    }
    setValidated(false);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'trainerId' ? (value ? parseInt(value) : null) : value,
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

    const dataToSend = {
      ...formData,
      phone: formData.phone || null,
    };

    onSubmit(dataToSend);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          {isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
        </Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Entrenador asignado</Form.Label>
                <Form.Select
                  name="trainerId"
                  value={formData.trainerId || ''}
                  onChange={handleChange}
                >
                  <option value="">Sin entrenador</option>
                  {entrenadores.map(ent => (
                    <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleClose}>
            <FaTimes className="me-2" /> Cancelar
          </Button>
          <Button variant="primary" type="submit">
            <FaSave className="me-2" /> Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MiembroForm;