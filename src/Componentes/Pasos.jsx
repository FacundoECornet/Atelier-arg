import { useState } from "react";
import consulta from "../Imagenes/Atelier-26.JPG";
import valor from "../Imagenes/Atelier-27.JPG";
import casa from "../Imagenes/Mercedes Costal-23.jpg";
import post from "../Imagenes/Atelier-31.JPG";
import contrato from "../Imagenes/Atelier-llaves.JPG";
import mark from "../Imagenes/mark.png";
import visita from "../Imagenes/Atelier-23.JPG";
import informe from "../Imagenes/Atelier-33.JPG";



export default function Pasos() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Definimos los pasos del proceso inmobiliario (similar a los de la imagen)
  const pasos = [
    {
        id: "consulta",
        icon: "🏛️", // Edificio clásico/columna, representa formalidad y profesionalidad
        title: "Consulta",
        content: "Vender una vivienda con éxito significa encontrar rápidamente al comprador adecuado y conseguir el precio de venta óptimo. Los consultores inmobiliarios poseen sólidos conocimientos en la materia y le ofrecen un asesoramiento inicial competente e individual.",
        imageSrc: consulta
      },
      {
        id: "valoracion",
        icon: "⚖️", // Balanza, simboliza valoración justa y equilibrada
        title: "Valoración",
        content: "Valoramos su propiedad utilizando análisis de mercado precisos y nuestra amplia experiencia en el sector inmobiliario, para determinar el precio óptimo que garantiza tanto competitividad como rentabilidad.",
        imageSrc: valor
      },
      {
        id: "exposicion",
        icon: "📋", // Portapapeles, representa documentación profesional
        title: "Exposición",
        content: "Preparamos documentación profesional y fotografías de alta calidad para mostrar su propiedad en su mejor luz y destacar todas sus características más atractivas.",
        imageSrc: casa
      },
      {
        id: "marketing",
        icon: "📢", // Megáfono, representa difusión y visibilidad
        title: "Marketing",
        content: "Implementamos estrategias de marketing personalizadas utilizando plataformas digitales, redes sociales y nuestra red exclusiva de contactos para maximizar la visibilidad de su propiedad.",
        imageSrc: mark
      },
      {
        id: "visitas",
        icon: "🔑", // Llave, símbolo clásico inmobiliario
        title: "Visitas",
        content: "Organizamos y guiamos visitas con compradores preseleccionados, asegurándonos de presentar su propiedad de manera profesional y respondiendo a todas las consultas.",
        imageSrc: visita
      },
      {
        id: "informes",
        icon: "📈", // Gráfico ascendente, representa análisis profesional
        title: "Informes",
        content: "Le proporcionamos informes detallados sobre el interés generado, feedback de las visitas y la evolución del proceso de venta, manteniéndole completamente informado.",
        imageSrc: informe
      },
      {
        id: "contrato",
        icon: "✒️", // Pluma estilográfica, representa firma de documentos formales
        title: "Contrato",
        content: "Gestionamos todas las negociaciones y trámites legales necesarios para asegurar un contrato de compraventa que proteja sus intereses y garantice una transacción segura.",
        imageSrc: contrato
      },
      {
        id: "servicio",
        icon: "🤲", // Manos ofreciendo, representa servicio y atención continua
        title: "Post-venta",
        content: "Nuestro compromiso no termina con la venta. Seguimos a su disposición para cualquier consulta posterior y le ayudamos con cualquier gestión relacionada con la propiedad vendida.",
        imageSrc: post
      }
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % pasos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + pasos.length) % pasos.length);
  };

  return (
    <>
    <div className="max-w-6xl mx-auto px-4 py-10" id="saber-mas">
      <h1 className="text-3xl font-semibold text-center mb-10">
        Nuestro 8 pasos al exito
      </h1>
  
      {/* Iconos de navegación superior */}
      <div className="flex justify-between items-center mb-8 overflow-x-auto pb-2 relative">
        <div className="absolute top-10 left-0 w-full h-0.5 bg-gray-200 -z-0" />
  
        {pasos.map((paso, index) => (
          <div 
            key={paso.id}
            onClick={() => setActiveIndex(index)}
            className="flex flex-col items-center cursor-pointer min-w-[80px] relative z-10"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 border bg-white ${
              activeIndex === index ? "border-black-600" : "border-gray-300"
            }`}>
              <span className="text-2xl">{paso.icon}</span>
            </div>
            <span className="text-xs text-center">{paso.title}</span>
            <div className={`h-1 w-full mt-2 rounded-full ${
              activeIndex === index ? "bg-black" : "bg-gray-200"
            }`} />
          </div>
        ))}
      </div>
  
      {/* Contenido del carrusel */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-[400px] md:h-[450px]">
          {pasos.map((paso, index) => (
            <div
              key={paso.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                activeIndex === index ? "opacity-100 z-10" : "opacity-0 -z-10"
              }`}
            >
              <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 h-full bg-gray-100">
              <img 
  src={paso.imageSrc} 
  alt={paso.title}
  className="w-full h-full object-cover object-center max-sm:h-auto max-sm:max-h-64"
  onError={(e) => {
    e.target.src = "/images/default-property.jpg";
  }}
/>

</div>


<div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
  <h2 className="text-2xl sm:text-xl md:text-2xl font-bold mb-4 sm:mb-2">{paso.title}</h2>
  <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-3">{paso.content}</p>
</div>

              </div>
            </div>
          ))}
        </div>
  
        {/* Flechas de navegación inferior */}
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
          >
            &#10094;
          </button>
  
          <span className="text-sm text-gray-500">
            {activeIndex + 1} de {pasos.length}
          </span>
  
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  </>
    ); }  