// src/features/Recepcion/Components/Carrito.jsx
import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const Carrito = ({ items, onEliminar, onActualizarCantidad, total }) => {
  if (items.length === 0) {
    return <p className="text-center text-muted">Carrito vacío</p>;
  }

  return (
    <div className="carrito">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Producto/Plan</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.nombre || item.tipo}</td>
              <td style={{ width: '100px' }}>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => onActualizarCantidad(idx, parseInt(e.target.value, 10))}
                  size="sm"
                />
              </td>
              <td>${(item.precio ?? 0).toFixed(2)}</td>
              <td>${(item.subtotal ?? 0).toFixed(2)}</td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => onEliminar(idx)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end fw-bold">Total:</td>
            <td className="fw-bold">${(total ?? 0).toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default Carrito;