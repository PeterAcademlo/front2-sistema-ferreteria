import "./App.css";
import SalesManager from "./modules/almacenamiento/layout/SalesManager";

import ProductManager from "./modules/producto/layout/ProductManager";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log("Token guardado en Front 2:", token);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-secondary">
        <Routes>
          <Route path="/almacenamiento" element={<ProductManager />} />
          <Route path="/ventas" element={<SalesManager />} />
          
          {/* 🎯 CAMBIO CLAVE: Redirigir a /ventas si viene con token, sino a /almacenamiento */}
          <Route path="/" element={
            window.location.search.includes('token') 
              ? <Navigate to="/ventas" replace />
              : <Navigate to="/almacenamiento" replace />
          } />
          
          <Route path="*" element={<Navigate to="/almacenamiento" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;