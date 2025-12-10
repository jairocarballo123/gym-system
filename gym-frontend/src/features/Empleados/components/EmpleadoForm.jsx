import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { User, Phone, Briefcase, Lock, Clock, IdCard } from 'lucide-react';

const EmpleadoForm = ({ show, handleClose, onSubmit, initialData }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        rol: '',
        especialidad: '',
        disponibilidad: '',
        activo: '',
        password: ''
    });

    //  manejar errores y feedback visual
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show) {
            // Limpiamos errores al abrir el modal
            setError(null);
            setIsSubmitting(false);

            if (initialData) {
                // Asegurar que activo tenga valor válido
                const activoValido = initialData.activo === 'activo' || initialData.activo === 'inactivo' 
                    ? initialData.activo 
                    : 'activo';
                
                setFormData({
                    ...initialData,
                    activo: activoValido,
                    password: '' // La contraseña siempre inicia vacía por seguridad
                });
            } else {
                // Resetear form si es nuevo registro
                setFormData({
                    nombre: '', 
                    telefono: '', 
                    rol: '',
                    especialidad: '', 
                    disponibilidad: 'disponible',
                    password: '', 
                    activo: 'activo'
                });
            }
        }
    }, [initialData, show]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        
        // Si el usuario cambia algo, limpiamos el error para que intente de nuevo
        if (error) setError(null);
    };

    // Lógica para determinar si la contraseña es obligatoria
    // Regla: Es obligatoria SOLO si es un registro NUEVO Y el rol es 'admin'
    const isPasswordRequired = !initialData && formData.rol === 'admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Validaciones de Negocio previas al envío
            if (formData.rol === 'admin' && !initialData && !formData.password) {
                throw new Error("Para registrar un Administrador, la contraseña es obligatoria.");
            }

            // 2. Preparar los datos (Sanitization)
            const dataToSend = { ...formData };

            // Asegurar que activo siempre tenga valor válido
            if (!dataToSend.activo || (dataToSend.activo !== 'activo' && dataToSend.activo !== 'inactivo')) {
                dataToSend.activo = 'activo';
            }

            // Si es edición y el campo pass está vacío, lo borramos para no enviar string vacío
            if (initialData && !dataToSend.password) {
                delete dataToSend.password;
            }
            
            // Si no es admin, no enviamos password
            if (formData.rol !== 'admin') {
                delete dataToSend.password; 
            }

            await onSubmit(dataToSend);
     
        } catch (err) {
            console.error("Error en formulario empleado:", err);
            setError(err.message || "Ocurrió un error inesperado al guardar el empleado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{initialData ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    
                    {/* Mensaje de Error Robusto */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <h6 className="text-muted mb-3 text-uppercase fw-bold small">Datos Generales</h6>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
                            <InputGroup>
                                <InputGroup.Text><User size={18} /></InputGroup.Text>
                                <Form.Control 
                                    name="nombre" 
                                    value={formData.nombre} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Nombre y Apellidos"
                                />
                            </InputGroup>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                            <InputGroup>
                                <InputGroup.Text><Phone size={18} /></InputGroup.Text>
                                <Form.Control 
                                    name="telefono" 
                                    value={formData.telefono} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Solo números"
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <h6 className="text-muted mb-3 text-uppercase fw-bold small mt-2">Detalles del Cargo</h6>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Rol <span className="text-danger">*</span></Form.Label>
                            <InputGroup>
                                <InputGroup.Text><IdCard size={18} /></InputGroup.Text>
                                <Form.Select 
                                    name="rol" 
                                    value={formData.rol} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Selecciona un rol</option>
                                    <option value="admin">Administrador (Con acceso)</option>
                                    <option value="entrenador">Entrenador</option>
                                    <option value="recepcionista">Recepcionista</option>
                                    <option value="nutriologo">Nutriólogo</option>
                                    <option value="fisioterapeuta">Fisioterapeuta</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Especialidad</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><Briefcase size={18} /></InputGroup.Text>
                                <Form.Control
                                    name="especialidad"
                                    value={formData.especialidad || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Pesas, Yoga, CrossFit"
                                />
                            </InputGroup>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Disponibilidad</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><Clock size={18} /></InputGroup.Text>
                                <Form.Select name="disponibilidad" value={formData.disponibilidad} onChange={handleChange}>
                                    <option value="disponible">Disponible</option>
                                    <option value="ocupado">ocupado</option>
                                    <option value="vacaciones">Vacaciones</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>

                        {/* LÓGICA DE CONTRASEÑA - SOLO SE MUESTRA PARA ADMIN */}
                        {formData.rol === 'admin' && (
                            <Col md={6} className="mb-3">
                                <Form.Label>
                                    Contraseña
                                    {isPasswordRequired && <span className="text-danger"> *</span>}
                                    {initialData && <small className="text-muted ms-1">(Opcional al editar)</small>}
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className={isPasswordRequired ? "bg-warning text-dark" : ""}>
                                        <Lock size={18} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={isPasswordRequired}
                                        placeholder="Contraseña de acceso"
                                    />
                                </InputGroup>
                            </Col>
                        )}

                        <Col md={12}>
                            <Form.Check
                                type="switch"
                                id="activo-switch"
                                label={formData.activo === 'activo' ? "activo" : "inactivo"}
                                name="activo"
                                checked={formData.activo === 'activo'}
                                onChange={(e) => {
                                 
                                    const valorParaBD = e.target.checked ? 'activo' : 'inactivo';
                                    setFormData({ ...formData, activo: valorParaBD });
                                }}
                                className="mt-2 fw-bold text-primary"
                            />
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Registrar Empleado')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EmpleadoForm;