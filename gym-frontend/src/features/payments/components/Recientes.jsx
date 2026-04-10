// src/features/pagos/components/FacturasRecientes.jsx
import React, { useState } from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { FaEye, FaPrint } from 'react-icons/fa';
import DetalleFactura from './detallesFac';

const FacturasRecientes = ({ facturas }) => {
  const [showDetalle, setShowDetalle] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const verDetalle = (factura) => {
    setSelectedInvoice(factura);
    setShowDetalle(true);
  };

  if (!facturas || facturas.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center text-muted py-4">
          <p>No hay facturas registradas</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 pt-3">
          <h6 className="fw-bold mb-0">📋 Facturas Recientes</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered hover responsive size="sm" className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Factura</th>
                <th>Miembro</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {facturas.slice(0, 20).map((factura) => (
                <tr key={factura.InvoiceId}>
                  <td className="fw-bold">{factura.InvoiceNumber}</td>
                  <td>{factura.MemberName || 'Cliente ocasional'}</td>
                  <td>{new Date(factura.InvoiceDate).toLocaleDateString()}</td>
                  <td>C${factura.TotalAmount?.toFixed(2)}</td>
                  <td>
                    {factura.Balance > 0 ? (
                      <Badge bg="warning">Pendiente</Badge>
                    ) : (
                      <Badge bg="success">Pagada</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => verDetalle(factura)}
                    >
                      <FaEye /> Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <DetalleFactura
        show={showDetalle}
        handleClose={() => {
          setShowDetalle(false);
          setSelectedInvoice(null);
        }}
        invoiceId={selectedInvoice?.InvoiceId}
      />
    </>
  );
};

export default FacturasRecientes;