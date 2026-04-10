// src/features/pagos/hooks/usePagos.js
import { useState, useEffect, useCallback } from 'react';
import { pagoApi } from '../services/PagoServices';
import toast from 'react-hot-toast';

export const usePagos = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [pagosFactura, setPagosFactura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [ingresos, setIngresos] = useState({ hoy: 0, semana: 0, mes: 0, porMetodoPago: [] });

  const cargarFacturas = useCallback(async () => {
    try {
      const data = await pagoApi.listarFacturas();
      setFacturas(data);
    } catch (err) {
      toast.error('Error al cargar facturas');
    }
  }, []);

  const cargarFacturasPendientes = useCallback(async () => {
    try {
      const data = await pagoApi.obtenerFacturasPendientes();
      setFacturasPendientes(data);
    } catch (err) {
      console.error('Error cargando facturas pendientes:', err);
    }
  }, []);

  const cargarIngresos = useCallback(async () => {
    try {
      const [hoy, semana, mes, porMetodoPago] = await Promise.all([
        pagoApi.obtenerIngresosHoy(),
        pagoApi.obtenerIngresosSemana(),
        pagoApi.obtenerIngresosMes(),
        pagoApi.obtenerIngresosPorMetodoPago()
      ]);
      setIngresos({ 
        hoy: hoy?.total || 0,
        semana: semana?.total || 0,
        mes: mes?.total || 0,
        porMetodoPago: porMetodoPago || []
      });
    } catch (err) {
      console.error('Error cargando ingresos:', err);
    }
  }, []);

  const cargarDetalleFactura = useCallback(async (invoiceId) => {
    console.log('🔍 [usePagos] cargarDetalleFactura llamado con invoiceId:', invoiceId);
    setLoadingDetalle(true);
    try {
      const [detalle, pagos] = await Promise.all([
        pagoApi.obtenerDetalle(invoiceId),
        pagoApi.obtenerHistorialPagos(invoiceId)
      ]);
      console.log('🔍 [usePagos] Detalle recibido:', detalle);
      console.log('🔍 [usePagos] Pagos recibidos:', pagos);
      setDetalleFactura(detalle);
      setPagosFactura(pagos);
    } catch (err) {
      console.error('Error cargando detalle:', err);
      toast.error('Error al cargar detalle de factura');
    } finally {
      setLoadingDetalle(false);
    }
  }, []);

  const cargarTodo = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      cargarFacturas(),
      cargarFacturasPendientes(),
      cargarIngresos()
    ]);
    setLoading(false);
  }, [cargarFacturas, cargarFacturasPendientes, cargarIngresos]);

  const registrarAbono = async (data) => {
    try {
      const result = await pagoApi.registrarAbono(data);
      toast.success(result.message);
      await cargarTodo();
      return result;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar abono');
      throw err;
    }
  };

  const cancelarFactura = async (invoiceId) => {
    try {
      const result = await pagoApi.cancelarFactura(invoiceId);
      toast.success(result.message);
      await cargarTodo();
      return result;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cancelar factura');
      throw err;
    }
  };

  const eliminarPago = async (paymentId) => {
    try {
      const result = await pagoApi.eliminarPago(paymentId);
      toast.success(result.message);
      await cargarTodo();
      return result;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar pago');
      throw err;
    }
  };

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  return {
    facturas,
    facturasPendientes,
    detalleFactura,
    pagosFactura,
    loading,
    loadingDetalle,
    ingresos,
    registrarAbono,
    cancelarFactura,
    eliminarPago,
    cargarDetalleFactura,
    refresh: cargarTodo
  };
};