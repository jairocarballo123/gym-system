// src/features/productos/hooks/useProductos.js
import { useState, useEffect, useCallback } from 'react';
import { productoApi } from '../Services/ProductosApi';
import toast from 'react-hot-toast';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [detalle, setDetalle] = useState(null);   
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
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

  const cargarEstadisticas = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await productoApi.getResumen();
      setResumen(res);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchDetalle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productoApi.getDetalleCompleto(id);
      setDetalle(data.data);  
    } catch (err) {
      setError(err.message || 'Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicialización de datos
  useEffect(() => {
    fetchProductos();
    cargarEstadisticas();
  }, [fetchProductos, cargarEstadisticas]);

  const refresh = useCallback(() => {
    fetchProductos();
    cargarEstadisticas();
  }, [fetchProductos, cargarEstadisticas]);

  // --- NUEVAS MUTACIONES DELEGADAS DE LA API ---
  const saveProducto = async (editingId, data) => {
    if (editingId) {
      await productoApi.update(editingId, data);
      toast.success('Producto actualizado');
    } else {
      await productoApi.create(data);
      toast.success('Producto creado');
    }
    refresh();
  };

  const desactivarProducto = async (id) => {
    await productoApi.delete(id);
    toast.success('Producto desactivado');
    refresh();
  };

  const ajustarStockProducto = async (id, cantidad, motivo) => {
    await productoApi.ajustarStock(id, cantidad, motivo);
    toast.success('Stock actualizado correctamente');
    refresh();
  };

  return { 
    productos, 
    detalle, 
    resumen,
    loading: loading || loadingStats, 
    error, 
    refresh, 
    fetchDetalle,
    saveProducto,
    desactivarProducto,
    ajustarStockProducto
  };
};