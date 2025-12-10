import  { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const PlanForm = ({ show, handleClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        
        nombre: '',
        precio: 0,
        duracion_dias: 0,
        descripcion: '',
        activo: 'activo'
    });

    // Si viene "initialData" es Edición, si no, es Creación
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({  nombre: '', precio: 0, duracion_dias:0, descripcion: '', activo: 'activo' });
        }
    }, [initialData, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" centered>
            <Modal.Header closeButton className={initialData ? "bg-warning" : "bg-primary text-white"}>
                <Modal.Title>{initialData ? 'Editar Plan' : 'Nuevo Plan'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="g-3">
                      
                        
                        <Col md={8}>
                            <Form.Label>Nombre del Plan</Form.Label>
                            <Form.Control 
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Label>Precio (C$)</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                                required
                                step="0.01"
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Label>Duración (Días)</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="duracion_dias"
                                value={formData.duracion_dias}
                                onChange={handleChange}
                                required
                            />
                        </Col>

                        <Col md={12}>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={2}
                            />
                        </Col>

                        <Col md={12}>
                            <Form.Label>Estado</Form.Label>
                            <Form.Select name="activo" value={formData.activo} onChange={handleChange}>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant={initialData ? "warning" : "primary"} type="submit">
                        {initialData ? 'Actualizar' : 'Guardar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PlanForm;