// src/features/asistencias/components/RegistrarEntrada.jsx
import React, { useState } from 'react';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import { FaCheckCircle, FaUserPlus } from 'react-icons/fa';
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
    <Card className="mb-4 border-0 shadow-sm rounded-4 bg-white">
      <Card.Body className="p-4">
        <h6 className="fw-bold mb-4 text-dark d-flex align-items-center">
          <FaUserPlus className="text-primary me-2" /> 
          Registrar Nueva Entrada
        </h6>
        
        <BuscadorMiembro onSelectMiembro={setSelectedMiembro} />
        
        {selectedMiembro && (
          <div className="mt-4 pt-3 border-top border-light">
            <Button
              variant="success"
              onClick={handleRegistrar}
              disabled={loading}
              className="w-100 rounded-pill py-2 fw-bold shadow-sm fs-6 d-flex justify-content-center align-items-center"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> 
                  Procesando...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-2 fs-5" /> 
                  Confirmar Asistencia
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-3 mb-0 rounded-3 small border-0 d-flex align-items-center">
            <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default RegistrarEntrada;