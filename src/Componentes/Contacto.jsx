import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

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

    const templateParams = {
      from_name: formData.from_name,
      to_name: formData.to_name,
      email_id: formData.email_id,
      phone_id: formData.phone_id,
      message: formData.message,
    };

    emailjs
      .send("service_inq85pp", "template_kmhkeok", templateParams, "bqG-kgsik_UVR-XMq")
      .then(
        () => {
          Swal.fire({
            title: "¡Mensaje enviado con éxito!",
            icon: "success",
            draggable: true,
          });

          setFormData({
            from_name: "",
            to_name: "",
            email_id: "",
            phone_id: "",
            message: "",
          });
        },
        (error) => {
          console.error("Error al enviar el correo:", error);
          Swal.fire({
            title: "Error al enviar el mensaje",
            text: "Verificá tu conexión e intentá de nuevo.",
            icon: "error",
          });
        }
      );
  };

  return (
    <>
    <div
  id="contacto"
  className="scroll-mt-24 flex flex-col md:flex-row items-stretch max-w-6xl mx-auto bg-white rounded overflow-hidden m-5"
>

  {/* Imagen a la izquierda */}
  <div className="hidden md:block md:w-1/2 h-full">
    <img
      src="https://static.wixstatic.com/media/00602b_c4f025d72578441b98a523b51f59656f~mv2.jpg/v1/crop/x_0,y_0,w_1053,h_787/fill/w_960,h_718,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/oficina-Zaragoza-web-1.jpg" // Reemplazá esta URL por la tuya
      alt="Imagen ilustrativa"
      className="w-full h-full object-cover"
    />
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
        rows="4"
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
