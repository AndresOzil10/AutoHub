import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import Solicitudes from './Solicitudes';
import Aprobacion from './Aprobacion';
import Licencia from './Licencia';
import Reservar from './Reservar';
import Caseta from './Caseta';
import Mantenimiento from './Mantenimiento';

// ─── Iconos (react-icons) ───
import {
  FaCar,
  FaSignOutAlt,
  FaListUl,
  FaShieldAlt,
  FaClipboardCheck,
  FaIdCard,
  FaLock,
  FaTools,
} from 'react-icons/fa';

// ─── Mapa de iconos para los tabs ───
const TABS_ICONS = {
  reservar: FaCar,
  solicitudes: FaListUl,
  aprobacion: FaShieldAlt,
  caseta: FaClipboardCheck,
  licencia: FaIdCard,
  mantenimiento: FaTools,
};

// ─── Encabezados dinámicos por tab ───
const TABS_HEADERS = {
  reservar: {
    title: 'Nueva Reservación',
    subtitle: 'Completa los datos para enviar tu solicitud',
  },
  solicitudes: {
    title: 'Mis Solicitudes',
    subtitle: 'Consulta y gestiona tus reservaciones',
  },
  aprobacion: {
    title: 'Aprobación',
    subtitle: 'Revisa y aprueba solicitudes pendientes',
  },
  caseta: {
    title: 'Caseta',
    subtitle: 'Control de accesos y salidas',
  },
  licencia: {
    title: 'Mi Licencia',
    subtitle: 'Consulta el estado de tu licencia de conducir',
  },
  mantenimiento: {
    title: 'Mantenimiento',
    subtitle: 'Gestiona unidades fuera de servicio',
  },
};

// ─── Flota inicial (fuera del componente para evitar re-creación) ───
const FLOTA_INICIAL = [
  {
    id: 'dolphin',
    categoria: 'Eléctrico',
    categoriaColor: 'text-emerald-600',
    modelo: 'BYD Dolphin',
    placas: 'PLK-992-A',
    estado: 'Disponible',
    estadoColor: 'text-emerald-600',
    imagen:
      'https://images.unsplash.com/photo-1617704548623-340376564e68?w=400&q=80',
    disponible: true,
  },
  {
    id: 'transporter',
    categoria: 'Carga Pesada',
    categoriaColor: 'text-sky-600',
    modelo: 'Transporter',
    placas: 'XT-4819-B',
    estado: 'Disponible',
    estadoColor: 'text-emerald-600',
    imagen:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=80',
    disponible: true,
  },
  {
    id: 'jetta',
    categoria: 'Ejecutivo',
    categoriaColor: 'text-violet-600',
    modelo: 'Jetta Sedán',
    placas: 'UAB-120-C',
    estado: 'Disponible',
    estadoColor: 'text-emerald-600',
    imagen:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80',
    disponible: true,
  },
  {
    id: 'taigun',
    categoria: 'Mantenimiento Prox.',
    categoriaColor: 'text-amber-600',
    modelo: 'Taigún SUV',
    placas: 'PWC-772-L',
    estado: 'Revisión',
    estadoColor: 'text-amber-600',
    imagen:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80',
    disponible: false,
  },
];

