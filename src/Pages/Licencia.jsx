import React, { useState } from 'react';
import {
  FaIdCard,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaUpload,
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaStar,
  FaTimes,
  FaSave,
  FaInfoCircle,
  FaShieldAlt,
} from 'react-icons/fa';

/**
 * Pantalla de Licencia.
 * Permite al usuario registrar, editar y eliminar sus licencias de conducir.
 * Muestra estado de vigencia calculado automáticamente.
 */
function Licencia() {
  // ─── Estado del formulario ───
  const [formAbierto, setFormAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    numero: '',
    tipo: 'A',
    expedicion: '',
    vencimiento: '',
    entidad: 'Puebla',
    archivo: null,
  });

  // ─── Lista mock de licencias registradas ───
  const [licencias, setLicencias] = useState([
    {
      id: 1,
      numero: 'A-8942',
      tipo: 'A',
      expedicion: '2022-03-15',
      vencimiento: '2026-03-15',
      entidad: 'Puebla',
      principal: true,
      archivo: 'Licencia_A8942.pdf',
    },
    {
      id: 2,
      numero: 'B-3310',
      tipo: 'B',
      expedicion: '2020-08-01',
      vencimiento: '2024-08-01',
      entidad: 'CDMX',
      principal: false,
      archivo: 'Licencia_B3310.pdf',
    },
    {
      id: 3,
      numero: 'C-1145',
      tipo: 'C',
      expedicion: '2021-11-20',
      vencimiento: '2025-11-20',
      entidad: 'Querétaro',
      principal: false,
      archivo: null,
    },
  ]);

  // ─── Tipos de licencia disponibles ───
  const tiposLicencia = [
    { id: 'A', label: 'A — Automovilista' },
    { id: 'B', label: 'B — Camión / Carga' },
    { id: 'C', label: 'C — Motociclista' },
    { id: 'D', label: 'D — Transporte Público' },
    { id: 'E', label: 'E — Servicio Particular' },
  ];

  const entidades = [
    'Puebla',
    'CDMX',
    'Querétaro',
    'Jalisco',
    'Estado de México',
    'Nuevo León',
    'Otra',
  ];

  // ─── Utilidad: calcular estado de vigencia ───
  const calcularEstado = (vencimiento) => {
    const hoy = new Date();
    const fecha = new Date(vencimiento);
    const diffDias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
      return {
        label: 'Vencida',
        icon: FaTimesCircle,
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
      };
    }
    if (diffDias <= 90) {
      return {
        label: `Por vencer (${diffDias} días)`,
        icon: FaExclamationTriangle,
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    return {
      label: 'Vigente',
      icon: FaCheckCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    };
  };

  // ─── Handlers ───
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const abrirFormularioNuevo = () => {
    setEditandoId(null);
    setForm({
      numero: '',
      tipo: 'A',
      expedicion: '',
      vencimiento: '',
      entidad: 'Puebla',
      archivo: null,
    });
    setFormAbierto(true);
  };

  const abrirFormularioEditar = (lic) => {
    setEditandoId(lic.id);
    setForm({
      numero: lic.numero,
      tipo: lic.tipo,
      expedicion: lic.expedicion,
      vencimiento: lic.vencimiento,
      entidad: lic.entidad,
      archivo: lic.archivo,
    });
    setFormAbierto(true);
  };

  const cerrarFormulario = () => {
    setFormAbierto(false);
    setEditandoId(null);
  };

  const guardarLicencia = () => {
    if (!form.numero || !form.expedicion || !form.vencimiento) return;

    if (editandoId) {
      // Editar existente
      setLicencias((prev) =>
        prev.map((l) =>
          l.id === editandoId
            ? { ...l, ...form }
            : l
        )
      );
    } else {
      // Agregar nueva
      setLicencias((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          principal: prev.length === 0, // primera es principal
        },
      ]);
    }
    cerrarFormulario();
  };

  const eliminarLicencia = (id) => {
    setLicencias((prev) => prev.filter((l) => l.id !== id));
  };

  const marcarComoPrincipal = (id) => {
    setLicencias((prev) =>
      prev.map((l) => ({ ...l, principal: l.id === id }))
    );
  };

  return (
    <div className="space-y-5">
      {/* ─── Encabezado ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <h2 className="text-lg font-black tracking-tight text-neutral-900">
              Mis Licencias
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Administra tus licencias de conducir registradas
          </p>
        </div>
        <button
          onClick={abrirFormularioNuevo}
          className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-red-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:from-red-500 hover:to-red-600 active:scale-[0.98]"
        >
          <FaPlus className="h-3.5 w-3.5" />
          Agregar Licencia
        </button>
      </div>

      {/* ─── Resumen rápido ─── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ResumenCard
          label="Total"
          value={licencias.length}
          icon={FaIdCard}
          color="text-neutral-700"
          bg="bg-neutral-100"
          ring="ring-neutral-200"
        />
        <ResumenCard
          label="Vigentes"
          value={
            licencias.filter(
              (l) => calcularEstado(l.vencimiento).label === 'Vigente'
            ).length
          }
          icon={FaCheckCircle}
          color="text-emerald-600"
          bg="bg-emerald-50"
          ring="ring-emerald-200"
        />
        <ResumenCard
          label="Vencidas / Por vencer"
          value={
            licencias.filter(
              (l) => calcularEstado(l.vencimiento).label !== 'Vigente'
            ).length
          }
          icon={FaExclamationTriangle}
          color="text-amber-600"
          bg="bg-amber-50"
          ring="ring-amber-200"
        />
      </div>

      {/* ─── Formulario (colapsable) ─── */}
      {formAbierto && (
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                <FaIdCard className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-sm font-black tracking-tight text-neutral-900">
                {editandoId ? 'Editar Licencia' : 'Nueva Licencia'}
              </h3>
            </div>
            <button
              onClick={cerrarFormulario}
              aria-label="Cerrar formulario"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Número + Tipo */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Campo
                label="Número de Licencia"
                icon={FaIdCard}
                value={form.numero}
                onChange={(v) => handleChange('numero', v)}
                placeholder="Ej. A-8942"
              />
              <CampoSelect
                label="Tipo de Licencia"
                value={form.tipo}
                onChange={(v) => handleChange('tipo', v)}
                options={tiposLicencia}
              />
            </div>

            {/* Expedición + Vencimiento */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Campo
                label="Fecha de Expedición"
                icon={FaCalendarAlt}
                type="date"
                value={form.expedicion}
                onChange={(v) => handleChange('expedicion', v)}
              />
              <Campo
                label="Fecha de Vencimiento"
                icon={FaCalendarAlt}
                type="date"
                value={form.vencimiento}
                onChange={(v) => handleChange('vencimiento', v)}
              />
            </div>

            {/* Entidad */}
            <CampoSelect
              label="Entidad Emisora"
              value={form.entidad}
              onChange={(v) => handleChange('entidad', v)}
              options={entidades.map((e) => ({ id: e, label: e }))}
            />

            {/* Archivo */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                Documento (PDF / Imagen)
              </p>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-3.5 transition hover:border-red-300 hover:bg-red-50">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200">
                    <FaUpload className="h-3.5 w-3.5 text-red-600" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">
                      {form.archivo || 'Sube el archivo de tu licencia'}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      PDF, JPG o PNG · máx. 5 MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleChange('archivo', e.target.files?.[0]?.name || null)
                  }
                />
              </label>
            </div>
          </div>

          {/* Acciones del formulario */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={cerrarFormulario}
              className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              onClick={guardarLicencia}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-red-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/20 transition hover:from-red-500 hover:to-red-600 active:scale-[0.98]"
            >
              <FaSave className="h-3.5 w-3.5" />
              {editandoId ? 'Guardar Cambios' : 'Agregar Licencia'}
            </button>
          </div>
        </div>
      )}

      {/* ─── Lista de licencias ─── */}
      <div className="space-y-3">
        {licencias.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
              <FaIdCard className="h-6 w-6 text-neutral-400" />
            </div>
            <p className="mt-4 text-sm font-bold text-neutral-900">
              No tienes licencias registradas
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Agrega una para poder reservar unidades
            </p>
          </div>
        ) : (
          licencias.map((lic) => (
            <LicenciaCard
              key={lic.id}
              licencia={lic}
              estado={calcularEstado(lic.vencimiento)}
              onEditar={() => abrirFormularioEditar(lic)}
              onEliminar={() => eliminarLicencia(lic.id)}
              onMarcarPrincipal={() => marcarComoPrincipal(lic.id)}
            />
          ))
        )}
      </div>

      {/* ─── Nota informativa ─── */}
      <div className="flex items-start gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
        <FaInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
        <p className="text-[11px] leading-relaxed text-neutral-600">
          La licencia marcada como <strong>principal</strong> es la que se
          validará automáticamente al generar una solicitud de reservación. Si
          está vencida o por vencer, no podrás reservar unidades.
        </p>
      </div>
    </div>
  );
}

