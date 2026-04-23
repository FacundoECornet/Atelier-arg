import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getOne, create, update } from './firestoreApi';
import TextField from './fields/TextField';
import TextAreaField from './fields/TextAreaField';
import ArrayUrlField from './fields/ArrayUrlField';

function buildEmpty(fields) {
  return fields.reduce((acc, f) => {
    acc[f.key] = f.type === 'arrayUrl' ? [] : '';
    return acc;
  }, {});
}

export default function AdminForm({ schema, mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(buildEmpty(schema.fields));
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getOne(schema.collection, id)
      .then((doc) => {
        const filled = buildEmpty(schema.fields);
        schema.fields.forEach((f) => {
          if (doc[f.key] !== undefined) filled[f.key] = doc[f.key];
        });
        setFormData(filled);
      })
      .catch(() => {
        Swal.fire({ title: 'Error al cargar el documento', icon: 'error' });
        navigate(schema.basePath);
      })
      .finally(() => setLoading(false));
  }, [id, schema.collection]);

  function handleChange(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData };
    schema.fields.forEach((f) => {
      if (f.type !== 'arrayUrl' && typeof payload[f.key] === 'string') {
        payload[f.key] = payload[f.key].trim();
      }
      if (f.type === 'arrayUrl') {
        payload[f.key] = (payload[f.key] || []).map((u) => u.trim()).filter(Boolean);
      }
    });

    try {
      if (isEdit) {
        await update(schema.collection, id, payload);
      } else {
        await create(schema.collection, payload);
      }
      Swal.fire({
        title: isEdit ? 'Guardado' : 'Creado',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(schema.basePath);
    } catch {
      Swal.fire({ title: 'Error al guardar', icon: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Cargando…</div>;
  }

  const primaryField = schema.listColumns[0];
  const title = isEdit
    ? `Editar — ${formData[primaryField] || id}`
    : `Nuevo en ${schema.label}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={schema.basePath}
          className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
        >
          ← {schema.label}
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5">
        {schema.fields.map((field) => {
          const props = { field, value: formData[field.key], onChange: handleChange };
          if (field.type === 'textarea') return <TextAreaField key={field.key} {...props} />;
          if (field.type === 'arrayUrl') return <ArrayUrlField key={field.key} {...props} />;
          return <TextField key={field.key} {...props} />;
        })}

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white rounded-xl px-6 py-2.5 font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <Link
            to={schema.basePath}
            className="border border-gray-300 text-gray-700 rounded-xl px-6 py-2.5 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
