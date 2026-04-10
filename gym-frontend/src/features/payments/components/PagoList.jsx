// src/features/pagos/components/PagosList.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { usePagos } from '../hooks/usePayments';
import FacturasPendientes from './Pendientes';
import FacturasRecientes from './Recientes';
import RegistrarAbono from './RegistrarAbono';

const PagosList = () => {
  const { facturas, facturasPendientes, ingresos, loading, registrarAbono, refresh } = usePagos();
  const [showAbonoModal, setShowAbonoModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleRegistrarAbono = async (data) => {
    await registrarAbono(data);
    setShowAbonoModal(false);
    setSelectedInvoice(null);
    refresh();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Módulo de Pagos</h2>
        <p className="text-muted small mb-0">Gestión de facturas, abonos y reportes financieros</p>
      </div>

      {/* Tarjetas de ingresos */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <h6 className="text-white-50">Ingresos Hoy</h6>
              <h3 className="fw-bold mb-0">C${ingresos.hoy?.toFixed(2) || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <h6 className="text-white-50">Ingresos Esta Semana</h6>
              <h3 className="fw-bold mb-0">C${ingresos.semana?.toFixed(2) || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <h6 className="text-white-50">Ingresos Este Mes</h6>
              <h3 className="fw-bold mb-0">C${ingresos.mes?.toFixed(2) || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ingresos por método de pago */}
      {ingresos.porMetodoPago?.length > 0 && (
        <Row className="mb-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-3">
                <h6 className="fw-bold mb-0"> Ingresos por Método de Pago (Hoy)</h6>
              </Card.Header>
              <Card.Body>
                {ingresos.porMetodoPago.map((metodo, idx) => (
                  <div key={idx} className="d-flex justify-content-between mb-2">
                    <span>{metodo.MethodName}</span>
                    <span className="fw-bold">C${metodo.total?.toFixed(2)}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Facturas pendientes */}
      <FacturasPendientes 
        facturas={facturasPendientes} 
        onRegistrarAbono={(invoice) => {
          setSelectedInvoice(invoice);
          setShowAbonoModal(true);
        }}
      />

      {/* Facturas recientes */}
      <FacturasRecientes facturas={facturas} />

      {/* Modal para registrar abono */}
      <RegistrarAbono
        show={showAbonoModal}
        handleClose={() => {
          setShowAbonoModal(false);
          setSelectedInvoice(null);
        }}
        onSubmit={handleRegistrarAbono}
        invoice={selectedInvoice}
      />
    </Container>
  );
};

export default PagosList;