// src/features/productos/components/ProductoTable.jsx
import React from 'react';
import { Table, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash, FaBoxes, FaDollarSign, FaPlusCircle } from 'react-icons/fa';

const ProductoTable = ({ productos, onEdit, onDelete, onVerMovimientos, onAjustarStock }) => {
  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No hay productos registrados</p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock Actual</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((prod) => (
          <tr key={prod.id}>
            <td>{prod.id}</td>
            <td className="fw-bold">{prod.nombre}</td>
            <td>
              <span className="text-success fw-bold">
                <FaDollarSign className="me-1" /> {Number(prod.precio).toFixed(2)}
              </span>
            </td>
            <td>
              <Badge bg={prod.stockActual === 0 ? 'danger' : prod.stockActual <= 5 ? 'warning' : 'success'}>
                {prod.stockActual} unidades
              </Badge>
            </td>
            <td>
              <Badge bg={prod.statusId === 1 ? 'success' : 'danger'}>
                {prod.statusId === 1 ? 'Activo' : 'Inactivo'}
              </Badge>
            </td>
            <td>
              <OverlayTrigger placement="top" overlay={<Tooltip>Ver movimientos</Tooltip>}>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-1"
                  onClick={() => onVerMovimientos(prod)}
                >
                  <FaBoxes />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Editar producto</Tooltip>}>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-1"
                  onClick={() => onEdit(prod)}
                >
                  <FaEdit />
                </Button>
              </OverlayTrigger>
              {/* Nuevo botón Ajustar stock */}
              <OverlayTrigger placement="top" overlay={<Tooltip>Ajustar stock</Tooltip>}>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-1"
                  onClick={() => onAjustarStock(prod)}
                >
                  <FaPlusCircle /> Stock
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Desactivar producto</Tooltip>}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(prod)}
                >
                  <FaTrash />
                </Button>
              </OverlayTrigger>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductoTable;