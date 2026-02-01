// src/App.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Layouts/Sidebar";
import Topbar from "./components/Layouts/Navbar";
import AppRouter from "./Router/AppRouter";
import LoginPage from "./features/auth/LoginPage";
import { AuthProvider } from "./features/auth/authContext";
// import { useAuth } from "./Hooks/useauth";
import "./index.css";

const AppContent = () => {
  return (
    <div className="app-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="main-wrapper">
        <Topbar />
        <div className="content-area">
          <AppRouter />
        </div>
      </div>
    </div>
  );
};



function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;









































































// // src/App.jsx
// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Sidebar from "./components/Layouts/Sidebar";
// import Topbar from "./components/Layouts/Navbar";
// import AppRouter from "./Router/AppRouter";
// import "./index.css";

// function App() {
//   return (
//     <div className="app-container">
//       <div className="sidebar-wrapper">
//         <Sidebar />
//       </div>

//       <div className="main-wrapper">
//         <Topbar />
//         <div className="content-area">
//           <AppRouter />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
