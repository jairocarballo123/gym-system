import { useState, useEffect, useCallback } from 'react';
import { empleadosApi } from '../../../Api/EmpleadosApi';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      const response = await empleadosApi.getAll();
   
      const data = response.data || response; 
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar empleados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmpleados();
  }, [loadEmpleados]);

  const createEmpleado = async (data) => {
    try {
      await empleadosApi.create(data);
      loadEmpleados();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateEmpleado = async (id, data) => {
    try {
      await empleadosApi.update(id, data);
      loadEmpleados();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const deleteEmpleado = async (id) => {
    try {
      await empleadosApi.delete(id);
      loadEmpleados();
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { 
    empleados, loading, error, 
    createEmpleado, updateEmpleado, deleteEmpleado, refreshEmpleados: loadEmpleados 
  };
};