import React, { useState, lazy, Suspense } from 'react'
import OficinasCarousel from './Nosotros'
import pareja from '../Imagenes/pareja-modal.jpg'

const ModalTasacion = lazy(() => import('./Modal'))

const Body = () => {
  const [showModal, setShowModal] = useState(false)

  const handleScrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <OficinasCarousel />
      {/* Botón WhatsApp */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://wa.me/5493812105720"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full flex items-center justify-center w-12 h-12 transition hover:bg-green-600"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-6 h-6"
            decoding="async"
          />
        </a>
      </div>

      {/* Sección de venta */}
      <section aria-label="Venta" className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center min-h-[500px]">
              {/* Contenido de texto */}
              <div className="lg:w-1/2 p-8 lg:p-16 bg-white rounded-l-3xl">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-400 mb-6 leading-tight">
                  Venda su propiedad con
                  <br />
                  <span className="text-black">Atelier Homes Argentina</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Evaluaremos todo el potencial de su propiedad, teniendo en cuenta todos sus
                  detalles y características especiales, y lo incluiremos en nuestra valoración
                  inmobiliaria gratuita y sin compromiso.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleScrollToContact}
                    className="border-2 border-black text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:bg-black hover:text-white text-center"
                  >
                    Pongase en contacto
                  </button>

                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-black text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:bg-black border-2 border-black"
                  >
                    Valoración en línea
                  </button>
                </div>
              </div>

              {/* Imagen */}
              <div className="lg:w-1/2 h-64 lg:h-[500px] relative rounded-r-3xl overflow-hidden">
                <img
                  src={pareja}
                  alt="Pareja en interior moderno"
                  className="w-full h-full object-cover rounded-r-3xl"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <Suspense fallback={<div className="text-center py-20 text-gray-400">Cargando…</div>}>
          <ModalTasacion showModal={showModal} handleCloseModal={() => setShowModal(false)} />
        </Suspense>
      )}
    </>
  )
}

export default Body
