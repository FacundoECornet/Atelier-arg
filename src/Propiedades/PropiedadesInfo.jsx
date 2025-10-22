import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

const PropiedadesInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'propiedades'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const found = data.find((p) => p.id === id || p.codigo === id);
        if (!found) {
          setError('Propiedad no encontrada.');
        } else {
          setProperty(found);
        }
      } catch (error) {
        setError('Error al cargar la propiedad.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const openModal = (index) => {
    setCurrentImgIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const prevImage = () =>
    setCurrentImgIndex((prev) => (prev === 0 ? property.galeria.length - 1 : prev - 1));

  const nextImage = () =>
    setCurrentImgIndex((prev) => (prev === property.galeria.length - 1 ? 0 : prev + 1));

  if (loading) return <div className="text-center py-20 text-xl">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative w-full h-80 md:h-[450px] overflow-hidden shadow-xl">
        <img
          src={property.img}
          alt={property.Nombre}
          className="w-full h-full object-cover brightness-75"
          onError={(e) => (e.target.src = '/placeholder-property.jpg')}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
            {property.Nombre}
          </h1>
        </div>
      </div>

      {/* Galería */}
      {property.galeria?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-12">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Galería</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.galeria.map((url, index) => (
              <img
                key={index}
                src={url}
                onClick={() => openModal(index)}
                className="w-full h-52 object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition duration-200 shadow-sm"
                alt={`Imagen ${index + 1}`}
                onError={(e) => (e.target.src = '/placeholder-property.jpg')}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center transition-all">
          <button
            onClick={closeModal}
            className="absolute top-4 right-6 text-white text-4xl hover:text-red-400 transition"
          >
            &times;
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-4xl hover:text-gray-300"
          >
            &#8592;
          </button>
          <img
            src={property.galeria[currentImgIndex]}
            alt="Vista ampliada"
            className="max-w-[90%] max-h-[90vh] rounded-lg shadow-lg"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl hover:text-gray-300"
          >
            &#8594;
          </button>
        </div>
      )}

      {/* Información */}
      <section className="max-w-xl mx-auto mt-14 bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        {/* Precio */}
        {property.precio && (
          <>
            <div className="text-center">
              <h3 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Precio
              </h3>
              <p className="text-2xl font-bold text-green-600">{property.precio}</p>
            </div>
            <hr className="border-gray-200" />
          </>
        )}

        {/* Ubicación */}
        <div className="text-center">
          <h3 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Ubicación
          </h3>
          {property.ubicURL ? (
            <a
              href={property.ubicURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-blue-600 hover:underline"
            >
              {property.ubicacion}
            </a>
          ) : (
            <p className="text-lg text-gray-800">{property.ubicacion}</p>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Características */}
        <div className="text-center">
          <h3 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Características
          </h3>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {property.caracteristicas}
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 pt-3">
          <button
            onClick={() => {
              try {
                navigate(-1);
              } catch (err) {
                window.location.href = '/';
              }
            }}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:scale-[1.02] transition duration-200 text-sm"
          >
            ← Volver
          </button>
          <button
            onClick={() => {
              const mensaje = `Hola, buen día. Me interesa la propiedad "${property.Nombre}". ¿Podrían darme más información, por favor?`;
              const url = `https://wa.me/5493812105720?text=${encodeURIComponent(mensaje)}`;
              window.open(url, '_blank');
            }}
            className="bg-black text-white px-5 py-2 rounded-lg hover:scale-[1.02] transition duration-200 text-sm"
          >
            Consultar Propiedad
          </button>
        </div>
      </section>
    </div>
  );
};

export default PropiedadesInfo;
