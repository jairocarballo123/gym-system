// src/routes/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../features/dashboard/dashboard";
import MemberList from "../features/member/MemberList";
import PaymentsList from '../features/payments/paymentList'
import EmpleadosList from "../features/Empleados/EmpleadoList";
import AsistenciasList from "../features/Asistencias/AsistenciasList";
import Configuracion from "../features/Config/configuracion";
import PlanList from "../features/planes/planList";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/members" element={<MemberList />} />

      <Route path="/pagos" element={<PaymentsList />} />
      <Route path="/Empleados" element={<EmpleadosList />} />
      <Route path="/Asistencias" element={<AsistenciasList />} />
      <Route path="/configuracion" element={<Configuracion />} />
      <Route path="/planes" element={<PlanList />} />


    </Routes>
  );
};

export default AppRouter;
