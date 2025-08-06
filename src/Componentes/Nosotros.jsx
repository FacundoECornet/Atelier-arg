import { useEffect, useState } from "react";
import imp from "../Imagenes/Atelier-19.webp";
import imp2 from "../Imagenes/Atelier-26.webp";
import fondo from "../assets/fondo.webp";

const images = [
  {
    img: fondo,
    text: (
      <>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Una inmobiliaria diferente
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto">
          En Atelier Homes disponemos de una metodología de venta basada en la fusión de arquitectura,
          diseño de interiores y marketing inmobiliario digital, importada de Europa.
        </p>
      </>
    ),
    isIntro: true,
  },
  {
    img: imp,
    text: "España",
    link: "https://www.atelierhomes.es",
    external: true,
  },
  {
    img: imp2,
    text: "Argentina",
    link: "#contacto",
    external: false,
  },
];

export default function OficinasCarousel() {
  const [current, setCurrent] = useState(0);

  const handleScrollToContact = () => {
    const el = document.getElementById("contacto");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
  {images.map(({ img, text, link, external, isIntro }, index) => (
    <div
      key={index}
      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
        index === current ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      {isIntro ? (
        <div className="w-full h-full relative">
          <img
            src={img}
            alt="Intro"
            className="w-full h-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white px-4">
            {text}
          </div>
        </div>
      ) : external ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <img
            src={img}
            alt={text}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-5xl font-extrabold tracking-wide drop-shadow-lg">
              {text}
            </p>
          </div>
        </a>
      ) : (
        <button
          type="button"
          onClick={handleScrollToContact}
          className="block w-full h-full cursor-pointer p-0 border-none bg-transparent"
        >
          <img
            src={img}
            alt={text}
            className="w-full h-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-5xl font-extrabold tracking-wide drop-shadow-lg">
              {text}
            </p>
          </div>
        </button>
      )}
    </div>
  ))}
</div>

  
  );
}
