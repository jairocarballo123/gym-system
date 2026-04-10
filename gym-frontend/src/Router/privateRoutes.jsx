// routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Layouts/Sidebar";
import Topbar from "../components/Layouts/Navbar";

const PrivateRoute = () => {
  const { token } = useAuth();

  if (!token) {
   return <Navigate to="/login" replace />;

  }

  return (
    <div className="app-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="main-wrapper">
        <Topbar />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;