// src/features/Recepcion/Components/RecepcionPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Card, Tabs, Tab } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useRecepcion } from '../Hooks/UseRecepcion';
import BuscarSocio from './BuscarSocio';
import SelectorPlan from './SelectorPlan';
import SelectorProducto from './SelectorProducto';
import Carrito from './Carrito';
import FormularioPago from './FormularioPago';
import NuevoSocioModal from './NuevoSocioModal';
import { useAuth } from '../../../context/AuthContext';
import { FaShoppingCart, FaCheckCircle } from 'react-icons/fa';

const RecepcionPage = () => {
  const { user } = useAuth();
  const cashierId = user?.id || 1;

  const {
    miembro, carrito, metodoPago, montoPagado, referencia,
    loading, error, total, setMiembro, setMetodoPago,
    setMontoPagado, setReferencia, agregarItem, eliminarItem,
    actualizarCantidad, registrarVenta, crearSocio,
  } = useRecepcion();

  const [showNuevoSocio, setShowNuevoSocio] = useState(false);
  const [keyCatalogo, setKeyCatalogo] = useState('planes');

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
    <Container fluid className="p-4 bg-light min-vh-100">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0 text-dark">Punto de Venta</h2>
          <p className="text-muted mb-0">Recepción y venta rápida</p>
        </div>
      </div>

      <Row className="g-4">
        {/* COLUMNA IZQUIERDA: Búsqueda y Catálogo */}
        <Col lg={7} xl={8}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <BuscarSocio
                miembro={miembro}
                setMiembro={setMiembro}
                onCrearNuevo={() => setShowNuevoSocio(true)}
              />
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <Tabs
                id="catalogo-tabs"
                activeKey={keyCatalogo}
                onSelect={(k) => setKeyCatalogo(k)}
                className="mb-4 custom-tabs"
                fill
              >
                <Tab eventKey="planes" title="Membresías y Planes">
                  <SelectorPlan onAgregarItem={agregarItem} />
                </Tab>
                <Tab eventKey="productos" title="Productos y Stock">
                  <SelectorProducto onAgregarItem={agregarItem} />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: Carrito y Pago */}
        <Col lg={5} xl={4}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold d-flex align-items-center">
                <FaShoppingCart className="me-2 text-primary" /> Resumen de Venta
              </h5>
            </Card.Header>
            <Card.Body className="p-4 d-flex flex-column gap-4">
              
              <Carrito
                items={carrito}
                onEliminar={eliminarItem}
                onActualizarCantidad={actualizarCantidad}
                total={total}
              />
              
              <hr className="text-muted my-0" />
              
              <FormularioPago
                metodoPago={metodoPago}
                setMetodoPago={setMetodoPago}
                montoPagado={montoPagado}
                setMontoPagado={setMontoPagado}
                referencia={referencia}
                setReferencia={setReferencia}
                total={total}
              />

              {error && <Alert variant="danger" className="small mb-0 rounded-3">{error}</Alert>}

              <Button
                variant="primary"
                size="lg"
                className="w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center py-3"
                onClick={handleRegistrar}
                disabled={loading || carrito.length === 0}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : (
                  <FaCheckCircle className="me-2" />
                )}
                Confirmar Pago — ${(total ?? 0).toFixed(2)}
              </Button>
            </Card.Body>
          </Card>
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