// src/features/productos/components/ProductoList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert, OverlayTrigger, Tooltip, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaExclamationTriangle } from 'react-icons/fa';

import { useProductos } from '../Hooks/useProductos';
import { useProductoUI } from '../Hooks/useProductosUI';

import ProductoTable from './ProductoTable';
import ProductoForm from './ProductoForm';
import ProductoMasVendidosTable from './ProductoMasVendidosTable';
import ProductoStockBajoTable from './ProductoStockBajoTable';
import ProductoStatsCards from './ProductoStatsCards';
import toast from 'react-hot-toast';

const ProductoList = () => {
  const navigate = useNavigate();
  

  const { 
    productos, detalle, resumen, loading, error, 
    saveProducto, desactivarProducto, ajustarStockProducto 
  } = useProductos();
  
  const { modalState, openModal, closeModal } = useProductoUI();

  const [cantidad, setCantidad] = useState(0);
  const [motivo, setMotivo] = useState('');

  const handleSave = async (data) => {
    try {
      await saveProducto(modalState.payload?.id, data);
      closeModal();
    } catch (err) {
      toast.error('Error al guardar cambios');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await desactivarProducto(modalState.payload.id);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al desactivar');
    }
  };

  const handleAjustarStockSubmit = async () => {
    if (cantidad === 0) return toast.error('La cantidad debe ser diferente de cero');
    try {
      await ajustarStockProducto(modalState.payload.id, cantidad, motivo);
      closeModal();
      setCantidad(0);
      setMotivo('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al ajustar stock');
    }
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className="p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestión de Productos</h2>
          <p className="text-muted small mb-0">Control de inventario y stock</p>
        </div>
        <OverlayTrigger placement="left" overlay={<Tooltip>Registrar nuevo producto</Tooltip>}>
          <Button variant="primary" onClick={() => openModal('FORM')}>
            <FaPlus className="me-2" /> Nuevo Producto
          </Button>
        </OverlayTrigger>
      </div>

      {/* Tarjetas de estadísticas */}
      <ProductoStatsCards resumen={resumen} />

      {/* Tabla Principal */}
      <ProductoTable
        productos={productos}
        onEdit={(prod) => openModal('FORM', prod)}
        onDelete={(prod) => openModal('DELETE', prod)}
        onVerMovimientos={(stock) => navigate(`/Stock/${stock.id}`)} 
        onAjustarStock={(prod) => openModal('STOCK', prod)}
      />


      <Row className="mt-4 g-4">
        <Col lg={6}>
          <ProductoMasVendidosTable data={detalle?.masVendidos} />
        </Col>
        <Col lg={6}>
          <ProductoStockBajoTable data={detalle?.stockBajo} />
        </Col>
      </Row>

      {/* MODAL 1: Formulario Crear/Editar */}
      <ProductoForm
        show={modalState.isOpen && modalState.type === 'FORM'}
        handleClose={closeModal}
        onSubmit={handleSave}
        initialData={modalState.payload}
      />

      {/* MODAL 2: Ajuste de Stock */}
      <Modal show={modalState.isOpen && modalState.type === 'STOCK'} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajustar stock: {modalState.payload?.nombre}</Modal.Title>
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
            </Form.Group>
            <Form.Group>
              <Form.Label>Motivo (opcional)</Form.Label>
              <Form.Control
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Compra a proveedor"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleAjustarStockSubmit}>Aplicar ajuste</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL 3: Confirmación de Eliminación */}
      <Modal show={modalState.isOpen && modalState.type === 'DELETE'} onHide={closeModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger">
            <FaExclamationTriangle className="me-2" /> Confirmar desactivación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaExclamationTriangle size={48} className="text-warning mb-3" />
          <h5>¿Desactivar el producto "{modalState.payload?.nombre}"?</h5>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={closeModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Sí, desactivar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductoList;