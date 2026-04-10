// src/features/productos/components/ProductoMovimientos.jsx
import React from 'react';
import { Modal, Table, Badge } from 'react-bootstrap';

const ProductoMovimientos = ({ show, handleClose, producto, movimientos }) => {
  if (!producto) return null;

  const getMovementBadge = (type) => {
    return type === 'ENTRADA' 
      ? <Badge bg="success">Entrada</Badge>
      : <Badge bg="warning">Salida</Badge>;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Movimientos de {producto.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!movimientos || movimientos.length === 0 ? (
          <p className="text-muted text-center">No hay movimientos registrados</p>
        ) : (
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cantidad</th>
                <th>Tipo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.MovementId}>
                  <td>{mov.MovementId}</td>
                  <td>{mov.Quantity}</td>
                  <td>{getMovementBadge(mov.MovementType)}</td>
                  <td>{new Date(mov.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProductoMovimientos;