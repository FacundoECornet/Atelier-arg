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

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      direccion: suggestion.display_name,
    }));
    setLocation([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setShowSuggestions(false);
  };

  const handleDireccionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else {
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

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Información Personal';
      case 2:
        return 'Características de la Propiedad';
      case 3:
        return 'Detalles Adicionales';
      case 4:
        return 'Ubicación y Descripción';
      default:
        return '';
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl relative flex flex-col">
        {/* Header del modal */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 sm:p-8">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            aria-label="Cerrar modal"
          >
            ×
          </button>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-2">
              Valoración de Propiedad
            </h2>
            <p className="text-sm sm:text-base text-gray-300 font-light">
              Evaluamos todo el potencial de su propiedad
            </p>
          </div>
        </div>

        {/* Barra de progreso moderna */}
        <div className="px-6 sm:px-8 py-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Paso {step} de 4</span>
            <span className="text-sm font-medium text-gray-900">{getStepTitle()}</span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    step === n
                      ? 'bg-black text-white shadow-lg scale-110'
                      : step > n
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  onClick={() => setStep(n)}
                >
                  {step > n ? '✓' : n}
                </div>
                {n < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step > n ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" autoComplete="off">
            {/* Paso 1 - Información Personal */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese su nombre"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Ingrese su apellido"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                      autoComplete="family-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                    <input
                      name="dni"
                      type="text"
                      value={formData.dni}
                      onChange={handleChange}
                      placeholder="Número de documento"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="numero"
                      type="tel"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="Número de contacto"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2 - Características de la Propiedad */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de propiedad <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="" disabled>
                        Seleccione una opción
                      </option>
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Terreno</option>
                      <option>Local comercial</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Operación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="operacion"
                      value={formData.operacion}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="" disabled>
                        Seleccione una opción
                      </option>
                      <option>Venta</option>
                      <option>Alquiler</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Habitaciones</label>
                    <input
                      name="habitaciones"
                      type="number"
                      min={0}
                      value={formData.habitaciones}
                      onChange={handleChange}
                      placeholder="Cantidad"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Baños</label>
                    <input
                      name="banos"
                      type="number"
                      min={0}
                      value={formData.banos}
                      onChange={handleChange}
                      placeholder="Cantidad"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Metros cuadrados
                    </label>
                    <input
                      name="metros"
                      type="number"
                      min={0}
                      value={formData.metros}
                      onChange={handleChange}
                      placeholder="m²"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Antigüedad</label>
                    <input
                      name="antiguedad"
                      type="number"
                      min={0}
                      value={formData.antiguedad}
                      onChange={handleChange}
                      placeholder="Años"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3 - Detalles Adicionales */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="" disabled>
                        Seleccione una opción
                      </option>
                      <option>Nuevo</option>
                      <option>Bueno</option>
                      <option>A refaccionar</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Piso</label>
                    <input
                      name="piso"
                      type="number"
                      min={0}
                      value={formData.piso}
                      onChange={handleChange}
                      placeholder="Solo si es departamento"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Cochera</label>
                    <select
                      name="cochera"
                      value={formData.cochera}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="" disabled>
                        ¿Tiene cochera?
                      </option>
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Patio</label>
                    <select
                      name="patio"
                      value={formData.patio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="" disabled>
                        ¿Tiene patio?
                      </option>
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Pileta</label>
                    <select
                      name="pileta"
                      value={formData.pileta}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="" disabled>
                        ¿Tiene pileta?
                      </option>
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 4 - Ubicación y Descripción */}
            {step === 4 && (
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Ingrese la dirección de la propiedad"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    onKeyDown={handleDireccionKeyDown}
                    autoComplete="off"
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                  />

                  {/* Dropdown de sugerencias */}
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 top-[75px] max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl">
                      {suggestions.map((sug) => (
                        <li
                          key={sug.place_id}
                          onClick={() => handleSuggestionClick(sug)}
                          className="cursor-pointer px-4 py-3 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
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
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ubicación en el mapa
                  </label>
                  <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-200">
                    {loadingGeo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Buscando ubicación...</span>
                        </div>
                      </div>
                    )}
                    <Map
                      defaultCenter={location}
                      center={location}
                      zoom={16}
                      height={320}
                      onClick={handleMapClick}
                    >
                      <Marker anchor={location} color="#dc2626" width={40} />
                    </Map>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción adicional
                  </label>
                  <textarea
                    name="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Agregue cualquier información adicional sobre la propiedad..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm resize-none"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer con botones */}
        <div className="border-t bg-gray-50 px-6 sm:px-8 py-6">
          <div className="flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
              >
                ← Atrás
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-black hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition-colors text-sm shadow-lg"
              >
                Continuar →
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-black hover:bg-black text-white px-10 py-3 rounded-lg font-semibold transition-colors text-sm shadow-lg"
              >
                Enviar solicitud
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTasacion;
