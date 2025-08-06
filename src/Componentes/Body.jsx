import React, { useState } from "react";
import PropertyList from "./propiedadesCards";
import ModalTasacion from "./Modal"; // asegúrate de que esté bien importado
import fondo from '../assets/fondo.webp';
import OficinasCarousel from "./Nosotros";

const Body = () => {
  const [showModal, setShowModal] = useState(false);

  const handleVenderClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleComprarClick = () => {
    document.getElementById("property-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
     <OficinasCarousel />
      {/* Botón WhatsApp */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://wa.me/5493812105720"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full flex items-center justify-center w-12 h-12 transition hover:bg-green-600"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
        </a>
      </div>

      {/* Botón de venta */}
      <div className="z-50 bg-gray-200 mx-auto p-8 rounded-lg shadow-lg text-center w-full">
        <h3 className="text-2xl font-semibold mb-6">Quiero vender mi propiedad</h3>
        <button
          onClick={handleVenderClick}
          className="bg-black text-white transition-all duration-300 border border-black px-6 py-3 rounded-md hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-black"
        >
          Vender
        </button>
      </div>

      {/* Modal de tasación en 3 pasos */}
      <ModalTasacion showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
};

export default Body;
