// src/features/asistencias/components/CheckInForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaUserCheck, FaSearch } from 'react-icons/fa';
import { membersApi } from '../../../Api/MemberApi'; 

const CheckInForm = ({ show, handleClose, onSubmit }) => {
  const [miembroId, setMiembroId] = useState('');
  const [listaMiembros, setListaMiembros] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    if (show) {
      const cargar = async () => {
        try {
          const data = await membersApi.getAll();
          setListaMiembros(data.filter(m => m.estado_membresia === 'activo'));
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingMembers(false);
        }
      };
      cargar();
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(miembroId);
    setMiembroId(''); // Limpiar
  };

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="bg-success bg-opacity-10 border-bottom-0 pb-3 pt-4 px-4 rounded-top-4">
        <Modal.Title className="fw-bold text-success d-flex align-items-center">
          <FaUserCheck className="me-2"/> Registrar Entrada Manual
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="px-4 py-4 text-center">
          
          <p className="mb-4 text-muted">Seleccione el socio activo para registrar su entrada</p>
          
          {loadingMembers ? (
            <div className="py-4">
              <Spinner animation="border" variant="success" />
              <p className="small text-muted mt-2">Cargando miembros...</p>
            </div>
          ) : (
            <Form.Group>
              <InputGroup size="lg" className="shadow-sm rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-white border-end-0 text-muted"><FaSearch /></InputGroup.Text>
                <Form.Select 
                  value={miembroId} 
                  onChange={(e) => setMiembroId(e.target.value)}
                  required
                  autoFocus
                  className="border-start-0 ps-0"
                >
                  <option value="">-- Buscar por Nombre --</option>
                  {listaMiembros.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} (ID: {m.id})
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
              <Form.Text className="text-muted small mt-2 d-block text-start ps-1">
                * Solo se muestran miembros con estado activo.
              </Form.Text>
            </Form.Group>
          )}

        </Modal.Body>
        <Modal.Footer className="border-top-0 px-4 pb-4 pt-0">
          <Button variant="light" className="rounded-pill px-4 fw-medium" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" type="submit" disabled={!miembroId}>
            Confirmar Entrada
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckInForm;