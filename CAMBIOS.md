# Registro de Cambios - Componente Reservar

## Fecha
29 de septiembre de 2026

## Archivo Modificado
`src/Pages/Reservar.jsx`

## Descripción General
Se convirtieron campos de solo lectura (texto estático) en campos abiertos editables para permitir el ingreso de datos de prueba en el formulario de reservación.

---

## Cambios Realizados

### 1. Periodo de Reservación

**Antes:** Las fechas de salida y devolución se mostraban como texto estático no editable.

**Ahora:** Se convirtieron en inputs editables de fecha y hora.

| Campo | Tipo de Input | Estado Inicial |
|-------|---------------|----------------|
| Fecha Salida | `date` | `2024-10-24` |
| Hora Salida | `time` | `08:00` |
| Fecha Devolución | `date` | `2024-10-26` |
| Hora Devolución | `time` | `18:00` |

**Estados agregados:**
```javascript
const [fechaSalida, setFechaSalida] = useState('2024-10-24');
const [horaSalida, setHoraSalida] = useState('08:00');
const [fechaDevolucion, setFechaDevolucion] = useState('2024-10-26');
const [horaDevolucion, setHoraDevolucion] = useState('18:00');
```

---

### 2. Entidad Federativa / Complejo

**Antes:** Se mostraba como un div con texto estático y un icono de flecha (simulando un select).

**Ahora:** Se convirtió en un input de texto editable vacío.

| Campo | Tipo de Input | Estado Inicial |
|-------|---------------|----------------|
| Entidad Federativa / Complejo | `text` | *(vacío)* |

**Estado agregado:**
```javascript
const [entidadFederativa, setEntidadFederativa] = useState('');
```

---

### 3. Dirección Exacta y Referencias

**Antes:** Se mostraba como un div con texto estático de solo lectura.

**Ahora:** Se convirtió en un textarea editable vacío.

| Campo | Tipo de Input | Estado Inicial |
|-------|---------------|----------------|
| Dirección Exacta y Referencias | `textarea` (3 filas) | *(vacío)* |

**Estado agregado:**
```javascript
const [direccionExacta, setDireccionExacta] = useState('');
```

---

### 4. Actualización del Resumen

Se actualizó el panel de resumen (columna derecha) para reflejar los valores ingresados por el usuario:

- **Salida:** Muestra `fechaSalida · horaSalida`
- **Devolución:** Muestra `fechaDevolucion · horaDevolucion`
- **Destino:** Muestra el valor de `entidadFederativa` cuando el destino es foráneo

---

## Notas Adicionales

- Todos los campos mantienen valores predeterminados para facilitar las pruebas.
- Los inputs conservan el mismo estilo visual que el resto del formulario (bordes redondeados, colores consistentes).
- El textarea de dirección exacta tiene `resize-none` para evitar que el usuario cambie su tamaño.
- No se eliminó ningún elemento visual; solo se reemplazó la presentación de solo lectura por inputs editables.

---

## Actualización: Buscador de Acompañantes

### 5. Nombres de Acompañantes (Sección 3 - Pasajeros & Tripulación)

**Antes:** Se mostraba como un div con texto estático: "Lic. Sofía Ramos, Ing. Roberto Díaz"

**Ahora:** Se convirtió en un buscador interactivo de empleados con las siguientes funcionalidades:

- **Input de búsqueda:** Permite buscar empleados por nombre o número de empleado
- **Lista de resultados:** Muestra empleados filtrados en tiempo real
- **Agregar acompañantes:** Click en un empleado lo agrega a la lista
- **Eliminar acompañantes:** Botón X en cada chip para quitar de la lista
- **Máximo 4 acompañantes:** Limitado a 4 personas adicionales

**Datos de ejemplo agregados (8 empleados):**

| ID | Nombre | Empleado | Área | Puesto |
|----|--------|----------|------|--------|
| 1 | Sofía Ramos Gutiérrez | EMP-1023 | Logística | Supervisora de Transporte |
| 2 | Roberto Díaz Martínez | EMP-2041 | Operaciones | Ingeniero de Procesos |
| 3 | María José Ortega López | EMP-1873 | Recursos Humanos | Coordinadora de Personal |
| 4 | Carlos Méndez Rojas | EMP-2210 | Mantenimiento | Técnico Automotriz |
| 5 | Ana Lucía Fernández Pérez | EMP-1998 | Calidad | Auditora de Calidad |
| 6 | Jorge Ramírez Soto | EMP-1567 | Almacén | Jefe de Almacén |
| 7 | Laura Patricia Gómez Ruiz | EMP-1345 | Compras | Analista de Compras |
| 8 | Fernando Torres Vega | EMP-1789 | Seguridad | Oficial de Seguridad |

