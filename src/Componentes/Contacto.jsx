import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Map, Marker } from 'pigeon-maps'

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    mensaje: '',
    _gotcha: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('https://formspree.io/f/xdkdwpae', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        Swal.fire({
          title: 'Mensaje enviado',
          text: 'Gracias por contactarnos. Te responderemos pronto.',
          icon: 'success',
        })

        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          mensaje: '',
          _gotcha: '',
        })
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al enviar el formulario.',
          icon: 'error',
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo conectar con el servidor.',
        icon: 'error',
      })
    }
  }

  return (
    <>
      <section id="contacto">
        <h1 className="text-3xl font-bold mb-6 text-center">Contactanos</h1>

        <div className="flex flex-col md:flex-row items-stretch max-w-6xl mx-auto bg-white overflow-hidden m-5">
          {/* Mapa */}
          <div className="w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden">
            <Map defaultCenter={[-26.800137, -65.302171]} defaultZoom={16} height={400}>
              <Marker anchor={[-26.800137, -65.302171]} color="red" width={40} />
            </Map>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-white max-w-2xl mx-auto p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-bold text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  id="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="mensaje" className="block text-sm font-bold text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                name="mensaje"
                id="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
              />
            </div>

            <input
              type="text"
              name="_gotcha"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              value={formData._gotcha}
              onChange={handleChange}
            />

            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-black text-white uppercase font-bold px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Formulario
