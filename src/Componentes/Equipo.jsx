import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";

export default function Equipo() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Nosotros"),
      (snapshot) => {
        const teamData = [];
        snapshot.forEach((doc) => {
          teamData.push({ id: doc.id, ...doc.data() });
        });
        setTeamMembers(teamData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching team members:", err);
        setError(
          "Error al cargar los datos del equipo. Por favor, intenta de nuevo más tarde."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Nuestro equipo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Conoce a los profesionales que hacen posible nuestro trabajo
        </p>
        <div className="mt-6 w-24 h-1 bg-black mx-auto rounded"></div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center w-full max-w-xs mx-auto cursor-pointer transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ aspectRatio: "3 / 4" }}
            >
              {/* Imagen */}
              <div className="w-full h-full relative bg-gray-100">
                <img
                  src={member.img || "https://via.placeholder.com/300x400?text=Sin+Imagen"}
                  alt={member.nombre || "Miembro del equipo"}
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{member.nombre}</h3>
                  <p className="text-sm font-medium text-yellow-200 mb-2 uppercase tracking-wide">
                    {member.cargo}
                  </p>
                  {member.descripcion && (
                    <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                      {member.descripcion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
