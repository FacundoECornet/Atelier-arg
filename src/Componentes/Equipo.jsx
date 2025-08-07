import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export default function Equipo() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch optimizado con useCallback para evitar recreaciones innecesarias
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "Nosotros"));
      const teamData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeamMembers(teamData);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Error al cargar los datos del equipo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Manejador para fallback de imagen, con uso de propiedad 'once' para evitar loops infinitos
  const handleImageError = (e) => {
    if (!e.target.dataset.error) {
      e.target.src = "/placeholder-person.jpg";
      e.target.dataset.error = "true"; // Marcar que ya reemplazó la imagen para evitar loop
    }
  };

  if (loading) {
    return (
      <section className="flex justify-center items-center h-64">
        <span className="text-xl font-semibold text-gray-600">Cargando...</span>
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

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center mt-12">Nuestro equipo</h1>
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map(({ id, img, nombre, cargo, descripcion }) => (
            <article
              key={id}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center w-full max-w-xs mx-auto cursor-pointer"
              style={{ aspectRatio: "3 / 4" }}
              tabIndex={0} // Mejora accesibilidad
              aria-label={`Miembro del equipo: ${nombre || "Nombre no disponible"}`}
            >
              <img
                src={img || "https://via.placeholder.com/300x400?text=Sin+Imagen"}
                alt={nombre || "Miembro del equipo"}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
                loading="lazy"
                decoding="async" // Mejora carga de imagen
                fetchpriority="low" // Permite priorizar carga si necesario
              />

              {/* Overlay con info */}
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4 text-white">
                <h3 className="text-lg font-semibold">{nombre || "Nombre no disponible"}</h3>
                <p className="text-sm mt-1">{cargo || "Cargo no especificado"}</p>
                {descripcion && (
                  <p className="text-xs mt-2 line-clamp-4">{descripcion}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
