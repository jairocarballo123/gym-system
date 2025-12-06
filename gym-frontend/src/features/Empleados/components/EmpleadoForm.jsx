import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaUser, FaPhone, FaBriefcase, FaLock, FaClock, FaIdBadge } from 'react-icons/fa';

const EmpleadoForm = ({ show, handleClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        rol: '', // Valor por defecto
        especialidad: '',
        disponibilidad: '',
        activo: 'Activo',
        password: '', // Campo para la contraseña

    });

    useEffect(() => {
        if (initialData) {

            setFormData({
                ...initialData,
                password: ''
            });
        } else {
            setFormData({
                nombre: '', telefono: '', rol: '',
                especialidad: '', disponibilidad: '',
                password: '', activo: 'Activo'
            });
        }
    }, [initialData, show]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = { ...formData };
        if (initialData && !dataToSend.password) {
            delete dataToSend.password;
        }
        onSubmit(dataToSend);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{initialData ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">

                    <h6 className="text-muted mb-3 text-uppercase fw-bold small">Datos Generales</h6>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaUser /></InputGroup.Text>
                                <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </InputGroup>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaPhone /></InputGroup.Text>
                                <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required />
                            </InputGroup>
                        </Col>
                    </Row>

                    <h6 className="text-muted mb-3 text-uppercase fw-bold small mt-2">Detalles del Cargo</h6>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaIdBadge /></InputGroup.Text>
                                <Form.Select name="rol" value={formData.rol} onChange={handleChange}>
                                    <option value="">Selecciona un rol</option>
                                    <option value="admin">admin</option>
                                    <option value="entrenador">entrenador</option>
                                    <option value="recepcionista">recepcionista</option>
                                    <option value="nutriologo">nutriologo</option>
                                    <option value="fisioterapeuta">fisioterapeuta</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Especialidad</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaBriefcase /></InputGroup.Text>
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
                                <InputGroup.Text><FaClock /></InputGroup.Text>
                                <Form.Select name="disponibilidad" value={formData.disponibilidad} onChange={handleChange}>
                                    <option value="disponible">disponible</option>
                                    <option value="no disponible">no disponible</option>
                                    <option value="vacaciones">Vacaciones</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label>Contraseña {initialData && <small className="text-muted">(Dejar vacío para no cambiar)</small>}</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><FaLock /></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!initialData} // Obligatorio solo al crear
                                    placeholder="••••••"
                                />
                            </InputGroup>
                        </Col>

                        <Col md={12}>
                            <Form.Check
                                type="switch"
                                id="activo-switch"
                                label="Empleado Activo"
                                name="activo"
                                checked={formData.activo === 'activo'}
                                onChange={(e) =>
                                    setFormData({ ...formData, activo: e.target.checked ? 'activo' : 'inactivo' })
                                }
                                className="mt-2"
                            />
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant="primary" type="submit">
                        {initialData ? 'Guardar Cambios' : 'Registrar Empleado'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EmpleadoForm;