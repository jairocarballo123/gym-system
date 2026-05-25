// src/features/asistencias/components/BuscadorMiembro.jsx
import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Spinner, Button } from 'react-bootstrap';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { miembroServices } from '../../Miembros/Services/MiembroServices';

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
    setTermino('');
    onSelectMiembro(miembro);
  };

  const limpiar = () => {
    setSelected(null);
    setTermino('');
    onSelectMiembro(null);
  };

  return (
    <div className="mb-3 position-relative">
      {!selected ? (
        <Form.Group>
          <Form.Label className="fw-semibold text-muted small text-uppercase" style={{letterSpacing: '0.5px'}}>
            <FaSearch className="me-1" /> Buscar Miembro
          </Form.Label>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Escribe el nombre o teléfono..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              disabled={buscando}
              className="rounded-3 py-2 ps-3 pe-5 border-light shadow-sm"
            />
            {buscando && (
              <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                <Spinner animation="border" size="sm" variant="primary" />
              </div>
            )}
          </div>
        </Form.Group>
      ) : (
        <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaUserCircle className="text-primary fs-3 me-3" />
            <div>
              <div className="fw-bold text-dark">{selected.fullName}</div>
              <div className="small text-muted">ID: {selected.id}</div>
            </div>
          </div>
          <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={limpiar}>
            Cambiar
          </Button>
        </div>
      )}

      {resultados.length > 0 && !selected && (
        <ListGroup className="mt-2 shadow position-absolute w-100 z-3 rounded-3 border-0" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {resultados.map((m) => (
            <ListGroup.Item
              key={m.id}
              action
              onClick={() => seleccionarMiembro(m)}
              className="d-flex justify-content-between align-items-center py-3 border-light"
            >
              <div>
                <strong className="text-dark">{m.fullName}</strong>
                <div className="small text-muted">{m.phone || 'Sin teléfono'}</div>
              </div>
              <span className="badge bg-light text-dark border">ID: {m.id}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default BuscadorMiembro;