**Estados agregados:**
```javascript
const [busquedaAcompanante, setBusquedaAcompanante] = useState('');
const [acompanantes, setAcompanantes] = useState([]);
const [mostrarResultadosAcompanante, setMostrarResultadosAcompanante] = useState([]);
```

**Resumen actualizado:** Se agregó una fila "Acompañantes" en el panel de resumen que muestra los nombres de los acompañantes agregados.

---

## Actualización: Validación de Pasajeros y Acompañantes

### 6. Validación de Coincidencia entre Número de Personas y Acompañantes

**Problema:** El contador de personas y la lista de acompañantes funcionaban de forma independiente, permitiendo inconsistencias (ej. 2 personas pero 3 acompañantes seleccionados).

**Solución implementada:** Se sincronizó el contador de pasajeros con la cantidad de acompañantes seleccionados.

**Reglas de validación:**

| Regla | Descripción |
|-------|-------------|
| **Fórmula** | `pasajeros = 1 (titular) + acompanantes.length` |
| **Límite máximo** | 5 personas totales (1 titular + 4 acompañantes) |
| **Límite mínimo** | 1 persona (solo titular) |

**Comportamiento de los botones:**

| Botón | Acción | Deshabilitado cuando |
|-------|--------|---------------------|
| **− (Menos)** | Elimina el último acompañante agregado | No hay acompañantes |
| **+ (Más)** | Incrementa el contador manualmente | Se alcanza el máximo de 5 personas |

**Mensajes de ayuda:**
- Cuando hay acompañantes: "1 titular + X acompañantes = Y personas"
- Cuando no hay acompañantes: "Agrega acompañantes para incrementar el número de personas"

**Funciones actualizadas:**
```javascript
const agregarAcompanante = (empleado) => {
  if (acompanantes.length < 4 && pasajeros < 5) {
    setAcompanantes([...acompanantes, empleado]);
    setPasajeros(pasajeros + 1);  // Incrementa automáticamente
    setBusquedaAcompanante('');
    setMostrarResultadosAcompanante(false);
  }
};

const eliminarAcompanante = (id) => {
  setAcompanantes(acompanantes.filter((a) => a.id !== id));
  setPasajeros(Math.max(0, pasajeros - 1));  // Decrementa automáticamente
};
```

---

## Actualización: Valor Inicial de Pasajeros en Cero

### 7. Valor Inicial del Contador de Pasajeros

**Problema:** El contador de personas iniciaba en 3, lo que impedía seleccionar acompañantes ya que se alcanzaba rápidamente el límite máximo.

**Solución:** Se cambió el valor inicial del contador de pasajeros de 3 a 0.

**Archivo modificado:** `src/Pages/Home.jsx`

**Cambio realizado:**
```javascript
// Antes
const [pasajeros, setPasajeros] = useState(3);

// Después
const [pasajeros, setPasajeros] = useState(0);
```

**Ajustes en la lógica de validación:**

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Valor inicial** | 3 | 0 |
| **Mínimo permitido** | 1 | 0 |
| **Mensaje sin acompañantes** | "Agrega acompañantes..." | "Agrega acompañantes..." o "X personas sin acompañantes" |

**Comportamiento actual:**
- El contador inicia en 0
- Se puede incrementar hasta 5 personas
- Se puede decrementar hasta 0
- El botón "−" se deshabilita cuando no hay personas ni acompañantes
- El botón "+" se deshabilita cuando se alcanzan 5 personas

---

## Actualización: Independencia entre Pasajeros y Acompañantes

### 8. Separación del Contador de Personas y Acompañantes

**Problema:** Al agregar un acompañante, el contador de personas se incrementaba automáticamente, generando confusión. La persona que hace la reserva es aparte y no debería afectar el contador.

**Solución:** Se separó completamente el contador de personas de la lista de acompañantes. Ahora funcionan de forma independiente.

**Cambios realizados:**

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Agregar acompañante** | Incrementa `pasajeros` automáticamente | Solo agrega a la lista de acompañantes |
| **Eliminar acompañante** | Decrementa `pasajeros` automáticamente | Solo elimina de la lista de acompañantes |
| **Contador de personas** | Depende de acompañantes | Completamente independiente |
| **Límite de acompañantes** | 4 (condicionado a pasajeros < 5) | 4 (independiente) |

