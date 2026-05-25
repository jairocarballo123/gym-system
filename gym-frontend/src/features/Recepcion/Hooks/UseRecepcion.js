// src/features/Recepcion/Hooks/useRecepcion.js
import { useState, useCallback } from 'react';
import { recepcionServices } from '../Services/RecepcionServices';
import { miembroServices } from '../../Miembros/Services/MiembroServices';
import toast from 'react-hot-toast';

export const useRecepcion = () => {

  const [miembro, setMiembro] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [montoPagado, setMontoPagado] = useState(0);
  const [referencia, setReferencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const agregarItem = (item, tipo) => {
    const id = tipo === 'PLAN' ? item.PlanId : item.id;
    const nombre = tipo === 'PLAN' ? item.PlanName : item.nombre;
    const precio = tipo === 'PLAN' ? item.Price : item.precio;

    const nuevoItem = {
      id, tipo, nombre, precio,
      cantidad: 1,
      subtotal: precio,
    };
    setCarrito(prev => [...prev, nuevoItem]);
  };

  const eliminarItem = (index) => {
    setCarrito(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev => {
      const nuevo = [...prev];
      nuevo[index].cantidad = nuevaCantidad;
      nuevo[index].subtotal = nuevo[index].precio * nuevaCantidad;
      return nuevo;
    });
  };

  const calcularTotal = useCallback(() => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }, [carrito]);

  const limpiarCarrito = () => {
    setCarrito([]);
    setMiembro(null);
    setMetodoPago('');
    setMontoPagado(0);
    setReferencia('');
    setError(null);
  };



const crearSocio = async (data) => {
  setLoading(true);
  setError(null);
  try {
    const response = await miembroServices.create(data);  // ← Usar create normal
    toast.success('Socio registrado correctamente');
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al registrar socio';
    setError(msg);
    toast.error(msg);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // ========== Registrar venta ==========
  const registrarVenta = async (cashierId) => {
    const total = calcularTotal();

    if (carrito.length === 0) {
      setError('Agrega al menos un producto o plan.');
      return false;
    }
    if (!metodoPago) {
      setError('Selecciona un método de pago.');
      return false;
    }
    // if (montoPagado < total) {
    //   setError(`El monto pagado (${montoPagado}) es menor al total (${total}).`);
    //   return false;
    // }

    const detalles = carrito.map(item => ({
      itemType: item.tipo,
      itemId: item.id,
      quantity: item.cantidad,
      unitPrice: item.precio,
      subTotal: item.subtotal,
    }));

    const ventaData = {
      memberId: miembro?.id || null,
      currencyId: 1,
      paymentMethodId: parseInt(metodoPago),
      referenceNumber: referencia || null,
      amountPaid: montoPagado,
      cashierId,
      exchangeRate: 1.0,
      notes: `Venta desde recepción - ${new Date().toLocaleString()}`,
      details: detalles,
    };

    setLoading(true);
    setError(null);
    try {
      const response = await recepcionServices.registrarVenta(ventaData);
      if (response.success) {
        limpiarCarrito();
        return { success: true, invoiceNumber: response.data.invoiceNumber };
      } else {
        throw new Error(response.message || 'Error al registrar venta');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    miembro,
    carrito,
    metodoPago,
    montoPagado,
    referencia,
    loading,
    error,
    total: calcularTotal(),
    setMiembro,
    setMetodoPago,
    setMontoPagado,
    setReferencia,
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    limpiarCarrito,
    registrarVenta,
    crearSocio,  // ← NUEVA FUNCIÓN
  };
};