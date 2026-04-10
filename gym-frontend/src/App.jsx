import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRouter from "./Router/AppRouter";
import "./index.css";

function App() {
  return (
    <div className="app">
      <AppRouter />
    </div>
  );
}

export default App;