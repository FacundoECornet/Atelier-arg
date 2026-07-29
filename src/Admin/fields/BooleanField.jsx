import React from 'react'

export default function BooleanField({ field, value, onChange }) {
  const isPublished = value === true

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{field.label}</label>
      <button
        type="button"
        onClick={() => onChange(field.key, !isPublished)}
        className={`relative w-28 h-9 rounded-full transition-colors duration-200 ${
          isPublished ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-8 h-8 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center text-xs font-bold ${
            isPublished ? 'translate-x-[72px]' : 'translate-x-0'
          }`}
        >
          {isPublished ? '\u2713' : '\u2717'}
        </span>
        <span
          className={`absolute top-1/2 -translate-y-1/2 text-xs font-semibold ${
            isPublished ? 'left-3 text-white' : 'right-3 text-gray-600'
          }`}
        >
          {isPublished ? 'Publicado' : 'Borrador'}
        </span>
      </button>
    </div>
  )
}
