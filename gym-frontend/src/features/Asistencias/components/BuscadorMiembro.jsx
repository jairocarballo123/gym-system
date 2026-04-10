// src/features/asistencias/components/BuscadorMiembro.jsx
import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { miembroServices } from '../../Miembros/services/MiembroServices';

const BuscadorMiembro = ({ onSelectMiembro }) => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (termino.trim().length >= 2) {
        buscarMiembros();
      } else {
        setResultados([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [termino]);

  const buscarMiembros = async () => {
    setBuscando(true);
    try {
      const response = await miembroServices.getAll();
      // IMPORTANTE: response.data.data o response.data?
      const miembros = response.data?.data || response.data || [];
      
      const filtrados = miembros.filter(m => 
        (m.fullName && m.fullName.toLowerCase().includes(termino.toLowerCase())) ||
        (m.phone && m.phone.includes(termino))
      );
      setResultados(filtrados.slice(0, 10));
    } catch (err) {
      console.error('Error buscando miembros:', err);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarMiembro = (miembro) => {
    setSelected(miembro);
    setResultados([]);
    setTermino(miembro.fullName);
    onSelectMiembro(miembro);
  };

  const limpiar = () => {
    setSelected(null);
    setTermino('');
    onSelectMiembro(null);
  };

  return (
    <div className="mb-3">
      <Form.Group>
        <Form.Label className="fw-semibold text-muted small">
          <FaSearch className="me-1" /> Buscar miembro
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre o teléfono..."
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          disabled={buscando}
        />
        {buscando && <Spinner animation="border" size="sm" className="mt-2" />}
      </Form.Group>

      {resultados.length > 0 && (
        <ListGroup className="mt-2 shadow-sm" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {resultados.map((m) => (
            <ListGroup.Item
              key={m.id}
              action
              onClick={() => seleccionarMiembro(m)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{m.fullName}</strong>
                <div className="small text-muted">{m.phone || 'Sin teléfono'}</div>
              </div>
              <span className="badge bg-secondary">ID: {m.id}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {selected && (
        <div className="mt-2 p-2 bg-light border rounded d-flex justify-content-between align-items-center">
          <div>
            <strong>{selected.fullName}</strong>
            <div className="small text-muted">ID: {selected.id}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={limpiar}>
            Cambiar
          </button>
        </div>
      )}
    </div>
  );
};

export default BuscadorMiembro;