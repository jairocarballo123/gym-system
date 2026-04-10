// src/features/Recepcion/Components/FormularioPago.jsx
import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';

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
    <div className="formulario-pago mt-4">
      <h6 className="fw-semibold text-muted small mb-2">Forma de pago</h6>
      <Form.Group className="mb-2">
        <Form.Label className="small">Método de pago</Form.Label>
        <Form.Select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          required
        >
          <option value="">Selecciona...</option>
          <option value="1">Efectivo</option>
          <option value="2">Tarjeta de crédito/débito</option>
          <option value="3">Transferencia bancaria</option>
        </Form.Select>
      </Form.Group>

      <Row className="g-2">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small">Monto pagado</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                step="0.01"
                value={montoPagado}
                onChange={manejarMonto}
                min={0}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small">Cambio</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                readOnly
                value={cambio.toFixed(2)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mt-2">
        <Form.Label className="small">Referencia / número de voucher</Form.Label>
        <Form.Control
          type="text"
          placeholder="Opcional"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
      </Form.Group>
    </div>
  );
};

export default FormularioPago;