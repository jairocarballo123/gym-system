// src/features/pagos/components/Pendientes.jsx
import React from 'react';
import { Card, Table, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaMoneyCheckAlt, FaPlus } from 'react-icons/fa';

const FacturasPendientes = ({ facturas, onRegistrarAbono }) => {
  if (!facturas || facturas.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center text-muted p-5">
          <FaMoneyCheckAlt size={40} className="mb-3 opacity-25" />
          <p className="mb-0 fw-medium">No hay facturas pendientes de pago</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-4 mb-4">
      <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
        <div className="d-flex align-items-center">
          <div className="bg-warning text-dark rounded p-2 me-3 shadow-sm">
            <FaMoneyCheckAlt size={18} />
          </div>
          <h5 className="fw-bold mb-0 text-dark">Facturas Pendientes</h5>
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
                <th className="fw-semibold pb-3">Pagado</th>
                <th className="fw-semibold pb-3">Deuda</th>
                <th className="pe-4 fw-semibold pb-3 text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.InvoiceId} className="border-bottom border-light">
                  <td className="ps-4 py-3 fw-bold text-dark">{factura.InvoiceNumber}</td>
                  <td className="py-3 text-muted">{factura.MemberName || 'Cliente ocasional'}</td>
                  <td className="py-3 text-muted">{new Date(factura.InvoiceDate).toLocaleDateString()}</td>
                  <td className="py-3 fw-medium">C${factura.TotalAmount?.toFixed(2)}</td>
                  <td className="py-3 text-success fw-medium">C${(factura.TotalAmount - factura.Balance)?.toFixed(2)}</td>
                  <td className="py-3">
                    <Badge bg="danger-subtle" text="danger" pill className="px-3 py-2 fw-bold">
                      C${factura.Balance?.toFixed(2)}
                    </Badge>
                  </td>
                  <td className="pe-4 py-3 text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-3 fw-semibold shadow-sm"
                      onClick={() => onRegistrarAbono(factura)}
                    >
                      <FaPlus className="me-1" /> Abono
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FacturasPendientes;