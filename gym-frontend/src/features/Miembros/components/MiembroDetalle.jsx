// src/features/Miembros/components/MiembroDetalle.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaDollarSign, FaUser, FaPhone, FaHome, FaHistory, FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { miembroServices } from '../Services/MiembroServices';
import toast from 'react-hot-toast';

const MiembroDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await miembroServices.getDetalleCompleto(id);
        setDetalle(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar detalle';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !detalle) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="rounded-3 shadow-sm">{error || 'No se encontró el miembro'}</Alert>
        <Button variant="light" className="rounded-3 border bg-white" onClick={() => navigate('/miembros')}>
          <FaArrowLeft className="me-2" /> Volver a miembros
        </Button>
      </Container>
    );
  }

  const { miembro, membresias, pagos, asistencia } = detalle;

  const attendanceData = asistencia.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    asistencias: item.asistencias,
  }));

  return (
    <Container fluid className="p-4">
      {/* Botón de Retorno */}
      <Button 
        variant="light" 
        className="mb-4 rounded-3 border bg-white shadow-sm fw-medium text-secondary d-inline-flex align-items-center"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Volver al listado
      </Button>

      <Row className="g-4">
        {/* Columna Izquierda: Tarjeta de Perfil Atleta */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-3 overflow-hidden mb-4">
            <div className="bg-primary bg-opacity-10 p-4 text-center border-bottom">
              <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-3 text-primary">
                <FaUser size={36} />
              </div>
              <h4 className="fw-bold text-dark mb-1">{miembro.fullName}</h4>
              <Badge 
                bg={miembro.statusId === 1 ? 'success' : 'secondary'} 
                className={`bg-opacity-10 ${miembro.statusId === 1 ? 'text-success' : 'text-secondary'} rounded-pill px-3 py-1.5 mt-2 fw-bold`}
              >
                ● {miembro.statusId === 1 ? 'Atleta Activo' : 'Inactivo'}
              </Badge>
            </div>
            <Card.Body className="p-4">
              <h6 className="text-uppercase text-muted fw-bold tracking-wider small mb-3">Información de Contacto</h6>
              
              <div className="mb-3 pb-2 border-bottom">
                <span className="text-muted d-block small mb-0.5"><FaPhone className="me-1.5" /> Teléfono</span>
                <span className="fw-medium text-dark">{miembro.phone || 'No registrado'}</span>
              </div>

              <div className="mb-3 pb-2 border-bottom">
                <span className="text-muted d-block small mb-0.5"><FaHome className="me-1.5" /> Dirección</span>
                <span className="fw-medium text-dark">{miembro.address || 'No registrada'}</span>
              </div>

              {miembro.balance > 0 && (
                <Alert variant="danger" className="bg-danger bg-opacity-10 text-danger border-0 rounded-3 d-flex align-items-center gap-2 mt-4 mb-0 py-2.5">
                  <FaDollarSign className="fs-5" />
                  <div>
                    <div className="small fw-semibold">Saldo Pendiente</div>
                    <div className="fs-5 fw-bold">${Number(miembro.balance).toFixed(2)}</div>
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Columna Derecha: Historiales */}
        <Col lg={8}>
          {/* Historial de membresías */}
          <Card className="shadow-sm border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-inline-flex">
                  <FaHistory size={16} />
                </div>
                <h5 className="fw-bold text-dark mb-0">Historial de Membresías</h5>
              </div>

              <div className="border rounded-3 overflow-hidden">
                <Table hover responsive className="align-middle mb-0 table-borderless">
                  <thead className="bg-light border-bottom text-secondary small fw-bold text-uppercase">
                    <tr>
                      <th className="px-4 py-3">Plan contratado</th>
                      <th className="py-3">F. Inicio</th>
                      <th className="py-3">F. Vencimiento</th>
                      <th className="px-4 py-3 text-end">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membresias.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 text-muted">Sin membresías registradas</td></tr>
                    ) : (
                      membresias.map((m) => (
                        <tr key={m.MembershipId} className="border-bottom last-border-0">
                          <td className="px-4 py-3 fw-semibold text-dark">{m.PlanName}</td>
                          <td className="py-3 text-muted">{new Date(m.StartDate).toLocaleDateString()}</td>
                          <td className="py-3 text-muted">{new Date(m.EndDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-end">
                            <Badge 
                              bg={m.StatusId === 1 ? 'success' : 'danger'} 
                              className={`bg-opacity-10 ${m.StatusId === 1 ? 'text-success' : 'text-danger'} rounded-pill px-2.5 py-1.5`}
                            >
                              {m.StatusName}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Historial de pagos */}
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-success bg-opacity-10 text-success rounded p-2 d-inline-flex">
                  <FaFileInvoiceDollar size={16} />
                </div>
                <h5 className="fw-bold text-dark mb-0">Historial de Transacciones / Pagos</h5>
              </div>

              <div className="border rounded-3 overflow-hidden">
                <Table hover responsive className="align-middle mb-0 table-borderless">
                  <thead className="bg-light border-bottom text-secondary small fw-bold text-uppercase">
                    <tr>
                      <th className="px-4 py-3">No. Factura</th>
                      <th className="py-3">Fecha Emisión</th>
                      <th className="py-3">Método</th>
                      <th className="py-3">Monto Cobrado</th>
                      <th className="px-4 py-3 text-end">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Sin pagos registrados</td></tr>
                    ) : (
                      pagos.map((p) => (
                        <tr key={p.InvoiceId} className="border-bottom last-border-0">
                          <td className="px-4 py-3 fw-medium text-dark">#{p.InvoiceNumber}</td>
                          <td className="py-3 text-muted">{new Date(p.InvoiceDate).toLocaleDateString()}</td>
                          <td className="py-3"><Badge bg="light" className="text-dark border">{p.MethodName || 'N/A'}</Badge></td>
                          <td className="py-3 fw-bold text-dark">${Number(p.TotalAmount).toFixed(2)}</td>
                          <td className="px-4 py-3 text-end">
                            <Badge 
                              bg={p.StatusId === 1 ? 'success' : 'secondary'} 
                              className={`bg-opacity-10 ${p.StatusId === 1 ? 'text-success' : 'text-secondary'} rounded-pill px-2.5 py-1.5`}
                            >
                              {p.StatusId === 1 ? 'Liquidado' : 'Anulado'}
                            </Badge>
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

      {/* Gráfico Estadístico de Asistencias */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-info bg-opacity-10 text-info rounded p-2 d-inline-flex">
                  <FaChartLine size={16} />
                </div>
                <h5 className="fw-bold text-dark mb-0">Frecuencia de Asistencia (Últimos 30 días)</h5>
              </div>
              
              {attendanceData.length === 0 ? (
                <p className="text-muted mb-0 bg-light rounded-3 p-4 text-center">No hay registros de ingresos en el molinete este mes.</p>
              ) : (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="fecha" stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                      />
                     
                      <Bar dataKey="asistencias" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Asistencias" maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MiembroDetalle;