import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

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
        setError(
          "Error al cargar los datos del equipo. Por favor, intenta de nuevo más tarde."
        );
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center w-full max-w-xs mx-auto cursor-pointer"
              style={{ aspectRatio: "3 / 4" }} // Mantener tamaño uniforme
            >
              {/* Imagen */}
              <img
                src={member.img || "https://via.placeholder.com/300x400?text=Sin+Imagen"}
                alt={member.nombre || "Miembro del equipo"}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
                loading="lazy"
              />

              {/* Overlay con info, oculto por defecto */}
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4 text-white">
                <h3 className="text-lg font-semibold">{member.nombre}</h3>
                <p className="text-sm mt-1">{member.cargo}</p>
                {member.descripcion && (
                  <p className="text-xs mt-2">{member.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

