// src/features/planes/components/PlanForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

const INITIAL_STATE = {
  nombre: '',
  precio: '',
  duracion_dias: '',
  descripcion: '',
  isAddOn: false,
};

const PlanForm = ({ show, handleClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData?.PlanId;

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.PlanName || '',
        precio: initialData.Price || '',
        duracion_dias: initialData.DurationDays || '',
        descripcion: initialData.Description || '',
        isAddOn: initialData.IsAddOn || false,
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setValidated(false);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    if (parseFloat(formData.precio) <= 0) {
      toast.error('El precio debe ser mayor a cero');
      return;
    }

    if (parseInt(formData.duracion_dias) <= 0) {
      toast.error('La duración debe ser mayor a cero');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      // El error ya se maneja en el padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          {isEditing ? 'Editar Plan' : 'Nuevo Plan'}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Nombre del Plan <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  El nombre es requerido
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Precio <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  El precio es requerido
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Duración (días) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  name="duracion_dias"
                  value={formData.duracion_dias}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  La duración es requerida
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Beneficios del plan..."
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Check
                type="checkbox"
                label="¿Es un plan complementario (adicional)?"
                name="isAddOn"
                checked={formData.isAddOn}
                onChange={handleChange}
                className="mt-2"
              />
              <Form.Text className="text-muted">
                Los planes complementarios pueden agregarse a una membresía principal.
              </Form.Text>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
            <FaTimes className="me-2" /> Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FaSave className="me-2" />
            {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Plan')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PlanForm;