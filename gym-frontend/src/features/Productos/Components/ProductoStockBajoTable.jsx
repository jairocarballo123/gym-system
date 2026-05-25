// src/features/productos/components/ProductoStockBajoTable.jsx
import React from 'react';
import { Card, Table } from 'react-bootstrap';

const ProductoStockBajoTable = ({ data }) => (
  <Card className="shadow-sm border-0 h-100">
    <Card.Body>
      <h5 className="text-danger mb-3 fw-bold">Productos con stock bajo</h5>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Stock actual</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr><td colSpan="3" className="text-center">No hay productos con stock bajo</td></tr>
          ) : (
            data.map((s) => (
              <tr key={s.id}>
                <td>{s.nombre}</td>
                <td className="fw-bold text-danger">{s.stockActual}</td>
                <td>${s.precio}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

export default ProductoStockBajoTable;