function Home() {
  const navigate = useNavigate();
  const { user, logout, nn } = useUser();

  // Estados del formulario (compartidos con <Reservar />)
  const [pasajeros, setPasajeros] = useState(0);
  const [motivo, setMotivo] = useState('personal');
  const [destinoTipo, setDestinoTipo] = useState('foraneo');
  const [transportaCarga, setTransportaCarga] = useState(true);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('dolphin');

  // Flota como estado (para reflejar cambios de mantenimiento)
  const [flotaState, setFlotaState] = useState(FLOTA_INICIAL);

  // Tab activo (móvil nav + sidebar desktop)
  const [activeTab, setActiveTab] = useState('reservar');

  // Manejar cambio de estado desde <Mantenimiento />
  const handleCambiarEstado = (unidadId, nuevoEstado) => {
    setFlotaState((prev) =>
      prev.map((u) => {
        if (u.id !== unidadId) return u;

        if (nuevoEstado === 'mantenimiento') {
          return {
            ...u,
            categoriaOriginal: u.categoria,
            categoriaColorOriginal: u.categoriaColor,
            estado: 'Mantenimiento',
            estadoColor: 'text-red-600',
            disponible: false,
            categoria: 'En Mantenimiento',
            categoriaColor: 'text-red-600',
          };
        }

        if (nuevoEstado === 'disponible') {
          return {
            ...u,
            estado: 'Disponible',
            estadoColor: 'text-emerald-600',
            disponible: true,
            categoria: u.categoriaOriginal || 'Eléctrico',
            categoriaColor: u.categoriaColorOriginal || 'text-emerald-600',
          };
        }

        return u;
      })
    );
  };

  // Unidad activa para el resumen lateral
  const unidadActiva =
    flotaState.find((u) => u.id === unidadSeleccionada) || flotaState[0];

  // Navegación móvil
  const tabs = [
    { id: 'reservar', label: 'Reservar' },
    { id: 'solicitudes', label: 'Solicitudes' },
    { id: 'aprobacion', label: 'Aprobación' },
    { id: 'caseta', label: 'Caseta' },
    { id: 'licencia', label: 'Licencia' },
    { id: 'mantenimiento', label: 'Mantto.' },
  ];

  const headerInfo = TABS_HEADERS[activeTab] || TABS_HEADERS.reservar;

  return (
    <div className="h-screen overflow-hidden bg-white font-sans text-neutral-900 antialiased">
      {/* Fondo decorativo (muy sutil sobre blanco) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-128 w-lg rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-112 w-md rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col lg:flex-row">
        <Sidebar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          usuario={user}
        />

        {/* ═══════════════════════════════════════════════════════════
            COLUMNA PRINCIPAL
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Header móvil + top bar */}
          <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-3.5 lg:px-8">
              {/* Logo solo móvil */}
              <div className="flex items-center gap-3 lg:hidden">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-red-700 shadow-lg shadow-red-600/20">
                  <FaCar className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-tight text-neutral-900">
                    AUTOS <span className="text-red-600">UTILITARIOS</span>
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    {headerInfo.title}
                  </p>
                </div>
              </div>

              {/* Título desktop dinámico */}
              <div className="hidden lg:block">
                <h1 className="text-lg font-black tracking-tight text-neutral-900">
                  {headerInfo.title}
                </h1>
                <p className="text-xs text-neutral-500">
                  {headerInfo.subtitle}
                </p>
              </div>

              {/* Acciones derecha */}
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {user?.vigente ? 'Licencia Vigente' : 'Licencia Vencida'}
                </span>

                {/* Logout móvil */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/AutoHub', { replace: true });
                  }}
                  aria-label="Cerrar sesión"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-red-300 hover:bg-red-600 hover:text-white lg:hidden"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Contenido scrollable — dinámico según activeTab */}
          <main className="flex-1 overflow-y-auto bg-neutral-50 px-4 pb-28 pt-4 lg:px-8 lg:pb-8 lg:pt-6">
            {activeTab === 'reservar' && (
              <Reservar
                flota={flotaState}
                pasajeros={pasajeros}
                setPasajeros={setPasajeros}
                motivo={motivo}
                setMotivo={setMotivo}
                destinoTipo={destinoTipo}
                setDestinoTipo={setDestinoTipo}
                transportaCarga={transportaCarga}
                setTransportaCarga={setTransportaCarga}
                unidadSeleccionada={unidadSeleccionada}
                setUnidadSeleccionada={setUnidadSeleccionada}
                unidadActiva={unidadActiva}
                user={user}
                nomina={nn}
              />
            )}
            {activeTab === 'solicitudes' && <Solicitudes />}
            {activeTab === 'aprobacion' && <Aprobacion />}
            {activeTab === 'licencia' && <Licencia />}
            {activeTab === 'caseta' && <Caseta />}
            {activeTab === 'mantenimiento' && (
              <Mantenimiento
                flota={flotaState}
                onCambiarEstado={handleCambiarEstado}
              />
            )}
          </main>

          {/* Footer desktop (fijo abajo, fuera del scroll) */}
          <footer className="hidden border-t border-neutral-200 bg-white px-8 py-4 lg:block">
            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span>© 2026 AutoHub · Kayser Automotive Systems</span>
              <span className="flex items-center gap-1.5">
                <FaLock className="h-3 w-3" />
                Validación y trazabilidad encriptada
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          NAVEGACIÓN INFERIOR (solo móvil)
      ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200 bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-1 py-1.5">
          {tabs.map((tab) => {
            const Icon = TABS_ICONS[tab.id];
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 transition-all duration-200 ${
                  isActive
                    ? 'text-red-600'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1.5 h-1 w-6 rounded-full bg-linear-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30" />
                )}
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Home;