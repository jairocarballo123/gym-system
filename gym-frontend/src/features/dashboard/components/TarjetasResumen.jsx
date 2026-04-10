import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaDollarSign, FaBoxes, FaCalendarCheck } from 'react-icons/fa';

const TarjetasResumen = ({ data }) => {
  const items = [
    { titulo: 'Miembros Activos', valor: data?.miembrosActivos || 0, icono: <FaUsers />, color: 'primary' },
    { titulo: 'Ingresos Hoy', valor: data?.ingresosHoy || 0, icono: <FaDollarSign />, color: 'success' },
    { titulo: 'Asistencias Hoy', valor: data?.asistenciasHoy || 0, icono: <FaCalendarCheck />, color: 'info' },
    { titulo: 'Stock Bajo', valor: data?.stockBajo || 0, icono: <FaBoxes />, color: 'warning' },
  ];
  return (
    <Row className="g-3 mb-4">
      {items.map((item, idx) => (
        <Col md={3} key={idx}>
          <Card className={`border-0 shadow-sm border-start border-${item.color} border-4`}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">{item.titulo}</h6>
                  <h3 className="fw-bold">{item.valor}</h3>
                </div>
                <div className={`text-${item.color} fs-1`}>{item.icono}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default TarjetasResumen;