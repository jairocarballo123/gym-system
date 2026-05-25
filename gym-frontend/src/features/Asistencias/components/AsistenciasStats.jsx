// src/features/asistencias/components/AsistenciasStats.jsx
import React from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaUsers, FaUserSlash, FaChartBar, FaStar, FaExclamationCircle } from 'react-icons/fa';

const AsistenciasStats = ({ stats }) => {
  const { horaPico, promedioDiario, diasAfluencia, miembrosInactivos, topActivos } = stats;

  return (
    <>
      {/* Tarjetas de Métricas Principales */}
      <Row className="mb-4 g-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-2">
                  <FaClock className="text-primary" size={20} />
                </div>
                <span className="text-muted small text-uppercase fw-bold" style={{letterSpacing: '0.5px'}}>Hora Pico Hoy</span>
              </div>
              <h3 className="fw-bolder mb-1 text-dark">
                {horaPico?.hora ? `${horaPico.hora}:00 - ${horaPico.hora + 1}:00` : 'Sin datos'}
              </h3>
              <small className="text-muted">{horaPico?.total || 0} entradas registradas</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-2 rounded-3 me-2">
                  <FaCalendarAlt className="text-success" size={20} />
                </div>
                <span className="text-muted small text-uppercase fw-bold" style={{letterSpacing: '0.5px'}}>Promedio Diario</span>
              </div>
              <h3 className="fw-bolder mb-1 text-dark">{promedioDiario?.promedio_diario?.toFixed(1) || 0}</h3>
              <small className="text-muted">personas por día este mes</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info bg-opacity-10 p-2 rounded-3 me-2">
                  <FaUsers className="text-info" size={20} />
                </div>
                <span className="text-muted small text-uppercase fw-bold" style={{letterSpacing: '0.5px'}}>Total Mes</span>
              </div>
              <h3 className="fw-bolder mb-1 text-dark">{promedioDiario?.total_asistencias || 0}</h3>
              <small className="text-muted">asistencias este mes</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger bg-opacity-10 p-2 rounded-3 me-2">
                  <FaUserSlash className="text-danger" size={20} />
                </div>
                <span className="text-muted small text-uppercase fw-bold" style={{letterSpacing: '0.5px'}}>Inactivos</span>
              </div>
              <h3 className="fw-bolder mb-1 text-dark">{miembrosInactivos?.length || 0}</h3>
              <small className="text-muted">sin asistencia en 15 días</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tablas de Estadísticas */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
              <h6 className="fw-bold mb-0 d-flex align-items-center text-dark">
                <FaChartBar className="text-primary me-2" /> Días con más afluencia <span className="text-muted ms-2 fw-normal small">(últimos 30 días)</span>
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="table-responsive">
                <Table borderless hover size="sm" className="mb-0 align-middle">
                  <thead className="text-muted small text-uppercase border-bottom">
                    <tr>
                      <th className="py-2 fw-semibold">Día</th>
                      <th className="py-2 fw-semibold text-end">Total Asistencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diasAfluencia?.length > 0 ? (
                      diasAfluencia.map((dia, idx) => (
                        <tr key={idx} className="border-bottom border-light">
                          <td className="py-3 fw-medium text-dark">{dia.dia_semana}</td>
                          <td className="py-3 text-end">
                            <Badge bg="primary-subtle" text="primary" pill className="px-3">{dia.total_asistencias}</Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-muted py-4">Sin datos suficientes</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
              <h6 className="fw-bold mb-0 d-flex align-items-center text-dark">
                <FaStar className="text-warning me-2" /> Miembros más activos <span className="text-muted ms-2 fw-normal small">(últimos 30 días)</span>
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="table-responsive">
                <Table borderless hover size="sm" className="mb-0 align-middle">
                  <thead className="text-muted small text-uppercase border-bottom">
                    <tr>
                      <th className="py-2 fw-semibold" style={{width: '10%'}}>#</th>
                      <th className="py-2 fw-semibold">Miembro</th>
                      <th className="py-2 fw-semibold text-end">Asistencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topActivos?.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">Sin datos suficientes</td>
                      </tr>
                    ) : (
                      topActivos?.map((m, idx) => (
                        <tr key={m.MemberId} className="border-bottom border-light">
                          <td className="py-3 text-muted fw-bold">{idx + 1}</td>
                          <td className="py-3 fw-bold text-dark">{m.FullName}</td>
                          <td className="py-3 text-end">
                            <Badge bg="success-subtle" text="success" pill className="px-3">{m.total_asistencias}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
              <h6 className="fw-bold mb-0 d-flex align-items-center text-dark">
                <FaExclamationCircle className="text-danger me-2" /> Miembros Inactivos <span className="text-muted ms-2 fw-normal small">(15+ días sin asistir)</span>
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              {miembrosInactivos?.length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3">
                  <p className="text-success fw-medium mb-0">¡Excelente! Todos los miembros están activos.</p>
                </div>
              ) : (
                <div className="table-responsive border border-light rounded-3">
                  <Table borderless hover size="sm" className="mb-0 align-middle">
                    <thead className="bg-light text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4 py-3 fw-semibold">Miembro</th>
                        <th className="py-3 fw-semibold">Teléfono</th>
                        <th className="pe-4 py-3 fw-semibold text-end">Última asistencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {miembrosInactivos?.map((m) => (
                        <tr key={m.MemberId} className="border-top border-light">
                          <td className="ps-4 py-3 fw-bold text-dark">{m.FullName}</td>
                          <td className="py-3 text-muted">{m.Phone || '—'}</td>
                          <td className="pe-4 py-3 text-end text-muted">
                            {m.ultima_asistencia ? (
                              <Badge bg="secondary-subtle" text="secondary" pill>
                                {new Date(m.ultima_asistencia).toLocaleDateString()}
                              </Badge>
                            ) : 'Nunca'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AsistenciasStats;