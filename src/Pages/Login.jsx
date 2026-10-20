// src/Screens/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const API_URL = import.meta.env.VITE_API_URL;

const enviarData = async (apiUrl, data) => {
    try {
        const resp = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        })
        if (!resp.ok) {
        throw new Error(`Error en la respuesta de la API: ${resp.estado}`)
        }
        return await resp.json();
    } catch (error) {
        console.error("Error en la solicitud:", error)
        throw error
    }
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!username.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    if (username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);

    const loginData = { aksi: "login", username: username, password: password }
    
    try {
      const response = await enviarData(API_URL, loginData)

      if (response.estado === "success" || response.status === "success") {
          login(username, response.nn)
          navigate("/AutoHub/home", { 
              replace: true, 
              state: { 
                  usuario: username,
                  nn: response.nn,
              } 
          })
      } else {
          setError(response.message || response.mensaje || "Credenciales incorrectas. Intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setError("Error de conexión. Intenta de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex h-screen supports-[height:100dvh]:h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-neutral-50 via-white to-neutral-100 p-4 font-sans sm:p-6 [@media(max-height:780px)]:p-3">

      {/* ═══════════════════════════════════════════════════════════
          KEYFRAMES INLINE (sin CSS externo)
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

      {/* ─── CAPA 1: Cuadrícula fina clara (48px) con pulso ─── */}
      <div
        aria-hidden="true"
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

      {/* ─── CAPA 2: Cuadrícula secundaria 12px tinte rojo tipo blueprint ─── */}
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

      {/* ─── CAPA 4: Halo neutro inferior-derecho (balance) ─── */}
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

      {/* ─── CAPA 6: Línea de escaneo horizontal roja ─── */}
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

      {/* ─── CAPA 7: Marcas de esquina tipo plano técnico (L en 4 esquinas) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-red-500/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-red-500/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-red-500/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-red-500/40"
      />

      {/* ─── CAPA 8: Texto corporativo (inferior-izquierda) ─── */}
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

      {/* ─── CAPA 9: Texto corporativo (inferior-derecha) ─── */}
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

      {/* ─── CAPA 10: Línea roja inferior tipo racing ─── */}
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
      <div className="relative z-10 w-full max-w-md max-h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        
        {/* Barra superior estilo navegador (puntos de colores) */}
        <div className="shrink-0 bg-neutral-50 px-4 py-3 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">AutoHub</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] font-bold text-neutral-400">En línea</span>
          </div>
        </div>

        {/* Contenido del Login */}
        <div className="p-8 [@media(max-height:780px)]:p-5 [@media(max-height:600px)]:p-4 flex-1 min-h-0 overflow-y-auto">
          
          {/* Logo */}
          <div className="flex justify-center mb-6 [@media(max-height:780px)]:mb-4 [@media(max-height:600px)]:hidden">
            <div className="w-16 h-16 [@media(max-height:780px)]:w-12 [@media(max-height:780px)]:h-12 bg-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-700/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 [@media(max-height:780px)]:h-6 [@media(max-height:780px)]:w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.83.75 1.46 2.08 1.46 1.42 0 1.94-.63 1.94-1.46 0-.73-.41-1.15-2.19-1.67-2.14-.6-3.58-1.47-3.58-3.46 0-1.77 1.25-2.91 3.06-3.27V4h2.67v1.93c1.65.32 2.88 1.32 3.06 3.06h-1.96c-.14-.77-.68-1.38-1.88-1.38-1.15 0-1.78.56-1.78 1.36 0 .75.47 1.11 2.19 1.61 2.24.66 3.58 1.52 3.58 3.52 0 1.88-1.34 3.01-3.21 3.36z"/>
              </svg>
            </div>
          </div>

          {/* Títulos */}
          <div className="text-center mb-8 [@media(max-height:780px)]:mb-5">
            <h1 className="text-[13px] sm:text-sm font-black tracking-[0.18em] text-red-600 uppercase">
              KAYSER AUTOMOTIVE SYSTEMS
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em] mt-2">
              AutoHub
            </p>
            <h2 className="text-3xl [@media(max-height:780px)]:text-2xl [@media(max-height:600px)]:text-xl font-black text-neutral-900 mt-6 [@media(max-height:780px)]:mt-3">
              Accede a tu panel
            </h2>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 [@media(max-height:780px)]:mb-3 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-semibold">{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5 [@media(max-height:780px)]:space-y-3">
            
            {/* Campo Usuario */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="mx-user"
                  className="w-full pl-10 pr-4 py-3 [@media(max-height:780px)]:py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-neutral-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Campo Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  className="w-full pl-10 pr-12 py-3 [@media(max-height:780px)]:py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-neutral-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Botón Submit */}
            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white font-black py-4 [@media(max-height:780px)]:py-3 rounded-xl shadow-lg shadow-red-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Entrar al panel
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Divisor */}
          <div className="flex items-center gap-3 my-6 [@media(max-height:780px)]:my-3">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300"></div>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>
        </div>

        {/* Footer inferior */}
        <div className="shrink-0 bg-neutral-50 border-t border-neutral-200 px-6 py-3 flex items-center justify-between">
          <span className="text-[9px] font-medium text-neutral-400">
            © 2026 Kayser Automotive Systems
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[9px] font-medium text-neutral-400 hover:text-neutral-600">Privacidad</a>
            <a href="#" className="text-[9px] font-medium text-neutral-400 hover:text-neutral-600">Términos</a>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-bold text-emerald-600">Sesion segura</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;