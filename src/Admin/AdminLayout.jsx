import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { schemas } from './schemas'

const sections = [
  { key: 'propiedades', label: 'Propiedades', path: '/admin/propiedades' },
  { key: 'noticias', label: 'Noticias', path: '/admin/noticias' },
  { key: 'nosotros', label: 'Equipo', path: '/admin/nosotros' },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <Link
          to="/admin"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          Panel Admin — Atelier
        </Link>
        <nav className="flex gap-2">
          {sections.map((s) => {
            const active = pathname.startsWith(s.path)
            return (
              <Link
                key={s.key}
                to={s.path}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {s.label}
              </Link>
            )
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2"
        >
          Cerrar sesión
        </button>
        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
          ← Ver sitio
        </Link>
      </header>

      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  )
}
