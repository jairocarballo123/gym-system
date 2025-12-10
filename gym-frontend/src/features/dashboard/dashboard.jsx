import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Button, Table, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { 
    FaUsers, 
    FaMoneyBillWave, 
    FaUserTie, 
    FaClipboardList, 
    FaChartLine, 
    FaArrowRight,
    FaExclamationTriangle
} from 'react-icons/fa';

// --- IMPORTACIÓN DE HOOKS ---
import { useMembers } from '../member/hooks/usemember';      
import { usePayments } from '../payments/hooks/usePayments';   
import { useEmpleados } from '../Empleados/hooks/useEmpleados'; 
import { usePlans } from '../planes/hooks/useplanes';        

const DashboardHome = () => {
  
    const { members, loading: loadMembers, error: errMembers } = useMembers();
    const { payments, loading: loadPayments, error: errPayments } = usePayments();
    const { empleados, loading: loadEmpleados, error: errEmpleados } = useEmpleados();
    const { planes, loading: loadPlanes, error: errPlanes } = usePlans();

    const isLoading = loadMembers || loadPayments || loadEmpleados || loadPlanes;
    const hasError = errMembers || errPayments || errEmpleados || errPlanes;

    
    // Usamos useMemo para que no recalcule en cada render, solo cuando cambien los datos.
    const stats = useMemo(() => {
      
        const totalMembers = members?.length || 0;
        const activeMembers = members?.filter(m => m.estado_membresia === 'activo' || m.estado === 'activo').length || 0;
        const inactiveMembers = totalMembers - activeMembers;
        const activityRate = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

    
        const totalIncome = payments?.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        // Obtenemos los últimos 5 pagos para la tabla (invertimos el array para ver los nuevos primero)
        const recentPayments = payments ? [...payments].reverse().slice(0, 5) : [];

        const totalStaff = empleados?.length || 0;
        const trainers = empleados?.filter(e => e.rol === 'entrenador').length || 0;

        const totalPlans = planes?.length || 0;

        return {
            totalMembers,
            activeMembers,
            inactiveMembers,
            activityRate,
            totalIncome,
            recentPayments,
            totalStaff,
            trainers,
            totalPlans
        };
    }, [members, payments, empleados, planes]);

    // 3. RENDERIZADO DE CARGA
    if (isLoading) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <h5 className="mt-3 text-muted">Sincronizando datos del gimnasio...</h5>
            </Container>
        );
    }

    // RENDERIZADO DE ERROR (Opcional, si falla alguna API)
    if (hasError) {
        return (
            <Container className="p-5">
                <Alert variant="warning">
                    <FaExclamationTriangle className="me-2"/>
                    Hubo un problema cargando algunos datos del tablero. Por favor verifica tu conexión o recarga la página.
                </Alert>
            </Container>
        );
    }

    // 5. RENDERIZADO DEL DASHBOARD
    return (
        <Container fluid className="p-4">
        
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-0">Panel General</h2>
                    <p className="text-muted mb-0 small">Visión general de operaciones en tiempo real</p>
                </div>
                <div className="text-end">
                    <span className="badge bg-light text-dark border px-3 py-2">
                        📅 {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* TARJETAS KPI (Key Performance Indicators) */}
            <Row className="g-3 mb-4">
                {/* Ingresos */}
                <Col md={6} xl={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                    <FaMoneyBillWave className="text-success" size={24} />
                                </div>
                                <span className="text-muted fw-bold small text-uppercase">Ingresos Totales</span>
                            </div>
                            <h3 className="fw-bold text-dark mb-0">
                                C$ {stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            <small className="text-success fw-bold">
                                <FaChartLine className="me-1"/> {payments?.length} Transacciones
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Miembros Activos */}
                <Col md={6} xl={3}>
                    <Card className="border-0 shadow-sm border-start border-primary border-4 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                    <FaUsers className="text-primary" size={24} />
                                </div>
                                <span className="text-muted fw-bold small text-uppercase">Miembros Activos</span>
                            </div>
                            <h3 className="fw-bold text-dark mb-0">{stats.activeMembers}</h3>
                            <small className="text-muted">
                                De {stats.totalMembers} registrados ({stats.activityRate.toFixed(0)}% Actividad)
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Personal */}
                <Col md={6} xl={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                                    <FaUserTie className="text-info" size={24} />
                                </div>
                                <span className="text-muted fw-bold small text-uppercase">Personal</span>
                            </div>
                            <h3 className="fw-bold text-dark mb-0">{stats.totalStaff}</h3>
                            <small className="text-muted">
                                {stats.trainers} Entrenadores Activos
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Planes */}
                <Col md={6} xl={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4 h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                                    <FaClipboardList className="text-warning" size={24} />
                                </div>
                                <span className="text-muted fw-bold small text-uppercase">Planes</span>
                            </div>
                            <h3 className="fw-bold text-dark mb-0">{stats.totalPlans}</h3>
                            <small className="text-muted">Oferta comercial actual</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* SECCIÓN IZQUIERDA: ESTADO DE SALUD */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 border-0">
                            <h6 className="fw-bold m-0">Salud de la Membresía</h6>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div className="text-center mb-4 position-relative">
                                <h1 className="display-4 fw-bold text-primary mb-0">
                                    {stats.activityRate.toFixed(1)}%
                                </h1>
                                <span className="text-muted small text-uppercase fw-bold">Tasa de Retención</span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="d-flex justify-content-between small mb-1 fw-bold">
                                    <span>Miembros Activos</span>
                                    <span className="text-primary">{stats.activeMembers}</span>
                                </div>
                                <ProgressBar variant="primary" now={stats.activityRate} style={{height: '10px', borderRadius: '10px'}} />
                            </div>

                            <div>
                                <div className="d-flex justify-content-between small mb-1 fw-bold">
                                    <span>Vencidos / Inactivos</span>
                                    <span className="text-danger">{stats.inactiveMembers}</span>
                                </div>
                                <ProgressBar variant="danger" now={100 - stats.activityRate} style={{height: '10px', borderRadius: '10px'}} />
                            </div>
                            
                            <div className="mt-4 pt-3 border-top text-center">
                                <small className="text-muted">Meta mensual: Mantener arriba del 80%</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* SECCIÓN DERECHA: ÚLTIMAS TRANSACCIONES */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-0">
                            <h6 className="fw-bold m-0">Últimos Pagos Registrados</h6>
                            <Button variant="link" size="sm" className="text-decoration-none p-0 fw-bold">
                                Ver historial completo <FaArrowRight size={12} className="ms-1"/>
                            </Button>
                        </Card.Header>
                        <Table hover responsive className="mb-0 align-middle table-borderless">
                            <thead className="bg-light text-muted small text-uppercase font-monospace">
                                <tr>
                                    <th className="ps-4">ID Pago</th>
                                    <th>Socio</th>
                                    <th>Recibo</th>
                                    <th className="text-end pe-4">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentPayments.length > 0 ? (
                                    stats.recentPayments.map((pago, idx) => (
                                        <tr key={pago.id || idx} className="border-bottom">
                                            <td className="ps-4 fw-bold text-muted">#{pago.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle p-2 me-2">
                                                        <FaUserTie size={12} className="text-secondary"/>
                                                    </div>
                                                    <span className="fw-bold text-dark">ID: {pago.miembro_id}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {pago.recibo_id || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <span className="fw-bold text-success">
                                                    + C$ {parseFloat(pago.monto).toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            <FaClipboardList size={30} className="mb-2 opacity-50"/>
                                            <p className="mb-0">No hay pagos registrados aún.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardHome;