// src/features/pagos/components/Recientes.jsx
import React, { useState } from 'react';
import { Card, Table, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaEye } from 'react-icons/fa';
import DetalleFactura from './detallesFac'; // Manteniendo tu import original

const FacturasRecientes = ({ facturas }) => {
  const [showDetalle, setShowDetalle] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const verDetalle = (factura) => {
    setSelectedInvoice(factura);
    setShowDetalle(true);
  };

  if (!facturas || facturas.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center text-muted p-5">
          <FaFileInvoiceDollar size={40} className="mb-3 opacity-25" />
          <p className="mb-0 fw-medium">No hay facturas registradas</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded p-2 me-3 shadow-sm">
              <FaFileInvoiceDollar size={18} />
            </div>
            <h5 className="fw-bold mb-0 text-dark">Facturas Recientes</h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4 fw-semibold pb-3">Factura</th>
                  <th className="fw-semibold pb-3">Miembro</th>
                  <th className="fw-semibold pb-3">Fecha</th>
                  <th className="fw-semibold pb-3">Total</th>
                  <th className="fw-semibold pb-3">Estado</th>
                  <th className="pe-4 fw-semibold pb-3 text-end">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {facturas.slice(0, 20).map((factura) => (
                  <tr key={factura.InvoiceId} className="border-bottom border-light">
                    <td className="ps-4 py-3 fw-bold text-dark">{factura.InvoiceNumber}</td>
                    <td className="py-3 text-muted">{factura.MemberName || 'Cliente ocasional'}</td>
                    <td className="py-3 text-muted">{new Date(factura.InvoiceDate).toLocaleDateString()}</td>
                    <td className="py-3 fw-bold">C${factura.TotalAmount?.toFixed(2)}</td>
                    <td className="py-3">
                      {factura.Balance > 0 ? (
                        <Badge bg="warning-subtle" text="warning-emphasis" pill className="px-3">Pendiente</Badge>
                      ) : (
                        <Badge bg="success-subtle" text="success" pill className="px-3">Pagada</Badge>
                      )}
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <OverlayTrigger placement="top" overlay={<Tooltip>Ver detalles</Tooltip>}>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-primary rounded-circle p-2 shadow-sm"
                          onClick={() => verDetalle(factura)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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