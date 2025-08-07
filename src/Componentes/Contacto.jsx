import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Map, Marker } from "pigeon-maps";

const initialFormData = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  mensaje: "",
};

const Formulario = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting) return;

      setSubmitting(true);

      try {
        const response = await fetch("https://formspree.io/f/xdkdwpae", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          Swal.fire({
            title: "Mensaje enviado",
            text: "Gracias por contactarnos. Te responderemos pronto.",
            icon: "success",
            confirmButtonText: "OK",
          });
          setFormData(initialFormData);
        } else {
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al enviar el formulario. Por favor, intenta nuevamente.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo conectar con el servidor. Revisa tu conexión e intenta más tarde.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [formData, submitting]
  );

  return (
    <section id="contacto" className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Contáctanos</h1>

      <div className="flex flex-col md:flex-row items-stretch bg-white overflow-hidden rounded-lg shadow-md">
        {/* Mapa */}
        <div className="w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden">
          <Map defaultCenter={[-26.800137, -65.302171]} defaultZoom={16} height={400}>
            <Marker anchor={[-26.800137, -65.302171]} color="red" width={40} />
          </Map>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-2xl mx-auto p-6 flex-grow"
          noValidate
          aria-label="Formulario de contacto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["nombre", "apellido", "email", "telefono"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-bold text-gray-700 mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : field === "telefono" ? "tel" : "text"}
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={submitting}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label
              htmlFor="mensaje"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Mensaje
            </label>
            <textarea
              name="mensaje"
              id="mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitting}
            />
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-black text-white uppercase font-bold px-8 py-3 rounded-md transition-colors ${
                submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
              aria-live="polite"
              aria-busy={submitting}
            >
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Formulario;
