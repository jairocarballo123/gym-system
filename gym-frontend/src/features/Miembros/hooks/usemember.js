import { useState, useEffect, useCallback } from 'react';
import { miembroServices } from '../Services/MiembroServices';
import toast from 'react-hot-toast';

export const useMiembro = () => {
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos
  const fetchMiembros = useCallback(async () => {
    setLoading(true);
    try {
      const response = await miembroServices.getAll();
      setMiembros(response.data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar miembros';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear
  const createMiembro = async (nuevo) => {
    try {
      const res = await miembroServices.create(nuevo);
      setMiembros((prev) => [...prev, res]); // actualiza estado local
      toast.success('Miembro creado');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear miembro');
    }
  };

  // Actualizar
  const updateMiembro = async (id, actualizado) => {
    try {
      const res = await miembroServices.update(id, actualizado);
      setMiembros((prev) =>
        prev.map((m) => (m.id === id ? res : m))
      );
      toast.success('Miembro actualizado');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar miembro');
    }
  };

  // Eliminar
  const deleteMiembro = async (id) => {
    try {
      await miembroServices.delete(id);
      setMiembros((prev) => prev.filter((m) => m.id !== id));
      toast.success('Miembro eliminado');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar miembro');
    }
  };

  useEffect(() => {
    fetchMiembros();
  }, [fetchMiembros]);

  return {
    miembros,
    loading,
    error,
    refresh: fetchMiembros,
    createMiembro,
    updateMiembro,
    deleteMiembro,
  };
};