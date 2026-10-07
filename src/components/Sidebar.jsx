import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// ─── Iconos (react-icons) ───
import {
  FaCar,
  FaSignOutAlt,
  FaListUl,
  FaShieldAlt,
  FaClipboardCheck,
  FaIdCard,
  FaThumbtack,
  FaTools,
} from 'react-icons/fa';

function Sidebar({ activeTab = 'reservar', onNavigate, usuario }) {
  const navigate = useNavigate();
  const { logout } = useUser();

  // Estado de expansión por hover
  const [hovered, setHovered] = useState(false);
  // Estado opcional de "pin" para dejarlo fijo abierto
  const [pinned, setPinned] = useState(false);

  const isOpen = hovered || pinned;

  // Navegación lateral (incluye opción "Licencia" y "Mantenimiento")
  const tabs = [
    { id: 'reservar', label: 'Reservar', icon: FaCar },
    { id: 'solicitudes', label: 'Solicitudes', icon: FaListUl },
    { id: 'aprobacion', label: 'Aprobación', icon: FaShieldAlt },
    { id: 'caseta', label: 'Caseta', icon: FaClipboardCheck },
    { id: 'licencia', label: 'Licencia', icon: FaIdCard },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: FaTools },
  ];

  const handleLogout = () => {
    logout();
    navigate('/AutoHub', { replace: true });
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`hidden h-full shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out lg:flex ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-neutral-200 py-6 transition-all duration-300 ${
          isOpen ? 'gap-3 px-6' : 'justify-center px-3'
        }`}
      >
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-red-700 shadow-lg shadow-red-600/20">
          <FaCar className="h-6 w-6 text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        <div
          className={`min-w-0 overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-w-50 opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          <p className="whitespace-nowrap text-sm font-black tracking-tight text-neutral-900">
            AUTOS <span className="text-red-600">UTILITARIOS</span>
          </p>
          <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Fleet Control
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-6">
        <p
          className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Menú
        </p>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate?.(tab.id)}
              title={!isOpen ? tab.label : undefined}
              className={`group flex w-full items-center rounded-xl text-sm font-semibold transition ${
                isOpen ? 'gap-3 px-3 py-3' : 'justify-center px-2 py-3'
              } ${
                isActive
                  ? 'bg-linear-to-r from-red-50 to-transparent text-neutral-900 ring-1 ring-red-200'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <span
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                }`}
              >
                <Icon className="h-4 w-4" />

                {/* Badge licencia vigente cuando está colapsado */}
                {tab.id === 'licencia' && usuario?.vigente && !isOpen && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                )}

                {/* Punto activo cuando está colapsado */}
                {isActive && !isOpen && (
                  <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                )}
              </span>

              <span
                className={`flex-1 overflow-hidden whitespace-nowrap text-left transition-all duration-300 ${
                  isOpen ? 'max-w-50 opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {tab.label}
              </span>

              {/* Badge licencia vigente cuando está expandido */}
              {isOpen && tab.id === 'licencia' && usuario?.vigente && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              )}

              {isOpen && isActive && tab.id !== 'licencia' && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Usuario + Logout */}
      <div className="border-t border-neutral-200 p-3">
        <div
          className={`flex items-center rounded-2xl border border-neutral-200 bg-neutral-50 transition-all duration-300 ${
            isOpen ? 'gap-3 p-3' : 'justify-center p-2'
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-neutral-700 to-neutral-800 text-sm font-black text-white ring-1 ring-neutral-300">
            {usuario?.iniciales}
          </div>

          <div
            className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
              isOpen ? 'max-w-50 opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            <p className="truncate text-xs font-bold text-neutral-900">
              {usuario}
            </p>
            <p className="truncate text-[10px] text-neutral-500">
              EMP-{usuario?.empleado}
            </p>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-red-600 hover:text-white ${
              isOpen ? '' : 'hidden'
            }`}
          >
            <FaSignOutAlt className="h-4 w-4" />
          </button>
        </div>

        {/* Botón de pin (solo visible cuando está abierto) */}
        {isOpen && (
          <button
            onClick={() => setPinned((v) => !v)}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
              pinned
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FaThumbtack
              className={`h-3 w-3 transition-transform ${
                pinned ? 'rotate-0' : 'rotate-45'
              }`}
            />
            {pinned ? 'Desanclar' : 'Anclar menú'}
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar