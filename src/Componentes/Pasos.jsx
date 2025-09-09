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

  const pasos = [
    {
      id: 'consulta',
      icon: '🏛️',
      title: 'Consulta',
      content:
        'Vender una vivienda con éxito significa encontrar rápidamente al comprador adecuado y conseguir el precio de venta óptimo...',
      imageSrc: consulta,
    },
    {
      id: 'valoracion',
      icon: '⚖️',
      title: 'Valoración',
      content:
        'Valoramos su propiedad utilizando análisis de mercado precisos y nuestra amplia experiencia en el sector...',
      imageSrc: valor,
    },
    {
      id: 'exposicion',
      icon: '📋',
      title: 'Exposición',
      content:
        'Preparamos documentación profesional y fotografías de alta calidad para mostrar su propiedad...',
      imageSrc: casa,
    },
    {
      id: 'marketing',
      icon: '📢',
      title: 'Marketing',
      content:
        'Implementamos estrategias de marketing personalizadas utilizando plataformas digitales...',
      imageSrc: mark,
    },
    {
      id: 'visitas',
      icon: '🔑',
      title: 'Visitas',
      content:
        'Organizamos y guiamos visitas con compradores preseleccionados, asegurándonos de presentar su propiedad...',
      imageSrc: visita,
    },
    {
      id: 'informes',
      icon: '📈',
      title: 'Informes',
      content:
        'Le proporcionamos informes detallados sobre el interés generado, feedback de las visitas...',
      imageSrc: informe,
    },
    {
      id: 'contrato',
      icon: '✒️',
      title: 'Contrato',
      content:
        'Gestionamos todas las negociaciones y trámites legales necesarios para asegurar un contrato seguro...',
      imageSrc: contrato,
    },
    {
      id: 'servicio',
      icon: '🤲',
      title: 'Post-venta',
      content:
        'Nuestro compromiso no termina con la venta. Seguimos a su disposición para cualquier consulta posterior...',
      imageSrc: post,
    },
  ];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % pasos.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + pasos.length) % pasos.length);

  const paso = pasos[activeIndex];

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto" id="pasos">
      {/* Título */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 px-2">
          Nuestros 8 Pasos al Éxito
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl mx-auto px-4">
          Un proceso probado que te guía desde la consulta inicial hasta el éxito de tu inversión
        </p>
      </div>

      {/* Timeline optimizado para móvil */}
      <div className="relative mb-6 sm:mb-8">
        {/* Línea de fondo - oculta en móvil muy pequeño */}
        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 mx-6 rounded-full"></div>

        {/* Contenedor scrolleable horizontal */}
        <div className="overflow-x-auto overflow-y-hidden scrollbar-none">
          <div className="flex justify-start sm:justify-center items-center space-x-2 sm:space-x-4 md:space-x-6 relative z-10 px-4 pb-2 min-w-max sm:min-w-0">
            {pasos.map((p, i) => {
              const isActive = i === activeIndex;
              const isCompleted = i < activeIndex;

              return (
                <div
                  key={p.id}
                  className="flex flex-col items-center cursor-pointer flex-shrink-0 group"
                  onClick={() => setActiveIndex(i)}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md text-sm sm:text-lg md:text-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-black text-white scale-110 shadow-lg'
                        : isCompleted
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {p.icon}
                  </div>
                  <span className="mt-1 text-[8px] sm:text-[10px] md:text-xs text-center max-w-[45px] sm:max-w-[60px] leading-tight font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    {p.title.length > 12 ? p.title.split(' ').slice(0, 2).join(' ') : p.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Imagen */}
          <div className="w-full lg:w-1/2 h-48 sm:h-56 md:h-64 lg:h-96 flex-shrink-0 relative overflow-hidden">
            <img
              src={paso.imageSrc}
              alt={paso.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.src = '/api/placeholder/600/400';
              }}
            />
          </div>

          {/* Contenido del texto */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-black text-xs sm:text-sm font-semibold mb-4 w-fit">
              <span className="mr-2 text-sm sm:text-base">{paso.icon}</span>
              Paso {activeIndex + 1}
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-gray-900">
              {paso.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {paso.content}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center p-4 sm:p-5 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 text-sm sm:text-base font-medium text-gray-700 min-w-[70px] sm:min-w-[90px]"
          >
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden text-lg">←</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              {activeIndex + 1} de {pasos.length}
            </span>
            {/* Indicadores de progreso en móvil */}
            <div className="flex space-x-1 sm:hidden">
              {pasos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? 'bg-black scale-125'
                      : i < activeIndex
                      ? 'bg-gray-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === pasos.length - 1}
            className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 text-sm sm:text-base font-medium min-w-[70px] sm:min-w-[90px]"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <span className="sm:hidden text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
