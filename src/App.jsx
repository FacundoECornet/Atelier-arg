import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Navbar from './Componentes/Header.jsx';
import Footer from './Componentes/Footer.jsx';
import PropiedadesInfo from './Propiedades/PropiedadesInfo.jsx';
import AllProperties from './Propiedades/Todaspropiedades.jsx';

// Componentes de la página principal
import Body from './Componentes/Body.jsx';
import Noticias from './Componentes/Noticias.jsx';
import Pasos from './Componentes/Pasos.jsx';
import Equipo from './Componentes/Equipo.jsx';
import PropertyList from './Componentes/propiedadesCards.jsx';
import Formulario from './Componentes/Contacto.jsx';

// Componente Home para la ruta principal
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToContacto) {
      const contacto = document.getElementById('contacto');
      if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      <Body />
      <Equipo />
      <Pasos />
      <PropertyList />
      <Formulario id="contacto" />
      <Noticias />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<Home />} />

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