/* ─────────── Tarjeta de resumen ─────────── */
function ResumenCard({ label, value, icon: Icon, color, bg, ring }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg} ring-1 ${ring}`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
          {label}
        </p>
        <p className="text-2xl font-black tabular-nums text-neutral-900">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─────────── Tarjeta individual de licencia ─────────── */
function LicenciaCard({ licencia, estado, onEditar, onEliminar, onMarcarPrincipal }) {
  const EstadoIcon = estado.icon;

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60 transition hover:border-neutral-300 hover:shadow-xl">
      {/* Fila superior: badge principal + estado */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {licencia.principal && (
            <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
              <FaStar className="h-3 w-3" />
              Principal
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-700">
            Tipo {licencia.tipo}
          </span>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${estado.bg} ${estado.color} ${estado.border}`}
        >
          <EstadoIcon className="h-3 w-3" />
          {estado.label}
        </span>
      </div>

      {/* Número grande */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
          <FaIdCard className="h-5 w-5 text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
            Número de Licencia
          </p>
          <p className="mt-0.5 text-lg font-black tracking-tight text-neutral-900">
            {licencia.numero}
          </p>
          <p className="text-[11px] text-neutral-500">
            Emitida en {licencia.entidad}
          </p>
        </div>
      </div>

      {/* Grid de fechas y archivo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DatoItem
          icon={FaCalendarAlt}
          label="Expedición"
          value={licencia.expedicion}
        />
        <DatoItem
          icon={FaCalendarAlt}
          label="Vencimiento"
          value={licencia.vencimiento}
        />
        <DatoItem
          icon={FaFileAlt}
          label="Documento"
          value={licencia.archivo || 'Sin adjunto'}
          muted={!licencia.archivo}
        />
      </div>

      {/* Acciones */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 pt-3">
        {!licencia.principal && (
          <button
            onClick={onMarcarPrincipal}
            className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
          >
            <FaStar className="h-3 w-3" />
            Marcar principal
          </button>
        )}
        <button
          onClick={onEditar}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          <FaEdit className="h-3 w-3" />
          Editar
        </button>
        <button
          onClick={onEliminar}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-700 transition hover:border-red-300 hover:bg-red-50"
        >
          <FaTrash className="h-3 w-3" />
          Eliminar
        </button>
      </div>
    </div>
  );
}

/* ─────────── Dato individual ─────────── */
function DatoItem({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
      <Icon
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
          muted ? 'text-neutral-400' : 'text-red-600'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
          {label}
        </p>
        <p
          className={`mt-0.5 truncate text-xs font-bold ${
            muted ? 'italic text-neutral-400' : 'text-neutral-900'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─────────── Campo de texto ─────────── */
function Campo({ label, icon: Icon, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
        {label}
      </p>
      <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-500" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-bold text-neutral-900 placeholder-neutral-400 outline-none"
        />
      </div>
    </div>
  );
}

/* ─────────── Campo select ─────────── */
function CampoSelect({ label, value, onChange, options }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm font-bold text-neutral-900 outline-none transition hover:border-neutral-300 focus:border-red-400"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <FaShieldAlt className="pointer-events-none absolute right-3.5 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
      </div>
    </div>
  );
}

export default Licencia;