import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch optimizado con useCallback para evitar recreaciones innecesarias
  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "Noticias"));
      const noticiasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNoticias(noticiasData);
    } catch (err) {
      console.error("Error cargando noticias:", err);
      setError("Error al cargar las novedades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  // Manejador para fallback de imagen para evitar imagen rota
  const handleImageError = (e) => {
    if (!e.target.dataset.error) {
      e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
      e.target.dataset.error = "true";
    }
  };

  if (loading) {
    return (
      <section className="flex justify-center items-center h-64">
        <span className="text-xl font-semibold text-gray-600">Cargando novedades...</span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-64">
        <span className="text-xl font-semibold text-red-600">{error}</span>
      </section>
    );
  }

  if (noticias.length === 0) {
    return (
      <section className="flex justify-center items-center h-64">
        <span className="text-xl font-semibold text-gray-600">No hay novedades disponibles.</span>
      </section>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto" id="noticias">
      <h1 className="text-3xl font-bold mb-10 text-center">Novedades</h1>

      <ul className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300">
        {noticias.map(({ id, titulo, descripcion, img, url }) => (
          <li
            key={id}
            className="md:w-1/3 px-6 py-8 text-center flex"
          >
            <article className="flex flex-col justify-between w-full min-h-[500px]">
              <div>
                <h2 className="text-xl font-semibold mb-2">{titulo}</h2>
                <p className="mb-4">{descripcion}</p>
                <img
                  src={img}
                  alt={titulo}
                  className="w-full h-[200px] object-cover rounded mb-4 mx-auto"
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />
              </div>

              <button
                onClick={() => url && window.open(url, "_blank")}
                className="group relative w-[50px] h-[50px] rounded-full bg-neutral-900 border-none font-semibold flex items-center justify-center shadow-[0px_0px_0px_4px_rgba(180,160,255,0.25)] cursor-pointer transition-all duration-300 overflow-hidden hover:w-[140px] hover:rounded-[50px] hover:bg-neutral-700 mx-auto mt-4"
                aria-label={`Ver más sobre ${titulo}`}
                type="button"
              >
                <svg
                  className="w-[12px] transition-transform duration-300 group-hover:-translate-y-[200%]"
                  viewBox="0 0 384 512"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="white"
                    d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                  />
                </svg>
                <span className="absolute bottom-[-20px] text-white text-[0px] group-hover:bottom-auto group-hover:text-[13px] transition-all duration-300 select-none">
                  Ver más
                </span>
              </button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
