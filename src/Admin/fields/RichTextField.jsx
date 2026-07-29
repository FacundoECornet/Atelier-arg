import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote'],
    ['clean'],
  ],
}

export default function RichTextField({ field, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={value || ''}
        onChange={(val) => onChange(field.key, val)}
        className="bg-white rounded-lg [&_.ql-editor]:min-h-[200px] [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg"
      />
    </div>
  )
}
