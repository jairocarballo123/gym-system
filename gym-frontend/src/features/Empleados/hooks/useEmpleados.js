import { useState, useEffect, useCallback } from 'react';
import { empleadoServices } from '../services/empleadoServices';
import toast from 'react-hot-toast';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEmpleados = useCallback(async () => {
    setLoading(true);
    try {
      const response = await empleadoServices.getAll();
      setEmpleados(response.data.data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cargar empleados';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const crearEmpleado = async (data) => {
    try {
      const response = await empleadoServices.create(data);
      await cargarEmpleados();
      toast.success('Empleado creado');
      return response;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear';
      toast.error(msg);
      throw err;
    }
  };





const actualizarEmpleado = async (id, data) => {
  try {
 
    const payload = {
      nombre: data.nombre,
      telefono: data.telefono || null,
      roleId: data.roleId,
      statusId: data.statusId ?? 1,
    };

  
    if (data.roleId === 2) {
      if (data.especialidad && data.especialidad.trim() !== '') {
        payload.specialty = data.especialidad;
      }
      if (data.disponibilidad && data.disponibilidad.trim() !== '') {
        payload.availability = data.disponibilidad;
      }
    }


    if (data.password && data.password.trim() !== '') {
      payload.password = data.password;
    }

    console.log('Enviando actualización:', payload);

    const response = await empleadoServices.update(id, payload);
    await cargarEmpleados();
    toast.success('Empleado actualizado');
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al actualizar';
    toast.error(msg);
    console.error('Error en actualizarEmpleado:', err);
    throw err;
  }
};

  const desactivarEmpleado = async (id) => {
    try {
      const response = await empleadoServices.delete(id);
      await cargarEmpleados();
      toast.success('Empleado desactivado');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al desactivar';
      toast.error(msg);
      throw err;
    }
  };

  return {
    empleados,
    loading,
    error,
    crearEmpleado,
    actualizarEmpleado,
    desactivarEmpleado,
    recargar: cargarEmpleados,
  };
};