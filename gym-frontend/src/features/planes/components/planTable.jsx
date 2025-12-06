import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PlanTable = ({ planes, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Duración</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {planes.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-4">No hay planes registrados.</td></tr>
                    ) : (
                        planes.map((plan) => (
                            <tr key={plan.id}>
                                <td className="fw-bold text-muted">{plan.id}</td>
                                <td>{plan.nombre}</td>
                                <td className="text-success fw-bold">C$ {parseFloat(plan.precio).toFixed(2)}</td>
                                <td>{plan.duracion_dias} días</td>
                                <td>
                                    <Badge bg={plan.activo === 'activo' ? 'success' : 'secondary'}>
                                        {plan.activo}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Button variant="light" size="sm" className="text-primary me-2" onClick={() => onEdit(plan)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="light" size="sm" className="text-danger" onClick={() => onDelete(plan.id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default PlanTable;