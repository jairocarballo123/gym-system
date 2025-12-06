// import React, { useState, useEffect } from 'react';
// import { Container, Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaPlus, FaDumbbell } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import { plansApi } from '../Api/PlanApi';

// const PlansManager = () => {
//     const [planes, setPlanes] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
    

//     const [formData, setFormData] = useState({ 
//         id: '', 
//         nombre: '', 
//         precio: '', 
//         duracion_dias: '', 
//         descripcion: '',
//         activo: 'activo'
//     });

//     const cargarPlanes = async () => {
//         try {
//             const data = await plansApi.getAll();
//             setPlanes(data);
//         } catch (error) { console.error(error); }
//     };

//     useEffect(() => { cargarPlanes(); }, []);

//     const handleShow = (plan = null) => {
//         if (plan) {
//             setIsEditing(true);
//             setFormData(plan);
//         } else {
//             setIsEditing(false);
//             setFormData({ id: '', nombre: '', precio: '', duracion_dias: '', descripcion: '', activo: 'activo' });
//         }
//         setShowModal(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEditing) {
//                 await plansApi.update(formData.id, formData);
//                 Swal.fire('Actualizado', 'Plan modificado', 'success');
//             } else {
//                 await plansApi.create(formData);
//                 Swal.fire('Creado', 'Plan creado', 'success');
//             }
//             setShowModal(false);
//             cargarPlanes();
//         } catch (error) {
//             Swal.fire('Error', error.response?.data?.error || 'Error desconocido', 'error');
//         }
//     };

//     const handleDelete = async (id) => {
   
//         const result = await Swal.fire({
//             title: '¿Eliminar?', text: "Si tiene pagos asociados, dará error.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33'
//         });
//         if (result.isConfirmed) {
//             try {
//                 await plansApi.delete(id);
//                 Swal.fire('Eliminado', 'Plan eliminado.', 'success');
//                 cargarPlanes();
//             } catch (error) {
//                 Swal.fire('Atención', error.response?.data?.error || 'No se pudo eliminar', 'error');
//             }
//         }
//     };

//     return (
//         <Container className="p-4">
//             <div className="d-flex justify-content-between mb-4">
//                 <h3><FaDumbbell /> Gestión de Planes</h3>
//                 <Button onClick={() => handleShow(null)}><FaPlus /> Nuevo Plan</Button>
//             </div>
//             <Table hover responsive>
//                 <thead className="bg-light">
//                     <tr>
//                         <th>ID</th>
//                         <th>Nombre</th>
//                         <th>Días</th>
//                         <th>Precio</th>
//                         <th>Estado</th>
//                         <th>Acciones</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {planes.map(p => (
//                         <tr key={p.id}>
//                             <td>{p.id}</td>
//                             <td>{p.nombre}</td>
//                             <td>{p.duracion_dias}</td>
//                             <td className="fw-bold text-success">C$ {p.precio}</td>
//                             <td>{p.descripcion}</td>
//                             <td><Badge bg={p.activo === 'activo' ? 'success' : 'secondary'}>{p.activo}</Badge></td>
//                             <td>
//                                 <Button size="sm" variant="light" className="text-primary" onClick={() => handleShow(p)}><FaEdit /></Button>
//                                 <Button size="sm" variant="light" className="text-danger" onClick={() => handleDelete(p.id)}><FaTrash /></Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* MODAL */}
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton><Modal.Title>{isEditing ? 'Editar' : 'Crear'} Plan</Modal.Title></Modal.Header>
//                 <Form onSubmit={handleSubmit}>
//                     <Modal.Body>
//                         <Row>
//                             <Col md={4}>
//                                 <Form.Label>ID (Código)</Form.Label>
//                                 <Form.Control 
//                                     type="text" value={formData.id} 
//                                     onChange={e => setFormData({...formData, id: e.target.value})} 
//                                     disabled={isEditing} // El ID no se suele editar
//                                     placeholder="Ej: MEN-01" required 
//                                 />
//                             </Col>
//                             <Col md={8}>
//                                 <Form.Label>Nombre</Form.Label>
//                                 <Form.Control type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
//                             </Col>
//                             <Col md={6} className="mt-2">
//                                 <Form.Label>Precio</Form.Label>
//                                 <Form.Control type="number" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required />
//                             </Col>
//                             <Col md={6} className="mt-2">
//                                 <Form.Label>Duración (Días)</Form.Label>
//                                 <Form.Control type="number" value={formData.duracion_dias} onChange={e => setFormData({...formData, duracion_dias: e.target.value})} required />
//                             </Col>
//                             <Col md={12} className="mt-2">
//                                 <Form.Label>Estado</Form.Label>
//                                 <Form.Select value={formData.activo} onChange={e => setFormData({...formData, activo: e.target.value})}>
//                                     <option value="activo">Activo</option>
//                                     <option value="inactivo">Inactivo</option>
//                                 </Form.Select>
//                             </Col>
//                         </Row>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button type="submit" variant="primary">Guardar</Button>
//                     </Modal.Footer>
//                 </Form>
//             </Modal>
//         </Container>
//     );
// };
// export default PlansManager;