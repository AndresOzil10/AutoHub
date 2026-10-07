import React, { useState } from 'react';
import {
  FaCar,
  FaUser,
  FaClock,
  FaMapPin,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaTachometerAlt,
  FaSave,
  FaUndo,
  FaHistory,
  FaFileSignature,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaCamera,
  FaClipboardList,
  FaGasPump,
  FaCalendarAlt,
  FaInfoCircle,
} from 'react-icons/fa';

// ─── Componente de Fila de Inspección (Checklist) ───
const InspectionItem = ({ number, title, children, subtitle }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex justify-between items-end mb-2">
      <label className="text-xs font-bold text-gray-700">
        {number}. {title}
      </label>
      {subtitle && <span className="text-[10px] text-gray-400 font-medium">{subtitle}</span>}
    </div>
    {children}
  </div>
);

// ─── Componente para el Acordeón de Salidas Pendientes ───
const ExitAccordion = ({ vehicle, isExpanded, onToggle, onSave }) => {
  // Estados locales para este vehículo específico
  const [fuelLevel, setFuelLevel] = useState(80);
  const [tireStatus, setTireStatus] = useState('ok');
  const [licenseStatus, setLicenseStatus] = useState('valid');
  const [permitExit, setPermitExit] = useState(true);
  
  // Estado para el odómetro
  const [odometer, setOdometer] = useState(vehicle.odometer);

  // 👇 NUEVO: Estados para el reporte de daños
  const [hasDamage, setHasDamage] = useState(false);
  const [damageObservations, setDamageObservations] = useState('');

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'lg:col-span-2' : ''}`}>
      
      {/* ─── CABECERA DEL ACORDEÓN (Siempre visible) ─── */}
      <div 
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-neutral-50 transition-colors flex justify-between items-center"
      >
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <div>
              <p className="text-red-600 font-bold text-[10px] uppercase tracking-wider mb-0.5">
                {vehicle.unit}
              </p>
              <h2 className="text-base font-black text-neutral-900 leading-tight">
                {vehicle.model}
              </h2>
            </div>
            <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold border border-neutral-200">
              {vehicle.plate}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-[10px] font-medium text-neutral-500">
            <div className="flex items-center gap-1.5">
              <FaUser className="w-3 h-3" />
              {vehicle.driver}
            </div>
            <div className="flex items-center gap-1.5">
              <FaClock className="w-3 h-3" />
              {vehicle.shift}
            </div>
          </div>
        </div>

        <div className={`ml-4 text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <FaChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* ─── CONTENIDO EXPANDIBLE (Checklist) ─── */}
      {isExpanded && (
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-6 animate-in slide-in-from-top-2 duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Columna Izquierda: Info Conductor + Odómetro + Combustible */}
            <div className="space-y-6">
              {/* Info del Conductor */}
              <div className="bg-white rounded-lg p-3 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-100 p-1.5 rounded">
                      <FaUser className="w-3 h-3 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Conductor</p>
                      <p className="text-xs font-bold text-neutral-800">{vehicle.driver}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-emerald-700">APROBADO</span>
                  </div>
                </div>
                <div className="flex gap-2 text-[10px] font-medium text-neutral-600">
                  <div className="flex-1 flex items-center gap-2">
                    <FaClock className="w-3 h-3 text-neutral-400" />
                    {vehicle.shift}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <FaMapPin className="w-3 h-3 text-neutral-400" />
                    {vehicle.location}
                  </div>
                </div>
              </div>

              {/* Título Inspección */}
              <div className="flex justify-between items-end">
                <h3 className="text-xs font-black text-neutral-800 flex items-center gap-2">
                  <span className="text-red-600">⛌</span> Inspección Física In Situ
                </h3>
                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  Obligatorio
                </span>
              </div>

              {/* Odómetro */}
              <InspectionItem number="1" title="Kilometraje Inicial de Salida">
                <div className="bg-neutral-100 rounded-lg p-3 flex items-center justify-between border border-neutral-200 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <FaTachometerAlt className="w-4 h-4 text-neutral-500" />
                    <input 
                      type="text" 
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      className="bg-transparent border-none outline-none text-lg font-black text-neutral-800 w-full tracking-tight"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500">KM</span>
                </div>
                <p className="text-[9px] text-emerald-600 mt-1.5 flex items-center gap-1 font-bold">
                  <FaCheckCircle className="w-3 h-3" /> Lectura previa: {vehicle.odometerPrev} km
                </p>
              </InspectionItem>

              {/* Combustible */}
              <InspectionItem number="2" title="Nivel de Combustible Actual">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex-1"></div>
                   <span className="bg-neutral-100 text-neutral-800 text-[10px] font-black px-2 py-0.5 rounded border border-neutral-200">
                      {fuelLevel}%
                   </span>
                </div>
                <div className="flex justify-between gap-1 mb-2.5">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFuelLevel(level)}
                      className={`flex-1 py-1 text-[9px] rounded border transition-colors ${
                        fuelLevel === level
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-400 font-medium hover:bg-neutral-100'
                      }`}
                    >
                      {level}%
                    </button>
                  ))}
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${fuelLevel}%` }}
                  ></div>
                </div>
              </InspectionItem>
            </div>

            {/* Columna Derecha: Neumáticos + Licencia + Reporte Daños + Toggle + Botones */}
            <div className="space-y-6">
              
              {/* Neumáticos */}
              <InspectionItem number="3" title="Estado de Neumáticos" subtitle="4 ruedas + repuesto">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setTireStatus('ok')}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                      tireStatus === 'ok'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <FaCheckCircle className="w-4 h-4" /> OK (Óptimo)
                  </button>
                  <button
                    onClick={() => setTireStatus('fail')}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                      tireStatus === 'fail'
                        ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <FaTimesCircle className="w-4 h-4" /> NOK (Falla)
                  </button>
                </div>
                <div className="bg-neutral-100 p-2.5 rounded text-[10px] font-medium text-neutral-600 border border-neutral-200 text-center">
                  Presión calibrada a 32 PSI
                </div>
              </InspectionItem>

              {/* Licencia */}
              <InspectionItem number="4" title="Licencia Física de Conducir" subtitle="Tipo B o Federal">
                <div className="flex gap-2">
                  <button
                    onClick={() => setLicenseStatus('valid')}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                      licenseStatus === 'valid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <FaCheckCircle className="w-4 h-4" /> Vigente (OK)
                  </button>
                  <button
                    onClick={() => setLicenseStatus('expired')}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                      licenseStatus === 'expired'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <FaExclamationTriangle className="w-4 h-4" /> Vencida (NOK)
                  </button>
                </div>
              </InspectionItem>

              {/* 👇 NUEVO: Reporte de Daños Físicos */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-700">Reporte de Daños Físicos</label>
                  <span className="text-[9px] text-neutral-400 font-medium">Antes de la entrega</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setHasDamage(false)}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                      !hasDamage
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <FaCheckCircle className="w-4 h-4" /> Sin Daños
                  </button>
                  <button
                    onClick={() => setHasDamage(true)}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                      hasDamage
                        ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <FaExclamationTriangle className="w-4 h-4" /> Reportar Daño
                  </button>
                </div>

                {/* Área de observaciones (solo si hay daño) */}
                {hasDamage && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <textarea
                      value={damageObservations}
                      onChange={(e) => setDamageObservations(e.target.value)}
                      placeholder="Describe el daño físico (ej. Rayón en puerta delantera izquierda, faro roto, etc.)"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-medium text-neutral-700 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none h-20"
                    />
                    <button className="w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 text-[10px] font-bold hover:bg-neutral-50 hover:border-neutral-400 transition-colors flex items-center justify-center gap-2">
                      <FaCamera className="w-3 h-3" /> Adjuntar Evidencia Fotográfica
                    </button>
                  </div>
                )}
              </div>

              {/* Toggle Permitir Salida */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-800">¿Permitir Salida?</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">Autoriza apertura de pluma exterior</p>
                </div>
                <button
                  onClick={() => setPermitExit(!permitExit)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                    permitExit ? 'bg-emerald-600' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                      permitExit ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2">
                <button 
                  onClick={() => onSave({ odometer, hasDamage, damageObservations, fuelLevel, tireStatus, licenseStatus, permitExit })}
                  className="w-full bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white font-black py-3.5 rounded-xl shadow-lg shadow-red-700/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all"
                >
                  <FaSave className="w-4 h-4" />
                  Registrar y Permitir Salida
                </button>
                <button className="w-full text-neutral-500 font-bold py-2 rounded-xl hover:bg-neutral-200/50 transition-colors text-[10px] uppercase tracking-wider">
                  Cancelar Operación
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// ─── Componente para las Tarjetas de Devoluciones ───
const ReturnCard = ({ unit, model, plate, time, status, onCheckIn }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">{unit}</p>
        <h4 className="font-bold text-neutral-800 text-sm">{model}</h4>
      </div>
      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold border border-neutral-200">
        {plate}
      </span>
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
      <div className="flex items-center gap-2 text-[10px] font-medium text-neutral-500">
        <FaClock className="w-3 h-3" />
        {time}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
        status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}>
        {status === 'pending' ? 'Pendiente de Revisión' : 'Completado'}
      </span>
    </div>
    <button 
      onClick={onCheckIn}
      className="w-full mt-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-bold rounded-lg border border-neutral-200 transition-colors flex items-center justify-center gap-2"
    >
      <FaFileSignature className="w-3 h-3" /> Iniciar Check-in
    </button>
  </div>
);

// ─── Componente para las Tarjetas del Historial ───
const HistoryCard = ({ date, model, plate, driver, type, status, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors group"
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg mt-0.5 ${type === 'exit' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {type === 'exit' ? <FaCar className="w-4 h-4" /> : <FaUndo className="w-4 h-4" />}
      </div>
      <div>
        <h4 className="font-bold text-neutral-800 text-sm">{model}</h4>
        <p className="text-[10px] font-medium text-neutral-500">{plate} · {driver}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[9px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
            {date}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            status === 'completed' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          }`}>
            {status === 'completed' ? 'Completado' : 'Con Incidencia'}
          </span>
        </div>
      </div>
    </div>
    <FaChevronRight className="w-3 h-3 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
  </div>
);

