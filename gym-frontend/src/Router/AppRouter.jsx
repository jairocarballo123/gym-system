// AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/Components/Login";
import PrivateRoute from "./privateRoutes";
import { AsistenciasList } from '../features/Asistencias';
import { ProductoList } from '../features/Productos';
import { PagosList } from '../features/payments';
import EmpleadosList from "../features/Empleados/components/EmpleadoList";
import EmpleadoDetalle from "../features/Empleados/components/EmpleadoDetalle";
import MiembroList from "../features/Miembros/components/MiembroList";
import PlanList from '../features/planes/components/PlanList';
import DashboardPage from '../features/dashboard/components/DashboardPage';
import Configuracion from "../features/Config/configuracion";
import RecepcionPage from "../features/Recepcion/Components/RecepcionPage";
import MiembroDetalle from '../features/Miembros/components/MiembroDetalle';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
   

        <Route path="/planes" element={<PlanList />} />

        <Route path="/empleados" element={<EmpleadosList />} />
        <Route path="/empleados/:id" element={<EmpleadoDetalle />} />
        <Route path="/miembros" element={<MiembroList />} />
        <Route path="/Stock" element={<ProductoList />} />
        <Route path="/asistencias" element={<AsistenciasList />} />
        <Route path="/pagos" element={<PagosList />} />
        <Route path="/dashboard" element={<DashboardPage />} />


        <Route path="/miembros/:id" element={<MiembroDetalle />} />

        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/recepcion" element={<RecepcionPage />} />
      </Route>

     
    </Routes>
  );
};

export default AppRouter;