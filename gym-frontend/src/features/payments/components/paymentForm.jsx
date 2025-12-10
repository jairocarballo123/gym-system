import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FaMoneyBillWave, FaUser, FaReceipt, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { membersApi } from '../../../Api/MemberApi'; 

const PaymentForm = ({ show, handleClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    miembro_id: '',
    monto: '',
    fecha_pago: new Date().toISOString().split('T')[0]
  });

  const [listaMiembros, setListaMiembros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null); 

  useEffect(() => {
    if (show) {
      cargarDatos();
    }
  }, [show]);

  const cargarDatos = async () => {
    setLoading(true);
    setErrorCarga(null);
    try {
      const miembrosData = await membersApi.getAll();
      if (Array.isArray(miembrosData)) {
        setListaMiembros(miembrosData);
      } else {
        console.warn("La API de miembros no devolvió un array:", miembrosData);
        setListaMiembros([]); 
      }
    } catch (err) {
      console.error("Error cargando miembros:", err);
      setListaMiembros([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Registrar Nuevo Pago</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          {errorCarga && <Alert variant="warning"><FaExclamationTriangle/> {errorCarga}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Cargando información...</p>
            </div>
          ) : (
            <Row>
              <Col md={7} className="border-end pe-4">
                <h6 className="text-muted mb-3 fw-bold">Detalles del Pago</h6>
                <Row className="g-3">
                  {/* Recibo (automático en backend) */}
                  <Col md={6}>
                    <Form.Label>No. Recibo</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaReceipt /></InputGroup.Text>
                      <Form.Control type="text" placeholder="Automático" disabled className="bg-light fst-italic"/>
                    </InputGroup>
                  </Col>

                  {/* Fecha */}
                  <Col md={6}>
                    <Form.Label>Fecha</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                      <Form.Control 
                        type="date" 
                        value={formData.fecha_pago} 
                        onChange={e => setFormData({...formData, fecha_pago: e.target.value})} 
                        required 
                      />
                    </InputGroup>
                  </Col>

                  {/* Socio */}
                  <Col md={12}>
                    <Form.Label>Socio</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaUser /></InputGroup.Text>
                      <Form.Select 
                        value={formData.miembro_id} 
                        onChange={e => setFormData({...formData, miembro_id: e.target.value})} 
                        required
                      >
                        <option value="">-- Seleccionar Socio --</option>
                        {Array.isArray(listaMiembros) && listaMiembros.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.nombre} (ID: {m.id})
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                    {listaMiembros.length === 0 && <Form.Text className="text-danger">No se encontraron socios.</Form.Text>}
                  </Col>

                  {/* Monto */}
                  <Col md={12}>
                    <Form.Label className="text-success fw-bold">Monto a Pagar</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-success text-white"><FaMoneyBillWave /></InputGroup.Text>
                      <Form.Control 
                        type="number" step="0.01" 
                        value={formData.monto} 
                        onChange={e => setFormData({...formData, monto: e.target.value})} 
                        required placeholder="0.00" 
                        className="fw-bold fs-5"
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Guardar Pago'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PaymentForm;
