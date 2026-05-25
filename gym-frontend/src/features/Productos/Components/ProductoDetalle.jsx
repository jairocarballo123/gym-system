// src/features/productos/components/ProductoDetalle.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaBox, FaDollarSign, FaChartLine, FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useProductos } from '../Hooks/useProductos';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detalle, fetchDetalle, loading, error } = useProductos();

  useEffect(() => {
    if (id) {
      fetchDetalle(id);
    }
  }, [id, fetchDetalle]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '200px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !detalle) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="rounded-3 shadow-sm">{error || 'No se encontró el producto'}</Alert>
        <Button variant="secondary" className="rounded-2" onClick={() => navigate('/Stock')}>
          <FaArrowLeft className="me-2" /> Volver al inventario
        </Button>
      </Container>
    );
  }

  const { producto, movimientos } = detalle;

  return (
    <Container fluid className="p-4">
      {/* Botón de retroceso estilizado */}
      <Button 
        variant="light" 
        className="mb-4 rounded-3 border bg-white shadow-sm fw-medium text-secondary d-inline-flex align-items-center"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Volver al listado
      </Button>

      <Row className="g-4">
        {/* Tarjeta Lateral de Información del Producto */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="bg-primary bg-opacity-10 p-4 text-center border-bottom">
              <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-3 text-primary">
                <FaBox size={32} />
              </div>
              <h4 className="fw-bold text-dark mb-1">{producto?.nombre}</h4>
              <Badge 
                bg={producto?.statusId === 1 ? 'success' : 'secondary'} 
                className={`bg-opacity-10 ${producto?.statusId === 1 ? 'text-success' : 'text-secondary'} rounded-pill px-3 py-1.5 mt-2`}
              >
                ● {producto?.statusId === 1 ? 'Activo en Catálogo' : 'Inactivo'}
              </Badge>
            </div>
            <Card.Body className="p-4">
              <h6 className="text-uppercase text-muted fw-bold tracking-wider small mb-4">Detalles Comerciales</h6>
              
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span className="text-muted d-flex align-items-center"><FaDollarSign className="me-2 text-secondary" /> Precio Público</span>
                <span className="fw-bold text-dark fs-5">${Number(producto?.precio).toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span className="text-muted d-flex align-items-center"><FaChartLine className="me-2 text-secondary" /> Stock Físico</span>
                <span className={`fw-bold fs-5 ${producto?.stockActual <= 5 ? 'text-warning' : 'text-success'}`}>
                  {producto?.stockActual} unidades
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Tabla de Movimientos del Historial de Stock */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-info bg-opacity-10 text-info rounded p-2 d-inline-flex">
                  <FaHistory size={18} />
                </div>
                <h5 className="fw-bold text-dark mb-0">Kardex / Movimientos de Inventario</h5>
              </div>

              <div className="border rounded-3 overflow-hidden">
                <Table hover responsive className="align-middle mb-0 table-borderless">
                  <thead className="bg-light border-bottom text-secondary small fw-bold text-uppercase">
                    <tr>
                      <th className="px-4 py-3">ID Mov.</th>
                      <th className="py-3">Tipo / Acción</th>
                      <th className="py-3 text-center">Cantidad</th>
                      <th className="px-4 py-3 text-end">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted fw-medium">
                          Sin transacciones ni ajustes de inventario para este artículo.
                        </td>
                      </tr>
                    ) : (
                      movimientos?.map((m) => {
                        // Determinar si es entrada o salida basándonos en la cantidad o tipo
                        const isEntrada = m.Quantity > 0 || m.MovementType?.toLowerCase().includes('entrada') || m.MovementType?.toLowerCase().includes('compra');
                        
                        return (
                          <tr key={m.MovementId} className="border-bottom last-border-0">
                            <td className="px-4 py-3 text-muted fw-medium">#{m.MovementId}</td>
                            <td className="py-3">
                              <span className="fw-semibold text-dark">{m.MovementType || 'Ajuste Manual'}</span>
                            </td>
                            <td className="py-3 text-center">
                              <Badge 
                                bg={isEntrada ? 'success' : 'danger'} 
                                className={`bg-opacity-10 ${isEntrada ? 'text-success' : 'text-danger'} px-3 py-2 rounded-pill fw-bold`}
                              >
                                {isEntrada ? <FaArrowUp className="me-1 small" /> : <FaArrowDown className="me-1 small" />}
                                {Math.abs(m.Quantity)} uds.
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-end text-muted small">
                              {new Date(m.fecha).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductoDetalle;