import react from 'react';  
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";   
import { db } from "../Firebase"; // Verifica que la ruta sea correcta
import img from '../assets/franymarlene.jpg';



export default function Nosotros() {

    return(
        <>
  <div className='container grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10'>
    {/* Imagen */}
    <div className='w-full rounded-md overflow-hidden'>
      <img 
        src={img}
        alt="FRAN Y MARLENE"
        className="w-full h-full md:aspect-[4/3] object-cover object-top"
      />
    </div>

    {/* Texto */}
    <div className='flex flex-col items-center text-center justify-center mt-10 md:mt-40'>
      <h1 className='font-bold font-sans text-2xl md:text-3xl'>NOSOTROS</h1>
      <p className='font-sans text-lg md:text-xl mt-5 max-w-lg'>
        Somos una compañía europea líder en el sector inmobiliario con presencia en Argentina, España y Miami. Nuestro equipo internacional, compuesto por abogados, escribanos, corredores inmobiliarios, arquitectos y diseñadores de interiores, se dedica a ofrecer un servicio integral.
      </p>
      <button className='mt-5 px-6 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black border-2 transition'>
        HABLEMOS!
      </button>
    </div>
  </div>
</>

    )
};