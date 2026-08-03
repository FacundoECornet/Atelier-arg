import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'

const Noticias = () => {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Noticias'))
        const docs = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((n) => n.publicado === true || n.publicado === 'true')
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3)
        setNoticias(docs)
      } catch {
        // silencioso — sin datos simplemente no muestra la sección
      } finally {
        setLoading(false)
      }
    }
    fetchNoticias()
  }, [])

  // Ocultar sección durante carga o si no hay artículos publicados
  if (loading) return null
  if (noticias.length === 0) return null

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto" id="noticias">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-10 text-center">
        Novedades
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {noticias.map((noticia) => (
          <li
            key={noticia.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-6 flex flex-col justify-between h-full"
          >
            <div>
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-[4/3]">
                <img
                  src={noticia.img}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                {noticia.titulo}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-4">
                {noticia.descripcion}
              </p>
            </div>

            <button
              onClick={() => navigate('/blog/' + noticia.slug)}
              className="group relative w-[50px] h-[50px] rounded-full bg-neutral-900 border-none font-semibold flex items-center justify-center shadow-[0px_0px_0px_4px_rgba(180,160,255,0.25)] cursor-pointer transition-all duration-300 overflow-hidden hover:w-[140px] hover:rounded-[50px] hover:bg-neutral-800 mx-auto mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
            >
              <svg
                className="w-[12px] transition-transform duration-300 group-hover:-translate-y-[200%]"
                viewBox="0 0 384 512"
              >
                <path
                  fill="white"
                  d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                ></path>
              </svg>
              <span className="absolute transform -translate-y-1/2 text-white text-[0px] group-hover:text-[13px] transition-all duration-300">
                Ver más
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Link
        to="/blog"
        className="block text-center mt-6 text-sm font-medium text-gray-600 hover:text-black transition-colors"
      >
        Ver todas las novedades →
      </Link>
    </div>
  )
}

export default Noticias
