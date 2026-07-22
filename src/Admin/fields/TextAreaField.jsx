import React from 'react'

export default function TextAreaField({ field, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        rows={5}
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        required={field.required}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm resize-y"
      />
    </div>
  )
}
