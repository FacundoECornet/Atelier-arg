import React, { useState } from 'react';
import PropertyList from './propiedadesCards';
import ModalTasacion from './Modal'; // asegúrate de que esté bien importado
import fondo from '../assets/fondo.webp';
import OficinasCarousel from './Nosotros';
import pareja from '../Imagenes/pareja-modal.jpg';

const Body = () => {
  const [showModal, setShowModal] = useState(false);

  const handleVenderClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleComprarClick = () => {
    document.getElementById('property-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para manejar clicks en navegación
  const handleClick = (item) => (e) => {
    e.preventDefault();

    // Si es de tipo navigate (como Propiedades)
    if (item.type === 'navigate') {
      navigate(item.to);
      return;
    }

    // Si es "Inicio", navegamos a "/"
    if (item.to === '/') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      return;
    }

    // Para anclas con # (tipo scroll)
    if (item.to.startsWith('#')) {
      // Si estamos en la página principal, scroll manual a la sección
      if (location.pathname === '/') {
        const id = item.to.substring(1); // quitar #
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Si no estamos en la página principal, navegamos a "/" y luego hacemos scroll
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(item.to.substring(1));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
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
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-6 h-6"
          />
        </a>
      </div>

      {/* Sección de venta con imagen de fondo mejorada */}
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center min-h-[500px]">
              {/* Contenido de texto - lado izquierdo */}
              <div className="lg:w-1/2 p-8 lg:p-16 bg-white rounded-l-3xl">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-400 mb-6 leading-tight">
                  Venda su propiedad con
                  <br />
                  <span className="text-black">Atelier Homes Argentina</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Evaluaremos todo el potencial de su propiedad, teniendo en cuenta todos sus
                  detalles y características especiales, y lo incluiremos en nuestra valoración
                  inmobiliaria gratuita y sin compromiso.
                </p>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contacto"
                    onClick={handleClick({ to: '#contacto', type: 'scroll' })}
                    className="border-2 border-black text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:bg-black hover:text-white text-center"
                  >
                    Pongase en contacto
                  </a>

                  <button
                    onClick={handleVenderClick}
                    className="bg-black text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:bg-black border-2 border-black"
                  >
                    Valoración en línea
                  </button>
                </div>
              </div>

              {/* Imagen - lado derecho */}
              <div className="lg:w-1/2 h-64 lg:h-[500px] relative rounded-r-3xl overflow-hidden">
                <img
                  src={pareja}
                  alt="Pareja en interior moderno"
                  className="w-full h-full object-cover rounded-r-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de tasación en 3 pasos */}
      <ModalTasacion showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
};

export default Body;
