import react from 'react';
import { useState } from "react";

export default function Servicios() {
  const botones = [
    {
      texto: "VENTA DE INMUEBLES",
      parrafo: "Ofrecemos propiedades seleccionadas para la venta.",
    },
    {
      texto: "ARQUITECTURA + INMOBILIARIA",
      parrafo: "Proyectos arquitectónicos con visión comercial.",
    },
    {
      texto: "PERSONAL SHOPPER",
      parrafo: "Te acompañamos en todo el proceso de compra.",
    },
    {
      texto: "INVERSION INTERNACIONAL",
      parrafo: "Accedé a oportunidades inmobiliarias globales.",
    },
  ];
  
  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row flex-wrap">
          {botones.map(({ texto, parrafo }, i) => (
            <div
              key={i}
              className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4"
            >
              <button className="group w-full text-black text-[20px] font-semibold font-poppins relative h-[70px] flex items-center justify-center text-center">
                <span className="relative z-10 px-2 group-hover:hidden">{texto}</span>
                <span className="relative z-10 px-2 hidden group-hover:block text-[16px]">{parrafo}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
                <span className="absolute right-0 top-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );}