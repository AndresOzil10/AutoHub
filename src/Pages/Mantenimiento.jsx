import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaCar,
  FaClipboardList,
  FaTimes,
  FaSpinner,
  FaCalendarAlt,
} from 'react-icons/fa';

// ─── Tipos de mantenimiento ───
const TIPOS_MANTENIMIENTO = [
  { id: 'preventivo', label: 'Preventivo', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'correctivo', label: 'Correctivo', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'emergencia', label: 'Emergencia', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
];

// ─── Simulación: unidades que inician en mantenimiento al cargar ───
// unidadId → { fechaSalida, fechaEstimada, ... }
const SIMULACION_INICIAL = {
  taigun: {
    fechaSalida: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // hace 2 días
    fechaEstimada: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // en 3 días
    tipo: 'preventivo',
    motivo: 'Servicio programado (simulación)',
    taller: 'Taller Autorizado Kayser',
    responsable: 'Sistema',
  },
};

// ─── Helpers de fecha ───
const MS_POR_DIA = 86400000;

const fechaAHoy = () => new Date().toISOString().split('T')[0];

const parseFechaLocal = (fechaStr) => {
  if (!fechaStr) return null;
  const [y, m, d] = fechaStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const calcularProgresoPorFechas = (fechaSalida, fechaEstimada) => {
  if (!fechaSalida || !fechaEstimada) return 0;
  const inicio = parseFechaLocal(fechaSalida)?.getTime();
  const fin = parseFechaLocal(fechaEstimada)?.getTime();
  if (inicio == null || fin == null) return 0;
  if (fin <= inicio) return 100;

  const hoy = Date.now();
  const total = fin - inicio;
  const transcurrido = hoy - inicio;
  const pct = Math.floor((transcurrido / total) * 100);
  return Math.max(0, Math.min(100, pct));
};

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
};

const diasRestantes = (fechaEstimada) => {
  if (!fechaEstimada) return null;
  const fin = parseFechaLocal(fechaEstimada)?.getTime();
  if (!fin) return null;
  const diff = Math.ceil((fin - Date.now()) / MS_POR_DIA);
  return diff;
};

function Mantenimiento({ flota = [], onCambiarEstado }) {
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [tipoMantenimiento, setTipoMantenimiento] = useState('preventivo');
  const [motivo, setMotivo] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [taller, setTaller] = useState('');
  const [responsable, setResponsable] = useState('');
  const [historial, setHistorial] = useState([]);
  const [toast, setToast] = useState(null);

  // ─── Registro de mantenimiento por unidad ───
  // { [unidadId]: { fechaSalida, fechaEstimada, tipo, motivo, ... } }
  const [registros, setRegistros] = useState(() => {
    const init = {};
    Object.entries(SIMULACION_INICIAL).forEach(([id, data]) => {
      init[id] = { ...data };
    });
    return init;
  });

  // Tick para forzar re-render cada minuto (recalcular progreso)
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000); // cada minuto
    return () => clearInterval(interval);
  }, []);

  // Ref para saber si ya disparamos la simulación inicial al padre
  const inicialAplicada = useRef(false);

  // ─── Simulación inicial: aplicar el estado de mantenimiento al padre una vez ───
  useEffect(() => {
    if (inicialAplicada.current) return;
    if (!onCambiarEstado) return;
    if (flota.length === 0) return;

    Object.entries(SIMULACION_INICIAL).forEach(([id, data]) => {
      const unidad = flota.find((u) => u.id === id);
      if (unidad && unidad.estado !== 'Mantenimiento') {
        onCambiarEstado(id, 'mantenimiento', {
          unidadId: id,
          modelo: unidad.modelo,
          placas: unidad.placas,
          ...data,
        });
      }
    });
    inicialAplicada.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flota.length]);

  // Filtrar flota por búsqueda
  const flotaFiltrada = useMemo(() => {
    if (!searchTerm.trim()) return flota;
    const term = searchTerm.toLowerCase();
    return flota.filter(
      (u) =>
        u.modelo?.toLowerCase().includes(term) ||
        u.placas?.toLowerCase().includes(term) ||
        u.id?.toLowerCase().includes(term)
    );
  }, [flota, searchTerm]);

  // Mostrar toast temporal
  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // Abrir panel de mantenimiento para una unidad
  const abrirPanel = (unidad) => {
    setUnidadSeleccionada(unidad);
    setTipoMantenimiento('preventivo');
    setMotivo('');
    setFechaSalida(fechaAHoy());
    setFechaEstimada('');
    setTaller('');
    setResponsable('');
  };

  // Cerrar panel
  const cerrarPanel = () => {
    setUnidadSeleccionada(null);
  };

  // Confirmar envío a mantenimiento
  const confirmarMantenimiento = () => {
    if (!unidadSeleccionada) return;
    if (!motivo.trim()) {
      mostrarToast('Debes indicar el motivo del mantenimiento', 'error');
      return;
    }
    if (!fechaSalida) {
      mostrarToast('Debes indicar la fecha de salida a mantenimiento', 'error');
      return;
    }
    if (!fechaEstimada) {
      mostrarToast('Debes indicar una fecha estimada de regreso', 'error');
      return;
    }
    if (fechaEstimada < fechaSalida) {
      mostrarToast('La fecha de regreso no puede ser anterior a la de salida', 'error');
      return;
    }

    const registro = {
      unidadId: unidadSeleccionada.id,
      modelo: unidadSeleccionada.modelo,
      placas: unidadSeleccionada.placas,
      tipo: tipoMantenimiento,
      motivo,
      fechaSalida,
      fechaEstimada,
      taller: taller || 'No especificado',
      responsable: responsable || 'No especificado',
      fechaRegistro: new Date().toISOString(),
    };

    setHistorial((prev) => [registro, ...prev]);

    // Guardar registro para calcular el progreso por fechas
    setRegistros((prev) => ({
      ...prev,
      [unidadSeleccionada.id]: {
        fechaSalida,
        fechaEstimada,
        tipo: tipoMantenimiento,
        motivo,
        taller,
        responsable,
      },
    }));

    // Notificar al padre
    if (onCambiarEstado) {
      onCambiarEstado(unidadSeleccionada.id, 'mantenimiento', registro);
    }

    mostrarToast(`${unidadSeleccionada.modelo} enviado a mantenimiento`, 'success');
    cerrarPanel();
  };

  // Marcar regreso de mantenimiento (solo si el progreso por fechas = 100)
  const marcarDisponible = (unidad) => {
    const reg = registros[unidad.id];
    const progresoActual = reg
      ? calcularProgresoPorFechas(reg.fechaSalida, reg.fechaEstimada)
      : 100;

    if (progresoActual < 100) {
      mostrarToast(
        `El periodo de mantenimiento aún no concluye (${progresoActual}%).`,
        'error'
      );
      return;
    }

    if (onCambiarEstado) {
      onCambiarEstado(unidad.id, 'disponible', null);
    }

    // Limpiar registro de esa unidad
    setRegistros((prev) => {
      const next = { ...prev };
      delete next[unidad.id];
      return next;
    });

    mostrarToast(`${unidad.modelo} marcado como disponible`, 'success');
  };

  // Color del estado
  const estadoColor = (estado) => {
    if (estado === 'Disponible') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (estado === 'Revisión') return 'text-amber-600 bg-amber-50 border-amber-200';
    if (estado === 'Mantenimiento') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-neutral-600 bg-neutral-50 border-neutral-200';
  };

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <FaTools className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-neutral-900">
              Control de Mantenimiento
            </h2>
            <p className="text-xs text-neutral-500">
              El progreso avanza según los días transcurridos
            </p>
          </div>
        </div>

        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por modelo, placas o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 sm:w-72"
          />
        </div>
      </div>

      {/* ─── Grid de unidades ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {flotaFiltrada.map((unidad) => {
          const enMantenimiento = unidad.estado === 'Mantenimiento';
          const reg = registros[unidad.id];

          // Progreso basado en fechas reales
          const progreso = enMantenimiento && reg
            ? calcularProgresoPorFechas(reg.fechaSalida, reg.fechaEstimada)
            : 0;
          const completo = progreso >= 100;
          const dias = reg ? diasRestantes(reg.fechaEstimada) : null;

          return (
            <div
              key={unidad.id}
              className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${
                enMantenimiento ? 'border-red-200' : 'border-neutral-200'
              }`}
            >
              {/* Imagen */}
              <div className="relative h-36 overflow-hidden bg-neutral-100">
                <img
                  src={unidad.imagen}
                  alt={unidad.modelo}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    enMantenimiento ? 'grayscale' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <span
                  className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold ${estadoColor(
                    unidad.estado
                  )}`}
                >
                  {unidad.estado}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-neutral-700 backdrop-blur">
                  {unidad.placas}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${unidad.categoriaColor}`}>
                  {unidad.categoria}
                </p>
                <h3 className="mt-0.5 text-sm font-black text-neutral-900">
                  {unidad.modelo}
                </h3>
                <p className="mt-0.5 text-[11px] text-neutral-500">
                  ID: {unidad.id}
                </p>

                {/* Barra de progreso (solo en mantenimiento) */}
                {enMantenimiento && reg && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
                      <span className="flex items-center gap-1 text-neutral-500">
                        {!completo && <FaSpinner className="h-2.5 w-2.5 animate-spin" />}
                        {completo
                          ? 'Listo para volver'
                          : dias != null && dias > 0
                            ? `Faltan ${dias} día${dias === 1 ? '' : 's'}`
                            : 'En mantenimiento'}
                      </span>
                      <span className={completo ? 'text-emerald-600' : 'text-amber-600'}>
                        {progreso}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          completo
                            ? 'bg-linear-to-r from-emerald-400 to-emerald-600'
                            : 'bg-linear-to-r from-amber-400 to-orange-500'
                        }`}
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-bold text-neutral-400">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="h-2.5 w-2.5" />
                        {formatearFecha(reg.fechaSalida)}
                      </span>
                      <span className="flex items-center gap-1">
                        {formatearFecha(reg.fechaEstimada)}
                        <FaCalendarAlt className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="mt-4 flex gap-2">
                  {enMantenimiento ? (
                    <button
                      onClick={() => marcarDisponible(unidad)}
                      disabled={!completo}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold transition ${
                        completo
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'cursor-not-allowed border border-neutral-200 bg-neutral-50 text-neutral-400'
                      }`}
                    >
                      <FaCheckCircle className="h-3.5 w-3.5" />
                      {completo ? 'Marcar disponible' : 'Esperando…'}
                    </button>
                  ) : (
                    <button
                      onClick={() => abrirPanel(unidad)}
                      disabled={!unidad.disponible}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold transition ${
                        unidad.disponible
                          ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'cursor-not-allowed border border-neutral-200 bg-neutral-50 text-neutral-400'
                      }`}
                    >
                      <FaTools className="h-3.5 w-3.5" />
                      Enviar a mantenimiento
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {flotaFiltrada.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <FaCar className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-2 text-sm font-bold text-neutral-600">
              Sin unidades que coincidan
            </p>
            <p className="text-xs text-neutral-400">
              Prueba con otro término de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* ─── Historial de mantenimientos ─── */}
      {historial.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FaClipboardList className="h-4 w-4 text-neutral-500" />
            <h3 className="text-sm font-black text-neutral-900">
              Historial de la sesión
            </h3>
            <span className="ml-auto rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">
              {historial.length} {historial.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <div className="space-y-2">
            {historial.map((h, i) => {
              const tipo = TIPOS_MANTENIMIENTO.find((t) => t.id === h.tipo);
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between ${tipo?.bg} ${tipo?.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${tipo?.color}`}>
                      <FaTools className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-neutral-900">
                        {h.modelo} · {h.placas}
                      </p>
                      <p className="text-[11px] text-neutral-600">{h.motivo}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                    <span className={`rounded-full bg-white px-2 py-1 ${tipo?.color}`}>
                      {tipo?.label}
                    </span>
                    <span className="rounded-full bg-white px-2 py-1 text-neutral-600">
                      Salida: {formatearFecha(h.fechaSalida)}
                    </span>
                    <span className="rounded-full bg-white px-2 py-1 text-neutral-600">
                      Regreso: {formatearFecha(h.fechaEstimada)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Panel lateral (modal) ─── */}
      {unidadSeleccionada && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            {/* Header panel */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <FaTools className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-neutral-900">
                    Enviar a mantenimiento
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {unidadSeleccionada.modelo} · {unidadSeleccionada.placas}
                  </p>
                </div>
              </div>
              <button
                onClick={cerrarPanel}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            {/* Formulario */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {/* Tipo */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Tipo de mantenimiento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIPOS_MANTENIMIENTO.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTipoMantenimiento(t.id)}
                      className={`rounded-xl border px-2 py-3 text-[11px] font-bold transition ${
                        tipoMantenimiento === t.id
                          ? `${t.bg} ${t.border} ${t.color}`
                          : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Motivo *
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  placeholder="Describe el problema o servicio a realizar..."
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Fecha de salida *
                  </label>
                  <input
                    type="date"
                    value={fechaSalida}
                    onChange={(e) => setFechaSalida(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Regreso estimado *
                  </label>
                  <input
                    type="date"
                    value={fechaEstimada}
                    min={fechaSalida || undefined}
                    onChange={(e) => setFechaEstimada(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Taller */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Taller / Proveedor
                </label>
                <input
                  type="text"
                  value={taller}
                  onChange={(e) => setTaller(e.target.value)}
                  placeholder="Ej. Taller Autorizado Kayser"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Responsable */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Responsable
                </label>
                <input
                  type="text"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  placeholder="Nombre de quien autoriza"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Aviso */}
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Al confirmar, la unidad quedará <b>fuera de servicio</b>. El
                  progreso avanzará automáticamente según los días transcurridos
                  entre la fecha de salida y la de regreso.
                </p>
              </div>
            </div>

            {/* Footer acciones */}
            <div className="flex gap-3 border-t border-neutral-200 p-5">
              <button
                onClick={cerrarPanel}
                className="flex-1 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarMantenimiento}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:from-amber-600 hover:to-orange-700"
              >
                <FaTools className="h-3.5 w-3.5" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast ─── */}
      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 lg:bottom-8">
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-2xl ${
              toast.tipo === 'error' ? 'bg-red-600' : 'bg-emerald-600'
            }`}
          >
            {toast.tipo === 'error' ? (
              <FaExclamationTriangle className="h-4 w-4" />
            ) : (
              <FaCheckCircle className="h-4 w-4" />
            )}
            {toast.mensaje}
          </div>
        </div>
      )}
    </div>
  );
}

export default Mantenimiento;