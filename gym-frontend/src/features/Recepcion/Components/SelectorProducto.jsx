// src/features/Recepcion/Components/SelectorProducto.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { recepcionServices } from '../Services/RecepcionServices';
import { FaPlus } from 'react-icons/fa';

const SelectorProducto = ({ onAgregarItem }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const response = await recepcionServices.obtenerProductos();
      if (response.success) {
        setProductos(response.data);
      } else {
        setError('No se pudieron cargar los productos');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="rounded-3">{error}</Alert>;

  return (
    <div className="selector-producto mt-3">
      <Row className="g-3">
        {productos.map((prod) => (
          <Col md={6} key={prod.id}>
            <Card className={`h-100 border border-light shadow-sm rounded-3 ${prod.stockActual === 0 ? 'opacity-50' : 'hover-effect'}`}>
              <Card.Body className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold text-dark mb-1">{prod.nombre}</div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="small fw-bold text-primary">${prod.precio}</span>
                    <Badge bg={prod.stockActual > 5 ? 'light' : 'warning'} text="dark" className="border">
                      Stock: {prod.stockActual}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant={prod.stockActual === 0 ? 'secondary' : 'primary'}
                  className="rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: '35px', height: '35px' }}
                  onClick={() => onAgregarItem(prod, 'PRODUCT')}
                  disabled={prod.stockActual === 0}
                >
                  <FaPlus size={12} />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SelectorProducto;