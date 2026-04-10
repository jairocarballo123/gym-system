// src/features/planes/hooks/usePlanes.js
import { useState, useEffect, useCallback } from 'react';
import { planApi } from '../Services/PlanServices';
import toast from 'react-hot-toast';

export const usePlanes = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlanes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await planApi.getAll();
      setPlanes(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar planes';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  const refresh = useCallback(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  return { planes, loading, error, refresh };
};