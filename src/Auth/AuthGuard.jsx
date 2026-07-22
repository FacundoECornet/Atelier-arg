import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Verificando acceso…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
