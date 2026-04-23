import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { listAll, remove } from './firestoreApi';
import { hideImgOnError } from '../utils/imgFallback';

export default function AdminList({ schema }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await listAll(schema.collection));
    } catch {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [schema.collection]);

  async function handleDelete(id, label) {
    const result = await Swal.fire({
      title: '¿Eliminar?',
      text: `Se eliminará "${label}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    try {
      await remove(schema.collection, id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ title: 'Error al eliminar', icon: 'error' });
    }
  }

  const primaryField = schema.listColumns[0];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{schema.label}</h1>
          <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'registro' : 'registros'}</p>
        </div>
        <Link
          to={`${schema.basePath}/nuevo`}
          className="bg-black text-white rounded-xl px-5 py-2 font-semibold hover:opacity-80 transition-opacity"
        >
          + Nuevo
        </Link>
      </div>

      {loading && (
        <div className="text-center py-16 text-gray-400">Cargando…</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4">
          {error}
          <button onClick={load} className="ml-4 underline text-sm">Reintentar</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No hay registros. <Link to={`${schema.basePath}/nuevo`} className="underline">Crear el primero.</Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const label = item[primaryField] || item.id;
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
                    <p className="font-semibold text-gray-900 truncate">{label || '(sin título)'}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {schema.listColumns.slice(1).map((col) => item[col]).filter(Boolean).join(' · ')}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
