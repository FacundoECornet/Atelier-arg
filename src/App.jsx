import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./Componentes/Header.jsx";
import Footer from "./Componentes/Footer.jsx";

// Lazy load componentes para mejorar el performance
const Body = lazy(() => import("./Componentes/Body.jsx"));
const Noticias = lazy(() => import("./Componentes/Noticias.jsx"));
const Pasos = lazy(() => import("./Componentes/Pasos.jsx"));
const Equipo = lazy(() => import("./Componentes/Equipo.jsx"));
const PropertyList = lazy(() => import("./Componentes/propiedadesCards.jsx"));
const Formulario = lazy(() => import("./Componentes/Contacto.jsx"));
const PropiedadesInfo = lazy(() => import("./Propiedades/PropiedadesInfo.jsx"));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div className="text-center py-10">Cargando...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Body />
                <Equipo />
                <Pasos />
                <PropertyList />
                <Formulario />
                <Noticias />
              </>
            }
          />
          <Route path="/propiedades/:id" element={<PropiedadesInfo />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
