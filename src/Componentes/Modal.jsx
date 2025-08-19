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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);

  // =======================
  // Autocomplete direcciones
  // =======================
  useEffect(() => {
    if (formData.direccion.trim().length < 5) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Limpiar debounce previo
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setLoadingGeo(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          formData.direccion + ', Tucumán, Argentina',
        )}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSuggestions(data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        })
        .finally(() => setLoadingGeo(false));
    }, 500);
  }, [formData.direccion]);

  // ======================
  // Reverse geocode + mapa
  // ======================
  const getNearbyCoords = (lat, lon, meters) => {
    // Aproximación para mover lat/lon unos metros (1m ≈ 0.000009 grados)
    const offset = meters * 0.000009;
    return [
      [lat + offset, lon],
      [lat - offset, lon],
      [lat, lon + offset],
      [lat, lon - offset],
    ];
  };

  const reverseGeocodeWithNearby = async (lat, lon) => {
    setLoadingGeo(true);

    async function fetchReverse(lat, lon) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      );
      if (!res.ok) throw new Error('Error en fetch');
      return await res.json();
    }

    try {
      let data = await fetchReverse(lat, lon);
      if (data.address && data.address.house_number) {
        setFormData((prev) => ({ ...prev, direccion: data.display_name }));
        setLocation([lat, lon]);
        return;
      }

      const nearbyCoords = getNearbyCoords(lat, lon, 10);
      for (const [nLat, nLon] of nearbyCoords) {
        try {
          data = await fetchReverse(nLat, nLon);
          if (data.address && data.address.house_number) {
            setFormData((prev) => ({ ...prev, direccion: data.display_name }));
            setLocation([nLat, nLon]);
            return;
          }
        } catch {
          // ignoro error
        }
      }

      // Si nada con número, dejo dirección original
      if (data.display_name) {
        setFormData((prev) => ({ ...prev, direccion: data.display_name }));
        setLocation([lat, lon]);
      }
    } catch {
      // fail silently
    } finally {
      setLoadingGeo(false);
    }
  };

  // ========================
  // Eventos de input y mapa
  // ========================
  const handleMapClick = ({ latLng }) => {
    const [lat, lon] = latLng;
    reverseGeocodeWithNearby(lat, lon);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'direccion') {
      setShowSuggestions(true);
    }
  };

  // Al elegir una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      direccion: suggestion.display_name,
    }));
    setLocation([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setShowSuggestions(false);
  };

  // Manejar tecla enter en input direccion para elegir la primera sugerencia si hay
  const handleDireccionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else {
        // No hay sugerencias, mantiene el texto escrito
        setShowSuggestions(false);
      }
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // =================
  // Envío de formulario
  // =================
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Tasación de Propiedad
        </h2>

        {/* Barra de progreso */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${
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
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex-grow flex flex-col relative"
          autoComplete="off"
        >
          {/* Paso 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre *"
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
                autoComplete="given-name"
              />
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido *"
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
                autoComplete="family-name"
              />
              <input
                name="dni"
                type="text"
                value={formData.dni}
                onChange={handleChange}
                placeholder="DNI"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
                autoComplete="off"
              />
              <input
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Correo electrónico *"
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
                autoComplete="email"
              />
              <input
                name="numero"
                type="tel"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Teléfono *"
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
                autoComplete="tel"
              />
              <div className="col-span-full flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Tipo de propiedad *
                </option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Terreno</option>
                <option>Local comercial</option>
              </select>
              <select
                name="operacion"
                value={formData.operacion}
                onChange={handleChange}
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Operación *
                </option>
                <option>Venta</option>
                <option>Alquiler</option>
              </select>
              <input
                name="habitaciones"
                type="number"
                min={0}
                value={formData.habitaciones}
                onChange={handleChange}
                placeholder="Habitaciones"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              />
              <input
                name="banos"
                type="number"
                min={0}
                value={formData.banos}
                onChange={handleChange}
                placeholder="Baños"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              />
              <input
                name="metros"
                type="number"
                min={0}
                value={formData.metros}
                onChange={handleChange}
                placeholder="Metros cuadrados"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              />
              <input
                name="antiguedad"
                type="number"
                min={0}
                value={formData.antiguedad}
                onChange={handleChange}
                placeholder="Antigüedad (años)"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              />
              <div className="col-span-full flex justify-between">
                <button type="button" onClick={handleBack} className="text-black underline">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3 */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Estado
                </option>
                <option>Nuevo</option>
                <option>Bueno</option>
                <option>A refaccionar</option>
              </select>
              <input
                name="piso"
                type="number"
                min={0}
                value={formData.piso}
                onChange={handleChange}
                placeholder="Piso (si es dpto)"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              />
              <select
                name="cochera"
                value={formData.cochera}
                onChange={handleChange}
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  ¿Tiene cochera?
                </option>
                <option>Sí</option>
                <option>No</option>
              </select>
              <select
                name="patio"
                value={formData.patio}
                onChange={handleChange}
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  ¿Tiene patio?
                </option>
                <option>Sí</option>
                <option>No</option>
              </select>
              <select
                name="pileta"
                value={formData.pileta}
                onChange={handleChange}
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  ¿Tiene pileta?
                </option>
                <option>Sí</option>
                <option>No</option>
              </select>
              <div className="col-span-full flex justify-between">
                <button type="button" onClick={handleBack} className="text-black underline">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 4 */}
          {step === 4 && (
            <div className="flex flex-col gap-4 relative">
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección *"
                required
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
                onKeyDown={handleDireccionKeyDown}
                autoComplete="off"
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />

              {/* Dropdown de sugerencias */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 top-[45px] max-h-48 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
                  {suggestions.map((sug) => (
                    <li
                      key={sug.place_id}
                      onClick={() => handleSuggestionClick(sug)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSuggestionClick(sug);
                        }
                      }}
                    >
                      {sug.display_name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="relative w-full h-52 sm:h-64 md:h-72 rounded overflow-hidden border">
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
                  onClick={handleMapClick}
                >
                  <Marker anchor={location} color="red" width={40} />
                </Map>
              </div>

              <textarea
                name="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción adicional"
                className="p-3 text-sm border rounded focus:ring-2 focus:ring-black"
              />

              <div className="flex justify-between">
                <button type="button" onClick={handleBack} className="text-black underline">
                  Atrás
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
                >
                  Enviar solicitud
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModalTasacion;
