// src/features/Recepcion/Components/RecepcionPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useRecepcion } from '../Hooks/UseRecepcion';
import BuscarSocio from './BuscarSocio';
import SelectorPlan from './SelectorPlan';
import SelectorProducto from './SelectorProducto';
import Carrito from './Carrito';
import FormularioPago from './FormularioPago';
import NuevoSocioModal from './NuevoSocioModal';
import { useAuth } from '../../../context/AuthContext';

const RecepcionPage = () => {
  const { user } = useAuth();
  const cashierId = user?.id || 1;

  const {
    miembro,
    carrito,
    metodoPago,
    montoPagado,
    referencia,
    loading,
    error,
    total,
    setMiembro,
    setMetodoPago,
    setMontoPagado,
    setReferencia,
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    registrarVenta,
    crearSocio,
  } = useRecepcion();

  const [showNuevoSocio, setShowNuevoSocio] = useState(false);

  const handleRegistrar = async () => {
    const result = await registrarVenta(cashierId);
    if (result.success) {
      toast.success(`¡Venta registrada! Factura ${result.invoiceNumber}`);
    } else {
      toast.error(result.error);
    }
  };



const handleCrearSocio = async (data) => {
  try {
    const nuevoSocio = await crearSocio(data, cashierId); 
    if (nuevoSocio) {
      setMiembro({
        id: nuevoSocio.id,
        fullName: nuevoSocio.fullName,
        phone: nuevoSocio.phone,
        adress: nuevoSocio.Address
      });
      toast.success(`Socio ${nuevoSocio.fullName} seleccionado`);
      return true;
    }
  } catch {
    return false;
  }
};

  return (
    <Container fluid className="p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="mb-4">Recepción / Venta rápida</h2>

      <Row className="g-4">
        <Col md={4}>
          <BuscarSocio
            miembro={miembro}
            setMiembro={setMiembro}
            onCrearNuevo={() => setShowNuevoSocio(true)}
          />
        </Col>

        <Col md={4}>
          <SelectorPlan onAgregarItem={agregarItem} />
          <hr />
          <SelectorProducto onAgregarItem={agregarItem} />
        </Col>

        <Col md={4}>
          <Carrito
            items={carrito}
            onEliminar={eliminarItem}
            onActualizarCantidad={actualizarCantidad}
            total={total}
          />
          <FormularioPago
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            montoPagado={montoPagado}
            setMontoPagado={setMontoPagado}
            referencia={referencia}
            setReferencia={setReferencia}
            total={total}
          />
          <Button
            variant="success"
            className="w-100 mt-3"
            onClick={handleRegistrar}
            disabled={loading || carrito.length === 0}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Registrar venta'}
          </Button>
          {error && <Alert variant="danger" className="mt-3 small">{error}</Alert>}
        </Col>
      </Row>

      <NuevoSocioModal
        show={showNuevoSocio}
        handleClose={() => setShowNuevoSocio(false)}
        onCreateSocio={handleCrearSocio}
        loading={loading}
        cashierId={cashierId}  
      />
    </Container>
  );
};

export default RecepcionPage;