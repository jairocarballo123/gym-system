// src/features/Miembros/components/MiembroDetalle.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaDollarSign, FaUser, FaPhone, FaHome } from 'react-icons/fa';
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
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !detalle) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'No se encontró el miembro'}</Alert>
        <Button variant="secondary" onClick={() => navigate('/miembros')}>
          Volver
        </Button>
      </Container>
    );
  }

  const { miembro, membresias, pagos, asistencia } = detalle;

  // Formatear datos para el gráfico
  const attendanceData = asistencia.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    asistencias: item.asistencias,
  }));

  return (
    <Container className="py-4">
      <Button variant="link" className="mb-3 p-0" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Volver
      </Button>

      <Row className="g-4">
        {/* Datos personales */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="text-primary mb-3">Información personal</h5>
              <p><FaUser className="me-2" /> <strong>Nombre:</strong> {miembro.fullName}</p>
              <p><FaPhone className="me-2" /> <strong>Teléfono:</strong> {miembro.phone || 'No registrado'}</p>
              <p><FaHome className="me-2" /> <strong>Dirección:</strong> {miembro.address || 'No registrada'}</p>
              <p><FaCalendarAlt className="me-2" /> <strong>Estado:</strong> {miembro.statusId === 1 ? 'Activo' : 'Inactivo'}</p>
              {miembro.balance > 0 && (
                <Alert variant="danger" className="mt-3">
                  <FaDollarSign /> Deuda pendiente: ${miembro.balance}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Historial de membresías */}
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="text-primary mb-3">Historial de membresías</h5>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {membresias.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">Sin membresías registradas</td></tr>
                  ) : (
                    membresias.map((m) => (
                      <tr key={m.MembershipId}>
                        <td>{m.PlanName}</td>
                        <td>{new Date(m.StartDate).toLocaleDateString()}</td>
                        <td>{new Date(m.EndDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${m.StatusId === 1 ? 'success' : 'danger'}`}>
                            {m.StatusName}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Historial de pagos */}
          <Card className="shadow-sm border-0 mt-4">
            <Card.Body>
              <h5 className="text-primary mb-3">Historial de pagos</h5>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">Sin pagos registrados</td></tr>
                  ) : (
                    pagos.map((p) => (
                      <tr key={p.InvoiceId}>
                        <td>{p.InvoiceNumber}</td>
                        <td>{new Date(p.InvoiceDate).toLocaleDateString()}</td>
                        <td>${p.TotalAmount}</td>
                        <td>{p.MethodName || 'N/A'}</td>
                        <td>
                          <span className={`badge bg-${p.StatusId === 1 ? 'success' : 'danger'}`}>
                            {p.StatusId === 1 ? 'Pagado' : 'Anulado'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico de asistencia */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="text-primary mb-3">Asistencia (últimos 30 días)</h5>
              {attendanceData.length === 0 ? (
                <p className="text-muted">No hay registros de asistencia.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="asistencias" fill="#8884d8" name="Asistencias" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MiembroDetalle;