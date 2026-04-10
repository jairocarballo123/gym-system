// src/features/productos/components/ProductoList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert, OverlayTrigger, Tooltip, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { useProductos } from '../Hooks/useProductos';
import { productoApi } from '../Services/ProductosApi';
import ProductoTable from './ProductoTable';
import ProductoForm from './ProductoForm';
import ProductoStatsCards from './ProductoStatsCards';
import ProductoMovimientos from './ProductoMovimientos';
import toast from 'react-hot-toast';

const ProductoList = () => {
  const { productos, loading, error, refresh } = useProductos();
  const [showModal, setShowModal] = useState(false);
  const [showMovimientos, setShowMovimientos] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Estados para ajustar stock
  const [showStockModal, setShowStockModal] = useState(false);
  const [productoStock, setProductoStock] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    const cargarEstadisticas = async () => {
      setLoadingStats(true);
      try {
        const res = await productoApi.getResumen();
        setResumen(res);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    cargarEstadisticas();
  }, []);

  const handleEdit = (producto) => {
    setEditing(producto);
    setShowModal(true);
  };

  const handleVerMovimientos = async (producto) => {
    setSelectedProducto(producto);
    setShowMovimientos(true);
    try {
      const data = await productoApi.getMovimientos(producto.id);
      setMovimientos(data);
    } catch (err) {
      toast.error('Error al cargar movimientos');
    }
  };

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!productoToDelete) return;
    
    try {
      await productoApi.delete(productoToDelete.id);
      toast.success('Producto desactivado');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al desactivar');
    } finally {
      setShowConfirmDelete(false);
      setProductoToDelete(null);
    }
  };

  const handleSave = async (data) => {
    if (editing) {
      await productoApi.update(editing.id, data);
      toast.success('Producto actualizado');
    } else {
      await productoApi.create(data);
      toast.success('Producto creado');
    }
    refresh();
    setShowModal(false);
    setEditing(null);
  };

  // Función para ajustar stock
  const handleAjustarStock = async () => {
    if (!productoStock) return;
    if (cantidad === 0) {
      toast.error('La cantidad debe ser diferente de cero');
      return;
    }
    try {
      await productoApi.ajustarStock(productoStock.id, cantidad, motivo);
      toast.success('Stock actualizado correctamente');
      refresh();
      setShowStockModal(false);
      setCantidad(0);
      setMotivo('');
      setProductoStock(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al ajustar stock');
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestión de Productos</h2>
          <p className="text-muted small mb-0">Control de inventario y stock</p>
        </div>
        <OverlayTrigger placement="left" overlay={<Tooltip>Registrar nuevo producto</Tooltip>}>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Nuevo Producto
          </Button>
        </OverlayTrigger>
      </div>

      <ProductoStatsCards resumen={resumen} />

      <ProductoTable
        productos={productos}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onVerMovimientos={handleVerMovimientos}
        onAjustarStock={(producto) => {
          setProductoStock(producto);
          setShowStockModal(true);
        }}
      />

      <ProductoForm
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
        initialData={editing}
      />

      <ProductoMovimientos
        show={showMovimientos}
        handleClose={() => {
          setShowMovimientos(false);
          setSelectedProducto(null);
          setMovimientos([]);
        }}
        producto={selectedProducto}
        movimientos={movimientos}
      />

      {/* Modal para ajustar stock */}
      <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajustar stock: {productoStock?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad (positiva = entrada, negativa = salida)</Form.Label>
              <Form.Control
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                placeholder="Ej: 10, -5"
                autoFocus
              />
              <Form.Text className="text-muted">
                Usa números positivos para aumentar stock (compras), negativos para disminuir (mermas, ventas).
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Motivo (opcional)</Form.Label>
              <Form.Control
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Compra a proveedor, producto dañado"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStockModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAjustarStock}>
            Aplicar ajuste
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para desactivar (ya existente) */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        {/* ... contenido existente ... */}
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger">
            <FaExclamationTriangle className="me-2" /> Confirmar desactivación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaExclamationTriangle size={48} className="text-warning mb-3" />
          <h5>¿Desactivar el producto "{productoToDelete?.nombre}"?</h5>
          <p className="text-muted mb-0">
            El producto quedará inactivo y no estará disponible para la venta.
            Puedes volver a activarlo más tarde si lo necesitas.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Sí, desactivar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductoList;