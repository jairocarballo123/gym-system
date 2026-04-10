// src/features/pagos/components/FacturasPendientes.jsx
import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { FaMoneyBillWave } from 'react-icons/fa';

const FacturasPendientes = ({ facturas, onRegistrarAbono }) => {
  if (!facturas || facturas.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center text-muted py-4">
          <FaMoneyBillWave size={40} className="mb-2 opacity-50" />
          <p>No hay facturas pendientes</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white border-0 pt-3">
        <h6 className="fw-bold mb-0 text-warning"> Facturas Pendientes (con deuda)</h6>
      </Card.Header>
      <Card.Body className="p-0">
        <Table striped bordered hover responsive size="sm" className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Factura</th>
              <th>Miembro</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Pagado</th>
              <th>Deuda</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.InvoiceId}>
                <td className="fw-bold">{factura.InvoiceNumber}</td>
                <td>{factura.MemberName || 'Cliente ocasional'}</td>
                <td>{new Date(factura.InvoiceDate).toLocaleDateString()}</td>
                <td>C${factura.TotalAmount?.toFixed(2)}</td>
                <td>C${(factura.TotalAmount - factura.Balance)?.toFixed(2)}</td>
                <td>
                  <Badge bg="danger">C${factura.Balance?.toFixed(2)}</Badge>
                </td>
                <td>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onRegistrarAbono(factura)}
                  >
                    Registrar Abono
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default FacturasPendientes;