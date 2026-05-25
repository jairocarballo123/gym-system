// src/features/Recepcion/Components/FormularioPago.jsx
import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';

const FormularioPago = ({
  metodoPago,
  setMetodoPago,
  montoPagado,
  setMontoPagado,
  referencia,
  setReferencia,
  total,
}) => {
  const [cambio, setCambio] = useState(0);

  useEffect(() => {
    if (montoPagado >= total) {
      setCambio(montoPagado - total);
    } else {
      setCambio(0);
    }
  }, [montoPagado, total]);

  const manejarMonto = (e) => {
    const valor = parseFloat(e.target.value);
    setMontoPagado(isNaN(valor) ? 0 : valor);
  };

  return (
    <div className="formulario-pago bg-light p-3 rounded-4">
      <Form.Group className="mb-3">
        <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">
          Método de pago
        </Form.Label>
        <Form.Select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="border-0 shadow-sm py-2 rounded-3"
          required
        >
          <option value="">Selecciona...</option>
          <option value="1">💵 Efectivo</option>
          <option value="2">💳 Tarjeta de crédito/débito</option>
          <option value="3">🏦 Transferencia bancaria</option>
        </Form.Select>
      </Form.Group>

      <Row className="g-3 mb-3">
        <Col xs={6}>
          <Form.Group>
            <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">
              Monto pagado
            </Form.Label>
            <InputGroup className="shadow-sm rounded-3">
              <InputGroup.Text className="bg-white border-0 text-muted">
                <FaMoneyBillWave />
              </InputGroup.Text>
              <Form.Control
                type="number"
                step="0.01"
                min={0}
                value={montoPagado === 0 ? '' : montoPagado}
                onChange={manejarMonto}
                className="border-0 py-2 fw-semibold"
                placeholder="0.00"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col xs={6}>
          <Form.Group>
            <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">
              Cambio
            </Form.Label>
            <InputGroup className="shadow-sm rounded-3">
              <InputGroup.Text className="bg-primary text-white border-0">
                <FaExchangeAlt />
              </InputGroup.Text>
              <Form.Control
                type="text"
                readOnly
                value={`$${cambio.toFixed(2)}`}
                className="border-0 py-2 fw-bold bg-white text-success text-end"
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Campo de Referencia siempre visible */}
      <Form.Group>
        <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">
          Referencia / número de voucher
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Opcional"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          className="border-0 shadow-sm py-2 rounded-3"
        />
      </Form.Group>

      {/* Resumen del Total */}
      <div className="mt-3 pt-3 border-top border-dark-subtle d-flex justify-content-between align-items-center">
        <span className="text-uppercase fw-bold text-muted">Total a Pagar</span>
        <span className="fs-3 fw-bolder text-dark">${(total ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default FormularioPago;