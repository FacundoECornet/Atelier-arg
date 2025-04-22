import react from 'react';  
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";   
import { db } from "../Firebase"; // Verifica que la ruta sea correcta
import Tooltip from './Social';



export default function Footer() {
return(
    <>
    <footer className="bg-gray-100 text-black py-10 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* Contacto */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Contacto</h3>
      <p className="mb-2">Teléfono: (381) 123-4567</p>
      <p className="mb-2">Email: contacto@empresa.com</p>
      <p className="mb-2">Horario: Lun a Vie de 9 a 18 hs</p>
    </div>

    {/* Ubicación */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
      <p className="mb-2">Av. Siempre Viva 742</p>
      <p className="mb-2">San Miguel de Tucumán, Argentina</p>
      <p className="mb-2">CP 4000</p>
    </div>

    {/* Redes Sociales */}
    <div className="flex flex-col items-center">
  <h3 className="text-xl font-semibold mb-4 text-center">Seguinos</h3>

  <ul className="flex justify-center gap-4">
    <Tooltip />
  </ul>
</div>


  </div>

  {/* Línea inferior */}
  <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
    © 2025 Tu Empresa. Todos los derechos reservados.
  </div>
</footer>

    </>
)

}