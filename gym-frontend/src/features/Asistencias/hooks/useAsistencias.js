import { useState, useEffect, useCallback } from 'react';
import { asistenciasApi } from '../../../Api/AsistenciaApi';

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
    
      const [listaRes, statsRes] = await Promise.all([
        asistenciasApi.getAll(),
        asistenciasApi.getStats()
      ]);

    
      setAsistencias(listaRes.data || []); 
      setStats(statsRes.data || null);

    } catch (err) {
      setError("Error al cargar datos de asistencia");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const registrarEntrada = async (miembroId) => {
    try {
      await asistenciasApi.registrar({ miembro_id: miembroId });
      loadData(); 
      return true;
    } catch (err) {
      throw err;
    }
  };

  const eliminarAsistencia = async (id) => {
    try {
      await asistenciasApi.delete(id);
      loadData();
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { 
    asistencias, stats, loading, error, 
    registrarEntrada, eliminarAsistencia, refresh: loadData 
  };
};