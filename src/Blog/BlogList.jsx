import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { handleImgFallback } from '../utils/imgFallback'
import { Helmet } from 'react-helmet-async'

const PLACEHOLDER = '/placeholder-property.jpg'

const BlogList = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(
          collection(db, 'Noticias'),
          where('publicado', '==', true),
          orderBy('fecha', 'desc')
        )
        const snapshot = await getDocs(q)
        setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch {
        // silent fail — empty state renders instead
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">Novedades</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 sm:p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet>
        <title>Novedades | Atelier Homes Argentina</title>
        <meta name="description" content="Últimas novedades y artículos de Atelier Homes Argentina" />
        <meta property="og:title" content="Novedades | Atelier Homes Argentina" />
        <meta property="og:description" content="Últimas novedades y artículos de Atelier Homes Argentina" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atelierhomes.com.ar/blog" />
        <link rel="canonical" href="https://atelierhomes.com.ar/blog" />
      </Helmet>
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">Novedades</h1>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No hay artículos publicados todavía.</p>
          <p className="text-gray-400 text-sm mt-2">
            Vuelve pronto para conocer las últimas novedades de Atelier Homes Argentina
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => navigate('/blog/' + article.slug)}
              className="cursor-pointer group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={article.img}
                  alt={article.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={handleImgFallback(PLACEHOLDER)}
                />
              </div>
              <div className="p-4 sm:p-6 flex flex-col gap-2">
                <h2 className="text-lg font-semibold line-clamp-2">{article.titulo}</h2>
                {article.fecha && (
                  <time
                    className="text-sm text-gray-500"
                    dateTime={article.fecha}
                  >
                    {new Date(article.fecha).toLocaleDateString('es-AR')}
                  </time>
                )}
                <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                  {article.descripcion}
                </p>
                <span className="text-sm font-medium text-black mt-2 group-hover:underline inline-flex items-center gap-1">
                  Leer más
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
      </section>
    </>
  )
}

export default BlogList
