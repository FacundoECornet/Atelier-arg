
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



function App() {
 

  return (
    <>
    <Navbar/>
    <Body/>
    <Nosotros/>
    <Noticias/>
    <Servicios/>
    <Pasos/>
    <Equipo/>
    <Formulario/>
    <Footer/>
    </>
  )
}

export default App
