import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();
  const initialCount = 3;
  console.log("📦 Renderizando PropertyList");

  useEffect(() => {
    console.log("🚀 Ejecutando useEffect: Fetch de propiedades");
  
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "propiedades"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(data);
      } catch (error) {
        console.error("Error cargando propiedades:", error);
      }
    };
  
    fetchProperties();
  }, []);
  

  const handleToggleProperties = () => {
    if (visibleCount < properties.length) {
      setVisibleCount(properties.length);
    } else {
      setVisibleCount(initialCount);
      const container = document.getElementById("propiedades");
      if (container) {
        container.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div id="propiedades" className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-center text-3xl font-bold mb-6">Propiedades en Venta</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.slice(0, visibleCount).map((property) => (
          <div key={property.id} className="h-full">
            <PropertyCard
              property={property}
              onClick={() => navigate(`/propiedades/${property.id}`)}
            />
          </div>
        ))}
      </div>

      {properties.length > initialCount && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleToggleProperties}
            className="bg-white text-black border-2 border-black py-3 px-6 rounded-lg font-semibold transition duration-300 hover:bg-black hover:text-white"
          >
            {visibleCount < properties.length ? "Ver Más" : "Ver Menos"}
          </button>
        </div>
      )}
    </div>
  );
};

const PropertyCard = ({ property, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border-2 border-black rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-[1.03] flex flex-col h-full"
  >
    <img
      src={property.img}
      alt={property.Nombre || "Imagen propiedad"}
      className="w-full h-52 sm:h-56 md:h-48 object-cover"
    />
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-sm text-gray-600">{property.ubicacion || "Sin ubicación"}</span>

      <div className="flex justify-between items-center mt-1 mb-4">
        <h3 className="text-xl font-semibold">{property.Nombre || "Sin título"}</h3>
        <span className="text-sm text-gray-600">
          {property.caracteristicas || "Sin características"}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="mt-auto w-full bg-white text-black border-2 border-black py-3 rounded-lg font-semibold transition duration-300 hover:bg-black hover:text-white"
      >
        Ver Propiedad
      </button>
    </div>
  </div>
);

export default PropertyList;
