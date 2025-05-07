import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; // Verifica que la ruta sea correcta

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Estado para manejar cuántas propiedades se muestran
  const initialCount = 3; // Definimos cuántas propiedades se muestran inicialmente

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "propiedades"));
        const propertiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Propiedades cargadas:", propertiesData);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error cargando propiedades:", error);
      }
    };

    fetchProperties();
  }, []);

  // Función para mostrar todas las propiedades
  const showAllProperties = () => {
    setVisibleCount(properties.length);
  };

  // Función para volver al estado inicial (3 propiedades)
  const showLessProperties = () => {
    setVisibleCount(initialCount);
    // Opcional: scroll hacia arriba de la sección de propiedades
    document.getElementById("propiedades").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-4" id="propiedades">
      <h2 className="text-center text-2xl font-bold mb-4">Propiedades en Venta</h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {properties.slice(0, visibleCount).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Botones para controlar la visualización */}
      <div className="mt-4 text-center">
        {visibleCount < properties.length ? (
          <button
            onClick={showAllProperties}
            className="bg-white text-black border-2 border-black py-2 px-4 rounded-lg transition duration-300 hover:bg-black hover:text-white"
          >
            Ver Más
          </button>
        ) : (
          properties.length > initialCount && (
            <button
              onClick={showLessProperties}
              className="bg-white text-black border-2 border-black py-2 px-4 rounded-lg transition duration-300 hover:bg-black hover:text-white"
            >
              Ver Menos
            </button>
          )
        )}
      </div>
    </div>
  );
};

function PropertyCard({ property }) {
  return (
    <div className="bg-white border-2 border-black rounded-xl shadow-lg overflow-hidden transform transition duration-300 ">
      <img
        src={property.img}
        alt={property.Nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-sm text-gray-600">{property.ubicacion || "Sin ubicación"}</span>

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{property.Nombre || "Sin título"}</h3>
          <span className="text-sm text-gray-600">{property.caracteristicas || "Sin características"}</span>
        </div>

        <button
          onClick={() => window.open(property.url, "_blank")}
          className="mt-3 w-full bg-white text-black border-2 border-black py-2 rounded-lg transition duration-300 hover:bg-black hover:text-white"
        >
          Ver Propiedad
        </button>
      </div>
    </div>
  );
}

export default PropertyList;