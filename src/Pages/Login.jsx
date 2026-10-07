import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarData } from '../api/Api';
import { useUser } from '../context/UserContext';

// ─── Iconos desde react-icons ───
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiCheckCircle, FiShield, FiUserPlus, FiLifeBuoy } from 'react-icons/fi';
import { FaCarSide } from 'react-icons/fa';

function Login({
  logo = null,
  companyName = 'Kayser Automotive Systems',
  systemLabel = 'AutoHub',
  greeting = 'Accede a tu panel',
  subtitle = 'Gestiona vehículos utilitarios',

  onForgotPassword = () => alert('Recuperar contraseña'),
  onRegister = () => alert('Solicitar acceso'),
  onSupport = () => alert('Contactar soporte'),
}) {
  const navigate = useNavigate();
  const { login } = useUser();

  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Ingresa tu usuario';
    else if (form.username.trim().length < 3)
      newErrors.username = 'Mínimo 3 caracteres';
    if (!form.password) newErrors.password = 'Ingresa tu contraseña';
    else if (form.password.length < 6)
      newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
    if (serverSuccess) setServerSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setServerSuccess('');

    if (!validate()) return;

    setLoading(true);

    const loginData = {
      aksi: 'login',
      username: form.username.trim(),
      password: form.password,
    };

    try {
      const response = await enviarData(loginData);

      const isSuccess =
        response?.estado === 'success' || response?.status === 'success';

      if (isSuccess) {
        setServerSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

        login(form.username.trim(), response.nn);

        if (form.remember) {
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('remember');
        }

        setTimeout(() => {
          navigate('/AutoHub/home', {
            replace: true,
            state: {
              usuario: form.username.trim(),
              nn: response.nn,
            },
          });
        }, 1200);
      } else {
        setServerError(
          response?.message ||
            response?.mensaje ||
            'Credenciales incorrectas. Intenta de nuevo.'
        );
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setServerError('Error de conexión. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-neutral-50 via-white to-neutral-100 p-4 font-sans sm:p-6">

      {/* ═══════════════════════════════════════════════════════════
          KEYFRAMES INLINE
      ═══════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes gridFade {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.8;  }
        }
        @keyframes blueprintScan {
          0%   { top: -2px;  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%;  opacity: 0; }
        }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.4; transform: scale(1);    }
          50%      { opacity: 0.7; transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-grid-fade, .anim-scan, .anim-corner { animation: none !important; }
        }
      `}</style>

      {/* ─── CAPA 1: Cuadrícula fina clara (48px) ─── */}
      <div aria-hidden="true"
        className="anim-grid-fade pointer-events-none absolute inset-0"
        style={{
          animation: 'gridFade 10s ease-in-out infinite',
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.055) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 35%, transparent 85%)',
        }}
      />

      {/* ─── CAPA 2: Cuadrícula secundaria muy fina (12px) tipo "blueprint" ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(220,38,38,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(220,38,38,0.035) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          maskImage:
            'radial-gradient(ellipse at center, black 25%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 25%, transparent 70%)',
        }}
      />

      {/* ─── CAPA 3: Halo rojo superior-izquierdo (marca) ─── */}
      <div
        aria-hidden="true"
        className="anim-corner pointer-events-none absolute -top-40 -left-40 h-130 w-130 rounded-full blur-[110px]"
        style={{
          animation: 'cornerGlow 9s ease-in-out infinite',
          background:
            'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(220,38,38,0.08) 40%, transparent 72%)',
        }}
      />

      {/* ─── CAPA 4: Halo gris neutro inferior-derecho (balance) ─── */}
      <div
        aria-hidden="true"
        className="anim-corner pointer-events-none absolute -bottom-40 -right-40 h-130 w-130 rounded-full blur-[120px]"
        style={{
          animation: 'cornerGlow 11s ease-in-out infinite',
          animationDelay: '2s',
          background:
            'radial-gradient(circle, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.04) 45%, transparent 75%)',
        }}
      />

      {/* ─── CAPA 5: Halo rojo tenue arriba-derecha (acento) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-[15%] h-70 w-70 rounded-full blur-[80px]"
        style={{
          background:
            'radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 70%)',
        }}
      />

      {/* ─── CAPA 6: Línea de escaneo horizontal roja (blueprint scan) ─── */}
      <div
        aria-hidden="true"
        className="anim-scan pointer-events-none absolute left-0 right-0 h-px"
        style={{
          animation: 'blueprintScan 12s linear infinite',
          background:
            'linear-gradient(to right, transparent, rgba(220,38,38,0.35) 25%, rgba(220,38,38,0.7) 50%, rgba(220,38,38,0.35) 75%, transparent)',
          boxShadow: '0 0 18px rgba(220,38,38,0.35)',
        }}
      />

      {/* ─── CAPA 7: Esquinas de "plano técnico" (marcas L en 4 esquinas) ─── */}
      {/* Esquina superior-izquierda */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-red-500/40"
      />
      {/* Esquina superior-derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-red-500/40"
      />
      {/* Esquina inferior-izquierda */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-red-500/40"
      />
      {/* Esquina inferior-derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-red-500/40"
      />

      {/* ─── CAPA 8: Texto corporativo decorativo (esquina inferior-izquierda) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-10 hidden flex-col gap-1 sm:flex"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400/70">
          AUTO · UTILITARIOS
        </span>
        <span className="text-[8px] uppercase tracking-[0.25em] text-neutral-300">
          FLEET CONTROL SYSTEM · V2.0
        </span>
      </div>

      {/* ─── CAPA 9: Texto corporativo decorativo (esquina inferior-derecha) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-10 hidden flex-col items-end gap-1 sm:flex"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-500/60">
          KAYSER · AUTOMOTIVE
        </span>
        <span className="text-[8px] uppercase tracking-[0.25em] text-neutral-300">
          SECURE ACCESS NODE
        </span>
      </div>

      {/* ─── CAPA 10: Línea roja inferior tipo "racing" ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 5%, rgba(220,38,38,0.6) 50%, transparent 95%)',
          boxShadow: '0 0 16px rgba(220,38,38,0.3)',
        }}
      />

      {/* ─── CAPA 11: Línea superior sutil ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent)',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          VENTANA DEL SISTEMA
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_25px_70px_-15px_rgba(220,38,38,0.20),0_15px_50px_-15px_rgba(0,0,0,0.15)]">
        {/* Barra superior macOS */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {systemLabel}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>En línea</span>
          </div>
        </div>

        {/* Cabecera */}
        <div className="flex flex-col items-center border-b border-neutral-100 px-8 pb-6 pt-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-red-600/30 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-linear-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/25">
              {logo ? (
                <img
                  src={logo}
                  alt={companyName}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <FaCarSide className="h-8 w-8 text-white" />
              )}
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            {companyName}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {systemLabel}
          </p>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {greeting}
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">{subtitle}</p>
          </div>
        </div>

        {/* Formulario */}
        <main className="px-8 py-8 sm:px-10">
          {serverError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <FiAlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
              <span>{serverError}</span>
            </div>
          )}

          {serverSuccess && (
            <div
              role="status"
              className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <FiCheckCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
              <span>{serverSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Usuario */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                Usuario
              </label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="mx-user"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4 disabled:bg-neutral-50 disabled:opacity-70 ${
                    errors.username
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-500/10'
                      : 'border-neutral-200 focus:border-red-500 focus:ring-red-500/10 hover:border-neutral-300'
                  }`}
                />
              </div>
              {errors.username && (
                <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <FiAlertCircle className="h-3.5 w-3.5" />
                  {errors.username}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-700"
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-medium text-red-600 transition hover:text-red-700 hover:underline"
                >
                  ¿La olvidaste?
                </button>
              </div>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-12 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4 disabled:bg-neutral-50 disabled:opacity-70 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-500/10'
                      : 'border-neutral-200 focus:border-red-500 focus:ring-red-500/10 hover:border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <FiEye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <FiAlertCircle className="h-3.5 w-3.5" />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Recordarme */}
            <label className="flex cursor-pointer select-none items-center gap-2.5">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-red-600"
              />
              <span className="text-sm text-neutral-600">
                Mantener mi sesión activa
              </span>
            </label>

            {/* Botón principal */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-red-700 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:-translate-y-0.5 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-600/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verificando...
                </>
              ) : (
                <>
                  Entrar al panel
                  <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                o
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

          </form>
        </main>

        {/* Barra inferior */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[11px] text-neutral-500">
          <span>
            © {new Date().getFullYear()} {companyName}
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Privacidad</span>
            <span className="hidden sm:inline">Términos</span>
            <span className="flex items-center gap-1.5">
              <FiShield className="h-3 w-3 text-emerald-500" />
              Sesión segura
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;