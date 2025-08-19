import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();
  const initialCount = 3;
  console.log('📦 Renderizando PropertyList');

  useEffect(() => {
    console.log('🚀 Ejecutando useEffect: Fetch de propiedades');

    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'propiedades'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(data);
      } catch (error) {
        console.error('Error cargando propiedades:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleToggleProperties = () => {
    if (visibleCount < properties.length) {
      setVisibleCount(properties.length);
    } else {
      setVisibleCount(initialCount);
      const container = document.getElementById('propiedades');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="propiedades" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12">
        Propiedades en Venta
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {properties.length === 0
          ? // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-[400px]"></div>
            ))
          : properties.slice(0, visibleCount).map((property) => (
              <div key={property.id} className="h-full">
                <PropertyCard
                  property={property}
                  onClick={() => navigate(`/propiedades/${property.id}`)}
                />
              </div>
            ))}
      </div>

      {properties.length > initialCount && (
        <div className="mt-10 sm:mt-12 flex justify-center">
          <button
            onClick={handleToggleProperties}
            className="group bg-white text-black border-2 border-black py-3 px-8 rounded-lg font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg relative overflow-hidden"
          >
            <span className="relative z-10 transition-transform group-hover:scale-105">
              {visibleCount < properties.length ? 'Ver Más' : 'Ver Menos'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

const PropertyCard = ({ property, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white border-2 border-black rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full"
  >
    <div className="relative overflow-hidden aspect-[4/3]">
      <img
        src={property.img}
        alt={property.Nombre || 'Imagen propiedad'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>

    <div className="p-5 sm:p-6 flex flex-col flex-grow">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full mb-2">
          {property.ubicacion || 'Sin ubicación'}
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold line-clamp-2 mb-2">
          {property.Nombre || 'Sin título'}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base line-clamp-2">
          {property.caracteristicas || 'Sin características'}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="mt-auto w-full bg-white text-black border-2 border-black py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Ver Propiedad
      </button>
    </div>
  </div>
);

export default PropertyList;
