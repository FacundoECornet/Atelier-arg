
import './App.css'
import Navbar from './Componentes/Header.jsx'
import React from 'react'
import Body from './Componentes/Body.jsx'
import PropertyList from './Componentes/propiedadesCards.jsx'
import Nosotros from './Componentes/Nosotros.jsx'
import Noticias from './Componentes/Noticias.jsx'
import Footer from './Componentes/Footer.jsx';
import Formulario from './Componentes/Contacto.jsx'
import Pasos from './Componentes/Pasos.jsx'
import Servicios from './Componentes/Servicios.jsx'
import Equipo from './Componentes/Equipo.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropiedadesInfo from './Propiedades/PropiedadesInfo.jsx';


function App() {
 

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Body />
            <Nosotros />
            <Noticias />
            <Servicios />
            <Pasos />
            <Equipo />
            <PropertyList />
            <Formulario />
          </>
        } />
        <Route path="/propiedades/:id" element={<PropiedadesInfo />} />
      </Routes>
      <Footer />
    </Router>
    </>
  )
}



export default App
