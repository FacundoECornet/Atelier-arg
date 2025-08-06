import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { Map, Marker } from 'pigeon-maps';

const ModalTasacion = ({ showModal, handleCloseModal }) => {
  const [step, setStep] = useState(1);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    numero: '',
    mensajeBreve: '',
    tipo: '',
    operacion: '',
    habitaciones: '',
    banos: '',
    metros: '',
    antiguedad: '',
    cochera: '',
    patio: '',
    pileta: '',
    piso: '',
    estado: '',
    direccion: '',
    descripcion: '',
  });

  const [location, setLocation] = useState([-26.800137, -65.302171]);
  const debounceTimer = useRef(null);

  // Actualizar mapa según dirección usando Nominatim OpenStreetMap (geocoding gratuito)
  useEffect(() => {
    if (formData.direccion.trim().length < 5) return;

    // Debounce para no llamar muy seguido a la API
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setLoadingGeo(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.direccion + ', Tucumán, Argentina'
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setLocation([parseFloat(lat), parseFloat(lon)]);
          }
        })
        .catch(() => {
          // no hacer nada si falla
        })
        .finally(() => setLoadingGeo(false));
    }, 1000);
  }, [formData.direccion]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos en último paso (puedes agregar más validaciones si querés)
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.correo ||
      !formData.numero ||
      !formData.tipo ||
      !formData.operacion ||
      !formData.direccion
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor completa los campos obligatorios.',
      });
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xrblyoez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: '¡Solicitud enviada!',
          text: 'Nos contactaremos pronto para coordinar la tasación.',
          icon: 'success',
        });
        setFormData({
          nombre: '',
          apellido: '',
          dni: '',
          correo: '',
          numero: '',
          mensajeBreve: '',
          tipo: '',
          operacion: '',
          habitaciones: '',
          banos: '',
          metros: '',
          antiguedad: '',
          cochera: '',
          patio: '',
          pileta: '',
          piso: '',
          estado: '',
          direccion: '',
          descripcion: '',
        });
        setStep(1);
        handleCloseModal();
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un problema al enviar el formulario.',
        icon: 'error',
      });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[95vh] overflow-y-auto rounded-lg shadow-xl p-4 sm:p-6 md:p-8 relative flex flex-col">
        
        {/* Botón cerrar */}
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-700 hover:text-black text-2xl sm:text-3xl font-bold"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Tasación de Propiedad</h2>

        {/* Barra de progreso */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step === n
                  ? 'bg-black text-white'
                  : 'bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400'
              }`}
              onClick={() => setStep(n)}
              style={{ userSelect: 'none' }}
            >
              {n}
            </div>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre *" required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido *" required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="dni" type="text" value={formData.dni} onChange={handleChange} placeholder="DNI" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="Correo electrónico *" required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="numero" type="tel" value={formData.numero} onChange={handleChange} placeholder="Teléfono *" required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <textarea name="mensajeBreve" rows="3" value={formData.mensajeBreve} onChange={handleChange} placeholder="Mensaje breve (opcional)" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black sm:col-span-2" />
              <button type="button" onClick={handleNext} className="sm:col-span-2 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition">Siguiente</button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <select name="tipo" value={formData.tipo} onChange={handleChange} required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black">
                <option value="" disabled>Tipo de propiedad *</option>
                <option>Casa</option><option>Departamento</option><option>Terreno</option><option>Local comercial</option>
              </select>
              <select name="operacion" value={formData.operacion} onChange={handleChange} required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black">
                <option value="" disabled>Operación *</option>
                <option>Venta</option><option>Alquiler</option>
              </select>
              <input name="habitaciones" type="number" min={0} value={formData.habitaciones} onChange={handleChange} placeholder="Habitaciones" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="banos" type="number" min={0} value={formData.banos} onChange={handleChange} placeholder="Baños" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="metros" type="number" min={0} value={formData.metros} onChange={handleChange} placeholder="Metros cuadrados" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <input name="antiguedad" type="number" min={0} value={formData.antiguedad} onChange={handleChange} placeholder="Antigüedad (años)" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <select name="estado" value={formData.estado} onChange={handleChange} className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black">
                <option value="" disabled>Estado</option><option>Nuevo</option><option>Bueno</option><option>A refaccionar</option>
              </select>
              <input name="piso" type="number" min={0} value={formData.piso} onChange={handleChange} placeholder="Piso (si es dpto)" className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />
              <select name="cochera" value={formData.cochera} onChange={handleChange} className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black">
                <option value="" disabled>¿Tiene cochera?</option><option>Sí</option><option>No</option>
              </select>
              <select name="patio" value={formData.patio} onChange={handleChange} className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black">
                <option value="" disabled>¿Tiene patio?</option><option>Sí</option><option>No</option>
              </select>
              <select name="pileta" value={formData.pileta} onChange={handleChange} className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black">
                <option value="" disabled>¿Tiene pileta?</option><option>Sí</option><option>No</option>
              </select>

              <div className="flex justify-between col-span-full">
                <button type="button" onClick={handleBack} className="text-black underline hover:text-gray-700 font-semibold">Atrás</button>
                <button type="button" onClick={handleNext} className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition">Siguiente</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección *" required className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />

              <div className="relative w-full h-60 sm:h-72 md:h-80 rounded overflow-hidden border border-gray-300 shadow-sm">
                {loadingGeo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                    <span className="text-gray-700 font-semibold">Buscando ubicación...</span>
                  </div>
                )}
                <Map
                  defaultCenter={location}
                  center={location}
                  zoom={16}
                  height={240}
                  onClick={({ latLng }) => setLocation(latLng)}
                >
                  <Marker anchor={location} color="red" width={40} />
                </Map>
              </div>

              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción adicional" rows={4} className="p-3 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-black" />

              <div className="flex justify-between">
                <button type="button" onClick={handleBack} className="text-black underline hover:text-gray-700 font-semibold">Atrás</button>
                <button type="submit" className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition">Enviar solicitud</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModalTasacion;
