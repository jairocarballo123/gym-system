import React, { useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaDumbbell } from 'react-icons/fa';
import { usePlans } from '../planes/hooks/useplanes'; 
import PlanTable from './components/planTable';
import PlanForm from './components/planForm';

const PlanList = () => {
    const { planes, loading, error, createPlan, updatePlan, deletePlan ,refreshPlanes} = usePlans();
    
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    
    const handleCreate = () => {
        setEditingPlan(null);
        setShowModal(true);
    };

    
    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setShowModal(true);
    };

    const handleSave = async (formData) => {
        let success = false;
        if (editingPlan) {
            success = await updatePlan(editingPlan.id,formData);
            refreshPlanes()
        } else {
            success = await createPlan(formData);
            refreshPlanes()
        }
        
        if (success) setShowModal(false);
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark"><FaDumbbell className="me-2"/>Gestión de Planes</h2>
                <Button variant="primary" onClick={handleCreate}>
                    <FaPlus className="me-2"/> Nuevo Plan
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <PlanTable 
                            planes={planes} 
                            onEdit={handleEdit} 
                            onDelete={deletePlan} 
                        />
                    )}
                </Card.Body>
            </Card>

            <PlanForm 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                onSubmit={handleSave} 
                initialData={editingPlan} 
            />
        </Container>
    );
};

export default PlanList;