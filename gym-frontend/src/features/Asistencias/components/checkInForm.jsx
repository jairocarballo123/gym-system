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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title><FaUserCheck className="me-2"/>Registrar Entrada</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4 text-center">
          
          <h5 className="mb-3 text-muted">Seleccione el socio</h5>
          
          {loadingMembers ? (
            <Spinner animation="border" variant="success" />
          ) : (
            <Form.Group>
              <InputGroup size="lg">
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Select 
                  value={miembroId} 
                  onChange={(e) => setMiembroId(e.target.value)}
                  required
                  autoFocus
                >
                  <option value="">-- Buscar por Nombre --</option>
                  {listaMiembros.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} (ID: {m.id})
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
              <Form.Text className="text-muted">
                Solo se muestran miembros activos.
              </Form.Text>
            </Form.Group>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="success" type="submit" disabled={!miembroId}>
            Confirmar Entrada
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckInForm;