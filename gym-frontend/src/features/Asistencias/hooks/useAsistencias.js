// src/features/asistencias/hooks/useAsistencias.js
import { useState, useEffect, useCallback } from 'react';
import { asistenciaApi } from '../Services/AsistenciaServices';
import toast from 'react-hot-toast';

export const useAsistencias = () => {
  const [asistenciasHoy, setAsistenciasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    horaPico: null,
    promedioDiario: null,
    diasAfluencia: [],
    miembrosInactivos: [],
    topActivos: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchAsistenciasHoy = useCallback(async () => {
    setLoading(true);
    try {
      const data = await asistenciaApi.getHoy();
      setAsistenciasHoy(data);
    } catch (err) {
      toast.error('Error al cargar asistencias de hoy');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [horaPico, promedioDiario, diasAfluencia, miembrosInactivos, topActivos] = await Promise.all([
        asistenciaApi.getHoraPico(),
        asistenciaApi.getPromedioDiario(),
        asistenciaApi.getDiasAfluencia(),
        asistenciaApi.getMiembrosInactivos(),
        asistenciaApi.getTopActivos()
      ]);
      setStats({ horaPico, promedioDiario, diasAfluencia, miembrosInactivos, topActivos });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchAsistenciasHoy();
    fetchStats();
  }, [fetchAsistenciasHoy, fetchStats]);

  const refresh = useCallback(() => {
    fetchAsistenciasHoy();
    fetchStats();
  }, [fetchAsistenciasHoy, fetchStats]);


  const registrarEntrada = async (memberId) => {
  try {
    const result = await asistenciaApi.registrar(memberId);
    toast.success(result.message);
    refresh();
    return true;
  } catch (err) {
  
    const errorMsg = err.response?.data?.message || 'Error al registrar entrada';
    toast.error(errorMsg);
    throw new Error(errorMsg); 
  }
};

  return { asistenciasHoy, stats, loading, loadingStats, refresh, registrarEntrada };
};