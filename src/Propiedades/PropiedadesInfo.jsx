import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PropiedadesInfo = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log('Buscando propiedad con id:', id);

        // 🔍 Busca por el campo "id" que usás en Firestore
        const q = query(collection(db, 'propiedades'), where('id', '==', id));
        const querySnapshot = await getDocs(q);

        console.log('Cantidad de resultados:', querySnapshot.size);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          console.log('Propiedad encontrada:', doc.data());
          setProperty({ docId: doc.id, ...doc.data() });
        } else {
          setError('Propiedad no encontrada.');
        }
      } catch (err) {
        console.error('Error al cargar la propiedad:', err);
        setError('Error al cargar la propiedad.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // 🌀 Estado de carga
  if (loading)
    return <div className="flex justify-center items-center h-screen">Cargando propiedad...</div>;

  // ⚠️ Si hay error
  if (error)
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  // 🏡 Si se encontró la propiedad
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto">
      {/* 🖼 Imagen principal */}
      <div className="w-full md:w-1/2 h-[400px] overflow-hidden rounded-2xl shadow-lg">
        <img
          src={property.img || property.galeria?.[0]}
          alt={property.Nombre}
          className="w-full h-full object-cover brightness-75"
        />
      </div>

      {/* 📝 Detalles */}
      <div className="flex flex-col justify-center w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-3">{property.Nombre}</h1>
        <p className="text-gray-600 mb-2">{property.ubicacion}</p>

        {property.ubicURL && (
          <a
            href={property.ubicURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mb-4"
          >
            Ver ubicación en Google Maps
          </a>
        )}

        <p className="text-gray-800 whitespace-pre-line mb-4">{property.caracteristicas}</p>

        {/* 🖼 Galería de imágenes */}
        {property.galeria?.length > 1 && (
          <>
            <h2 className="text-xl font-semibold mt-6 mb-2">Galería</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.galeria.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Galería ${index}`}
                  className="rounded-xl object-cover h-40 w-full shadow-md hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropiedadesInfo;
