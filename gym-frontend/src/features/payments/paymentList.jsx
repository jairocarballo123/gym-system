import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form, Spinner } from 'react-bootstrap';
import { FaPlus, FaSearch, FaMoneyBillAlt, FaChartLine } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

import PaymentTable from './components/paymentTable'; 
import PaymentForm from './components/paymentForm';
import { usePayments } from './hooks/usePayments';

const PaymentsList = () => {
  const { payments, loading, error, createPayment, deletePayment, refreshPayments } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // --- ESTADÍSTICAS RÁPIDAS ---
  const stats = useMemo(() => {
   
    const totalIngresos = payments.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const totalTransacciones = payments.length;
    return { totalIngresos, totalTransacciones };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    const term = searchTerm.toLowerCase();
    
    return payments.filter(p => 
     
      p.miembro_id?.toString().toLowerCase().includes(term) ||

      p.recibo_id?.toLowerCase().includes(term) ||

      p.id?.toString().includes(term)
    );
  }, [payments, searchTerm]);

  // --- HANDLERS ---
  const handleSave = async (formData) => {
    try {
      Swal.fire({ title: 'Registrando...', didOpen: () => Swal.showLoading() });
   
      await createPayment(formData);
      
      Swal.fire('¡Pago Exitoso!', 'El pago ha sido registrado correctamente.', 'success');
      setShowModal(false);
      refreshPayments(); // Recargar la lista por si acaso
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'No se pudo registrar el pago', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: '¿Anular pago?', 
      text: "Esta acción eliminará el registro de la base de datos.", 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, anular'
    });

    if (res.isConfirmed) {
      try {
        await deletePayment(id);
        Swal.fire('Anulado', 'El pago ha sido eliminado.', 'success');
      } catch (err) { 
        Swal.fire('Error', 'No se pudo eliminar el pago.', 'error'); 
      }
    }
  };

  return (
    <Container fluid className="p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Gestión de Pagos</h2>
          <Button variant="success" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2"/> Registrar Pago
          </Button>
      </div>

      {/* TARJETAS DE INGRESOS */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm border-start border-success border-4">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                <FaMoneyBillAlt size={28} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Ingresos Totales</h6>
                <h3 className="fw-bold mb-0">C$ {stats.totalIngresos.toFixed(2)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm border-start border-info border-4">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3 text-info">
                <FaChartLine size={28} />
              </div>
              <div>
                <h6 className="text-muted mb-0">Transacciones</h6>
                <h3 className="fw-bold mb-0">{stats.totalTransacciones}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* TABLA Y FILTRO */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <InputGroup style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-light"><FaSearch /></InputGroup.Text>
            <Form.Control 
              placeholder="Buscar por Recibo o ID Socio..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
           {loading ? (
             <div className="text-center p-5"><Spinner animation="border"/></div> 
           ) : (
             <PaymentTable payments={filteredPayments} onDelete={handleDelete} /> 
           )}
        </Card.Body>
      </Card>

      {/* MODAL DE FORMULARIO */}
      <PaymentForm 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onSubmit={handleSave} 
      />
    </Container>
  );
};

export default PaymentsList;