// src/features/Dashboard/components/SaludoUsuario.jsx
import React from 'react';

const SaludoUsuario = ({ nombre }) => {
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
  const fechaActual = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="mb-4">
      <h2 className="fw-bold text-dark mb-1">{saludo}, {nombre}! 👋</h2>
      <p className="text-muted small text-capitalize mb-0">{fechaActual}</p>
    </div>
  );
};

export default SaludoUsuario;