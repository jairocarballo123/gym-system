// src/features/Recepcion/Components/NuevoSocioModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { planApi } from '../../planes/Services/PlanServices';

const NuevoSocioModal = ({ show, handleClose, onCreateSocio, loading, cashierId }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    planId: '',
    paymentMethodId: '',
    currencyId: 1
  });
  const [planes, setPlanes] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (show) {
      cargarPlanes();
    }
  }, [show]);

  const cargarPlanes = async () => {
    try {
      const res = await planApi.getAll();
      setPlanes(res);
    } catch (err) {
      console.error(err);
    }
  };

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

    const socioData = {
      fullName: formData.fullName,
      phone: formData.phone || null,
      address: formData.address || null,
      planId: parseInt(formData.planId),
      paymentMethodId: parseInt(formData.paymentMethodId),
      currencyId: parseInt(formData.currencyId),
      cashierId: cashierId
    };

    const success = await onCreateSocio(socioData);
    if (success) {
      setFormData({ fullName: '', phone: '', address: '', planId: '', paymentMethodId: '' });
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">Registrar Nuevo Socio</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Nombre Completo <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Plan <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="planId"
                  value={formData.planId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar plan...</option>
                  {planes.map(plan => (
                    <option key={plan.PlanId} value={plan.PlanId}>
                      {plan.PlanName} - ${plan.Price}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Moneda</Form.Label>
                <Form.Select
                  name="currencyId"
                  value={formData.currencyId}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Córdobas (NIO)</option>
                  <option value="2">Dólares (USD)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Método de pago <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="paymentMethodId"
                  value={formData.paymentMethodId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="1">Efectivo</option>
                  <option value="2">Tarjeta</option>
                  <option value="3">Transferencia</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top-0 bg-light">
          <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
            <FaTimes className="me-2" /> Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FaSave className="me-2" />
            {loading ? 'Registrando...' : 'Registrar Socio'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NuevoSocioModal;