// ─── MODAL DE CHECK-IN ───
const CheckInModal = ({ isOpen, onClose, vehicle }) => {
  const [returnOdometer, setReturnOdometer] = useState('');
  const [returnFuel, setReturnFuel] = useState(50);
  const [observations, setObservations] = useState('');
  const [hasDamage, setHasDamage] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-neutral-900 px-5 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider">Check-in de Devolución</h3>
            <p className="text-neutral-400 text-[10px] font-medium">{vehicle?.model} · {vehicle?.plate}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-1">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          <div className="bg-neutral-50 rounded-lg p-3 flex items-center gap-3 border border-neutral-200">
            <div className="bg-white p-2 rounded-full border border-neutral-200">
              <FaUser className="w-4 h-4 text-neutral-600" />
            </div>
            <div>
              <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Conductor</p>
              <p className="text-xs font-bold text-neutral-800">Ing. Carlos Mendoza</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-2">Kilometraje Final de Llegada</label>
            <div className="bg-neutral-100 rounded-lg p-3 flex items-center justify-between border border-neutral-200 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all">
              <div className="flex items-center gap-3 flex-1">
                <FaTachometerAlt className="w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  value={returnOdometer}
                  onChange={(e) => setReturnOdometer(e.target.value)}
                  placeholder="Ej. 42,950"
                  className="bg-transparent border-none outline-none text-lg font-black text-neutral-800 w-full placeholder:text-neutral-400"
                />
              </div>
              <span className="text-[10px] font-bold text-neutral-500">KM</span>
            </div>
            <p className="text-[9px] text-neutral-500 mt-1.5 font-medium">
              Odómetro de salida registrado: <span className="font-bold text-neutral-700">42,850 km</span>
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-neutral-700">Nivel de Combustible al Regreso</label>
              <span className="bg-neutral-100 text-neutral-800 text-[10px] font-black px-2 py-0.5 rounded border border-neutral-200">
                {returnFuel}%
              </span>
            </div>
            <div className="flex justify-between gap-1 mb-2.5">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((level) => (
                <button
                  key={level}
                  onClick={() => setReturnFuel(level)}
                  className={`flex-1 py-1 text-[9px] rounded border transition-colors ${
                    returnFuel === level
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-400 font-medium hover:bg-neutral-100'
                  }`}
                >
                  {level}%
                </button>
              ))}
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${returnFuel}%` }}
              ></div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-2">Estado del Vehículo</label>
            <div className="flex gap-2">
              <button
                onClick={() => setHasDamage(false)}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                  !hasDamage
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                    : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <FaCheckCircle className="w-4 h-4" /> Sin Daños
              </button>
              <button
                onClick={() => setHasDamage(true)}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border transition-all ${
                  hasDamage
                    ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                    : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <FaExclamationTriangle className="w-4 h-4" /> Reportar Daño
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-2">Observaciones / Incidencias</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ej. Rayón en puerta trasera derecha, espejo lateral suelto..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-medium text-neutral-700 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none h-24"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-2">Evidencia Fotográfica</label>
            <button className="w-full py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 text-xs font-bold hover:bg-neutral-50 hover:border-neutral-400 transition-colors flex items-center justify-center gap-2">
              <FaCamera className="w-4 h-4" /> Adjuntar Foto
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-neutral-600 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors">
            Cancelar
          </button>
          <button className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-700/20 flex items-center justify-center gap-2 transition-all">
            <FaClipboardList className="w-4 h-4" /> Confirmar Devolución
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MODAL DE DETALLE DEL HISTORIAL ───
const HistoryDetailModal = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  const isExit = record.type === 'exit';
  const isCompleted = record.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`px-5 py-4 flex justify-between items-center ${isExit ? 'bg-red-700' : 'bg-emerald-700'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              {isExit ? <FaCar className="w-5 h-5 text-white" /> : <FaUndo className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-wider">
                {isExit ? 'Detalle de Salida' : 'Detalle de Devolución'}
              </h3>
              <p className="text-white/80 text-[10px] font-medium">{record.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className={`rounded-lg p-3 border flex items-center gap-3 ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            {isCompleted ? <FaCheckCircle className="w-5 h-5 text-emerald-600" /> : <FaExclamationTriangle className="w-5 h-5 text-red-600" />}
            <div>
              <p className={`text-xs font-bold ${isCompleted ? 'text-emerald-700' : 'text-red-700'}`}>
                {isCompleted ? 'Movimiento Completado' : 'Movimiento con Incidencia'}
              </p>
              <p className="text-[10px] text-neutral-500">
                {isCompleted ? 'Sin observaciones pendientes' : 'Requiere revisión del supervisor'}
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <FaCar className="w-4 h-4 text-neutral-500" />
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Vehículo</p>
            </div>
            <p className="text-sm font-black text-neutral-800">{record.model}</p>
            <p className="text-[10px] font-medium text-neutral-500 mt-0.5">Placas: {record.plate}</p>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <FaUser className="w-4 h-4 text-neutral-500" />
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Conductor</p>
            </div>
            <p className="text-sm font-bold text-neutral-800">{record.driver}</p>
            <p className="text-[10px] font-medium text-neutral-500 mt-0.5">Licencia Tipo B · Vigente</p>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="w-4 h-4 text-neutral-500" />
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Fecha y Hora</p>
            </div>
            <p className="text-sm font-bold text-neutral-800">{record.date}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
              <div className="flex items-center gap-2 mb-1">
                <FaTachometerAlt className="w-3 h-3 text-neutral-500" />
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Odómetro</p>
              </div>
              <p className="text-sm font-black text-neutral-800">42,850</p>
              <p className="text-[9px] font-medium text-neutral-400">KM</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
              <div className="flex items-center gap-2 mb-1">
                <FaGasPump className="w-3 h-3 text-neutral-500" />
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Combustible</p>
              </div>
              <p className="text-sm font-black text-neutral-800">80%</p>
              <p className="text-[9px] font-medium text-neutral-400">Nivel</p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <FaInfoCircle className="w-4 h-4 text-neutral-500" />
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Observaciones</p>
            </div>
            <p className="text-xs font-medium text-neutral-700">
              {isCompleted 
                ? 'Vehículo entregado en condiciones óptimas. Sin daños reportados.' 
                : 'Se reportó un rayón menor en la puerta trasera derecha. Pendiente de revisión por el área de mantenimiento.'}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <button onClick={onClose} className="w-full py-3 bg-neutral-800 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const Caseta = () => {
  const [activeSubTab, setActiveSubTab] = useState('salidas');
  const [expandedExitId, setExpandedExitId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);

  const pendingExits = [
    {
      id: 'exit-1',
      unit: 'Unidad en Bahía 02',
      model: 'Taigun SUV 2024',
      plate: 'TYG-112-L',
      driver: 'Ing. Carlos Mendoza',
      shift: 'Horario 08:30 - 18:00',
      location: 'Planta Norte',
      odometer: '42,850',
      odometerPrev: '42,848',
    },
    {
      id: 'exit-2',
      unit: 'Unidad en Bahía 04',
      model: 'Transporter 2023',
      plate: 'XT-4819-B',
      driver: 'Juan Pérez',
      shift: 'Horario 09:00 - 18:00',
      location: 'Planta Sur',
      odometer: '15,200',
      odometerPrev: '15,198',
    },
    {
      id: 'exit-3',
      unit: 'Unidad en Bahía 06',
      model: 'Jetta Sedán 2023',
      plate: 'UAB-120-C',
      driver: 'María López',
      shift: 'Horario 10:00 - 19:00',
      location: 'Planta Centro',
      odometer: '8,500',
      odometerPrev: '8,498',
    },
  ];

  const historyData = [
    { id: 1, date: 'Hoy, 09:15', model: 'Taigun SUV 2024', plate: 'TYG-112-L', driver: 'Ing. Carlos Mendoza', type: 'exit', status: 'completed' },
    { id: 2, date: 'Ayer, 18:45', model: 'Transporter 2023', plate: 'XT-4819-B', driver: 'Juan Pérez', type: 'return', status: 'completed' },
    { id: 3, date: 'Ayer, 08:30', model: 'BYD Dolphin 2024', plate: 'PLK-992-A', driver: 'María López', type: 'exit', status: 'incident' },
    { id: 4, date: '22 May, 16:20', model: 'Jetta Sedán 2023', plate: 'UAB-120-C', driver: 'Roberto Gómez', type: 'return', status: 'completed' },
  ];

  const handleToggleExit = (id) => {
    setExpandedExitId(prev => prev === id ? null : id);
  };

  // Ahora recibe un objeto con todos los datos del formulario
  const handleSaveExit = (id, data) => {
    console.log(`Guardando salida para ${id}:`, data);
    setExpandedExitId(null);
  };

  const handleOpenCheckIn = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleOpenHistoryDetail = (record) => {
    setSelectedHistoryRecord(record);
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 pb-8 relative">
      
      {/* ─── TABS INTERNOS ─── */}
      <div className="bg-white p-1.5 rounded-xl shadow-sm border border-neutral-200 flex justify-between text-[11px] font-bold text-neutral-500 max-w-md">
        <button 
          onClick={() => setActiveSubTab('salidas')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'salidas' 
              ? 'bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-200/50' 
              : 'hover:bg-neutral-50'
          }`}
        >
          {activeSubTab === 'salidas' && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
          Salidas Pendientes
        </button>
        <button 
          onClick={() => setActiveSubTab('devoluciones')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'devoluciones' 
              ? 'bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-200/50' 
              : 'hover:bg-neutral-50'
          }`}
        >
          {activeSubTab === 'devoluciones' && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
          Devoluciones
        </button>
        <button 
          onClick={() => setActiveSubTab('historial')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'historial' 
              ? 'bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-200/50' 
              : 'hover:bg-neutral-50'
          }`}
        >
          {activeSubTab === 'historial' && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
          Historial
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          VISTA 1: SALIDAS PENDIENTES (Grid)
      ═══════════════════════════════════════════════════════════ */}
      {activeSubTab === 'salidas' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider flex items-center gap-2">
              <FaCar className="text-red-600 w-4 h-4" /> Salidas Pendientes
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
              {pendingExits.length} Vehículos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingExits.map((vehicle) => (
              <ExitAccordion 
                key={vehicle.id}
                vehicle={vehicle}
                isExpanded={expandedExitId === vehicle.id}
                onToggle={() => handleToggleExit(vehicle.id)}
                onSave={(data) => handleSaveExit(vehicle.id, data)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          VISTA 2: DEVOLUCIONES (Grid)
      ═══════════════════════════════════════════════════════════ */}
      {activeSubTab === 'devoluciones' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider flex items-center gap-2">
              <FaUndo className="text-red-600 w-4 h-4" /> Devoluciones Pendientes
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
              2 Vehículos
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReturnCard 
              unit="Unidad en Bahía 01"
              model="BYD Dolphin 2024"
              plate="PLK-992-A"
              time="Hoy, 14:30 hrs"
              status="pending"
              onCheckIn={() => handleOpenCheckIn({ model: 'BYD Dolphin 2024', plate: 'PLK-992-A', driver: 'Juan Pérez' })}
            />
            <ReturnCard 
              unit="Unidad en Bahía 05"
              model="Jetta Sedán 2023"
              plate="UAB-120-C"
              time="Hoy, 16:00 hrs"
              status="pending"
              onCheckIn={() => handleOpenCheckIn({ model: 'Jetta Sedán 2023', plate: 'UAB-120-C', driver: 'María López' })}
            />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          VISTA 3: HISTORIAL (Grid)
      ═══════════════════════════════════════════════════════════ */}
      {activeSubTab === 'historial' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider flex items-center gap-2">
              <FaHistory className="text-red-600 w-4 h-4" /> Historial de Movimientos
            </h3>
            <select className="text-[10px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 rounded px-2 py-1 outline-none">
              <option>Hoy</option>
              <option>Esta Semana</option>
              <option>Este Mes</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {historyData.map((record) => (
              <HistoryCard 
                key={record.id}
                date={record.date}
                model={record.model}
                plate={record.plate}
                driver={record.driver}
                type={record.type}
                status={record.status}
                onClick={() => handleOpenHistoryDetail(record)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── MODALES ─── */}
      <CheckInModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={selectedVehicle}
      />

      <HistoryDetailModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        record={selectedHistoryRecord}
      />

    </div>
  );
};

export default Caseta;