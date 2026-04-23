import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';

import Navbar from './Componentes/Header.jsx';
import Body from './Componentes/Body.jsx';
import Noticias from './Componentes/Noticias.jsx';
import Pasos from './Componentes/Pasos.jsx';
import Equipo from './Componentes/Equipo.jsx';
import PropertyList from './Componentes/propiedadesCards.jsx';
import Formulario from './Componentes/Contacto.jsx';
import Footer from './Componentes/Footer.jsx';
import PropiedadesInfo from './Propiedades/PropiedadesInfo.jsx';
import AllProperties from './Propiedades/Todaspropiedades.jsx';

const AdminLayout = lazy(() => import('./Admin/AdminLayout.jsx'));
const AdminHub = lazy(() => import('./Admin/AdminHub.jsx'));
const AdminList = lazy(() => import('./Admin/AdminList.jsx'));
const AdminForm = lazy(() => import('./Admin/AdminForm.jsx'));

import { schemas } from './Admin/schemas.js';

const AdminFallback = <div className="text-center py-20 text-gray-400">Cargando…</div>;

function Shell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

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
                <Body />
                <Equipo />
                <Pasos />
                <PropertyList />
                <Formulario />
                <Noticias />
              </div>
            }
          />

          {/* Páginas de propiedades */}
          <Route path="/propiedades/:id" element={<PropiedadesInfo />} />
          <Route path="/propiedades" element={<AllProperties />} />

          {/* Panel admin — cargado de forma lazy */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={AdminFallback}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<Suspense fallback={AdminFallback}><AdminHub /></Suspense>} />

            <Route path="propiedades" element={<Suspense fallback={AdminFallback}><AdminList schema={schemas.propiedades} /></Suspense>} />
            <Route path="propiedades/nuevo" element={<Suspense fallback={AdminFallback}><AdminForm schema={schemas.propiedades} mode="create" /></Suspense>} />
            <Route path="propiedades/:id/editar" element={<Suspense fallback={AdminFallback}><AdminForm schema={schemas.propiedades} mode="edit" /></Suspense>} />

            <Route path="noticias" element={<Suspense fallback={AdminFallback}><AdminList schema={schemas.noticias} /></Suspense>} />
            <Route path="noticias/nuevo" element={<Suspense fallback={AdminFallback}><AdminForm schema={schemas.noticias} mode="create" /></Suspense>} />
            <Route path="noticias/:id/editar" element={<Suspense fallback={AdminFallback}><AdminForm schema={schemas.noticias} mode="edit" /></Suspense>} />

            <Route path="nosotros" element={<Suspense fallback={AdminFallback}><AdminList schema={schemas.nosotros} /></Suspense>} />
            <Route path="nosotros/nuevo" element={<Suspense fallback={AdminFallback}><AdminForm schema={schemas.nosotros} mode="create" /></Suspense>} />
            <Route path="nosotros/:id/editar" element={<Suspense fallback={AdminFallback}><AdminForm schema={schemas.nosotros} mode="edit" /></Suspense>} />
          </Route>
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}

export default App;
