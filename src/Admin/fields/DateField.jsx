import React from 'react'

export default function DateField({ field, value, onChange }) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        value={value || today}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
      />
    </div>
  )
}
