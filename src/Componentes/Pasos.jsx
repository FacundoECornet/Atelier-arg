import { useState } from 'react';
import consulta from '../Imagenes/Atelier-26.webp';
import valor from '../Imagenes/valoracion.webp';
import casa from '../Imagenes/Mercedes Costal-23.webp';
import post from '../Imagenes/post-venta.webp';
import contrato from '../Imagenes/Atelier-llaves.webp';
import mark from '../Imagenes/mark.webp';
import visita from '../Imagenes/visita (1).webp';
import informe from '../Imagenes/informe.webp';

export default function Pasos() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Definimos los pasos del proceso inmobiliario (similar a los de la imagen)
  const pasos = [
    {
      id: 'consulta',
      icon: '🏛️', // Edificio clásico/columna, representa formalidad y profesionalidad
      title: 'Consulta',
      content:
        'Vender una vivienda con éxito significa encontrar rápidamente al comprador adecuado y conseguir el precio de venta óptimo. Los consultores inmobiliarios poseen sólidos conocimientos en la materia y le ofrecen un asesoramiento inicial competente e individual.',
      imageSrc: consulta,
    },
    {
      id: 'valoracion',
      icon: '⚖️', // Balanza, simboliza valoración justa y equilibrada
      title: 'Valoración',
      content:
        'Valoramos su propiedad utilizando análisis de mercado precisos y nuestra amplia experiencia en el sector inmobiliario, para determinar el precio óptimo que garantiza tanto competitividad como rentabilidad.',
      imageSrc: valor,
    },
    {
      id: 'exposicion',
      icon: '📋', // Portapapeles, representa documentación profesional
      title: 'Exposición',
      content:
        'Preparamos documentación profesional y fotografías de alta calidad para mostrar su propiedad en su mejor luz y destacar todas sus características más atractivas.',
      imageSrc: casa,
    },
    {
      id: 'marketing',
      icon: '📢', // Megáfono, representa difusión y visibilidad
      title: 'Marketing',
      content:
        'Implementamos estrategias de marketing personalizadas utilizando plataformas digitales, redes sociales y nuestra red exclusiva de contactos para maximizar la visibilidad de su propiedad.',
      imageSrc: mark,
    },
    {
      id: 'visitas',
      icon: '🔑', // Llave, símbolo clásico inmobiliario
      title: 'Visitas',
      content:
        'Organizamos y guiamos visitas con compradores preseleccionados, asegurándonos de presentar su propiedad de manera profesional y respondiendo a todas las consultas.',
      imageSrc: visita,
    },
    {
      id: 'informes',
      icon: '📈', // Gráfico ascendente, representa análisis profesional
      title: 'Informes',
      content:
        'Le proporcionamos informes detallados sobre el interés generado, feedback de las visitas y la evolución del proceso de venta, manteniéndole completamente informado.',
      imageSrc: informe,
    },
    {
      id: 'contrato',
      icon: '✒️', // Pluma estilográfica, representa firma de documentos formales
      title: 'Contrato',
      content:
        'Gestionamos todas las negociaciones y trámites legales necesarios para asegurar un contrato de compraventa que proteja sus intereses y garantice una transacción segura.',
      imageSrc: contrato,
    },
    {
      id: 'servicio',
      icon: '🤲', // Manos ofreciendo, representa servicio y atención continua
      title: 'Post-venta',
      content:
        'Nuestro compromiso no termina con la venta. Seguimos a su disposición para cualquier consulta posterior y le ayudamos con cualquier gestión relacionada con la propiedad vendida.',
      imageSrc: post,
    },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % pasos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + pasos.length) % pasos.length);
  };

  // ...existing code...

  return (
    <>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-10" id="saber-mas">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-10">
          Nuestro 8 pasos al éxito
        </h1>

        {/* Iconos de navegación superior */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 overflow-x-auto pb-2 relative scrollbar-hide">
          <div className="absolute top-10 left-0 w-full h-0.5 bg-gray-200 -z-0" />

          {pasos.map((paso, index) => (
            <div
              key={paso.id}
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center cursor-pointer min-w-[60px] sm:min-w-[80px] mx-1 sm:mx-2 relative z-10"
            >
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-1 sm:mb-2 border bg-white ${
                  activeIndex === index ? 'border-black-600' : 'border-gray-300'
                }`}
              >
                <span className="text-xl sm:text-2xl">{paso.icon}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-center whitespace-nowrap">
                {paso.title}
              </span>
              <div
                className={`h-1 w-full mt-1 sm:mt-2 rounded-full ${
                  activeIndex === index ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Contenido del carrusel */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[400px] xs:h-[450px] sm:h-[450px]">
            {' '}
            {/* Reducida la altura en móvil */}
            {pasos.map((paso, index) => (
              <div
                key={paso.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 -z-10'
                }`}
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="h-48 sm:h-full sm:w-full bg-gray-100 relative">
                    {' '}
                    {/* Añadido relative */}
                    <img
                      src={paso.imageSrc}
                      alt={paso.title}
                      className="w-full h-full object-contain sm:object-cover object-center" // Cambiado a object-contain en móvil
                      onError={(e) => {
                        e.target.src = '/images/default-property.jpg';
                      }}
                    />
                  </div>

                  <div className="p-4 sm:p-6 md:p-10 sm:w-1/2 flex flex-col justify-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3">{paso.title}</h2>
                    <p className="text-sm sm:text-base text-gray-700">{paso.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flechas de navegación inferior */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 py-2 sm:py-4">
            {/* Reducido el padding vertical en móvil */}
            <button
              onClick={handlePrev}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
            >
              &#10094;
            </button>
            <span className="text-xs sm:text-sm text-gray-500">
              {activeIndex + 1} de {pasos.length}
            </span>
            <button
              onClick={handleNext}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
