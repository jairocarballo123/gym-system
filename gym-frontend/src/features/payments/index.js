// src/features/pagos/index.js
export { default as PagosList } from './components/PagoList';
export { default as FacturasPendientes } from './components/Pendientes';
export { default as Recientes } from './components/Recientes';
export { default as RegistrarAbono } from './components/RegistrarAbono';
export { default as DetalleFactura } from './components/detallesFac';
export { usePagos } from './hooks/usePayments';
export { pagoApi } from '../payments/services/PagoServices';