// src/features/productos/hooks/useProductos.js
import { useState, useEffect, useCallback } from 'react';
import { productoApi } from '../Services/ProductosApi';
import toast from 'react-hot-toast';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productoApi.getAll();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar productos';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const refresh = useCallback(() => {
    fetchProductos();
  }, [fetchProductos]);

  return { productos, loading, error, refresh };
};