**Funciones actualizadas:**
```javascript
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
```

**Mensajes de ayuda actualizados:**
- **Con acompañantes:** "3 personas + 2 acompañantes"
- **Sin acompañantes:** "3 personas sin acompañantes"
- **Vacío:** "Agrega acompañantes o incrementa el número de personas"

**Comportamiento actual:**
- El contador de personas (0-5) es independiente de los acompañantes
- Los acompañantes (0-4) son información adicional
- La persona que hace la reserva no se cuenta en ninguno de los dos
- Ambos controles funcionan por separado

---

## Actualización: Función del Botón Enviar Solicitud

### 9. Implementación del Botón "Enviar Solicitud"

**Descripción:** Se creó la función `handleEnviarSolicitud` que captura todos los valores del formulario y los imprime en consola.

**Función implementada:**
```javascript
const handleEnviarSolicitud = () => {
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
};
```

**Datos capturados:**

| Sección | Campos |
|---------|--------|
| **Usuario** | nombre, empleado, area, licencia |
| **Conductor** | esConductor, conductorSeleccionado (nombre, empleado, licencia, vigencia) |
| **Periodo** | fechaSalida, horaSalida, fechaDevolucion, horaDevolucion |
| **Pasajeros** | cantidad, lista de acompañantes (nombre, empleado, area) |
| **Destino** | tipo, entidadFederativa, direccionExacta |
| **Motivo** | tipo, detalle |
| **Carga** | transportaCarga |
| **Unidad** | id, datos de unidadActiva |

**Salida en consola:**
```
=== SOLICITUD DE RESERVACIÓN ===
{ ...datos completos del formulario... }
================================
```

**Funcionalidad de reestablecimiento:**
Después de imprimir en consola, la función restablece automáticamente todos los campos del formulario a su estado inicial:

| Campo | Valor de Reestablecimiento |
|-------|----------------------------|
| `esConductor` | `null` |
| `busquedaConductor` | `''` (vacío) |
| `conductorSeleccionado` | `null` |
| `mostrarResultados` | `false` |
| `detalleMotivo` | `''` (vacío) |
| `mostrarModalPersonal` | `false` |
| `aceptaResponsabilidad` | `false` |
| `fechaSalida` | `''` (vacío) |
| `horaSalida` | `''` (vacío) |
| `fechaDevolucion` | `''` (vacío) |
| `horaDevolucion` | `''` (vacío) |
| `entidadFederativa` | `''` (vacío) |
| `direccionExacta` | `''` (vacío) |
| `busquedaAcompanante` | `''` (vacío) |
| `acompanantes` | `[]` (vacío) |
| `mostrarResultadosAcompanante` | `false` |
| `pasajeros` | `0` |
| `motivo` | `''` (vacío) |
| `destinoTipo` | `'local'` |
| `transportaCarga` | `false` |
| `unidadSeleccionada` | `null` |

**Código de reestablecimiento:**
```javascript
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
```

---

## Actualización: Validación de Campos Vacíos

### 10. Validación de Campos Obligatorios

**Descripción:** Se agregó una validación en la función `handleEnviarSolicitud` para verificar que todos los campos obligatorios estén completos antes de permitir el envío de la solicitud.

**Campos validados:**

| Campo | Condición de validación |
|-------|------------------------|
| `fechaSalida` | No debe estar vacío |
| `horaSalida` | No debe estar vacío |
| `fechaDevolucion` | No debe estar vacío |
| `horaDevolucion` | No debe estar vacío |
| `entidadFederativa` | No debe estar vacío o solo espacios |
| `direccionExacta` | No debe estar vacío o solo espacios |
| `motivo` | No debe estar vacío |
| `destinoTipo` | No debe estar vacío |
| `unidadSeleccionada` | No debe ser `null` |
| `esConductor` | No debe ser `null` (debe ser `true` o `false`) |
| `pasajeros` | Debe ser mayor a 0 |

**Comportamiento:**
- Si algún campo está vacío o es inválido, se muestra una alerta con la lista de campos faltantes
- La función se detiene (`return`) y no se imprime en consola ni se reestablecen los campos
- Solo si todos los campos están completos, se procede con el envío

