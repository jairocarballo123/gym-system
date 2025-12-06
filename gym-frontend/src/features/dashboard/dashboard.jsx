
import React from "react";

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Bienvenido al Sistema de Gimnasio</h1>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Resumen General</h6>
        </div>
        <div className="card-body">
          <p>Este es el resumen general del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
