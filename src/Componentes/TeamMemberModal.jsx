import React from 'react'
import { handleImgFallback } from '../utils/imgFallback'

const TeamMemberModal = ({ member, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 text-3xl transition"
        aria-label="Cerrar"
      >
        &times;
      </button>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {member.img && (
          <img
            src={member.img}
            alt={member.nombre || 'Miembro del equipo'}
            className="w-full h-64 object-cover rounded-t-2xl"
            onError={handleImgFallback('/placeholder-person.jpg')}
          />
        )}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{member.nombre}</h2>
          <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
            {member.cargo}
          </p>
          <p className="text-base text-gray-700 leading-relaxed">{member.descripcion}</p>
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="block w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center no-underline"
            >
              Hablemos
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamMemberModal
