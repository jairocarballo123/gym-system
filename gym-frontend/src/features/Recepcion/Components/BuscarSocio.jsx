// src/features/Recepcion/Components/BuscarSocio.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Form, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { recepcionServices } from '../Services/RecepcionServices';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const BuscarSocio = ({ miembro, setMiembro, onCrearNuevo }) => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  // Buscar miembros al escribir (con debounce)
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
    setTermino(member.fullName);
    setResultados([]); // Limpiar resultados después de seleccionar
  };

  const limpiarSeleccion = () => {
    setMiembro(null);
    setTermino('');
    setResultados([]);
  };

  return (
    <div className="buscar-socio mb-4">
      <Form.Group>
        <Form.Label className="fw-semibold text-muted small">
          <FaSearch className="me-1 text-primary" /> Buscar socio
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre o teléfono..."
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          disabled={buscando}
        />
        <Form.Text className="text-muted">
          Ingresa al menos 2 caracteres para buscar
        </Form.Text>
      </Form.Group>

      {buscando && <Spinner animation="border" size="sm" className="mt-2" />}

      {error && <Alert variant="danger" className="mt-2 small">{error}</Alert>}

      {resultados.length > 0 && (
        <ListGroup className="mt-2 shadow-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {resultados.map((member) => (
            <ListGroup.Item
              key={member.id}
              action
              onClick={() => seleccionarMiembro(member)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{member.fullName}</strong>
                <div className="small text-muted">{member.phone}</div>
              </div>
              <span className="badge bg-secondary">{member.statusId === 1 ? 'Activo' : 'Inactivo'}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {miembro && (
        <div className="mt-3 p-2 bg-light border rounded d-flex justify-content-between align-items-center">
          <div>
            <strong>{miembro.fullName}</strong>
            <div className="small text-muted">{miembro.phone}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={limpiarSeleccion}>
            Cambiar
          </button>
        </div>
      )}

      <button
        className="btn btn-outline-primary btn-sm mt-2 w-100"
        onClick={onCrearNuevo}
      >
        <FaUserPlus className="me-1" /> Nuevo socio
      </button>
    </div>
  );
};

export default BuscarSocio;