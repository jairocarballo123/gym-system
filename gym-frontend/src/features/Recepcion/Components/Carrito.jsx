// src/features/Recepcion/Components/Carrito.jsx
import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

const Carrito = ({ items, onEliminar, onActualizarCantidad }) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted py-5 bg-light rounded-3 border-dashed">
        <p className="mb-0">Aún no hay items en la venta</p>
      </div>
    );
  }

  return (
    <div className="carrito table-responsive">
      <Table borderless className="align-middle mb-0">
        <thead className="border-bottom text-muted small text-uppercase">
          <tr>
            <th className="fw-semibold pb-2">Descripción</th>
            <th className="fw-semibold pb-2 text-center" style={{ width: '90px' }}>Cant.</th>
            <th className="fw-semibold pb-2 text-end">Subtotal</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-bottom border-light">
              <td className="py-3">
                <span className="fw-semibold text-dark d-block">{item.nombre || item.tipo}</span>
                <span className="small text-muted">${(item.precio ?? 0).toFixed(2)} c/u</span>
              </td>
              <td className="py-3">
                <Form.Control
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => onActualizarCantidad(idx, parseInt(e.target.value, 10))}
                  className="text-center rounded-3 p-1 form-control-sm"
                />
              </td>
              <td className="py-3 text-end fw-semibold text-dark">
                ${(item.subtotal ?? 0).toFixed(2)}
              </td>
              <td className="py-3 text-end">
                <Button variant="light" size="sm" className="text-danger rounded-circle p-2" onClick={() => onEliminar(idx)}>
                  <FaRegTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Carrito;