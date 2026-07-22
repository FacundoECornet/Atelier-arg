import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import './App.css'

import Navbar from './Componentes/Header.jsx'
import Body from './Componentes/Body.jsx'
import Noticias from './Componentes/Noticias.jsx'
import Pasos from './Componentes/Pasos.jsx'
import Equipo from './Componentes/Equipo.jsx'
import PropertyList from './Componentes/propiedadesCards.jsx'
import Formulario from './Componentes/Contacto.jsx'
import Footer from './Componentes/Footer.jsx'
import ErrorBoundary from './Componentes/ErrorBoundary.jsx'
import PropiedadesInfo from './Propiedades/PropiedadesInfo.jsx'
import AllProperties from './Propiedades/Todaspropiedades.jsx'

const AdminLayout = lazy(() => import('./Admin/AdminLayout.jsx'))
const AdminHub = lazy(() => import('./Admin/AdminHub.jsx'))
const AdminList = lazy(() => import('./Admin/AdminList.jsx'))
const AdminForm = lazy(() => import('./Admin/AdminForm.jsx'))

import AuthGuard from './Auth/AuthGuard'
import LoginPage from './Auth/LoginPage'
import { AuthProvider } from './Auth/AuthContext'
import { schemas } from './Admin/schemas.js'

const AdminFallback = <div className="text-center py-20 text-gray-400">Cargando…</div>

function Shell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isAdmin = pathname.startsWith('/admin') || pathname === '/login'

  // Redirigir fragmentos hash antiguos (/#/ruta → /ruta)
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.startsWith('#/')) {
      const clean = hash.replace(/^#/, '')
      navigate(clean, { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Página principal */}
          <Route
            path="/"
            element={
              <div className="flex flex-col">
                <ErrorBoundary section="Inicio">
                  <Body />
                </ErrorBoundary>
                <ErrorBoundary section="Equipo">
                  <Equipo />
                </ErrorBoundary>
                <Pasos />
                <ErrorBoundary section="Propiedades">
                  <PropertyList />
                </ErrorBoundary>
                <Formulario />
                <Noticias />
              </div>
            }
          />

          {/* Páginas de propiedades */}
          <Route
            path="/propiedades/:id"
            element={
              <ErrorBoundary section="Propiedades">
                <PropiedadesInfo />
              </ErrorBoundary>
            }
          />
          <Route
            path="/propiedades"
            element={
              <ErrorBoundary section="Propiedades">
                <AllProperties />
              </ErrorBoundary>
            }
          />

          {/* Login — sin Navbar ni Footer */}
          <Route path="/login" element={<LoginPage />} />

          {/* Panel admin — cargado de forma lazy */}
          <Route
            path="/admin"
            element={
              <ErrorBoundary section="Administración">
                <AuthGuard>
                  <Suspense fallback={AdminFallback}>
                    <AdminLayout />
                  </Suspense>
                </AuthGuard>
              </ErrorBoundary>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminHub />
                </Suspense>
              }
            />

            <Route
              path="propiedades"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminList schema={schemas.propiedades} />
                </Suspense>
              }
            />
            <Route
              path="propiedades/nuevo"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminForm schema={schemas.propiedades} mode="create" />
                </Suspense>
              }
            />
            <Route
              path="propiedades/:id/editar"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminForm schema={schemas.propiedades} mode="edit" />
                </Suspense>
              }
            />

            <Route
              path="noticias"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminList schema={schemas.noticias} />
                </Suspense>
              }
            />
            <Route
              path="noticias/nuevo"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminForm schema={schemas.noticias} mode="create" />
                </Suspense>
              }
            />
            <Route
              path="noticias/:id/editar"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminForm schema={schemas.noticias} mode="edit" />
                </Suspense>
              }
            />

            <Route
              path="nosotros"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminList schema={schemas.nosotros} />
                </Suspense>
              }
            />
            <Route
              path="nosotros/nuevo"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminForm schema={schemas.nosotros} mode="create" />
                </Suspense>
              }
            />
            <Route
              path="nosotros/:id/editar"
              element={
                <Suspense fallback={AdminFallback}>
                  <AdminForm schema={schemas.nosotros} mode="edit" />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </Router>
  )
}

export default App
