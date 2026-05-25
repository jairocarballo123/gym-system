// src/features/pagos/components/DetalleFactura.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Table, Spinner, Badge, Button, Row, Col } from 'react-bootstrap';
import { FaTrashAlt, FaFileInvoice, FaBoxOpen, FaHistory } from 'react-icons/fa';
import { usePagos } from '../hooks/usePayments';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const DetalleFactura = ({ show, handleClose, invoiceId }) => {
  const { user } = useAuth();
  const { detalleFactura, pagosFactura, loadingDetalle, cargarDetalleFactura, eliminarPago, refresh } = usePagos();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);

  useEffect(() => {
    if (show && invoiceId) {
      cargarDetalleFactura(invoiceId);
    }
  }, [show, invoiceId, cargarDetalleFactura]);

  const handleEliminarPago = (paymentId, monto) => {
    setPagoAEliminar({ paymentId, monto });
    setShowConfirmModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!pagoAEliminar) return;
    try {
      await eliminarPago(pagoAEliminar.paymentId);
      toast.success(`Pago eliminado correctamente`);
      cargarDetalleFactura(invoiceId);
      refresh();
    } catch (error) {
      toast.error('Error al eliminar pago');
    } finally {
      setShowConfirmModal(false);
      setPagoAEliminar(null);
    }
  };

  const isAdmin = user?.roleId === 1;

  if (!invoiceId) return null;

  const detalles = detalleFactura?.Detalles || [];

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="bg-light border-bottom-0 pb-3 pt-4 px-4 rounded-top-4">
          <Modal.Title className="fw-bold d-flex align-items-center text-dark">
            <FaFileInvoice className="text-primary me-2" /> 
            Detalle de Factura
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          {loadingDetalle ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3 mb-0 small">Cargando detalles...</p>
            </div>
          ) : (
            <>
              {/* Tarjeta de Información de la factura */}
              <div className="bg-primary bg-opacity-10 p-4 rounded-4 mb-4">
                <Row className="g-3">
                  <Col md={3} xs={6}>
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Nº Factura</small>
                    <div className="fw-bolder fs-5 text-dark">{detalleFactura?.InvoiceNumber}</div>
                  </Col>
                  <Col md={3} xs={6}>
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Estado</small>
                    <div className="mt-1">
                      {detalleFactura?.Balance > 0 ? (
                        <Badge bg="warning-subtle" text="warning-emphasis" pill className="px-3">Pendiente</Badge>
                      ) : (
                        <Badge bg="success-subtle" text="success" pill className="px-3">Pagada</Badge>
                      )}
                    </div>
                  </Col>
                  <Col md={3} xs={6}>
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Total</small>
                    <div className="fw-bolder fs-5 text-dark">C${detalleFactura?.TotalAmount?.toFixed(2)}</div>
                  </Col>
                  <Col md={3} xs={6}>
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Balance</small>
                    <div className="fw-bolder fs-5 text-danger">C${detalleFactura?.Balance?.toFixed(2)}</div>
                  </Col>
                  <Col md={6} className="mt-3">
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Miembro / Cliente</small>
                    <div className="text-dark fw-medium">{detalleFactura?.MemberName || 'Cliente ocasional'}</div>
                  </Col>
                  <Col md={6} className="mt-3">
                    <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>Fecha de Emisión</small>
                    <div className="text-dark fw-medium">
                      {detalleFactura?.InvoiceDate ? new Date(detalleFactura.InvoiceDate).toLocaleString() : '-'}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Items vendidos */}
              <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                <FaBoxOpen className="text-secondary me-2" /> Ítems Facturados
              </h6>
              <div className="table-responsive border border-light rounded-4 mb-4 shadow-sm">
                <Table borderless hover size="sm" className="mb-0 align-middle">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3 fw-semibold">Tipo</th>
                      <th className="py-3 fw-semibold">Item</th>
                      <th className="text-center py-3 fw-semibold">Cant.</th>
                      <th className="py-3 fw-semibold">Precio Unit.</th>
                      <th className="pe-4 py-3 text-end fw-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">No hay items registrados</td>
                      </tr>
                    ) : (
                      detalles.map((item, idx) => (
                        <tr key={idx} className="border-top border-light">
                          <td className="ps-4 py-3">
                            <Badge bg={item.ItemType === 'PLAN' ? 'info-subtle' : 'secondary-subtle'} text={item.ItemType === 'PLAN' ? 'info' : 'secondary'} pill>
                              {item.ItemType === 'PLAN' ? 'Plan' : 'Producto'}
                            </Badge>
                          </td>
                          <td className="fw-bold text-dark py-3">{item.ItemName}</td>
                          <td className="text-center py-3">{item.Quantity}</td>
                          <td className="py-3 text-muted fw-medium">C${item.UnitPrice?.toFixed(2)}</td>
                          <td className="pe-4 py-3 text-end fw-bold text-dark">C${item.SubTotal?.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Historial de pagos */}
              <h6 className="fw-bold mb-3 d-flex align-items-center text-dark mt-4">
                <FaHistory className="text-secondary me-2" /> Historial de Pagos
              </h6>
              <div className="table-responsive border border-light rounded-4 shadow-sm">
                <Table borderless hover size="sm" className="mb-0 align-middle">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3 fw-semibold">Fecha</th>
                      <th className="py-3 fw-semibold">Monto</th>
                      <th className="py-3 fw-semibold">Método</th>
                      <th className="py-3 fw-semibold">Ref / Notas</th>
                      <th className="pe-4 py-3 text-end fw-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosFactura && pagosFactura.length > 0 ? (
                      pagosFactura.map((pago) => (
                        <tr key={pago.PaymentId} className="border-top border-light">
                          <td className="ps-4 py-3 text-muted small">{new Date(pago.PaymentDate).toLocaleString()}</td>
                          <td className="py-3 fw-bold text-success">C${pago.AmountPaid?.toFixed(2)}</td>
                          <td className="py-3">
                            <Badge bg="light" text="dark" className="border fw-medium">
                              {pago.PaymentMethodId === 1 ? 'Efectivo' : pago.PaymentMethodId === 2 ? 'Tarjeta' : 'Transferencia'}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="small text-dark fw-medium">{pago.ReferenceNumber || 'Sin referencia'}</div>
                            {pago.Notes && <div className="text-muted" style={{fontSize: '0.75rem'}}>{pago.Notes}</div>}
                          </td>
                          <td className="pe-4 py-3 text-end">
                            <Button 
                              variant="light" 
                              size="sm"
                              className="text-danger rounded-circle p-2 shadow-sm d-inline-flex align-items-center justify-content-center"
                              title="Eliminar pago"
                              onClick={() => handleEliminarPago(pago.PaymentId, pago.AmountPaid)}
                            >
                              <FaTrashAlt />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">No hay pagos registrados para esta factura</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación (Diseño Destructivo) */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered contentClassName="border-0 rounded-4 shadow-sm">
        <Modal.Header closeButton className="border-bottom-0 pb-0 pt-4 px-4">
          <Modal.Title className="fw-bold text-danger h5">Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <p className="text-muted mb-2">¿Estás seguro de que deseas eliminar este pago por la cantidad de <strong className="text-dark">C${pagoAEliminar?.monto?.toFixed(2)}</strong>?</p>
          <p className="small text-danger mb-0 fw-medium">Esta acción no se puede deshacer y el saldo pendiente de la factura se recalculará automáticamente.</p>
        </Modal.Body>
        <Modal.Footer className="border-top-0 px-4 pb-4 pt-2">
          <Button variant="light" className="rounded-pill px-4 fw-medium" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={confirmarEliminacion}>
            Sí, eliminar pago
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetalleFactura;