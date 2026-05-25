
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { FaArrowLeft, FaPhone, FaDumbbell, FaClock, FaUserCircle, FaBriefcase, FaIdCard, FaChartLine } from 'react-icons/fa';
import { empleadoServices } from '../services/empleadoServices';
import toast from 'react-hot-toast';

const EmpleadoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const res = await empleadoServices.getById(id);
        setEmpleado(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar perfil del empleado';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleado();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !empleado) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="border-0 shadow-sm">{error || 'El empleado solicitado no se encuentra registrado.'}</Alert>
        <Button variant="secondary" onClick={() => navigate('/empleados')}>Volver</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '1000px' }}>
      
      <Button variant="link" className="text-decoration-none text-secondary mb-4 p-0 d-inline-flex align-items-center gap-2" onClick={() => navigate('/empleados')}>
        <FaArrowLeft /> Regresar al listado de personal
      </Button>

      {/* Header Profile Card */}
      <Card className="border-0 shadow-sm bg-white p-4 rounded-3 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
          <div className="bg-light rounded-circle p-2 border d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
            <FaUserCircle size={70} className="text-secondary opacity-50" />
          </div>
          <div className="text-center text-md-start flex-grow-1">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-2 mb-1">
              <h3 className="fw-bold text-dark mb-0">{empleado.nombre || empleado.FullName}</h3>
              <Badge bg={empleado.statusId === 1 ? 'success' : 'danger'} className="bg-opacity-10 text-capitalize px-2 py-1" style={{ color: empleado.statusId === 1 ? '#198754' : '#dc3545' }}>
                ● {empleado.Estado || (empleado.statusId === 1 ? 'Activo' : 'Inactivo')}
              </Badge>
            </div>
            <p className="text-muted d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-0">
              <FaBriefcase size={14} /> {empleado.Rol || (empleado.roleId === 1 ? 'Administrador' : empleado.roleId === 2 ? 'Entrenador' : 'Recepcionista')}
            </p>
          </div>
        </div>
      </Card>

      <Row className="g-4">
        {/* Columna Izquierda: Detalles de Identificación */}
        <Col md={5}>
          <Card className="border-0 shadow-sm rounded-3 h-100 bg-white">
            <Card.Body className="p-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                <FaIdCard className="text-primary" size={16} /> Información del Empleado
              </h5>
              <div className="d-flex flex-column gap-3">
                <div>
                  <span className="text-muted small d-block">Identificador único (Código Interno)</span>
                  <span className="text-dark fw-semibold">#{empleado.id || empleado.EmployeeId}</span>
                </div>
                <div>
                  <span className="text-muted small d-block"><FaPhone size={11} className="me-1" /> Teléfono de Contacto</span>
                  <span className="text-dark fw-medium">{empleado.telefono || empleado.Phone || 'No registrado'}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna Derecha: Métricas y Perfil Laboral */}
        <Col md={7}>
          <Card className="border-0 shadow-sm rounded-3 h-100 bg-white">
            <Card.Body className="p-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                <FaChartLine className="text-success" size={16} /> Ficha Operativa y Desempeño
              </h5>
              
              {/* Bloques de información según el rol */}
              {empleado.roleId === 2 ? (
                <Row className="g-3 mb-4">
                  <Col xs={12}>
                    <div className="bg-light p-3 rounded-3">
                      <span className="text-muted small d-block"><FaDumbbell className="text-warning me-1" /> Especialidad Técnica</span>
                      <span className="text-dark fw-semibold">{empleado.Especialidad || empleado.specialty || 'General / Instructor de Sala'}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="bg-light p-3 rounded-3">
                      <span className="text-muted small d-block"><FaClock className="text-info me-1" /> Horario Asignado</span>
                      <span className="text-dark fw-semibold">{empleado.Disponibilidad || empleado.availability || 'Por definir'}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="p-3 bg-violet bg-opacity-10 rounded-3 border-start border-4" style={{ borderColor: '#6f42c1' }}>
                      <span className="text-muted small d-block">Volumen de Clientes a Cargo</span>
                      <h4 className="fw-bold mb-0 mt-1 text-dark" style={{ color: '#6f42c1' }}>{empleado.ClientesAsignados || 0} <span className="fs-6 text-muted fw-normal">Atletas Activos</span></h4>
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row className="g-3 mb-4">
                  <Col xs={12}>
                    <div className="bg-light p-3 rounded-3">
                      <span className="text-muted small d-block"><FaClock className="text-info me-1" /> Disponibilidad en Caja / Administración</span>
                      <span className="text-dark fw-semibold">{empleado.Disponibilidad || empleado.availability || 'Turno Rotativo Completo'}</span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="p-3 bg-success bg-opacity-10 rounded-3 border-start border-4 border-success">
                      <span className="text-muted small d-block">Transacciones y Ventas Cobradas</span>
                      <h4 className="fw-bold text-success mb-0 mt-1">{empleado.FacturasProcesadas || 0} <span className="fs-6 text-muted fw-normal">Facturas Emitidas</span></h4>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmpleadoDetalle;