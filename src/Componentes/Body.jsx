import React, { useState } from "react";
import PropertyList from "./propiedadesCards";
import emailjs from "@emailjs/browser";
import fondo from '../assets/fondo.webp';

const Body = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    numero: "",
    tipo: "Casa",
    direccion: "",
    descripcion: "",
  });

  const handleVenderClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleComprarClick = () => {
    document.getElementById("property-list")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!formData.nombre || !formData.correo || !formData.numero) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Parámetros para enviar el email
    const templateParams = {
      nombre: formData.nombre,
      correo: formData.correo,
      numero: formData.numero,
      tipo: formData.tipo,
      direccion: formData.direccion,
      descripcion: formData.descripcion,
    };

    // Enviar email con EmailJS sin publicKey
    emailjs
      .send("service_0idwo4b", "template_ixkz4ph", templateParams, "OmSNlnNWonV9JOdiV")
      .then(
        (response) => {
          console.log("Correo enviado con éxito:", response);
          alert("¡Correo enviado con éxito! Un asesor te contactará pronto.");

          // Cerrar modal y resetear formulario
          setShowModal(false);
          setFormData({
            nombre: "",
            correo: "",
            numero: "",
            tipo: "Casa",
            direccion: "",
            descripcion: "",
          });
        },
        (error) => {
          console.error("Error al enviar el correo:", error);
          alert("Error al enviar el mensaje. Verifica tu conexión e intenta nuevamente.");
        }
      );
  };

  return (
    <>
    
      <div className="relative w-auto h-[500px] sm:h-[600px] lg:h-[800px]">
        <img
          src={fondo}
          alt="Fondo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Una inmobiliaria diferente
          </h1>
          <p className="text-lg sm:text-xl mb-6 w-full max-w-md"
>En Atelier Homes disponemos de una metodología de venta basada en la fusión de arquitectura, diseño de interiores y marketing inmobiliario digital, importada de Europa.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleVenderClick}
              className="bg-transparent transition border border-white px-6 py-3 rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-white hover:text-black"
            >
              Vender
            </button>
            <button
              onClick={handleComprarClick}
              className="bg-transparent transition border border-white px-6 py-3 rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-white hover:text-black"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://wa.me/549XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center w-12 h-12 transition hover:bg-green-600"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
        </a>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 text-xl">
              ✖
            </button>
            <h3 className="text-lg font-bold mb-4">Formulario de Venta</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="w-full mb-2 p-2 border rounded" required />
              <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo" className="w-full mb-2 p-2 border rounded" required />
              <input type="number" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" className="w-full mb-2 p-2 border rounded" required />
              <label className="block text-sm font-medium text-gray-900">Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full p-2 border rounded">
                <option>Casa</option>
                <option>Departamento</option>
              </select>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" className="w-full mb-2 p-2 border rounded mt-4" />
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Descripción" className="w-full mb-2 p-2 border rounded mt-4"></textarea>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-3">
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      <div id="property-list" className="mt-12">
        <PropertyList />
      </div>
    </>
  );
};

export default Body;
