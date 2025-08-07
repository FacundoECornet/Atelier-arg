import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";

const INITIAL_VISIBLE_COUNT = 3;

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch propiedades con useCallback para evitar recreación innecesaria
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "propiedades"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(data);
    } catch (err) {
      console.error("Error cargando propiedades:", err);
      setError("Error al cargar propiedades. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleToggleProperties = () => {
    if (visibleCount < properties.length) {
      setVisibleCount(properties.length);
    } else {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      const container = document.getElementById("propiedades");
      if (container) container.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section
        id="propiedades"
        className="flex justify-center items-center h-64 max-w-screen-xl mx-auto p-4"
      >
        <span className="text-xl font-semibold text-gray-600">
          Cargando propiedades...
        </span>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="propiedades"
        className="flex justify-center items-center h-64 max-w-screen-xl mx-auto p-4"
      >
        <span className="text-xl font-semibold text-red-600">{error}</span>
      </section>
    );
  }

  if (!properties.length) {
    return (
      <section
        id="propiedades"
        className="flex justify-center items-center h-64 max-w-screen-xl mx-auto p-4"
      >
        <span className="text-xl font-semibold text-gray-600">
          No hay propiedades disponibles.
        </span>
      </section>
    );
  }

  return (
    <section id="propiedades" className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-center text-3xl font-bold mb-6">Propiedades en Venta</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.slice(0, visibleCount).map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => navigate(`/propiedades/${property.id}`)}
          />
        ))}
      </div>

      {properties.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleToggleProperties}
            className="bg-white text-black border-2 border-black py-3 px-6 rounded-lg font-semibold transition duration-300 hover:bg-black hover:text-white"
            aria-expanded={visibleCount >= properties.length}
            aria-controls="propiedades-list"
          >
            {visibleCount < properties.length ? "Ver Más" : "Ver Menos"}
          </button>
        </div>
      )}
    </section>
  );
};

const PropertyCard = React.memo(({ property, onClick }) => {
  // Manejo fallback para imagen
  const handleImageError = (e) => {
    if (!e.target.dataset.error) {
      e.target.src = "https://via.placeholder.com/400x300?text=Sin+Imagen";
      e.target.dataset.error = "true";
    }
  };

  return (
    <article
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="bg-white border-2 border-black rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-[1.03] flex flex-col h-full focus:outline-none focus:ring-4 focus:ring-indigo-500"
      aria-label={`Ver detalles de la propiedad ${property.Nombre || "sin título"}`}
    >
      <img
        src={property.img}
        alt={property.Nombre || "Imagen propiedad"}
        className="w-full h-52 sm:h-56 md:h-48 object-cover"
        loading="lazy"
        decoding="async"
        onError={handleImageError}
      />
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-sm text-gray-600">
          {property.ubicacion || "Sin ubicación"}
        </span>

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
          aria-label={`Ver propiedad ${property.Nombre || ""}`}
          type="button"
        >
          Ver Propiedad
        </button>
      </div>
    </article>
  );
});

export default PropertyList;