**Código de validación:**
```javascript
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
if (pasajeros === 0) camposVacios.push('Número de Personas');

if (camposVacios.length > 0) {
  alert(
    `⚠️ No se puede enviar la solicitud.\n\n` +
    `Los siguientes campos están vacíos o son inválidos:\n\n` +
    camposVacios.map((c) => `• ${c}`).join('\n') +
    `\n\nPor favor complete todos los campos antes de continuar.`
  );
  return;
}
```

**Ejemplo de alerta:**
```
⚠️ No se puede enviar la solicitud.

Los siguientes campos están vacíos o son inválidos:

• Fecha de Salida
• Entidad Federativa / Complejo
• Número de Personas

Por favor complete todos los campos antes de continuar.
```

---

## Actualización: Diseño de Alertas con SweetAlert2

### 11. Instalación y Configuración de SweetAlert2

**Descripción:** Se reemplazó la alerta nativa del navegador (`alert()`) con SweetAlert2 para mostrar alertas con mejor diseño y experiencia de usuario.

**Paquete instalado:**
```bash
npm install sweetalert2
```

**Importación en el componente:**
```javascript
import Swal from 'sweetalert2';
```

**Configuración de la alerta:**
```javascript
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
```

**Características de la alerta:**

| Característica | Descripción |
|----------------|-------------|
| **Icono** | ⚠️ Warning (advertencia) |
| **Título** | "Campos incompletos" |
| **Contenido** | Lista de campos faltantes con viñetas rojas |
| **Botón** | "Entendido" con color rojo (#dc2626) |
| **Animación** | FadeInDown al aparecer, FadeOutUp al cerrar |
| **Diseño** | Moderno, centrado, con bordes redondeados |

**Ventajas sobre alert() nativo:**
- Diseño moderno y personalizable
- Animaciones suaves
- Mejor experiencia de usuario
- No bloquea el hilo principal
- Responsive y accesible

---

## Actualización: Validación de Acompañantes

### 12. Validación de Coincidencia entre Pasajeros y Acompañantes

**Problema:** Se permitía enviar la solicitud con un número de pasajeros mayor a 0 pero sin agregar los nombres de los acompañantes.

**Solución:** Se agregó una validación que verifica que si hay pasajeros, se hayan agregado los nombres de los acompañantes correspondientes.

**Regla de validación:**

| Condición | Resultado |
|-----------|-----------|
| `pasajeros > 0` y `acompanantes.length === 0` | ⚠️ Mostrar alerta solicitando acompañantes |
| `pasajeros > 0` y `acompanantes.length > 0` | ✅ Permitir envío |
| `pasajeros === 0` | ✅ Permitir envío (sin acompañantes) |

**Código de validación:**
```javascript
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
```

**Ejemplo de alerta:**
```
❓ Acompañantes requeridos

Has indicado que viajan 3 personas, pero no has agregado los nombres de los acompañantes.

Por favor, busca y agrega los nombres de los acompañantes en la sección correspondiente.

[ Agregar acompañantes ]
```

**Flujo de validación completo:**
1. Validar campos vacíos → Si hay campos vacíos, mostrar alerta
2. Validar acompañantes → Si hay pasajeros pero no acompañantes, mostrar alerta
3. Si todo está correcto → Imprimir en consola y reestablecer campos

---

## Actualización: Permitir 0 Pasajeros

### 13. Corrección de Validación para Viaje Solo

**Problema:** No se permitía enviar la solicitud cuando el número de pasajeros era 0, pero es válido que solo la persona que solicita viaje sin acompañantes.

**Solución:** Se eliminó la validación que requería que el número de pasajeros fuera mayor a 0.

**Cambio realizado:**

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Validación de pasajeros** | `if (pasajeros === 0) camposVacios.push('Número de Personas');` | *Eliminada* |
| **Pasajeros = 0** | ❌ Mostraba alerta de campo vacío | ✅ Permitido (viaje solo) |
| **Pasajeros > 0 sin acompañantes** | ⚠️ Mostraba alerta de acompañantes | ⚠️ Mostraba alerta de acompañantes |

**Reglas de validación actualizadas:**

| Condición | Resultado |
|-----------|-----------|
| `pasajeros === 0` | ✅ Permitido (solicitante viaja solo) |
| `pasajeros > 0` y `acompanantes.length === 0` | ⚠️ Mostrar alerta solicitando acompañantes |
| `pasajeros > 0` y `acompanantes.length > 0` | ✅ Permitir envío |

**Nota:** El campo "Número de Personas" ya no se considera obligatorio, ya que es válido que el solicitante viaje solo sin acompañantes.
