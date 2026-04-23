import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  {
    path: '/admin/propiedades',
    label: 'Propiedades',
    desc: 'Crear, editar y eliminar propiedades en venta o alquiler.',
    icon: '🏠',
  },
  {
    path: '/admin/noticias',
    label: 'Noticias',
    desc: 'Gestionar las novedades que aparecen en el home.',
    icon: '📰',
  },
  {
    path: '/admin/nosotros',
    label: 'Equipo',
    desc: 'Administrar los miembros del equipo.',
    icon: '👥',
  },
];

export default function AdminHub() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de administración</h1>
      <p className="text-gray-500 mb-8">Seleccioná una sección para gestionar el contenido.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group"
          >
            <span className="text-4xl">{c.icon}</span>
            <span className="text-lg font-bold text-gray-900 group-hover:text-black">{c.label}</span>
            <span className="text-sm text-gray-500">{c.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
