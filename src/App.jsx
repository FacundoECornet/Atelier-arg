import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // ← SOLO CAMBIA ESTO

import './App.css';

import Navbar from './Componentes/Header.jsx';
import Body from './Componentes/Body.jsx';
import Noticias from './Componentes/Noticias.jsx';
import Pasos from './Componentes/Pasos.jsx';
import Equipo from './Componentes/Equipo.jsx';
import PropertyList from './Componentes/propiedadesCards.jsx';
import Formulario from './Componentes/Contacto.jsx';
import Footer from './Componentes/Footer.jsx';
import OficinasCarousel from './Componentes/Nosotros.jsx';
import PropiedadesInfo from './Propiedades/PropiedadesInfo.jsx';
import AllProperties from './Propiedades/Todaspropiedades.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Página principal */}
            <Route
              path="/"
              element={
                <div className="flex flex-col">
                  <Body />
                  <Equipo />
                  <Pasos />
                  <PropertyList />
                  <Formulario />
                  <Noticias />
                </div>
              }
            />

            {/* Página de detalle de propiedad */}
            <Route path="/propiedades/:id" element={<PropiedadesInfo />} />

            {/* Página con todas las propiedades */}
            <Route path="/propiedades" element={<AllProperties />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
