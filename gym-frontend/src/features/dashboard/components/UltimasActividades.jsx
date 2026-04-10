// src/features/dashboard/components/UltimasActividades.jsx
import { Table, Badge } from 'react-bootstrap';

const UltimasActividades = ({ actividades = [] }) => {
  // Si no hay actividades, mostrar mensaje
  if (!actividades || actividades.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No hay actividades recientes
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead className="bg-light">
        <tr>
          <th>Fecha</th>
          <th>Actividad</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        {actividades.map((act, idx) => (
          <tr key={idx}>
            <td>{new Date(act.fecha).toLocaleString()}</td>
            <td>{act.descripcion}</td>
            <td>{act.monto ? `C$${act.monto.toFixed(2)}` : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UltimasActividades;