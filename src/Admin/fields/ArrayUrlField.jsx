import React from 'react';
import { hideImgOnError } from '../../utils/imgFallback';

export default function ArrayUrlField({ field, value = [], onChange }) {
  const urls = Array.isArray(value) ? value : [];

  function set(idx, val) {
    const next = [...urls];
    next[idx] = val;
    onChange(field.key, next);
  }

  function add() {
    onChange(field.key, [...urls, '']);
  }

  function remove(idx) {
    onChange(field.key, urls.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{field.label}</label>
      {urls.map((url, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            value={url}
            onChange={(e) => set(idx, e.target.value)}
            placeholder="https://..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          {url && (
            <img
              src={url}
              alt=""
              className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
              onError={hideImgOnError}
            />
          )}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="text-red-500 hover:text-red-700 font-bold px-2 shrink-0"
            title="Quitar"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start mt-1 border border-gray-400 text-gray-700 rounded-lg px-3 py-1 text-sm hover:bg-gray-100 transition-colors"
      >
        + Agregar URL
      </button>
    </div>
  );
}
