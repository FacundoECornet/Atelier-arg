import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; // Asegúrate de que esta ruta sea correcta

export default function Equipo() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Nosotros"));
        const teamData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          teamData.push({ id: doc.id, ...data });
        });

        setTeamMembers(teamData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Error al cargar los datos del equipo. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleImageError = (e) => {
    e.target.src = "/placeholder-person.jpg";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
    <h1 className="text-3xl font-bold mb-6 text-center">Nuestro equipo</h1>
    <div className="container mx-auto px-4 py-8">
      {/* Ajustando el espacio entre las cards con gap-6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center w-full max-w-xs mx-auto"
          >
            {/* Imagen tipo retrato vertical ajustada para que se vea más abajo */}
            <div className="w-full h-64 bg-white">
              <img
                src={member.img || "https://via.placeholder.com/300x400?text=Sin+Imagen"}
                alt={member.nombre || "Miembro del equipo"}
                className="w-full h-full object-cover object-[center_20%]" // Ajuste para mover la imagen un poco más abajo
                onError={handleImageError}
                loading="lazy"
              />
            </div>

            {/* Información del miembro */}
            <div className="w-full p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{member.nombre}</h3>
              <p className="text-sm text-gray-600">{member.cargo}</p>
              {member.descripcion && (
                <p className="text-xs text-gray-500 mt-2">{member.descripcion}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
