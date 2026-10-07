import React, { useState } from 'react';
import {
  FaCar,
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaUsers,
  FaUser,
  FaMinus,
  FaPlus,
  FaFileAlt,
  FaBalanceScale,
  FaMapMarkerAlt,
  FaBuilding,
  FaChevronDown,
  FaBox,
  FaExclamationTriangle,
  FaArrowRight,
  FaLock,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaIdCard,
  FaShieldAlt,
  FaTimes,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

function Reservar({
  flota,
  pasajeros,
  setPasajeros,
  motivo,
  setMotivo,
  destinoTipo,
  setDestinoTipo,
  transportaCarga,
  setTransportaCarga,
  unidadSeleccionada,
  setUnidadSeleccionada,
  unidadActiva,
  user,
  nomina
}) {
  // ── Estado: ¿Eres el conductor? ──
  const [esConductor, setEsConductor] = useState(null); // null | true | false
  const [busquedaConductor, setBusquedaConductor] = useState('');
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // ── Estado: detalle del motivo ──
  const [detalleMotivo, setDetalleMotivo] = useState('');

  // ── Estado: periodo de reservación (campos abiertos) ──
  const [fechaSalida, setFechaSalida] = useState('2024-10-24');
  const [horaSalida, setHoraSalida] = useState('08:00');
  const [fechaDevolucion, setFechaDevolucion] = useState('2024-10-26');
  const [horaDevolucion, setHoraDevolucion] = useState('18:00');

  // ── Estado: destino (campos abiertos) ──
  const [entidadFederativa, setEntidadFederativa] = useState('');
  const [direccionExacta, setDireccionExacta] = useState('');

  // ── Estado: buscador de acompañantes ──
  const [busquedaAcompanante, setBusquedaAcompanante] = useState('');
  const [acompanantes, setAcompanantes] = useState([]);
  const [mostrarResultadosAcompanante, setMostrarResultadosAcompanante] = useState(false);

  // Lista de empleados de ejemplo para buscar acompañantes
  const empleadosDisponibles = [
    { id: 1, nombre: 'Sofía Ramos Gutiérrez', empleado: 'EMP-1023', area: 'Logística', puesto: 'Supervisora de Transporte' },
    { id: 2, nombre: 'Roberto Díaz Martínez', empleado: 'EMP-2041', area: 'Operaciones', puesto: 'Ingeniero de Procesos' },
    { id: 3, nombre: 'María José Ortega López', empleado: 'EMP-1873', area: 'Recursos Humanos', puesto: 'Coordinadora de Personal' },
    { id: 4, nombre: 'Carlos Méndez Rojas', empleado: 'EMP-2210', area: 'Mantenimiento', puesto: 'Técnico Automotriz' },
    { id: 5, nombre: 'Ana Lucía Fernández Pérez', empleado: 'EMP-1998', area: 'Calidad', puesto: 'Auditora de Calidad' },
    { id: 6, nombre: 'Jorge Ramírez Soto', empleado: 'EMP-1567', area: 'Almacén', puesto: 'Jefe de Almacén' },
    { id: 7, nombre: 'Laura Patricia Gómez Ruiz', empleado: 'EMP-1345', area: 'Compras', puesto: 'Analista de Compras' },
    { id: 8, nombre: 'Fernando Torres Vega', empleado: 'EMP-1789', area: 'Seguridad', puesto: 'Oficial de Seguridad' },
  ];

  const empleadosFiltrados = empleadosDisponibles.filter(
    (e) =>
      !acompanantes.find((a) => a.id === e.id) &&
      (e.nombre.toLowerCase().includes(busquedaAcompanante.toLowerCase()) ||
        e.empleado.toLowerCase().includes(busquedaAcompanante.toLowerCase()))
  );

  const agregarAcompanante = (empleado) => {
    if (acompanantes.length < 4) {
      setAcompanantes([...acompanantes, empleado]);
      setBusquedaAcompanante('');
      setMostrarResultadosAcompanante(false);
    }
  };

  const eliminarAcompanante = (id) => {
    setAcompanantes(acompanantes.filter((a) => a.id !== id));
  };

  // ── Función: Enviar Solicitud ──
  const handleEnviarSolicitud = () => {
    // ── Validación de campos vacíos ──
    const camposVacios = [];

    if (!fechaSalida) camposVacios.push('Fecha de Salida');
    if (!horaSalida) camposVacios.push('Hora de Salida');
    if (!fechaDevolucion) camposVacios.push('Fecha de Devolución');
    if (!horaDevolucion) camposVacios.push('Hora de Devolución');
    if (!entidadFederativa.trim()) camposVacios.push('Entidad Federativa / Complejo');
    if (!direccionExacta.trim()) camposVacios.push('Dirección Exacta');
    if (!motivo) camposVacios.push('Motivo del Viaje');
    if (!destinoTipo) camposVacios.push('Tipo de Destino');
    if (!unidadSeleccionada) camposVacios.push('Unidad');
    if (esConductor === null) camposVacios.push('Selección de Conductor');

    if (camposVacios.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 12px; color: #666;">Los siguientes campos están vacíos o son inválidos:</p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${camposVacios.map((c) => `<li style="padding: 6px 0; border-bottom: 1px solid #eee;"><span style="color: #ef4444; margin-right: 8px;">•</span>${c}</li>`).join('')}
            </ul>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc2626',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
      return;
    }

    // ── Validación: Acompañantes requeridos si hay pasajeros ──
    if (pasajeros > 0 && acompanantes.length === 0) {
      Swal.fire({
        icon: 'question',
        title: 'Acompañantes requeridos',
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 12px; color: #666;">
              Has indicado que viajan <strong>${pasajeros} persona${pasajeros > 1 ? 's' : ''}</strong>, pero no has agregado los nombres de los acompañantes.
            </p>
            <p style="color: #666;">
              Por favor, busca y agrega los nombres de los acompañantes en la sección correspondiente.
            </p>
          </div>
        `,
        confirmButtonText: 'Agregar acompañantes',
        confirmButtonColor: '#dc2626',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
      return;
    }

    const datosSolicitud = {
      usuario: {
        nombre: user?.nombre,
        empleado: user?.empleado || nomina,
        area: user?.area,
        licencia: user?.licencia,
      },
      conductor: {
        esConductor,
        conductorSeleccionado: conductorSeleccionado
          ? {
              nombre: conductorSeleccionado.nombre,
              empleado: conductorSeleccionado.empleado,
              licencia: conductorSeleccionado.licencia,
              licenciaVigente: conductorSeleccionado.licenciaVigente,
            }
          : null,
      },
      periodo: {
        fechaSalida,
        horaSalida,
        fechaDevolucion,
        horaDevolucion,
      },
      pasajeros: {
        cantidad: pasajeros,
        acompanantes: acompanantes.map((a) => ({
          nombre: a.nombre,
          empleado: a.empleado,
          area: a.area,
        })),
      },
      destino: {
        tipo: destinoTipo,
        entidadFederativa,
        direccionExacta,
      },
      motivo: {
        tipo: motivo,
        detalle: detalleMotivo,
      },
      transportaCarga,
      unidad: {
        id: unidadSeleccionada,
        ...unidadActiva,
      },
    };

    console.log('=== SOLICITUD DE RESERVACIÓN ===');
    console.log(datosSolicitud);
    console.log('================================');

    // ── Reestablecer campos a vacío ──
    setEsConductor(null);
    setBusquedaConductor('');
    setConductorSeleccionado(null);
    setMostrarResultados(false);
    setDetalleMotivo('');
    setMostrarModalPersonal(false);
    setAceptaResponsabilidad(false);
    setFechaSalida('');
    setHoraSalida('');
    setFechaDevolucion('');
    setHoraDevolucion('');
    setEntidadFederativa('');
    setDireccionExacta('');
    setBusquedaAcompanante('');
    setAcompanantes([]);
    setMostrarResultadosAcompanante(false);
    setPasajeros(0);
    setMotivo('');
    setDestinoTipo('local');
    setTransportaCarga(false);
    setUnidadSeleccionada(null);
  };

  // ── Estado: modal de responsabilidad (Personal) ──
  const [mostrarModalPersonal, setMostrarModalPersonal] = useState(false);
  const [aceptaResponsabilidad, setAceptaResponsabilidad] = useState(false);

  // Lista simulada de conductores designados
  // ⚠️ Agregado campo `licencia` y `licenciaVigente`
  const conductoresDisponibles = [
    {
      id: 1,
      nombre: 'Carlos Méndez Rojas',
      empleado: 'EMP-2041',
      area: 'Logística',
      licencia: 'QRO-884512',
      licenciaVigente: true,
    },
    {
      id: 2,
      nombre: 'Ana Lucía Fernández',
      empleado: 'EMP-1873',
      area: 'Operaciones',
      licencia: 'QRO-772109',
      licenciaVigente: true,
    },
    {
      id: 3,
      nombre: 'Jorge Ramírez Soto',
      empleado: 'EMP-2210',
      area: 'Mantenimiento',
      licencia: 'QRO-661034',
      licenciaVigente: false, // ejemplo de licencia vencida
    },
    {
      id: 4,
      nombre: 'María José Ortega',
      empleado: 'EMP-1998',
      area: 'Recursos Humanos',
      licencia: 'QRO-559821',
      licenciaVigente: true,
    },
  ];

  const conductoresFiltrados = conductoresDisponibles.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busquedaConductor.toLowerCase()) ||
      c.empleado.toLowerCase().includes(busquedaConductor.toLowerCase())
  );

  // Datos del usuario titular (con fallback si no viene licenciaVigente)
  const titularLicenciaVigente = user?.licenciaVigente !== false;

  // Etiquetas de los motivos que requieren detalle
  const motivosConDetalle = {
    proveedor: 'Nombre del Proveedor',
    cliente: 'Nombre del Cliente',
    capacitacion: 'Nombre de la Capacitación',
    otro: 'Especifique el motivo',
  };

  const handleMotivoClick = (id) => {
    if (id === 'personal') {
      setMostrarModalPersonal(true);
      return;
    }
    setMotivo(id);
    setDetalleMotivo('');
  };

  const handleConfirmarPersonal = () => {
    if (aceptaResponsabilidad) {
      setMotivo('personal');
      setMostrarModalPersonal(false);
      setAceptaResponsabilidad(false);
    }
  };

  // Helper para iniciales
  const getIniciales = (nombre = '') =>
    nombre
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
      {/* ─────────── COLUMNA IZQUIERDA ─────────── */}
      <div className="space-y-5">
        {/* Tarjeta usuario (móvil/tablet) */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-linear-to-br from-white to-neutral-50 p-4 shadow-lg shadow-neutral-200/60 lg:hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/5 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-neutral-700 to-neutral-800 text-lg font-black text-white ring-1 ring-neutral-300">
              {user?.iniciales}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-extrabold tracking-tight text-neutral-900">
                    {user?.nombre}
                  </h2>
                  <p className="text-xs text-neutral-500">{user?.area}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-700">
                      EMP-{user?.empleado}
                    </span>
                    {user?.vigente && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Vigente
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Lic. {user?.licencia}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Verificado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Consultar status */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/60">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                <FaEye className="h-5 w-5 text-red-600" />
              </div>
              <p className="flex-1 text-sm font-bold text-neutral-900">
                1. Consultar status de reservación
              </p>
            </div>
            <button className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-red-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:from-red-500 hover:to-red-600 active:scale-[0.98] sm:ml-auto">
              Ver reservas pendientes
              <FaArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ── ¿Eres el conductor? ── */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                <FaUser className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                ¿Eres el conductor del viaje?
              </h3>
            </div>
            {esConductor === true && (
              <span
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                  titularLicenciaVigente
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                <FaUserCheck className="h-3 w-3" />
                Tú conduces
              </span>
            )}
            {esConductor === false && (
              <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                <FaUserTimes className="h-3 w-3" />
                Otro conductor
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEsConductor(true)}
              className={`rounded-xl border py-3 text-xs font-bold transition-all duration-200 ${
                esConductor === true
                  ? 'border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Sí, yo conduzco
            </button>
            <button
              onClick={() => setEsConductor(false)}
              className={`rounded-xl border py-3 text-xs font-bold transition-all duration-200 ${
                esConductor === false
                  ? 'border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              No, designar conductor
            </button>
          </div>

          {/* ── NUEVO: Tarjeta con mi información cuando "Sí, yo conduzco" ── */}
          {esConductor === true && (
            <div className="mt-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                Datos del Conductor Titular
              </p>

              <div
                className={`flex items-start gap-3 rounded-2xl border px-3.5 py-3.5 ${
                  titularLicenciaVigente
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-neutral-700 to-neutral-800 text-sm font-black text-white">
                  {user?.iniciales || getIniciales(user?.nombre)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-neutral-900">
                        {user}
                      </p>
                      <p className="text-[11px] text-neutral-600">
                        {user?.area}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-700">
                      EMP-{nomina}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <FaIdCard className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-[11px] font-semibold text-neutral-700">
                      Lic. {user?.licencia || 'No registrada'}
                    </span>
                  </div>

                  <div className="mt-2">
                    {titularLicenciaVigente ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <FaShieldAlt className="h-3 w-3" />
                        Licencia vigente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-white px-2 py-0.5 text-[10px] font-bold text-red-700">
                        <FaExclamationTriangle className="h-3 w-3" />
                        Licencia NO vigente
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!titularLicenciaVigente && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3">
                  <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <p className="text-[11px] leading-relaxed text-red-900">
                    Tu licencia no está vigente. No puedes figurar como
                    conductor de esta reservación. Actualiza tu licencia o
                    designa a otro conductor.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Campo de búsqueda del conductor designado */}
          {esConductor === false && (
            <div className="mt-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                Buscar Conductor Designado
              </p>

              <div className="relative">
                <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
                  <FaSearch className="h-4 w-4 shrink-0 text-red-600" />
                  <input
                    type="text"
                    value={busquedaConductor}
                    onChange={(e) => {
                      setBusquedaConductor(e.target.value);
                      setMostrarResultados(true);
                    }}
                    onFocus={() => setMostrarResultados(true)}
                    placeholder="Nombre o número de empleado..."
                    className="flex-1 bg-transparent text-xs font-semibold text-neutral-900 placeholder-neutral-400 outline-none"
                  />
                  {conductorSeleccionado && (
                    <button
                      onClick={() => {
                        setConductorSeleccionado(null);
                        setBusquedaConductor('');
                      }}
                      className="text-[10px] font-bold text-red-600 hover:underline"
                    >
                      Cambiar
                    </button>
                  )}
                </div>

                {/* Resultados de búsqueda */}
                {mostrarResultados &&
                  !conductorSeleccionado &&
                  busquedaConductor && (
                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-300/40">
                      {conductoresFiltrados.length > 0 ? (
                        conductoresFiltrados.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setConductorSeleccionado(c);
                              setBusquedaConductor(c.nombre);
                              setMostrarResultados(false);
                            }}
                            className="flex w-full items-center gap-3 border-b border-neutral-100 px-3.5 py-3 text-left transition hover:bg-red-50 last:border-0"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-neutral-600 to-neutral-700 text-[11px] font-black text-white">
                              {getIniciales(c.nombre)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-neutral-900">
                                {c.nombre}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                {c.empleado} · {c.area}
                              </p>
                            </div>
                            {c.licenciaVigente ? (
                              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                                Vigente
                              </span>
                            ) : (
                              <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
                                Vencida
                              </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="px-3.5 py-3 text-xs text-neutral-500">
                          Sin resultados para "{busquedaConductor}"
                        </p>
                      )}
                    </div>
                  )}
              </div>

              {/* Tarjeta del conductor seleccionado */}
              {conductorSeleccionado && (
                <div
                  className={`rounded-2xl border px-3.5 py-3.5 ${
                    conductorSeleccionado.licenciaVigente
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-neutral-700 to-neutral-800 text-sm font-black text-white">
                      {getIniciales(conductorSeleccionado.nombre)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-neutral-900">
                            {conductorSeleccionado.nombre}
                          </p>
                          <p className="text-[11px] text-neutral-600">
                            {conductorSeleccionado.area}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-700">
                          {conductorSeleccionado.empleado}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <FaIdCard className="h-3.5 w-3.5 text-neutral-500" />
                        <span className="text-[11px] font-semibold text-neutral-700">
                          Lic. {conductorSeleccionado.licencia}
                        </span>
                      </div>

                      <div className="mt-2">
                        {conductorSeleccionado.licenciaVigente ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <FaShieldAlt className="h-3 w-3" />
                            Licencia vigente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-white px-2 py-0.5 text-[10px] font-bold text-red-700">
                            <FaExclamationTriangle className="h-3 w-3" />
                            Licencia NO vigente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!conductorSeleccionado.licenciaVigente && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-white px-3 py-2.5">
                      <FaExclamationTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                      <p className="text-[11px] leading-relaxed text-red-900">
                        Este conductor tiene la licencia vencida. No puede ser
                        designado hasta regularizar su situación.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Grid 2 columnas para secciones en desktop */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Periodo */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                  <FaCalendarAlt className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  2. Periodo de Reservación
                </h3>
              </div>
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">
                58 hrs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-neutral-200 bg-linear-to-b from-neutral-50 to-white p-3.5">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                  Fecha Salida
                </p>
                <input
                  type="date"
                  value={fechaSalida}
                  onChange={(e) => setFechaSalida(e.target.value)}
                  className="w-full bg-transparent text-base font-extrabold tracking-tight text-neutral-900 outline-none"
                />
                <div className="mt-1.5 flex items-center gap-1">
                  <FaClock className="h-3 w-3 text-red-600" />
                  <input
                    type="time"
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-red-600 outline-none"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-linear-to-b from-neutral-50 to-white p-3.5">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                  Fecha Devolución
                </p>
                <input
                  type="date"
                  value={fechaDevolucion}
                  onChange={(e) => setFechaDevolucion(e.target.value)}
                  className="w-full bg-transparent text-base font-extrabold tracking-tight text-neutral-900 outline-none"
                />
                <div className="mt-1.5 flex items-center gap-1">
                  <FaClock className="h-3 w-3 text-neutral-500" />
                  <input
                    type="time"
                    value={horaDevolucion}
                    onChange={(e) => setHoraDevolucion(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-neutral-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Pasajeros */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                  <FaUsers className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  3. Pasajeros & Tripulación
                </h3>
              </div>
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">
                Máx. 5 plazas
              </span>
            </div>

            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Número de Personas
            </p>
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <button
                onClick={() => setPasajeros(Math.max(0, pasajeros - 1))}
                disabled={pasajeros === 0}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
                  pasajeros === 0
                    ? 'border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-red-600 hover:text-white'
                }`}
              >
                <FaMinus className="h-3 w-3" />
              </button>
              <span className="text-2xl font-black tabular-nums text-neutral-900">
                {pasajeros}
              </span>
              <button
                onClick={() => setPasajeros(Math.min(5, pasajeros + 1))}
                disabled={pasajeros >= 5}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
                  pasajeros >= 5
                    ? 'border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-red-600 hover:text-white'
                }`}
              >
                <FaPlus className="h-3 w-3" />
              </button>
            </div>
            <p className="mb-2 text-[10px] text-neutral-500">
              {acompanantes.length > 0
                ? `${pasajeros} persona${pasajeros !== 1 ? 's' : ''} + ${acompanantes.length} acompañante${acompanantes.length > 1 ? 's' : ''}`
                : pasajeros > 0
                ? `${pasajeros} persona${pasajeros > 1 ? 's' : ''} sin acompañantes`
                : 'Agrega acompañantes o incrementa el número de personas'}
            </p>

            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Nombres de Acompañantes
            </p>
            <div className="relative">
              <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
                <FaSearch className="h-4 w-4 shrink-0 text-red-600" />
                <input
                  type="text"
                  value={busquedaAcompanante}
                  onChange={(e) => {
                    setBusquedaAcompanante(e.target.value);
                    setMostrarResultadosAcompanante(true);
                  }}
                  onFocus={() => setMostrarResultadosAcompanante(true)}
                  placeholder="Buscar empleado por nombre o número..."
                  className="flex-1 bg-transparent text-xs font-semibold text-neutral-900 placeholder-neutral-400 outline-none"
                />
              </div>

              {/* Resultados de búsqueda */}
              {mostrarResultadosAcompanante && busquedaAcompanante && (
                <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-300/40">
                  {empleadosFiltrados.length > 0 ? (
                    empleadosFiltrados.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => agregarAcompanante(e)}
                        className="flex w-full items-center gap-3 border-b border-neutral-100 px-3.5 py-3 text-left transition hover:bg-red-50 last:border-0"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-neutral-600 to-neutral-700 text-[11px] font-black text-white">
                          {getIniciales(e.nombre)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-neutral-900">
                            {e.nombre}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            {e.empleado} · {e.area}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="px-3.5 py-3 text-xs text-neutral-500">
                      Sin resultados para "{busquedaAcompanante}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Lista de acompañantes agregados */}
            {acompanantes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {acompanantes.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700"
                  >
                    {a.nombre}
                    <button
                      onClick={() => eliminarAcompanante(a.id)}
                      className="text-red-400 transition hover:text-red-600"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Selección de Unidad */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                <FaCar className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                2. Selección de Unidad
              </h3>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              4 Flotas Activas
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {flota.map((unidad) => {
              const seleccionada = unidadSeleccionada === unidad.id;
              return (
                <button
                  key={unidad.id}
                  onClick={() =>
                    unidad.disponible && setUnidadSeleccionada(unidad.id)
                  }
                  disabled={!unidad.disponible}
                  className={`group relative overflow-hidden rounded-2xl border-2 bg-white text-left transition-all duration-300 ${
                    seleccionada
                      ? 'border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  } ${!unidad.disponible ? 'opacity-60' : ''}`}
                >
                  <div className="relative h-32 overflow-hidden bg-neutral-100 sm:h-28">
                    <img
                      src={unidad.imagen}
                      alt={unidad.modelo}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                        seleccionada ? 'opacity-100' : 'opacity-90'
                      }`}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
                    {unidad.disponible && (
                      <span
                        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full transition ${
                          seleccionada
                            ? 'bg-red-500 shadow-lg shadow-red-500/40'
                            : 'bg-emerald-500'
                        }`}
                      >
                        <FaCheck className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    {!unidad.disponible && (
                      <span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    )}
                  </div>
                  <div className="p-3">
                    <p
                      className={`text-[9px] font-black uppercase tracking-[0.15em] ${unidad.categoriaColor}`}
                    >
                      {unidad.categoria}
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-neutral-900">
                      {unidad.modelo}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-neutral-500">
                        {unidad.placas}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${unidad.estadoColor}`}
                      >
                        {unidad.estado === 'Disponible'
                          ? 'Disp.'
                          : unidad.estado}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Motivo */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                <FaFileAlt className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                4. Motivo del Viaje
              </h3>
            </div>
            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
              Auditable
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { id: 'proveedor', label: 'Proveedor' },
              { id: 'cliente', label: 'Cliente' },
              { id: 'capacitacion', label: 'Capacitación' },
              { id: 'otro', label: 'Otro' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => handleMotivoClick(m.id)}
                className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition-all duration-200 ${
                  motivo === m.id
                    ? 'border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {m.label}
              </button>
            ))}
            <button
              onClick={() => handleMotivoClick('personal')}
              className={`col-span-2 flex items-center justify-center gap-2 rounded-xl border px-2 py-2.5 text-xs font-bold transition-all duration-200 sm:col-span-3 lg:col-span-1 ${
                motivo === 'personal'
                  ? 'border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <FaUser className="h-4 w-4" />
              Personal
            </button>
          </div>

          {motivosConDetalle[motivo] && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                {motivosConDetalle[motivo]}
              </p>
              <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
                <FaFileAlt className="h-4 w-4 shrink-0 text-red-600" />
                <input
                  type="text"
                  value={detalleMotivo}
                  onChange={(e) => setDetalleMotivo(e.target.value)}
                  placeholder={
                    motivo === 'proveedor'
                      ? 'Ej. Ferretería Industrial del Norte S.A. de C.V.'
                      : motivo === 'cliente'
                      ? 'Ej. Grupo Bimbo S.A.B. de C.V.'
                      : motivo === 'capacitacion'
                      ? 'Ej. Certificación en Manejo de Montacargas'
                      : 'Describa el motivo del viaje...'
                  }
                  className="flex-1 bg-transparent text-xs font-semibold text-neutral-900 placeholder-neutral-400 outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <FaBalanceScale className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[11px] font-semibold text-amber-900">
                Responsabilidad Civil: Pendiente de Firma
              </p>
            </div>
            <button className="text-[11px] font-black text-red-600 hover:text-red-700 hover:underline">
              VER CARTA
            </button>
          </div>
        </section>

        {/* Destino + Transporta carga */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-200">
                  <FaMapMarkerAlt className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">
                  5. Destino
                </h3>
              </div>
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">
                Ruta Foránea
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setDestinoTipo('local')}
                className={`rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 ${
                  destinoTipo === 'local'
                    ? 'border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                Puebla (Local)
              </button>
              <button
                onClick={() => setDestinoTipo('foraneo')}
                className={`rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 ${
                  destinoTipo === 'foraneo'
                    ? 'border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                Otro Estado (Foráneo)
              </button>
            </div>

            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Entidad Federativa / Complejo
            </p>
            <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3.5">
              <FaBuilding className="h-4 w-4 shrink-0 text-red-600" />
              <input
                type="text"
                value={entidadFederativa}
                onChange={(e) => setEntidadFederativa(e.target.value)}
                placeholder="Ej. Querétaro (Parque Industrial Benito Juárez)"
                className="flex-1 bg-transparent text-xs font-semibold text-neutral-900 placeholder-neutral-400 outline-none"
              />
            </div>

            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Dirección Exacta y Referencias
            </p>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3.5">
              <textarea
                value={direccionExacta}
                onChange={(e) => setDireccionExacta(e.target.value)}
                placeholder="Ingrese la dirección exacta y referencias del destino..."
                rows={3}
                className="w-full resize-none bg-transparent text-xs leading-relaxed text-neutral-700 placeholder-neutral-400 outline-none"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg shadow-neutral-200/60">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                <FaBox className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    ¿Transporta Material o Carga?
                  </h3>
                  <button
                    onClick={() => setTransportaCarga((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                      transportaCarga
                        ? 'bg-linear-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/20'
                        : 'bg-neutral-300'
                    }`}
                    aria-label="Toggle transporta carga"
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                        transportaCarga ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Aplica póliza de seguro extendida
                </p>
                {transportaCarga && (
                  <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3">
                    <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-[11px] leading-relaxed text-amber-900">
                      Carga declarada: Kit calibrador óptico e instrumental de
                      campo (45 kg).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ─────────── COLUMNA DERECHA: RESUMEN ─────────── */}
      <aside className="hidden xl:block">
        <div className="sticky top-6 space-y-5">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-linear-to-b from-white to-neutral-50 shadow-lg shadow-neutral-200/60">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-neutral-900">
                Resumen
              </h3>
              <p className="mt-0.5 text-[11px] text-neutral-500">
                Verifica antes de enviar
              </p>
            </div>

            <div className="space-y-4 p-5">
              {/* Unidad activa */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="relative h-32 overflow-hidden bg-neutral-100">
                  <img
                    src={unidadActiva.imagen}
                    alt={unidadActiva.modelo}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <FaCheck className="h-3 w-3 text-white" />
                  </span>
                </div>
                <div className="bg-white p-3">
                  <p
                    className={`text-[9px] font-black uppercase tracking-[0.15em] ${unidadActiva.categoriaColor}`}
                  >
                    {unidadActiva.categoria}
                  </p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">
                    {unidadActiva.modelo}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {unidadActiva.placas}
                  </p>
                </div>
              </div>

              {/* Datos */}
              <div className="space-y-2.5 text-xs">
                {/* Conductor + estado licencia */}
                <div
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                    esConductor === true
                      ? titularLicenciaVigente
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-red-200 bg-red-50'
                      : conductorSeleccionado
                      ? conductorSeleccionado.licenciaVigente
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-red-200 bg-red-50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FaUser className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-[11px] font-semibold text-neutral-500">
                      Conductor
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-neutral-900">
                      {esConductor === true
                        ? 'Yo (Titular)'
                        : conductorSeleccionado
                        ? conductorSeleccionado.nombre.split(' ')[0] +
                          ' ' +
                          conductorSeleccionado.nombre.split(' ')[1]
                        : 'Sin asignar'}
                    </span>
                    {(esConductor === true ||
                      (esConductor === false && conductorSeleccionado)) && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          (esConductor === true &&
                            titularLicenciaVigente) ||
                          (esConductor === false &&
                            conductorSeleccionado?.licenciaVigente)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {(esConductor === true && titularLicenciaVigente) ||
                        (esConductor === false &&
                          conductorSeleccionado?.licenciaVigente)
                          ? 'Vigente'
                          : 'Vencida'}
                      </span>
                    )}
                  </div>
                </div>

                <ResumenRow
                  icon={FaCalendarAlt}
                  label="Salida"
                  value={`${fechaSalida} · ${horaSalida}`}
                />
                <ResumenRow
                  icon={FaCalendarAlt}
                  label="Devolución"
                  value={`${fechaDevolucion} · ${horaDevolucion}`}
                />
                <ResumenRow
                  icon={FaUsers}
                  label="Pasajeros"
                  value={`${pasajeros} personas`}
                />
                {acompanantes.length > 0 && (
                  <ResumenRow
                    icon={FaUsers}
                    label="Acompañantes"
                    value={acompanantes.map((a) => a.nombre.split(' ')[0]).join(', ')}
                  />
                )}
                <ResumenRow
                  icon={FaMapMarkerAlt}
                  label="Destino"
                  value={
                    destinoTipo === 'local'
                      ? 'Puebla (Local)'
                      : entidadFederativa || 'Sin especificar'
                  }
                />
                <ResumenRow
                  icon={FaFileAlt}
                  label="Motivo"
                  value={
                    motivo === 'personal'
                      ? 'Personal'
                      : motivo.charAt(0).toUpperCase() + motivo.slice(1)
                  }
                />
                {detalleMotivo && (
                  <ResumenRow
                    icon={FaFileAlt}
                    label="Detalle"
                    value={detalleMotivo}
                  />
                )}
                <ResumenRow
                  icon={FaBox}
                  label="Carga"
                  value={transportaCarga ? 'Sí (45 kg)' : 'No'}
                />
              </div>

              <button
                onClick={handleEnviarSolicitud}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-500 via-red-600 to-red-700 py-4 text-sm font-black uppercase tracking-[0.15em] text-white shadow-xl shadow-red-500/30 transition-all duration-300 hover:from-red-400 hover:via-red-500 hover:to-red-600 active:scale-[0.98]"
              >
                Enviar Solicitud
                <FaArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
                <FaLock className="h-3 w-3" />
                <span>Encriptado por AutoHub</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─────────── MODAL: Responsabilidad Personal ─────────── */}
      {mostrarModalPersonal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">
            <div className="border-b border-neutral-200 bg-linear-to-r from-red-50 to-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 ring-1 ring-red-200">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-neutral-900">
                    Aviso de Responsabilidad
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Viaje por motivos personales
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-xs leading-relaxed text-neutral-700">
                Al seleccionar <strong>Personal</strong>, usted se hace
                responsable de los gastos ocasionados por cualquier accidente,
                así como de gestionar las reparaciones y trámites
                correspondientes directamente con el gestor de la flota.
              </p>

              <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5 cursor-pointer transition hover:border-red-300 hover:bg-red-50/50">
                <input
                  type="checkbox"
                  checked={aceptaResponsabilidad}
                  onChange={(e) => setAceptaResponsabilidad(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-[11px] font-semibold text-neutral-700">
                  He leído y acepto la responsabilidad total sobre los gastos,
                  reparaciones y trámites derivados de este viaje personal.
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMostrarModalPersonal(false);
                    setAceptaResponsabilidad(false);
                  }}
                  className="flex-1 rounded-2xl border border-neutral-200 bg-white py-3 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarPersonal}
                  disabled={!aceptaResponsabilidad}
                  className={`flex-1 rounded-2xl py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition active:scale-[0.98] ${
                    aceptaResponsabilidad
                      ? 'bg-linear-to-r from-red-500 to-red-700 shadow-lg shadow-red-500/30 hover:from-red-400 hover:to-red-600'
                      : 'bg-neutral-300 cursor-not-allowed'
                  }`}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────── Fila del resumen ─────────── */
function ResumenRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-red-600" />
        <span className="text-[11px] font-semibold text-neutral-500">
          {label}
        </span>
      </div>
      <span className="text-[11px] font-bold text-neutral-900">{value}</span>
    </div>
  );
}

export default Reservar;