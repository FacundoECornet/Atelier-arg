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
    <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto" id="propiedades">
      {/* Título principal */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
          Propiedades en Venta
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra selección de propiedades exclusivas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.length === 0
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          : properties.slice(0, visibleCount).map((property) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20 z-10" />
                  <img
                    src={property.img}
                    alt={property.Nombre || 'Imagen propiedad'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-black text-sm font-medium border border-gray-200">
                      {property.ubicacion || 'Sin ubicación'}
                    </div>
                    {property.precio && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/90 backdrop-blur-sm text-white text-sm font-semibold border border-white/20">
                        {property.precio}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 flex flex-col">
                  <h3 className="text-2xl font-bold text-black mb-4 line-clamp-2">
                    {property.Nombre || 'Sin título'}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-6 line-clamp-3">
                    {property.caracteristicas || 'Sin características'}
                  </p>

                  <button
                    onClick={() => navigate(`/propiedades/${property.id}`)}
                    className="mt-auto flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg group"
                  >
                    <span className="font-medium">Ver Detalles</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
      </div>

      {properties.length > initialCount && (
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/propiedades')} // Redirige a la página con todas las propiedades
            className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-black border-2 border-black rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span>Ver Más Propiedades</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
