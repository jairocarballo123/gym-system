// src/features/planes/hooks/usePlans.js
import { useState, useEffect, useCallback } from 'react';
import { planApi } from '../../../Api/PlanApi';
import Swal from 'sweetalert2';

export const usePlans = () => {
  const [planes, setPlanes] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const loadPlanes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await planApi.getAll();
      const lista = Array.isArray(data) ? data : []; 
      setPlanes(lista);
      setError(null);
    } catch (err) {
      console.error("Error en loadPlanes:", err.response?.data || err.message);
      setError('Error al cargar los planes.');
      setPlanes([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanes();
  }, [loadPlanes]);

  // Crear plan
  const createPlan = async (plan) => {
    try {
      await planApi.create(plan);
      await loadPlanes(); // recargar lista
      Swal.fire('Éxito', 'Plan creado correctamente', 'success');
      return true;
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'No se pudo crear el plan', 'error');
      return false;
    }
  };

  // Actualizar plan
  const updatePlan = async (id, plan) => {
    try {
      await planApi.update(id, plan);
      await loadPlanes();
      Swal.fire('Éxito', 'Plan actualizado correctamente', 'success');
      return true;
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'No se pudo actualizar', 'error');
      return false;
    }
  };

  // Eliminar plan
  const deletePlan = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await planApi.delete(id);
        setPlanes(prev => prev.filter(p => p.id !== id));
        Swal.fire('Eliminado', 'El plan ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar (quizás tiene pagos asociados).', 'error');
      }
    }
  };

  return { planes, loading, error, createPlan, updatePlan, deletePlan };
};
