import { useState, useEffect } from 'react';
import { dashboardApi } from '../Services/dashboardApi';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const { user } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumenRes, actividadesRes] = await Promise.all([
          dashboardApi.getResumen(),
          dashboardApi.getUltimasActividades()
        ]);
        setResumen(resumenRes.data);
        setActividades(actividadesRes.data);
      } catch (err) {
        toast.error('Error al cargar dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { user, resumen, actividades, loading };
};