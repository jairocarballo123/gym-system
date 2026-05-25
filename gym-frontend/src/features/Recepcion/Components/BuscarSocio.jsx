// src/features/Recepcion/Components/BuscarSocio.jsx
import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Spinner, Alert, InputGroup, Button } from 'react-bootstrap';
import { recepcionServices } from '../Services/RecepcionServices';
import { FaSearch, FaUserPlus, FaUserCheck, FaTimes } from 'react-icons/fa';

const BuscarSocio = ({ miembro, setMiembro, onCrearNuevo }) => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (termino.trim().length >= 2) {
        buscarMiembros(termino);
      } else {
        setResultados([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [termino]);

  const buscarMiembros = async (texto) => {
    setBuscando(true);
    setError(null);
    try {
      const response = await recepcionServices.buscarMiembros(texto);
      if (response.success) {
        setResultados(response.data);
      } else {
        setError('Error al buscar miembros');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarMiembro = (member) => {
    setMiembro(member);
    setTermino('');
    setResultados([]);
  };

  const limpiarSeleccion = () => {
    setMiembro(null);
    setTermino('');
    setResultados([]);
  };

  return (
    <div className="buscar-socio">
      <div className="d-flex justify-content-between align-items-end mb-3">
        <h6 className="fw-bold mb-0 text-dark">Información del Cliente</h6>
        <Button variant="outline-primary" size="sm" onClick={onCrearNuevo} className="rounded-pill px-3">
          <FaUserPlus className="me-1" /> Nuevo
        </Button>
      </div>

      {!miembro ? (
        <div className="position-relative">
          <InputGroup className="shadow-sm rounded-3">
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              disabled={buscando}
              className="border-start-0 py-2 bg-white form-control-lg fs-6"
            />
          </InputGroup>

          {buscando && (
            <div className="position-absolute top-100 end-0 mt-2 me-2 z-3">
              <Spinner animation="border" size="sm" variant="primary" />
            </div>
          )}

          {error && <Alert variant="danger" className="mt-2 small rounded-3">{error}</Alert>}

          {resultados.length > 0 && (
            <ListGroup className="position-absolute w-100 mt-1 shadow-lg rounded-3 z-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {resultados.map((member) => (
                <ListGroup.Item
                  key={member.id}
                  action
                  onClick={() => seleccionarMiembro(member)}
                  className="d-flex justify-content-between align-items-center py-3 border-start-0 border-end-0"
                >
                  <div>
                    <strong className="d-block text-dark">{member.fullName}</strong>
                    <span className="small text-muted">{member.phone || 'Sin teléfono'}</span>
                  </div>
                  <span className={`badge ${member.statusId === 1 ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                    {member.statusId === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      ) : (
        <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '45px', height: '45px' }}>
              <FaUserCheck size={20} />
            </div>
            <div>
              <strong className="d-block fs-6 text-dark">{miembro.fullName}</strong>
              <span className="small text-muted">{miembro.phone || 'Sin número registrado'}</span>
            </div>
          </div>
          <Button variant="link" className="text-danger p-0 text-decoration-none" onClick={limpiarSeleccion}>
            <FaTimes size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BuscarSocio;