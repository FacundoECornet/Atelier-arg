import React from 'react';   
import Tooltip from './Social';



export default function Footer() {
return(
    <>
    <footer className="bg-gray-100 text-black py-10 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* Contacto */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Contacto</h3>
      <p className="mb-2">Teléfono: (381) 415 9547</p>
      <p className="mb-2">Email: marlene@atelierhomes.es</p>
      <p className="mb-2">Horario: Lun a Vie de 9 a 18 hs</p>
    </div>

    {/* Ubicación */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
      <p className="mb-2">Alter Point | Av. Perón 2300  | Oficina 10</p>
      <p className="mb-2">Yerba Buena, Tucumán, Argentina</p>
      <p className="mb-2">CP 4107</p>
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
  © 2035 by Atelier Homes
  </div>
</footer>

    </>
)

}