// src/features/productos/components/ProductoMasVendidosTable.jsx
import React from 'react';
import { Card, Table } from 'react-bootstrap';

const ProductoMasVendidosTable = ({ data }) => (
  <Card className="shadow-sm border-0 h-100">
    <Card.Body>
      <h5 className="text-primary mb-3 fw-bold">Productos más vendidos</h5>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Unidades vendidas</th>
            <th>Total vendido</th>
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr><td colSpan="3" className="text-center">No hay registros</td></tr>
          ) : (
            data.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.unidadesVendidas}</td>
                <td>${p.totalVendido}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

export default ProductoMasVendidosTable;