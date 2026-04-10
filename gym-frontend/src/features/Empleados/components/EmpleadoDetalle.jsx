// src/features/Empleados/components/EmpleadoDetalle.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { FaArrowLeft, FaUser, FaPhone, FaDumbbell, FaClock, FaCalendarAlt } from 'react-icons/fa';
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
        const msg = err.response?.data?.message || 'Error al cargar empleado';
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
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !empleado) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Empleado no encontrado'}</Alert>
        <Button variant="secondary" onClick={() => navigate('/empleados')}>
          Volver
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="link" className="mb-3 p-0" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Volver
      </Button>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="text-primary mb-3">Información personal</h5>
              <p><FaUser className="me-2" /> <strong>Nombre:</strong> {empleado.nombre}</p>
              <p><FaPhone className="me-2" /> <strong>Teléfono:</strong> {empleado.telefono || 'No registrado'}</p>
              <p><FaCalendarAlt className="me-2" /> <strong>Estado:</strong>{' '}
                <Badge bg={empleado.statusId === 1 ? 'success' : 'danger'}>
                  {empleado.statusId === 1 ? 'Activo' : 'Inactivo'}
                </Badge>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="text-primary mb-3">Información laboral</h5>
              <p><strong>Rol:</strong> {empleado.roleId === 1 ? 'Administrador' : empleado.roleId === 2 ? 'Entrenador' : 'Recepcionista'}</p>
              {empleado.roleId === 2 && (
                <>
                  <p><FaDumbbell className="me-2" /> <strong>Especialidad:</strong> {empleado.specialty || 'No especificada'}</p>
                  <p><FaClock className="me-2" /> <strong>Disponibilidad:</strong> {empleado.availability || 'No especificada'}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmpleadoDetalle;