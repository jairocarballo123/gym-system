// src/features/Recepcion/Components/SelectorProducto.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { recepcionServices } from '../Services/RecepcionServices';
import { FaBoxOpen, FaPlus } from 'react-icons/fa';

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

  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="selector-producto">
      <h6 className="fw-semibold  mb-2 text-primary">Stock disponible</h6>
      <div className="d-flex flex-column gap-2">
        {productos.map((prod) => (
          <Card key={prod.id} className="border-0 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center p-3">
              <div>
                <div className="fw-bold">{prod.nombre}</div>
                <div className="small text-muted">
                  ${prod.precio} · Stock: {prod.stockActual}
                </div>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onAgregarItem(prod, 'PRODUCT')}
                disabled={prod.stockActual === 0}
              >
                <FaPlus />
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SelectorProducto;