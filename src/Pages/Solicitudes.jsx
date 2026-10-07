import React, { useState } from 'react';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaPencilAlt,
  FaRedoAlt,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaCar,
  FaUserCheck,
  FaClipboardCheck,
  FaWarehouse,
  FaUser,
} from 'react-icons/fa';

function Solicitudes() {
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Datos mock de solicitudes
  const solicitudes = [
    {
      id: 'FL-9042',
      estado: 'en_validacion',
      unidad: 'Jetta Trendline',
      placas: 'UXR-842-D',
      destino: 'Querétaro, QRO',
      fecha: 'Hoy, 14:30 hrs',
      solicitante: 'Ing. Carlos Mendo',
      motivo: 'Personal',
      pasajeros: 3,
      etapaActual: 2,
      totalEtapas: 4,
      etapas: [
        { label: 'Gte. Área', estado: 'aprobado' },
        { label: 'Admin Flota', estado: 'validando' },
        { label: 'Dir. Planta', estado: 'espera' },
        { label: 'Caseta Salida', estado: 'espera' },
      ],
      nota: 'Revisión mecánica previa en curso en la Est. 20m',
    },
    {
      id: 'FL-8819',
      estado: 'rechazada',
      unidad: 'Nissan NP300 Chasis',
      placas: 'LMS-912-A',
      destino: 'San Luis Potosí, SLP',
      fecha: 'Ayer, 09:00 hrs',
      solicitante: 'Lic. Sofía Ramos',
      motivo: 'Proveedor',
      pasajeros: 2,
      motivoRechazo:
        'Unidad programada con mantenimiento correctivo preventivo de frenos. Favor de solicitar unidad alternativa para la ruta San Luis Potosí.',
    },
    {
      id: 'FL-9041',
      estado: 'aprobada',
      unidad: 'BYD Dolphin',
      placas: 'PLK-992-A',
      destino: 'Puebla, PUE',
      fecha: '23 Oct · 10:30 hrs',
      solicitante: 'Ing. Carlos Mendo',
      motivo: 'Cliente',
      pasajeros: 3,
      etapaActual: 4,
      totalEtapas: 4,
      etapas: [
        { label: 'Gte. Área', estado: 'aprobado' },
        { label: 'Admin Flota', estado: 'aprobado' },
        { label: 'Dir. Planta', estado: 'aprobado' },
        { label: 'Caseta Salida', estado: 'aprobado' },
      ],
      nota: 'Unidad lista para recoger en caseta principal.',
    },
    {
      id: 'FL-9038',
      estado: 'en_validacion',
      unidad: 'Taigún SUV',
      placas: 'PWC-772-L',
      destino: 'Guadalajara, JAL',
      fecha: '21 Oct · 14:00 hrs',
      solicitante: 'Ing. Roberto Díaz',
      motivo: 'Capacitación',
      pasajeros: 4,
      etapaActual: 1,
      totalEtapas: 4,
      etapas: [
        { label: 'Gte. Área', estado: 'validando' },
        { label: 'Admin Flota', estado: 'espera' },
        { label: 'Dir. Planta', estado: 'espera' },
        { label: 'Caseta Salida', estado: 'espera' },
      ],
      nota: 'Esperando aprobación del gerente de área.',
    },
    {
      id: 'FL-9035',
      estado: 'rechazada',
      unidad: 'Jetta Sedán',
      placas: 'UAB-120-C',
      destino: 'Puebla, PUE',
      fecha: '20 Oct · 09:15 hrs',
      solicitante: 'Lic. Sofía Ramos',
      motivo: 'Otro',
      pasajeros: 2,
      motivoRechazo:
        'Solicitud fuera de la ventana permitida de reservación (24 hrs antes). Vuelve a enviar con al menos 48 hrs de anticipación.',
    },
  ];

  // Configuración visual por estado
  const estadosConfig = {
    en_validacion: {
      label: 'EN VALIDACIÓN',
      icon: FaClock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    aprobada: {
      label: 'APROBADA',
      icon: FaCheckCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    rechazada: {
      label: 'RECHAZADA',
      icon: FaTimesCircle,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      dot: 'bg-red-500',
    },
  };

  // Filtros disponibles
  const filtros = [
    { id: 'todas', label: 'Todas' },
    { id: 'en_validacion', label: 'En Validación' },
    { id: 'aprobada', label: 'Aprobadas' },
    { id: 'rechazada', label: 'Rechazadas' },
  ];

  // Filtrado
  const solicitudesFiltradas = solicitudes.filter((s) => {
    const coincideFiltro = filtro === 'todas' || s.estado === filtro;
    const coincideBusqueda =
      busqueda.trim() === '' ||
      s.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.solicitante.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.unidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.destino.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.placas.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  // Conteos
  const conteos = {
    todas: solicitudes.length,
    en_validacion: solicitudes.filter((s) => s.estado === 'en_validacion').length,
    aprobada: solicitudes.filter((s) => s.estado === 'aprobada').length,
    rechazada: solicitudes.filter((s) => s.estado === 'rechazada').length,
  };

  return (
    <div className="space-y-5">
      {/* ─── Encabezado de la sección ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <h2 className="text-lg font-black tracking-tight text-neutral-900">
              Mis Solicitudes
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Consulta el estado de tus reservaciones y las de tu equipo
          </p>
        </div>
        <button className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-red-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:from-red-500 hover:to-red-600 active:scale-[0.98]">
          <FaPlus className="h-3.5 w-3.5" />
          Nueva Solicitud
        </button>
      </div>

      {/* ─── Filtros y búsqueda ─── */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5">
            <FaSearch className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por auto, placa o destino..."
              className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50">
            <FaFilter className="h-3.5 w-3.5" />
            Filtros
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50">
            <FaDownload className="h-3.5 w-3.5" />
            Exportar
          </button>
        </div>

        {/* Tabs de filtro */}
        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => {
            const isActive = filtro === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-900/20'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {conteos[f.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Lista de solicitudes ─── */}
      <div className="space-y-3">
        {solicitudesFiltradas.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
              <FaSearch className="h-6 w-6 text-neutral-400" />
            </div>
            <p className="mt-4 text-sm font-bold text-neutral-900">
              No se encontraron solicitudes
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Prueba con otro filtro o término de búsqueda
            </p>
          </div>
        ) : (
          solicitudesFiltradas.map((solicitud) => (
            <SolicitudCard
              key={solicitud.id}
              solicitud={solicitud}
              estadosConfig={estadosConfig}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────── Tarjeta individual de solicitud ─────────── */
function SolicitudCard({ solicitud, estadosConfig }) {
  const config = estadosConfig[solicitud.estado];
  const EstadoIcon = config.icon;
  const [mostrarReporte, setMostrarReporte] = useState(false);

  const esRechazada = solicitud.estado === 'rechazada';
  const esEnValidacion = solicitud.estado === 'en_validacion';

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60 transition hover:border-neutral-300 hover:shadow-xl">
      {/* ─── Fila superior: Estado + Folio + Miniatura ─── */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Badge estado + folio */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.color} ${config.border}`}
            >
              <EstadoIcon className="h-3 w-3" />
              {config.label}
            </span>
            <span className="text-[11px] font-semibold text-neutral-500">
              Folio #{solicitud.id}
            </span>
          </div>

          {/* Título grande + placas */}
          <h3 className="mt-2.5 text-lg font-black leading-tight tracking-tight text-neutral-900">
            {solicitud.unidad}
          </h3>
          <p className="text-sm font-bold tracking-wide text-neutral-500">
            {solicitud.placas}
          </p>
        </div>

        {/* Placeholder miniatura */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100">
          <FaCar className="h-7 w-7 text-neutral-300" />
        </div>
      </div>

      {/* ─── Grid 2 columnas: Destino + Fecha ─── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
          <FaMapMarkerAlt className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Destino
            </p>
            <p className="mt-0.5 truncate text-sm font-bold text-neutral-900">
              {solicitud.destino}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
          <FaCalendarAlt className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Fecha Salida
            </p>
            <p className="mt-0.5 truncate text-sm font-bold text-neutral-900">
              {solicitud.fecha}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Flujo de autorizaciones (solo si no es rechazada) ─── */}
      {!esRechazada && solicitud.etapas && (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-3.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-500">
              Flujo de Autorizaciones
            </p>
            <p className="text-[11px] font-bold text-red-600">
              Etapa {solicitud.etapaActual} de {solicitud.totalEtapas}
            </p>
          </div>

          {/* Barra de progreso segmentada */}
          <div className="mb-4 flex items-center gap-1">
            {solicitud.etapas.map((etapa, i) => {
              const completada = etapa.estado === 'aprobado';
              const actual = etapa.estado === 'validando';
              return (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition ${
                    completada
                      ? 'bg-emerald-500'
                      : actual
                      ? 'bg-red-500'
                      : 'bg-neutral-200'
                  }`}
                />
              );
            })}
          </div>

          {/* Etapas con iconos */}
          <div className="grid grid-cols-4 gap-2">
            {solicitud.etapas.map((etapa, i) => {
              const completada = etapa.estado === 'aprobado';
              const actual = etapa.estado === 'validando';
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                      completada
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : actual
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                    }`}
                  >
                    {completada ? (
                      <FaCheckCircle className="h-3.5 w-3.5" />
                    ) : actual ? (
                      <FaClock className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[10px] font-bold ${
                        completada || actual
                          ? 'text-neutral-900'
                          : 'text-neutral-400'
                      }`}
                    >
                      {etapa.label}
                    </p>
                    <p
                      className={`text-[9px] font-semibold ${
                        completada
                          ? 'text-emerald-600'
                          : actual
                          ? 'text-red-600'
                          : 'text-neutral-400'
                      }`}
                    >
                      {completada
                        ? 'Aprobado'
                        : actual
                        ? 'Validando'
                        : 'En espera'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Banner de nota informativa (solo si hay nota) ─── */}
      {solicitud.nota && !esRechazada && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
          <FaInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
          <p className="text-xs font-medium leading-relaxed text-neutral-700">
            {solicitud.nota}
          </p>
        </div>
      )}

      {/* ─── Banner de motivo de rechazo ─── */}
      {esRechazada && solicitud.motivoRechazo && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3.5">
          <div className="mb-1.5 flex items-center gap-2">
            <FaTimesCircle className="h-4 w-4 shrink-0 text-red-600" />
            <p className="text-[11px] font-black uppercase tracking-wider text-red-700">
              Motivo de rechazo por Dirección:
            </p>
          </div>
          <p className="text-xs leading-relaxed text-red-900">
            {solicitud.motivoRechazo}
          </p>
        </div>
      )}

      {/* ─── Acciones ─── */}
      <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center">
        {esRechazada ? (
          <>
            <button className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-100">
              <FaPencilAlt className="h-3.5 w-3.5" />
              Editar y volver a enviar
            </button>
            <button
              aria-label="Reintentar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100"
            >
              <FaRedoAlt className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setMostrarReporte((v) => !v)}
            className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-black uppercase tracking-wider text-red-700 transition hover:bg-red-100"
          >
            <span className="flex items-center gap-2">
              <FaExclamationTriangle className="h-4 w-4" />
              Reportar averías o comentarios
            </span>
            {mostrarReporte ? (
              <FaChevronUp className="h-3 w-3" />
            ) : (
              <FaChevronDown className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* ─── Contenido desplegable de reporte ─── */}
      {mostrarReporte && !esRechazada && (
        <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
          <textarea
            rows={3}
            placeholder="Describe la avería o comentario que deseas reportar..."
            className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-red-400"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setMostrarReporte(false)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-600 transition hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button className="rounded-xl bg-linear-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/20 transition hover:from-red-500 hover:to-red-600">
              Enviar reporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solicitudes;