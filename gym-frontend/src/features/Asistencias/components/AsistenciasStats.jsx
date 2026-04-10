// src/features/asistencias/components/AsistenciasStats.jsx
import React from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaUsers, FaUserSlash, FaTrophy } from 'react-icons/fa';

const AsistenciasStats = ({ stats }) => {
  const { horaPico, promedioDiario, diasAfluencia, miembrosInactivos, topActivos } = stats;

  return (
    <>
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <FaClock className="text-primary me-2" size={24} />
                <span className="text-muted small text-uppercase fw-bold">Hora Pico Hoy</span>
              </div>
              <h3 className="fw-bold mb-0">
                {horaPico?.hora ? `${horaPico.hora}:00 - ${horaPico.hora + 1}:00` : 'Sin datos'}
              </h3>
              <small className="text-muted">{horaPico?.total || 0} entradas en esa hora</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <FaCalendarAlt className="text-success me-2" size={24} />
                <span className="text-muted small text-uppercase fw-bold">Promedio Diario</span>
              </div>
              <h3 className="fw-bold mb-0">{promedioDiario?.promedio_diario?.toFixed(1) || 0}</h3>
              <small className="text-muted">personas por día este mes</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <FaUsers className="text-info me-2" size={24} />
                <span className="text-muted small text-uppercase fw-bold">Total Asistencias</span>
              </div>
              <h3 className="fw-bold mb-0">{promedioDiario?.total_asistencias || 0}</h3>
              <small className="text-muted">este mes</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <FaUserSlash className="text-danger me-2" size={24} />
                <span className="text-muted small text-uppercase fw-bold">Inactivos</span>
              </div>
              <h3 className="fw-bold mb-0">{miembrosInactivos?.length || 0}</h3>
              <small className="text-muted">sin asistencia en 15 días</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-3">
              <h6 className="fw-bold mb-0">📈 Días con más afluencia (últimos 30 días)</h6>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Total Asistencias</th>
                  </tr>
                </thead>
                <tbody>
                  {diasAfluencia?.map((dia, idx) => (
                    <tr key={idx}>
                      <td>{dia.dia_semana}</td>
                      <td><Badge bg="primary">{dia.total_asistencias}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-3">
              <h6 className="fw-bold mb-0">🏆 Miembros más activos (últimos 30 días)</h6>
            </Card.Header>
            <Card.Body>
              {topActivos?.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Miembro</th>
                      <th>Asistencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topActivos?.map((m, idx) => (
                      <tr key={m.MemberId}>
                        <td>{idx + 1}</td>
                        <td className="fw-bold">{m.FullName}</td>
                        <td><Badge bg="success">{m.total_asistencias}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-3">
              <h6 className="fw-bold mb-0">⚠️ Miembros Inactivos (15+ días sin asistir)</h6>
            </Card.Header>
            <Card.Body>
              {miembrosInactivos?.length === 0 ? (
                <p className="text-muted text-center">¡Excelente! Todos los miembros están activos</p>
              ) : (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Miembro</th>
                      <th>Teléfono</th>
                      <th>Última asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miembrosInactivos?.map((m) => (
                      <tr key={m.MemberId}>
                        <td className="fw-bold">{m.FullName}</td>
                        <td>{m.Phone || '—'}</td>
                        <td>{m.ultima_asistencia ? new Date(m.ultima_asistencia).toLocaleDateString() : 'Nunca'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AsistenciasStats;