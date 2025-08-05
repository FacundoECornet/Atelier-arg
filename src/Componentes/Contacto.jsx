import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Map, Marker } from "pigeon-maps";

const Formulario = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    to_name: "",
    email_id: "",
    phone_id: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Acá podés integrar con Formspree o Firebase si querés enviar los datos
    // Por ahora solo simula éxito
    Swal.fire({
      title: "Mensaje enviado",
      text: "Gracias por contactarnos. Te responderemos pronto.",
      icon: "success",
    });

    setFormData({
      from_name: "",
      to_name: "",
      email_id: "",
      phone_id: "",
      message: "",
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Contactanos</h1>

      <div
        id="contacto"
        className="scroll-mt-24 flex flex-col md:flex-row items-stretch max-w-6xl mx-auto bg-white rounded overflow-hidden m-5"
      >
        {/* Mapa */}
        <div className="w-full max-w-md mx-auto aspect-square rounded-lg shadow-md overflow-hidden">
          <Map
            defaultCenter={[-26.800137, -65.302171]}
            defaultZoom={16}
            height={400}
          >
            <Marker
              anchor={[-26.800137, -65.302171]}
              color="red"
              width={40}
            />
          </Map>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="from_name" className="text-sm font-bold text-gray-600">Nombre</label>
            <input
              type="text"
              name="from_name"
              id="from_name"
              value={formData.from_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 bg-gray-200 text-gray-800 px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="to_name" className="text-sm font-bold text-gray-600">Apellido</label>
            <input
              type="text"
              name="to_name"
              id="to_name"
              value={formData.to_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 bg-gray-200 text-gray-800 px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="email_id" className="text-sm font-bold text-gray-600">Email</label>
            <input
              type="email"
              name="email_id"
              id="email_id"
              value={formData.email_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 bg-gray-200 text-gray-800 px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="phone_id" className="text-sm font-bold text-gray-600">Teléfono</label>
            <input
              type="tel"
              name="phone_id"
              id="phone_id"
              value={formData.phone_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 bg-gray-200 text-gray-800 px-4 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="message" className="text-sm font-bold text-gray-600">Mensaje</label>
            <textarea
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 bg-gray-200 text-gray-800 px-4 py-2"
            />
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-black text-white uppercase font-bold px-6 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Formulario;
