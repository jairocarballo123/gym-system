import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form, Spinner } from 'react-bootstrap';
import { FaSearch, FaUserCheck, FaCalendarCheck, FaChartBar, FaRunning } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

import AsistenciaTable from './components/AsistenciaTable';
import CheckInForm from './components/checkInForm';
import { useAsistencias } from './hooks/useAsistencias';

const AsistenciasList = () => {
  const { asistencias, stats, loading, error, registrarEntrada, eliminarAsistencia } = useAsistencias();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // --- FILTRO ---
  const filteredList = useMemo(() => {
    if (!searchTerm) return asistencias;
    const term = searchTerm.toLowerCase();
    return asistencias.filter(a => 
      a.miembro_nombre?.toLowerCase().includes(term) || 
      a.miembro_id?.toLowerCase().includes(term)
    );
  }, [asistencias, searchTerm]);

  // --- HANDLERS ---
  const handleCheckIn = async (miembroId) => {
    try {
      Swal.fire({ title: 'Registrando...', didOpen: () => Swal.showLoading() });
      await registrarEntrada(miembroId);
      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Asistencia registrada correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      
      setShowModal(false);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Error al registrar', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: '¿Borrar registro?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33'
    });
    if (res.isConfirmed) {
      try {
        await eliminarAsistencia(id);
        Swal.fire('Eliminado', 'Registro borrado.', 'success');
      } catch (err) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Control de Asistencias</h2>
          <Button variant="success" size="lg" onClick={() => setShowModal(true)} className="shadow">
            <FaRunning className="me-2"/> Registrar Entrada
          </Button>
      </div>

      {/* --- TARJETAS DE ESTADÍSTICAS (Usando datos del Backend) --- */}
      {stats && (
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm border-start border-success border-4">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                  <FaUserCheck size={28} />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Asistencias Hoy</h6>
                  <h3 className="fw-bold mb-0">{stats.asistencias_hoy}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm border-start border-primary border-4">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                  <FaChartBar size={28} />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Histórico</h6>
                  <h3 className="fw-bold mb-0">{stats.total_asistencias}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm border-start border-warning border-4">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                  <FaCalendarCheck size={28} />
                </div>
                <div>
                  <h6 className="text-muted mb-0">Socios Únicos</h6>
                  <h3 className="fw-bold mb-0">{stats.miembros_unicos}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* TABLA */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <InputGroup style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-light"><FaSearch /></InputGroup.Text>
            <Form.Control 
              placeholder="Buscar por Socio..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
           {loading ? <div className="text-center p-5"><Spinner animation="border"/></div> : 
             <AsistenciaTable asistencias={filteredList} onDelete={handleDelete} /> 
           }
        </Card.Body>
      </Card>

      <CheckInForm show={showModal} handleClose={() => setShowModal(false)} onSubmit={handleCheckIn} />
    </Container>
  );
};

export default AsistenciasList;