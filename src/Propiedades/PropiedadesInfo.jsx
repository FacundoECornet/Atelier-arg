import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";

const PropiedadesInfo = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "propiedades"));
        const propertyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const property = propertyData.find((p) => p.id === id);
        setProperty(property);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError(
          "Error al cargar la propiedad. Por favor, intenta de nuevo más tarde."
        );
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-12">
      {/* Hero visual */}
      <div className="relative w-full h-72 md:h-96 flex items-center justify-center">
        <img
          src={property.img}
          alt={property.Nombre}
          className="w-full h-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">
            {property.Nombre}
          </h1>
        </div>
      </div>
      {/* Tarjeta de detalles */}
      <div className="max-w-3xl mx-auto -mt-16 md:-mt-24 bg-white rounded-xl shadow-2xl p-8 md:p-12 relative z-10">
        <div className="mb-6 justify-center items-center flex flex-col">
          <span className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-2">
            Ubicación
          </span>
          <p className="text-lg font-semibold text-gray-800 mb-4">
            {property.ubicacion} 
          </p>
          <span className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-2">
            Características
          </span>
          <p className="text-base text-gray-700 mb-6 whitespace-pre-line">
            {property.caracteristicas}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-8 py-3 rounded-lg shadow hover:bg-gray-800 transition text-lg font-semibold flex justify-center items-center"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropiedadesInfo;
