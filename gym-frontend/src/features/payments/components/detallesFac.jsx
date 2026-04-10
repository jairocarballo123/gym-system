// src/features/pagos/components/DetalleFactura.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Table, Spinner, Badge, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
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
      toast.success(`Pago eliminado`);
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
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetalle ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {/* Información de la factura */}
              <div className="bg-light p-3 rounded mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <small className="text-muted">Factura</small>
                    <div className="fw-bold">{detalleFactura?.InvoiceNumber}</div>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted">Fecha</small>
                    <div>{detalleFactura?.InvoiceDate ? new Date(detalleFactura.InvoiceDate).toLocaleString() : '-'}</div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <small className="text-muted">Miembro</small>
                    <div>{detalleFactura?.MemberName || 'Cliente ocasional'}</div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <small className="text-muted">Estado</small>
                    <div>
                      {detalleFactura?.Balance > 0 ? (
                        <Badge bg="warning">Pendiente</Badge>
                      ) : (
                        <Badge bg="success">Pagada</Badge>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <small className="text-muted">Total</small>
                    <div className="fw-bold">C${detalleFactura?.TotalAmount?.toFixed(2)}</div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <small className="text-muted">Balance</small>
                    <div className="fw-bold text-danger">C${detalleFactura?.Balance?.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Items vendidos */}
              <h6 className="fw-bold mb-2"> Items vendidos</h6>
              <Table striped bordered hover responsive size="sm" className="mb-3">
                <thead className="bg-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No hay items registrados
                      </td>
                    </tr>
                  ) : (
                    detalles.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.ItemType === 'PLAN' ? ' Plan' : ' Producto'}</td>
                        <td className="fw-bold">{item.ItemName}</td>
                        <td>{item.Quantity}</td>
                        <td>C${item.UnitPrice?.toFixed(2)}</td>
                        <td>C${item.SubTotal?.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Historial de pagos con botón eliminar SIEMPRE visible */}
              <h6 className="fw-bold mb-2"> Historial de pagos</h6>
              <Table striped bordered hover responsive size="sm">
                <thead className="bg-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Referencia</th>
                    <th>Notas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFactura && pagosFactura.length > 0 ? (
                    pagosFactura.map((pago) => (
                      <tr key={pago.PaymentId}>
                        <td>{new Date(pago.PaymentDate).toLocaleString()}</td>
                        <td className="fw-bold text-success">C${pago.AmountPaid?.toFixed(2)}</td>
                        <td>
                          {pago.PaymentMethodId === 1 ? 'Efectivo' : 
                           pago.PaymentMethodId === 2 ? 'Tarjeta' : 'Transferencia'}
                        </td>
                        <td>{pago.ReferenceNumber || '-'}</td>
                        <td>{pago.Notes || '-'}</td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleEliminarPago(pago.PaymentId, pago.AmountPaid)}
                          >
                            <FaTrash /> Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No hay pagos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Eliminar este pago de <strong>C${pagoAEliminar?.monto?.toFixed(2)}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetalleFactura;