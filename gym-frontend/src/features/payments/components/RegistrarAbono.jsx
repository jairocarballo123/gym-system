// src/features/pagos/components/RegistrarAbono.jsx
import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaTimes, FaHandHoldingUsd } from 'react-icons/fa';
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
    <Modal show={show} onHide={handleClose} backdrop="static" centered contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-3 pt-4 px-4 rounded-top-4">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <FaHandHoldingUsd className="text-success me-2" />
          Registrar Nuevo Abono
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <div className="bg-success bg-opacity-10 p-3 rounded-4 mb-4">
            <Row>
              <Col xs={6}>
                <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Nº Factura</small>
                <div className="fw-bolder text-dark">{invoice?.InvoiceNumber}</div>
              </Col>
              <Col xs={6} className="text-end">
                <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Deuda Pendiente</small>
                <div className="fw-bolder fs-5 text-danger">C${invoice?.Balance?.toFixed(2)}</div>
              </Col>
              <Col xs={12} className="mt-2">
                <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Miembro</small>
                <div className="text-dark fw-medium">{invoice?.MemberName || 'Cliente ocasional'}</div>
              </Col>
            </Row>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small mb-1">
                  Monto a pagar <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">C$</span>
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
                    className="border-start-0 ps-0 form-control-lg fs-5 fw-bold text-success"
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small mb-1">Método de pago</Form.Label>
                <Form.Select
                  name="paymentMethodId"
                  value={formData.paymentMethodId}
                  onChange={handleChange}
                  className="form-control-lg fs-6"
                >
                  <option value={1}>Efectivo</option>
                  <option value={2}>Tarjeta</option>
                  <option value={3}>Transferencia</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small mb-1">Referencia (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="Ej. Nº de voucher o transferencia"
                  className="bg-light border-0"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted small mb-1">Notas (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Observaciones adicionales sobre el pago..."
                  className="bg-light border-0"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top-0 px-4 pb-4">
          <Button variant="light" onClick={handleClose} disabled={loading} className="rounded-pill px-4 fw-medium">
            <FaTimes className="me-1" /> Cancelar
          </Button>
          <Button variant="success" type="submit" disabled={loading} className="rounded-pill px-4 fw-bold shadow-sm">
            <FaSave className="me-1" />
            {loading ? 'Procesando...' : 'Confirmar Abono'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RegistrarAbono;