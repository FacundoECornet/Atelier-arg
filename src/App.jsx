
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




function App() {
 

  return (
    <>
    <Navbar/>
    <Body/>
    <Nosotros/>
    <Noticias/>
    <Formulario/>
    <Pasos/>
    <Footer/>
    </>
  )
}

export default App
