import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tucumán');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, 'propiedades'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(data);
        // Por defecto mostramos propiedades de Tucumán
        setFilteredProperties(
          data.filter((property) => getProvince(property.ubicacion) === 'Tucumán'),
        );
      } catch (error) {
        console.error('Error cargando propiedades:', error);
        setError('Error al cargar las propiedades. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Clasifica la ubicación en Tucumán, Buenos Aires o Otra
  const getProvince = (ubicacion) => {
    if (!ubicacion) return 'Otra';
    const lower = ubicacion.toLowerCase();
    const tucumanLocalidades = [
      'san miguel de tucuman',
      'tucumán',
      'yerba buena',
      'concepción',
      'santa ana',
      'tafí viejo',
    ];
    const buenosAiresLocalidades = [
      'buenos aires',
      'la plata',
      'mar del plata',
      'quilmes',
      'lomas de zamora',
      'belgrano',
      'palermo',
      'recoleta',
      'caballito',
      'san isidro',
      'avellaneda',
      'lanús',
      'morón',
      'san justo',
      'haedo',
      'castelar',
      'merlo',
      'temperley',
      'burzaco',
      'adrogue',
      'banfield',
      'olivos',
      'vicente lopez',
      'tigre',
      'san fernando',
      'pilar',
      'escobar',
      'zarate',
      'campana',
      'lujan',
      'carmen de areco',
      'saladillo',
      'chivilcoy',
      'velez sarsfield',
      'flores',
      'parque patricios',
      'villa crespo',
      'boedo',
      'almagro',
      'caballito',
      'villa urquiza',
      'belgrano',
      'nuñez',
      'palermo hollywood',
      'palermo viejo',
      'retiro',
      'constitución',
      'san telmo',
      'monserrat',
      'barracas',
    ];

    if (tucumanLocalidades.some((loc) => lower.includes(loc))) return 'Tucumán';
    if (buenosAiresLocalidades.some((loc) => lower.includes(loc))) return 'Buenos Aires';
    return 'Otra';
  };

  // Función para formatear el precio de manera consistente
  const formatPrice = (price) => {
    if (!price) return null;

    // Convertir a string y limpiar
    let priceStr = String(price).trim();

    // Si ya tiene formato de moneda, devolverlo tal como está
    if (priceStr.includes('$') || priceStr.includes('USD') || priceStr.includes('ARS')) {
      return priceStr;
    }

    // Si es solo un número, formatear
    const numPrice = parseFloat(priceStr.replace(/[^\d.]/g, ''));
    if (!isNaN(numPrice)) {
      // Si es un número muy grande, asumir que es en pesos
      if (numPrice > 1000000) {
        return `$${numPrice.toLocaleString('es-AR')} ARS`;
      }
      // Si es un número más pequeño, podría ser en USD
      return `$${numPrice.toLocaleString('es-AR')} USD`;
    }

    return priceStr;
  };

  const filterByLocation = (location) => {
    setSelectedLocation(location);
    setFilteredProperties(
      properties.filter((property) => getProvince(property.ubicacion) === location),
    );
  };

  const handlePropertyClick = (propertyId) => {
    try {
      navigate(`/propiedades/${propertyId}`);
    } catch (error) {
      console.error('Error navegando a la propiedad:', error);
      // Fallback: recargar la página con la nueva URL
      window.location.href = `/propiedades/${propertyId}`;
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-8 text-center scroll-mt-32">
        Todas las Propiedades
      </h2>

      {/* Filtro por ubicación */}
      <div className="flex justify-center gap-4 mb-8">
        {['Tucumán', 'Buenos Aires'].map((loc) => (
          <button
            key={loc}
            onClick={() => filterByLocation(loc)}
            className={`px-4 py-2 rounded-full border ${
              selectedLocation === loc
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300'
            } transition-all`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Mensaje si no hay propiedades */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No se encontraron propiedades en {selectedLocation}
          </p>
        </div>
      )}

      {/* Listado de propiedades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => {
          const formattedPrice = formatPrice(property.precio);

          return (
            <div
              key={property.id}
              onClick={() => handlePropertyClick(property.id)}
              className="cursor-pointer group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20 z-10" />
                <img
                  src={property.img}
                  alt={property.Nombre || 'Imagen propiedad'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/placeholder-property.jpg'; // Imagen de fallback
                  }}
                />
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-black text-sm font-medium border border-gray-200">
                    {property.ubicacion || 'Sin ubicación'}
                  </div>
                  {formattedPrice && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/90 backdrop-blur-sm text-white text-sm font-semibold border border-white/20 max-w-fit">
                      <span className="truncate">{formattedPrice}</span>
                    </div>
                  )}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/90 backdrop-blur-sm text-white text-sm font-semibold border border-white/20 max-w-fit">
                    {property.estado || 'Venta'}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                  {property.Nombre || 'Sin título'}
                </h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {property.caracteristicas || 'Sin características disponibles'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllProperties;
