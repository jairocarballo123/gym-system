// src/features/pagos/components/RegistrarAbono.jsx
import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegistrarAbono = ({ show, handleClose, onSubmit, invoice }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethodId: 1,
    referenceNumber: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast.error('Ingrese un monto válido');
      return;
    }

    if (amount > invoice?.Balance) {
      toast.error(`El monto no puede superar la deuda pendiente (C$${invoice?.Balance})`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        invoiceId: invoice?.InvoiceId,
        amount,
        paymentMethodId: parseInt(formData.paymentMethodId),
        referenceNumber: formData.referenceNumber || null,
        notes: formData.notes || null
      });
      setFormData({ amount: '', paymentMethodId: 1, referenceNumber: '', notes: '' });
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) return null;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">Registrar Abono</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          <div className="bg-light p-3 rounded mb-3">
            <Row>
              <Col md={6}>
                <small className="text-muted">Factura</small>
                <div className="fw-bold">{invoice?.InvoiceNumber}</div>
              </Col>
              <Col md={6}>
                <small className="text-muted">Deuda pendiente</small>
                <div className="fw-bold text-danger">C${invoice?.Balance?.toFixed(2)}</div>
              </Col>
              <Col md={12} className="mt-2">
                <small className="text-muted">Miembro</small>
                <div>{invoice?.MemberName || 'Cliente ocasional'}</div>
              </Col>
            </Row>
          </div>

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">
                  Monto a pagar <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={invoice?.Balance}
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Método de pago</Form.Label>
                <Form.Select
                  name="paymentMethodId"
                  value={formData.paymentMethodId}
                  onChange={handleChange}
                >
                  <option value={1}>Efectivo</option>
                  <option value={2}>Tarjeta</option>
                  <option value={3}>Transferencia</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Referencia (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="Número de voucher o transferencia"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small">Notas (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Observaciones del abono..."
                />
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
            {loading ? 'Registrando...' : 'Registrar Abono'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RegistrarAbono;