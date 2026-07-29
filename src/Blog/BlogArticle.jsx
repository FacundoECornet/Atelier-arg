import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { handleImgFallback } from '../utils/imgFallback'
import { Helmet } from 'react-helmet-async'

const PLACEHOLDER = '/placeholder-property.jpg'

const BlogArticle = () => {
  const { slug: rawSlug } = useParams()
  const slug = rawSlug.replace(/\/$/, '')
  const navigate = useNavigate()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const q = query(
          collection(db, 'Noticias'),
          where('publicado', '==', true),
          where('slug', '==', slug)
        )
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setArticle({ id: doc.id, ...doc.data() })
        } else {
          setError('Artículo no encontrado.')
        }
      } catch {
        setError('Error al cargar el artículo.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Cargando…</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-xl mb-2">Artículo no encontrado.</p>
        <p className="text-gray-500 text-sm mb-6">
          El artículo que buscas no existe o ha sido eliminado.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:scale-[1.02] transition duration-200 text-sm"
        >
          ← Volver al blog
        </Link>
      </div>
    )
  }

  const description = (article.descripcion || '').substring(0, 160)

  return (
    <>
      <Helmet>
        <title>{article.titulo} | Atelier Homes Argentina</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={article.titulo} />
        <meta property="og:description" content={description} />
        {article.img && <meta property="og:image" content={article.img} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://atelierhomes.com.ar/blog/${article.slug}`} />
        <link rel="canonical" href={`https://atelierhomes.com.ar/blog/${article.slug}`} />
      </Helmet>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors mb-6"
        >
          ← Volver al blog
        </Link>

        {article.img && (
          <img
            src={article.img}
            alt={article.titulo}
            className="w-full max-h-[400px] object-cover rounded-xl mb-6"
            loading="lazy"
            decoding="async"
            onError={handleImgFallback(PLACEHOLDER)}
          />
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{article.titulo}</h1>

        {article.fecha && (
          <time
            className="text-sm text-gray-500 mb-6 block"
            dateTime={article.fecha}
          >
            {new Date(article.fecha).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}

        {article.contenido && (
          <div
            className="[&_img]:rounded-lg [&_img]:my-4 [&_h1]:text-2xl [&_h2]:text-xl [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.contenido }}
          />
        )}
      </article>
    </>
  )
}

export default BlogArticle
