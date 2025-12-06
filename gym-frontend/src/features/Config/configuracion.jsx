import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUserCog, FaMoon, FaBell, FaVolumeUp, FaDatabase, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useauth'; 

const Configuracion = () => {
  const { user, logout } = useAuth(); 

  
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    sound: false,
    compactMode: false
  });


  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('gym_settings'));
    if (savedSettings) setSettings(savedSettings);
  }, []);

 
  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('gym_settings', JSON.stringify(newSettings));
    

    if(key === 'darkMode') {
        document.body.style.backgroundColor = newSettings.darkMode ? '#2c3e50' : '#f8f9fa';
        Swal.fire({
            toast: true, position: 'top-end', icon: 'info', 
            title: `Tema ${newSettings.darkMode ? 'Oscuro' : 'Claro'} activado`,
            showConfirmButton: false, timer: 1500
        });
    }
  };


  const handleBackup = () => {
    Swal.fire({
      title: 'Generando Respaldo...',
      html: 'Exportando base de datos local JSON',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => { Swal.showLoading() }
    }).then(() => {
  
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ sistema: "GymSystem", fecha: new Date() }));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "backup_gym.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();m
      downloadAnchorNode.remove();
      
      Swal.fire('¡Listo!', 'Copia de seguridad descargada.', 'success');
    });
  };

  return (
    <Container fluid className="p-4">
      <h2 className="fw-bold text-dark mb-4">Configuración del Sistema</h2>

      <Row>
        {/* --- COLUMNA IZQUIERDA: PERFIL --- */}
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm text-center p-4 h-100">
            <div className="mb-3">
                <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block text-primary">
                    <FaUserCog size={50} />
                </div>
            </div>
            <h4 className="fw-bold">{user?.nombre || 'Administrador'}</h4>
            <p className="text-muted mb-1 text-uppercase small">{user?.rol || 'Super Admin'}</p>
            <p className="text-muted small">ID: {user?.id || '---'}</p>
            
            <hr />
            
            <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">Editar Perfil</Button>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                    <FaSignOutAlt className="me-2"/> Cerrar Sesión
                </Button>
            </div>
          </Card>
        </Col>

        {/* --- COLUMNA DERECHA: AJUSTES --- */}
        <Col md={8}>
          
          {/* 1. Preferencias de Interfaz */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 fw-bold border-bottom-0">
                <FaMoon className="me-2 text-primary"/> Apariencia y Comportamiento
            </Card.Header>
            <Card.Body>
                <Form>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <strong>Modo Oscuro</strong>
                            <p className="text-muted small mb-0">Cambia la interfaz a colores oscuros para descansar la vista.</p>
                        </div>
                        <Form.Check 
                            type="switch" 
                            id="darkMode" 
                            checked={settings.darkMode}
                            onChange={() => toggleSetting('darkMode')}
                            className="fs-5"
                        />
                    </div>
                    <hr className="text-muted opacity-25"/>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <strong><FaBell className="me-1 text-warning"/> Notificaciones</strong>
                            <p className="text-muted small mb-0">Recibir alertas emergentes al realizar acciones.</p>
                        </div>
                        <Form.Check 
                            type="switch" 
                            id="notifications" 
                            checked={settings.notifications}
                            onChange={() => toggleSetting('notifications')}
                            className="fs-5"
                        />
                    </div>
                    <hr className="text-muted opacity-25"/>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong><FaVolumeUp className="me-1 text-info"/> Efectos de Sonido</strong>
                            <p className="text-muted small mb-0">Reproducir sonidos al completar tareas.</p>
                        </div>
                        <Form.Check 
                            type="switch" 
                            id="sound" 
                            checked={settings.sound}
                            onChange={() => toggleSetting('sound')}
                            className="fs-5"
                        />
                    </div>
                </Form>
            </Card.Body>
          </Card>

          {/* 2. Zona de Datos */}
          <Card className="border-0 shadow-sm border-start border-danger border-4">
            <Card.Header className="bg-white py-3 fw-bold border-bottom-0">
                <FaDatabase className="me-2 text-danger"/> Gestión de Datos
            </Card.Header>
            <Card.Body>
                <Alert variant="info" className="d-flex align-items-center">
                    <FaInfoCircle className="me-3 fs-3" />
                    <div>
                        <strong>Copia de Seguridad Local</strong>
                        <br />
                        Descarga un archivo JSON con la configuración actual del sistema.
                    </div>
                </Alert>
                <Button variant="dark" onClick={handleBackup}>
                    <FaDatabase className="me-2"/> Exportar Datos (Backup)
                </Button>
            </Card.Body>
          </Card>

          {/* Footer de Versión */}
          <div className="text-center mt-4 text-muted small">
            Gym System v1.0.0 &copy; 2025
          </div>

        </Col>
      </Row>
    </Container>
  );
};

export default Configuracion;