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
    <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto" id="pasos">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Nuestros 8 Pasos al Éxito
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Un proceso probado que te guía desde la consulta inicial hasta el éxito de tu inversión
        </p>
      </div>

      {/* Timeline centrado */}
      <div className="relative flex justify-center items-center overflow-x-auto px-4 sm:px-0 mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 mx-6 rounded-full"></div>

        <div className="flex space-x-4 sm:space-x-6 relative z-10">
          {pasos.map((p, i) => {
            const isActive = i === activeIndex;
            const isCompleted = i < activeIndex;

            return (
              <div
                key={p.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setActiveIndex(i)}
              >
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-md text-lg sm:text-xl transition-all ${
                    isActive
                      ? 'bg-black text-white scale-110'
                      : isCompleted
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {p.icon}
                </div>
                <span className="mt-1 text-[7px] sm:text-[10px] text-center max-w-[50px] truncate">
                  {p.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido principal responsive */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Imagen ajustable sin cortarse */}
          <div className="lg:w-1/2 h-48 sm:h-64 lg:h-96 flex-shrink-0 relative overflow-hidden">
            <img
              src={paso.imageSrc}
              alt={paso.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.src = '/api/placeholder/600/400';
              }}
            />
          </div>

          <div className="lg:w-1/2 p-4 sm:p-6 lg:p-10 flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-black text-sm font-medium mb-3">
              <span className="mr-2">{paso.icon}</span>
              Paso {activeIndex + 1}
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{paso.title}</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{paso.content}</p>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handlePrev}
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition text-sm sm:text-base"
          >
            Anterior
          </button>
          <span className="text-sm sm:text-base text-gray-600">
            {activeIndex + 1} de {pasos.length}
          </span>
          <button
            onClick={handleNext}
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl bg-black text-white hover:bg-gray-800 shadow transition text-sm sm:text-base"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
