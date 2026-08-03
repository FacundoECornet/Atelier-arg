import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { handleImgFallback } from '../utils/imgFallback'
import TeamMemberModal from './TeamMemberModal'

export default function Equipo() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Nosotros'))
        const teamData = []
        querySnapshot.forEach((doc) => {
          teamData.push({ id: doc.id, ...doc.data() })
        })
        setTeamMembers(teamData)
      } catch {
        setError('Error al cargar los datos del equipo. Por favor, intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    fetchTeamMembers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <>
      <section aria-label="Equipo" className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-center mt-12">Nuestro equipo</h1>
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center w-full max-w-xs mx-auto cursor-pointer transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ aspectRatio: '3 / 4' }}
            >
              <img
                src={member.img || 'https://via.placeholder.com/300x400?text=Sin+Imagen'}
                alt={member.nombre || 'Miembro del equipo'}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-110"
                onError={handleImgFallback('/placeholder-person.jpg')}
                loading="lazy"
                decoding="async"
                width={300}
                height={400}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-1">{member.nombre}</h3>
                  <p className="text-sm font-medium text-yellow-300 uppercase tracking-wide">
                    {member.cargo}
                  </p>
                  {member.descripcion && (
                    <p className="text-xs mt-2 line-clamp-3">{member.descripcion}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </>
  )
}
