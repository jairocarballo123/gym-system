// src/features/pagos/components/PagosList.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaMoneyBillWave, FaCalendarWeek, FaCalendarAlt, FaWallet } from 'react-icons/fa';
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
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-0">Módulo de Pagos</h2>
        <p className="text-muted mb-0">Gestión de facturas, abonos y reportes financieros</p>
      </div>

      {/* Tarjetas de ingresos (KPIs) */}
      <Row className="mb-4 g-4">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Ingresos Hoy</span>
                  <h3 className="fw-bolder mt-2 mb-0 text-dark">C${ingresos.hoy?.toFixed(2) || 0}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <FaMoneyBillWave className="text-primary fs-4" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Esta Semana</span>
                  <h3 className="fw-bolder mt-2 mb-0 text-dark">C${ingresos.semana?.toFixed(2) || 0}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <FaCalendarWeek className="text-success fs-4" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Este Mes</span>
                  <h3 className="fw-bolder mt-2 mb-0 text-dark">C${ingresos.mes?.toFixed(2) || 0}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <FaCalendarAlt className="text-info fs-4" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100 hover-effect">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <FaWallet className="text-warning me-2 fs-5" />
                <span className="text-muted small text-uppercase fw-bold letter-spacing-1">Métodos (Hoy)</span>
              </div>
              <div className="flex-grow-1">
                {ingresos.porMetodoPago?.length > 0 ? (
                  ingresos.porMetodoPago.map((metodo, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center border-bottom border-light pb-2 mb-2">
                      <span className="text-muted small">{metodo.MethodName}</span>
                      <span className="fw-bold text-dark">C${metodo.total?.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-muted small">Sin transacciones hoy</span>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tablas de Facturas */}
      <Row className="g-4">
        <Col xl={12}>
          <FacturasPendientes 
            facturas={facturasPendientes} 
            onRegistrarAbono={(invoice) => {
              setSelectedInvoice(invoice);
              setShowAbonoModal(true);
            }}
          />
        </Col>
        <Col xl={12}>
          <FacturasRecientes facturas={facturas} />
        </Col>
      </Row>

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