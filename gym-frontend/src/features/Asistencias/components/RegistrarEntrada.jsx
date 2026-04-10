// src/features/asistencias/components/RegistrarEntrada.jsx
import React, { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import BuscadorMiembro from './BuscadorMiembro';

const RegistrarEntrada = ({ onRegistrar, loading }) => {
  const [selectedMiembro, setSelectedMiembro] = useState(null);
  const [error, setError] = useState('');

  const handleRegistrar = async () => {
    if (!selectedMiembro) return;
    setError('');
    try {
      await onRegistrar(selectedMiembro.id);
      setSelectedMiembro(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-4 p-3 bg-light rounded shadow-sm">
      <h6 className="fw-bold mb-3"> Registrar entrada</h6>
      <BuscadorMiembro onSelectMiembro={setSelectedMiembro} />
      
      {selectedMiembro && (
        <div className="mt-3">
          <Button
            variant="success"
            onClick={handleRegistrar}
            disabled={loading}
            className="w-100"
          >
            {loading ? <Spinner animation="border" size="sm" /> : <><FaCheckCircle className="me-1" /> Marcar entrada</>}
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-3 small">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default RegistrarEntrada;