import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BotonesAcceso = () => {
  const navigate = useNavigate();
  const modulos = [
    { nombre: 'Miembros', ruta: '/miembros', color: 'primary' },
    { nombre: 'Empleados', ruta: '/empleados', color: 'success' },
    { nombre: 'Planes', ruta: '/planes', color: 'info' },
    { nombre: 'Stock', ruta: '/Stock', color: 'warning' },
    { nombre: 'Pagos', ruta: '/pagos', color: 'danger' },
    { nombre: 'Asistencias', ruta: '/asistencias', color: 'secondary' },
  ];
  return (
    <Row className="g-2 mb-4">
      {modulos.map(mod => (
        <Col key={mod.ruta} xs={6} md={4} lg={2}>
          <Button variant={mod.color} className="w-100" onClick={() => navigate(mod.ruta)}>
            {mod.nombre}
          </Button>
        </Col>
      ))}
    </Row>
  );
};
export default BotonesAcceso;