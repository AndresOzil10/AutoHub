import React, { useState } from 'react';
import {
  FaExclamationTriangle,
  FaClipboardList,
  FaLock,
  FaCheckCircle,
  FaFileAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCar,
  FaSyncAlt,
  FaShieldAlt,
  FaLeaf,
  FaFileContract,
  FaExchangeAlt,
  FaHistory,
  FaUserTie,
  FaTools,
  FaCog,
  FaArrowRight,
  FaTimes,
} from 'react-icons/fa';

/**
 * Pantalla de Aprobación (Admin N2).
 * Muestra una solicitud pendiente de validación y despacho,
 * permitiendo reasignar unidad y autorizar el envío a Dirección.
 */
function Aprobacion() {
  const [tabActivo, setTabActivo] = useState('admin');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('taigun');

  // Datos mock de la solicitud a aprobar
  const solicitud = {
    id: 'REQ-8821',
    etapa: 2,
    totalEtapas: 4,
    titulo: 'Validación de Unidad y Despacho',
    descripcion:
      '1 solicitud en espera de asignación y validación técnica inmediata.',
    solicitante: {
      nombre: 'Ing. Carlos Mendoza',
      area: 'Dpto. Control de Calidad & Procesos',
      licenciaNombre: 'Licencia_Mendoza_2026.pdf',
      licencia: 'Lic. Chofer A',
    },
    periodo: {
      rango: '24 Oct – 26 Oct',
      duracion: '3 días de comisión',
    },
    destino: {
      lugar: 'Querétaro',
      detalle: 'Parque Ind. Bernardo Q.',
    },
    unidadOriginal: {
      modelo: 'Jetta Trendline (Original)',
      nota: 'En taller: Cambio preventivo de frenos',
      estado: 'Bloqueado',
    },
    unidadSugerida: {
      id: 'taigun',
      nombre: 'Taigún SUV 2024 (Placas TYG-112-L)',
      placas: 'TYG-112-L',
      spec: 'EcoBoost 1.0 TSI',
      disponibilidad: 'Lista en Bahía B',
      seguros: [
        { label: 'Seguro GNP', valor: 'Vence Abr 2025', icon: FaShieldAlt },
        { label: 'Holograma 00', valor: 'Vigente 2025', icon: FaLeaf },
        { label: 'Tenencia OK', valor: 'Refrendo Pagado', icon: FaFileContract },
      ],
    },
    historial: [
      {
        autor: 'Gte. Raúl Morales (Calidad)',
        tiempo: 'Ayer, 16:40',
        cita:
          '"Autorizado por vía de auditoría urgente a proveedor de estampados en Querétaro."',
        accion: 'APROBACIÓN N1 FIRMADA',
      },
    ],
    dictamen: {
      area: 'Dictamen Técnico de Flota (N2)',
      nota: 'Quedará registrado en bitácora',
      texto:
        'Admin Flota: Unidad Jetta original en servicio preventivo; se reasigna Taigún SUV 2024 en óptimas condiciones mecánicas y con tanque lleno.',
    },
  };

  // Unidades disponibles para reasignar
  const unidadesDisponibles = [
    {
      id: 'taigun',
      label: 'Taigún SUV 2024 (Placas TYG-112-L)',
    },
    {
      id: 'dolphin',
      label: 'BYD Dolphin 2024 (Placas PLK-992-A)',
    },
    {
      id: 'jetta',
      label: 'Jetta Sedán 2024 (Placas UAB-120-C)',
    },
  ];

  const etapas = [
    { id: 'gerente', label: 'Gerente N1' },
    { id: 'admin', label: 'Admin N2' },
    { id: 'director', label: 'Director N3' },
  ];

  return (
    <div className="space-y-5">
      {/* ─── Tabs de etapas (Gerente / Admin / Director) ─── */}
      <div className="flex items-center justify-around rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-lg shadow-neutral-200/60">
        {etapas.map((etapa) => {
          const isActive = tabActivo === etapa.id;
          return (
            <button
              key={etapa.id}
              onClick={() => setTabActivo(etapa.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-md ring-1 ring-neutral-200'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {etapa.id === 'admin' && (
                <span className="h-2 w-2 rounded-full bg-red-500" />
              )}
              {etapa.label}
            </button>
          );
        })}
      </div>

      {/* ─── Card de etapa activa ─── */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
            <FaExclamationTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-600">
                Etapa Nivel {solicitud.etapa}
              </p>
              <p className="text-[10px] font-bold text-neutral-500">
                ID #{solicitud.id}
              </p>
            </div>
            <h2 className="mt-1 text-base font-black leading-tight tracking-tight text-neutral-900">
              {solicitud.titulo}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {solicitud.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Ficha de Solicitud ─── */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaClipboardList className="h-4 w-4 text-neutral-700" />
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-neutral-900">
              Ficha de Solicitud
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <FaLock className="h-3 w-3" />
            Solo lectura
          </div>
        </div>

        {/* Solicitante */}
        <div className="mb-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-neutral-900">
                {solicitud.solicitante.nombre}
              </p>
              <p className="mt-0.5 text-[11px] text-neutral-500">
                {solicitud.solicitante.area}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-600">
                <FaFileAlt className="h-3 w-3" />
                <span className="truncate">
                  {solicitud.solicitante.licenciaNombre}
                </span>
              </div>
              <button className="mt-1 text-[10px] font-black uppercase tracking-wider text-red-600 hover:underline">
                Ver adjunto
              </button>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              <FaCheckCircle className="h-3 w-3" />
              {solicitud.solicitante.licencia}
            </span>
          </div>
        </div>

        {/* Periodo + Destino */}
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <FaCalendarAlt className="h-3.5 w-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Periodo
              </p>
            </div>
            <p className="mt-1.5 text-sm font-black text-neutral-900">
              {solicitud.periodo.rango}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              {solicitud.periodo.duracion}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <FaMapMarkerAlt className="h-3.5 w-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Destino
              </p>
            </div>
            <p className="mt-1.5 text-sm font-black text-neutral-900">
              {solicitud.destino.lugar}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              {solicitud.destino.detalle}
            </p>
          </div>
        </div>

        {/* Unidad original */}
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5">
          <FaClock className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-xs font-black text-neutral-900">
              {solicitud.unidadOriginal.modelo}
            </p>
            <p className="mt-0.5 text-[11px] text-red-800">
              {solicitud.unidadOriginal.nota}
            </p>
          </div>
          <span className="shrink-0 rounded-md border border-red-300 bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-700">
            {solicitud.unidadOriginal.estado}
          </span>
        </div>
      </div>

      {/* ─── Reasignar Unidad ─── */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
              <FaSyncAlt className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-neutral-900">
                Reasignar Unidad
              </h3>
              <p className="mt-0.5 text-[11px] text-neutral-500">
                Acción requerida para habilitar la firma de Dirección
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Verificada
          </span>
        </div>

        {/* Selector de unidad */}
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
          Unidad de Reemplazo Sugerida
        </p>
        <div className="relative mb-3">
          <select
            value={unidadSeleccionada}
            onChange={(e) => setUnidadSeleccionada(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 pr-10 text-sm font-bold text-neutral-900 outline-none transition hover:border-neutral-300 focus:border-red-400"
          >
            {unidadesDisponibles.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
          <FaExchangeAlt className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
        </div>

        {/* Detalles de unidad + seguros */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-neutral-300 bg-white px-2 py-0.5 text-[11px] font-black text-neutral-900">
              {solicitud.unidadSugerida.placas}
            </span>
            <span className="text-[11px] font-bold text-neutral-700">
              {solicitud.unidadSugerida.spec}
            </span>
            <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {solicitud.unidadSugerida.disponibilidad}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {solicitud.unidadSugerida.seguros.map((seguro, i) => {
              const Icon = seguro.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2 py-3 text-center"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                    <Icon className="h-3.5 w-3.5 text-emerald-600" />
                  </span>
                  <p className="text-[10px] font-black text-neutral-900">
                    {seguro.label}
                  </p>
                  <p className="text-[9px] text-neutral-500">{seguro.valor}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón guardar */}
        <button className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-neutral-100 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-200">
          <FaSyncAlt className="h-3.5 w-3.5" />
          Guardar Cambio de Unidad
        </button>
      </div>

      {/* ─── Historial de Validaciones ─── */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaHistory className="h-4 w-4 text-neutral-700" />
            <p className="text-sm font-black tracking-tight text-neutral-900">
              Historial de Validaciones
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-500">
            Audit Trail
          </p>
        </div>

        {/* Item de historial */}
        {solicitud.historial.map((h, i) => (
          <div key={i} className="mb-4 flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100">
              <FaUserTie className="h-3.5 w-3.5 text-neutral-600" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-black text-neutral-900">
                  {h.autor}
                </p>
                <p className="shrink-0 text-[10px] text-neutral-500">
                  {h.tiempo}
                </p>
              </div>
              <p className="mt-1 text-[11px] italic leading-relaxed text-neutral-600">
                {h.cita}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                <FaCheckCircle className="h-3 w-3" />
                {h.accion}
              </p>
            </div>
          </div>
        ))}

        {/* Dictamen técnico */}
        <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
            <FaTools className="h-3.5 w-3.5 text-red-600" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-black text-neutral-900">
                {solicitud.dictamen.area}
              </p>
              <p className="shrink-0 text-[10px] text-neutral-500">
                {solicitud.dictamen.nota}
              </p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-700">
              {solicitud.dictamen.texto}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Botones de acción ─── */}
      <div className="space-y-3">
        {/* Botón Autorizar */}
        <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-red-700 py-4 text-sm font-black uppercase tracking-[0.15em] text-white shadow-xl shadow-red-600/30 transition hover:from-red-500 hover:to-red-600 active:scale-[0.98]">
          <FaCog className="h-4 w-4" />
          Autorizar y Enviar a Dirección
        </button>

        {/* Botón Rechazar */}
        <button className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-4 text-sm font-black uppercase tracking-[0.15em] text-red-700 shadow-lg shadow-neutral-200/60 transition hover:border-red-300 hover:bg-red-50 active:scale-[0.98]">
          <FaTimes className="h-4 w-4" />
          Rechazar Solicitud
        </button>
      </div>
    </div>
  );
}

export default Aprobacion;