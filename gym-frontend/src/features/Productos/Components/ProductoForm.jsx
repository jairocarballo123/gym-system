// src/features/productos/components/ProductoForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

const INITIAL_STATE = {
  nombre: '',
  precio: '',
  stockInicial: '',
};

const ProductoForm = ({ show, handleClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        precio: initialData.precio || '',
        stockInicial: initialData.stockActual || '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setValidated(false);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      // Error ya manejado en el padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Nombre del Producto <span className="text-danger">*</span>
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

            {!isEditing && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted small">
                    Stock Inicial
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stockInicial"
                    value={formData.stockInicial}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  <Form.Text className="text-muted">
                    Cantidad inicial en inventario
                  </Form.Text>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
            <FaTimes className="me-2" /> Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FaSave className="me-2" />
            {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Producto')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductoForm;