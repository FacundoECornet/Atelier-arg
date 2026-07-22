import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { listAll, listAllOrdered, remove } from './firestoreApi'
import { hideImgOnError } from '../utils/imgFallback'

const tucumanLocalidades = [
  'san miguel de tucuman',
  'tucumán',
  'yerba buena',
  'concepción',
  'santa ana',
  'tafi viejo',
]

const buenosAiresLocalidades = [
  'buenos aires',
  'la plata',
  'mar del plata',
  'quilmes',
  'lomas de zamora',
  'belgrano',
  'palermo',
  'recoleta',
  'caballito',
  'san isidro',
  'avellaneda',
  'lanús',
  'morón',
  'san justo',
  'haedo',
  'castelar',
  'merlo',
  'temperley',
  'burzaco',
  'adrogue',
  'banfield',
  'olivos',
  'vicente lopez',
  'tigre',
  'san fernando',
  'pilar',
  'escobar',
  'zarate',
  'campana',
  'lujan',
  'carmen de areco',
  'saladillo',
  'chivilcoy',
  'velez sarsfield',
  'flores',
  'parque patricios',
  'villa crespo',
  'boedo',
  'almagro',
  'villa urquiza',
  'nuñez',
  'palermo hollywood',
  'palermo viejo',
  'retiro',
  'constitución',
  'san telmo',
  'monserrat',
  'barracas',
]

function getProvince(ubicacion) {
  if (!ubicacion) return 'Otra'
  const lower = ubicacion.toLowerCase()
  if (tucumanLocalidades.some((loc) => lower.includes(loc))) return 'Tucumán'
  if (buenosAiresLocalidades.some((loc) => lower.includes(loc))) return 'Buenos Aires'
  return 'Otra'
}

export default function AdminList({ schema }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProvince, setSelectedProvince] = useState(null)

  const isPropiedades = schema.collection === 'propiedades'

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = schema.sortable
        ? await listAllOrdered(schema.collection, 'orden', 'desc')
        : await listAll(schema.collection)
      setItems(data)
    } catch {
      setError('Error al cargar los datos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [schema.collection])

  async function handleDelete(id, label) {
    const result = await Swal.fire({
      title: '¿Eliminar?',
      text: `Se eliminará "${label}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (!result.isConfirmed) return
    try {
      await remove(schema.collection, id)
      setItems((prev) => prev.filter((it) => it.id !== id))
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false })
    } catch {
      Swal.fire({ title: 'Error al eliminar', icon: 'error' })
    }
  }

  const primaryField = schema.listColumns[0]

  const provinces = isPropiedades ? ['Tucumán', 'Buenos Aires', 'Otra'] : []

  const visibleItems =
    isPropiedades && selectedProvince
      ? items.filter((i) => getProvince(i.ubicacion) === selectedProvince)
      : items

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{schema.label}</h1>
          <p className="text-sm text-gray-500">
            {visibleItems.length} {visibleItems.length === 1 ? 'registro' : 'registros'}
            {isPropiedades && selectedProvince && ` en ${selectedProvince}`}
          </p>
        </div>
        <Link
          to={`${schema.basePath}/nuevo`}
          className="bg-black text-white rounded-xl px-5 py-2 font-semibold hover:opacity-80 transition-opacity"
        >
          + Nuevo
        </Link>
      </div>

      {isPropiedades && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setSelectedProvince(null)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-colors ${
              selectedProvince === null
                ? 'bg-black text-white border-black'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          {provinces.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvince(p)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-colors ${
                selectedProvince === p
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="text-center py-16 text-gray-400">Cargando…</div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4">
          {error}
          <button onClick={load} className="ml-4 underline text-sm">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No hay registros.{' '}
          {!selectedProvince && (
            <Link to={`${schema.basePath}/nuevo`} className="underline">
              Crear el primero.
            </Link>
          )}
        </div>
      )}

      {!loading && visibleItems.length > 0 && (
        <div className="flex flex-col gap-3">
          {visibleItems.map((item) => {
            const label = item[primaryField] || item.id
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {item.img && (
                    <img
                      src={item.img}
                      alt=""
                      className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0"
                      onError={hideImgOnError}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {label || '(sin título)'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {schema.listColumns
                        .slice(1)
                        .map((col) => item[col])
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`${schema.basePath}/${item.id}/editar`)}
                    className="border border-gray-300 text-gray-700 rounded-xl px-4 py-1.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, label)}
                    className="bg-red-600 text-white rounded-xl px-4 py-1.5 text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
