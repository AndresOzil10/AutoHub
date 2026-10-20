-- =====================================================================
--  AutoHub · Esquema de base de datos
--  Motor: InnoDB · Charset: utf8mb4 · BD destino: control (MySQL :3307)
--
--  CÓMO EJECUTAR:
--    1. Abrir phpMyAdmin (o CLI) en la BD `control`.
--    2. Ejecutar este archivo completo. Las tablas usan IF NOT EXISTS,
--       los seeds son idempotentes (ON DUPLICATE KEY UPDATE).
--
--  REGLAS DE REFERENCIA:
--    · Las columnas *_nn (VARCHAR) referencian rh.usuarios.Nomina y
--      control.usuario.nn. NO se crean FOREIGN KEYS entre bases de datos;
--      la integridad se valida en la capa PHP.
--    · NO se modifican las tablas existentes usuario / areas / responsivas.
--
--  NOTAS:
--    · Los CHECK requieren MySQL >= 8.0.16 o MariaDB >= 10.2.
--    · PENDIENTE (backend): UploadPDF en functions.php llama a
--      handleUploadPDF() que no está definida; la tabla `documentos`
--      de este esquema es su destino.
-- =====================================================================

-- USE control;  -- ajustar si se ejecuta en otra sesión

-- ---------------------------------------------------------------------
-- 1) privilegios — catálogo de roles/privilegios del módulo AutoHub
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS privilegios (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  clave      VARCHAR(30)  NOT NULL COMMENT 'admin, gerente, admin_flota, director, caseta, solicitante',
  nombre     VARCHAR(60)  NOT NULL,
  nivel      TINYINT      NOT NULL DEFAULT 0 COMMENT 'Orden de firma 0-4; 99 = acceso total',
  activo     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_privilegios_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catalogo de privilegios (roles) de AutoHub';

-- ---------------------------------------------------------------------
-- 2) usuario_privilegios — asignación nn -> privilegio
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_privilegios (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nn            VARCHAR(10)  NOT NULL COMMENT 'Nomina -> rh.usuarios.Nomina (sin FK cruzada)',
  privilegio_id INT UNSIGNED NOT NULL,
  asignado_por  VARCHAR(10)  NULL COMMENT 'Nomina de quien realizo la asignacion',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_privilegio (nn, privilegio_id),
  KEY idx_up_nn (nn),
  CONSTRAINT fk_up_privilegio FOREIGN KEY (privilegio_id)
    REFERENCES privilegios (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Asignacion de privilegios por nomina (una persona puede tener varios)';

-- ---------------------------------------------------------------------
-- 3) autos — unidades de la flota
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS autos (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  clave            VARCHAR(30)  NOT NULL COMMENT 'dolphin, transporter, jetta, taigun',
  modelo           VARCHAR(80)  NOT NULL,
  categoria        VARCHAR(40)  NULL,
  placas           VARCHAR(20)  NOT NULL,
  especificaciones TEXT         NULL,
  anio             SMALLINT     NULL,
  imagen           VARCHAR(255) NULL,
  estado           ENUM('disponible','revision','mantenimiento','bloqueado') NOT NULL DEFAULT 'disponible',
  ubicacion        VARCHAR(100) NULL,
  odometro         INT UNSIGNED NOT NULL DEFAULT 0,
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_autos_clave (clave),
  UNIQUE KEY uq_autos_placas (placas),
  KEY idx_autos_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Vehiculos utilitarios de la flota';

-- ---------------------------------------------------------------------
-- 4) mantenimientos — agenda de no-disponibilidad / servicio de autos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mantenimientos (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  auto_id            INT UNSIGNED NOT NULL,
  tipo               ENUM('preventivo','correctivo','emergencia') NOT NULL,
  motivo             TEXT         NULL,
  fecha_salida       DATE         NOT NULL COMMENT 'Dia en que el auto deja de estar disponible',
  fecha_estimada     DATE         NOT NULL COMMENT 'Regreso estimado al servicio',
  fecha_regreso_real DATE         NULL     COMMENT 'NULL mientras el mantenimiento este activo',
  taller             VARCHAR(100) NULL,
  responsable_nn     VARCHAR(10)  NULL COMMENT 'Nomina del responsable del servicio',
  estado             ENUM('activo','cerrado') NOT NULL DEFAULT 'activo',
  costo              DECIMAL(10,2) NULL COMMENT 'Costo del servicio: reportes por vehiculo/mes/taller',
  creado_por_nn      VARCHAR(10)  NULL,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mto_auto (auto_id),
  KEY idx_mto_estado (estado),
  KEY idx_mto_fechas (fecha_salida),
  CONSTRAINT fk_mto_auto FOREIGN KEY (auto_id)
    REFERENCES autos (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CHECK (fecha_estimada >= fecha_salida),
  CHECK (fecha_regreso_real IS NULL OR fecha_regreso_real >= fecha_salida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Agenda de no disponibilidad: 1 mantenimiento activo por auto';

-- ---------------------------------------------------------------------
-- 5) licencias — licencias de conducir por empleado (nn)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS licencias (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nn          VARCHAR(10)  NOT NULL COMMENT 'Titular -> rh.usuarios.Nomina (sin FK cruzada)',
  numero      VARCHAR(30)  NOT NULL,
  tipo        ENUM('A','B','C','D','E') NOT NULL,
  expedicion  DATE         NULL,
  vencimiento DATE         NOT NULL,
  entidad     VARCHAR(60)  NULL COMMENT 'Entidad federativa que expide',
  principal   TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = licencia principal del empleado',
  archivo     VARCHAR(255) NULL COMMENT 'Ruta del PDF/imagen en uploads/',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lic_nn_principal (nn, principal),
  KEY idx_lic_nn (nn),
  KEY idx_lic_vencimiento (vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Licencias de conducir; UNIQUE(nn, principal) limita a 1 principal por empleado';

-- ---------------------------------------------------------------------
-- 6) solicitudes — maestro de reservaciones de unidades
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes (
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  folio                   VARCHAR(20)  NOT NULL COMMENT 'FL-#### autogenerado en PHP',
  solicitante_nn          VARCHAR(10)  NOT NULL,
  auto_solicitado_id      INT UNSIGNED NULL COMMENT 'Unidad elegida en el formulario',
  auto_asignado_id        INT UNSIGNED NULL COMMENT 'Unidad asignada/reasignada en etapa N2',
  licencia_id             INT UNSIGNED NULL COMMENT 'Licencia del conductor declarada',
  fecha_salida            DATE         NOT NULL,
  hora_salida             TIME         NOT NULL,
  fecha_devolucion        DATE         NOT NULL,
  hora_devolucion         TIME         NOT NULL,
  destino_tipo            ENUM('local','foraneo') NOT NULL DEFAULT 'local',
  entidad_federativa      VARCHAR(60)  NULL COMMENT 'Solo cuando destino_tipo = foraneo',
  direccion_exacta        TEXT         NULL,
  motivo                  ENUM('proveedor','cliente','capacitacion','otro','personal') NOT NULL,
  motivo_detalle          TEXT         NULL COMMENT 'Requerido cuando motivo = otro',
  pasajeros               TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Contador (0-5); el detalle va en solicitud_pasajeros',
  es_conductor            TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1 = el solicitante conduce',
  conductor_nn            VARCHAR(10)  NULL COMMENT 'Nomina del conductor cuando es_conductor = 0',
  transporta_carga        TINYINT(1)   NOT NULL DEFAULT 0,
  descripcion_carga       TEXT         NULL,
  acepta_responsabilidad  TINYINT(1)   NOT NULL DEFAULT 0,
  estado                  ENUM('borrador','en_validacion','aprobada','rechazada','cancelada','en_viaje','completada') NOT NULL DEFAULT 'en_validacion',
  motivo_rechazo          TEXT         NULL,
  nota                    TEXT         NULL,
  created_at              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sol_folio (folio),
  KEY idx_sol_solicitante (solicitante_nn),
  KEY idx_sol_estado (estado),
  KEY idx_sol_fechas (fecha_salida, fecha_devolucion),
  KEY idx_sol_asignado (auto_asignado_id),
  CONSTRAINT fk_sol_auto_solicitado FOREIGN KEY (auto_solicitado_id)
    REFERENCES autos (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_sol_auto_asignado FOREIGN KEY (auto_asignado_id)
    REFERENCES autos (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_sol_licencia FOREIGN KEY (licencia_id)
    REFERENCES licencias (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CHECK (pasajeros BETWEEN 0 AND 5),
  CHECK (fecha_devolucion >= fecha_salida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Maestro de solicitudes de unidades';

-- ---------------------------------------------------------------------
-- 7) solicitud_pasajeros — acompañantes (versión delgada: solo nn)
--     Nombre/area/puesto se obtienen de rh.usuarios por JOIN.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitud_pasajeros (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  solicitud_id INT UNSIGNED NOT NULL,
  nn           VARCHAR(10)  NOT NULL COMMENT 'Acompanante -> rh.usuarios.Nomina',
  orden        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Posicion en la lista (max 4)',
  PRIMARY KEY (id),
  UNIQUE KEY uq_sp_solicitud_nn (solicitud_id, nn),
  KEY idx_sp_nn (nn),
  CONSTRAINT fk_sp_solicitud FOREIGN KEY (solicitud_id)
    REFERENCES solicitudes (id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Detalle de acompanantes por solicitud (0 a 4 filas)';

-- ---------------------------------------------------------------------
-- 8) solicitud_aprobaciones — flujo de 4 etapas (N1..N4)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitud_aprobaciones (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  solicitud_id  INT UNSIGNED NOT NULL,
  etapa         TINYINT UNSIGNED NOT NULL COMMENT '1=Gte.Area 2=AdminFlota 3=Dir.Planta 4=Caseta',
  privilegio_id INT UNSIGNED NOT NULL COMMENT 'Rol que firma la etapa',
  aprobador_nn  VARCHAR(10)  NULL COMMENT 'Nomina de quien firma (NULL = aun en espera)',
  estado        ENUM('espera','validando','aprobado','rechazado') NOT NULL DEFAULT 'espera',
  comentario    TEXT         NULL,
  dictamen      TEXT         NULL COMMENT 'Dictamen tecnico de la etapa 2 (reasignacion)',
  fecha_accion  DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sa_solicitud_etapa (solicitud_id, etapa),
  CONSTRAINT fk_sa_solicitud FOREIGN KEY (solicitud_id)
    REFERENCES solicitudes (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_sa_privilegio FOREIGN KEY (privilegio_id)
    REFERENCES privilegios (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CHECK (etapa BETWEEN 1 AND 4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Etapas de aprobacion: 1 fila por solicitud y etapa';

-- ---------------------------------------------------------------------
-- 9) solicitud_bitacora — audit trail
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitud_bitacora (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  solicitud_id     INT UNSIGNED NOT NULL,
  nn               VARCHAR(10)  NOT NULL COMMENT 'Usuario que ejecuta la accion',
  accion           VARCHAR(40)  NOT NULL COMMENT 'crear, aprobar, rechazar, reasignar, salida, devolucion...',
  comentario       TEXT         NULL,
  auto_anterior_id INT UNSIGNED NULL COMMENT 'En reasignaciones: unidad original',
  auto_nuevo_id    INT UNSIGNED NULL COMMENT 'En reasignaciones: unidad nueva',
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sb_solicitud (solicitud_id),
  CONSTRAINT fk_sb_solicitud FOREIGN KEY (solicitud_id)
    REFERENCES solicitudes (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_sb_auto_anterior FOREIGN KEY (auto_anterior_id)
    REFERENCES autos (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_sb_auto_nuevo FOREIGN KEY (auto_nuevo_id)
    REFERENCES autos (id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Historial de acciones sobre una solicitud';

-- ---------------------------------------------------------------------
-- 10) movimientos_caseta — salidas y devoluciones con checklist
--     salida_id: en tipo=devolucion apunta al movimiento de salida
--     correspondiente -> km recorrido, duracion y consumo exactos.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movimientos_caseta (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  solicitud_id        INT UNSIGNED NULL COMMENT 'NULL si el movimiento no viene de una solicitud',
  auto_id             INT UNSIGNED NOT NULL,
  tipo                ENUM('salida','devolucion') NOT NULL,
  salida_id           INT UNSIGNED NULL COMMENT 'Solo en devolucion: FK al movimiento de salida',
  conductor_nn        VARCHAR(10)  NOT NULL,
  fecha_movimiento    DATETIME     NOT NULL,
  odometro            INT UNSIGNED NOT NULL,
  nivel_combustible   TINYINT UNSIGNED NOT NULL COMMENT 'Porcentaje 0-100',
  estado_llantas      ENUM('ok','fail') NOT NULL DEFAULT 'ok',
  estado_licencia     ENUM('vigente','vencida') NOT NULL DEFAULT 'vigente',
  tiene_dano          TINYINT(1)   NOT NULL DEFAULT 0,
  observaciones_dano  TEXT         NULL,
  observaciones       TEXT         NULL,
  permitir_salida     TINYINT(1)   NOT NULL DEFAULT 1,
  estatus             ENUM('pendiente','completado','incidencia') NOT NULL DEFAULT 'completado',
  registrado_por_nn   VARCHAR(10)  NOT NULL,
  created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mc_auto (auto_id),
  KEY idx_mc_solicitud (solicitud_id),
  KEY idx_mc_salida (salida_id),
  KEY idx_mc_fecha (fecha_movimiento),
  CONSTRAINT fk_mc_solicitud FOREIGN KEY (solicitud_id)
    REFERENCES solicitudes (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_mc_auto FOREIGN KEY (auto_id)
    REFERENCES autos (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_mc_salida FOREIGN KEY (salida_id)
    REFERENCES movimientos_caseta (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CHECK (nivel_combustible <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Movimientos de caseta (salida/devolucion) con checklist';

-- ---------------------------------------------------------------------
-- 11) documentos — archivos subidos (tabla genérica, entidad polimórfica)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documentos (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entidad          ENUM('auto','licencia','solicitud','personal') NOT NULL,
  entidad_id       INT UNSIGNED NOT NULL COMMENT 'ID logico de la entidad duena (sin FK: entidad polimorfica)',
  tipo             ENUM('seguro','holograma','tenencia','verificacion','licencia','acuse','foto_evidencia') NOT NULL,
  nombre_original  VARCHAR(255) NOT NULL,
  ruta             VARCHAR(255) NOT NULL COMMENT 'Ruta relativa dentro de uploads/',
  mime             VARCHAR(80)  NULL,
  tamano_bytes     INT UNSIGNED NULL,
  fecha_vencimiento DATE        NULL COMMENT 'Vigencia (seguro/tenencia/verificacion/licencia) para alertas "por vencer"',
  subido_por_nn    VARCHAR(10)  NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_doc_entidad (entidad, entidad_id),
  KEY idx_doc_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Archivos subidos: documentos vehiculares, licencias, acuses, evidencias';

-- =====================================================================
-- SEEDS (idempotentes)
-- =====================================================================

INSERT INTO privilegios (clave, nombre, nivel, activo) VALUES
  ('solicitante', 'Solicitante',      0,  1),
  ('gerente',     'Gerente de Area',  1,  1),
  ('admin_flota', 'Admin. de Flota',  2,  1),
  ('director',    'Director de Planta', 3, 1),
  ('caseta',      'Caseta',           4,  1),
  ('admin',       'Administrador',    99, 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), nivel = VALUES(nivel);

-- Nota: las placas son placeholders UNICOS para no chocar con el UNIQUE de
-- `placas`; sustituirlas por las placas reales con un UPDATE por unidad.
INSERT INTO autos (clave, modelo, categoria, placas, estado) VALUES
  ('dolphin',    'Van utilitaria', 'Van',       'PEND-DOLPHIN',    'disponible'),
  ('transporter','Transporter',    'Camioneta', 'PEND-TRANSPORTER','disponible'),
  ('jetta',      'Jetta',          'Sedan',     'PEND-JETTA',      'disponible'),
  ('taigun',     'Taigun',         'SUV',       'PEND-TAIGUN',     'disponible')
ON DUPLICATE KEY UPDATE modelo = VALUES(modelo), categoria = VALUES(categoria);

-- =====================================================================
-- VISTAS
-- =====================================================================

-- Licencias con estado de vigencia (umbral 90 dias)
CREATE OR REPLACE VIEW vw_licencias_estado AS
SELECT
  l.*,
  DATEDIFF(l.vencimiento, CURDATE()) AS dias_restantes,
  CASE
    WHEN l.vencimiento < CURDATE()                THEN 'Vencida'
    WHEN DATEDIFF(l.vencimiento, CURDATE()) <= 90 THEN 'Por vencer'
    ELSE 'Vigente'
  END AS estado_vigencia
FROM licencias l;

-- Unidades realmente disponibles: activas, en estado disponible y sin mantenimiento activo
CREATE OR REPLACE VIEW vw_autos_disponibles AS
SELECT a.*
FROM autos a
WHERE a.activo = 1
  AND a.estado = 'disponible'
  AND NOT EXISTS (
    SELECT 1 FROM mantenimientos m
    WHERE m.auto_id = a.id AND m.estado = 'activo'
  );

-- Resumen de solicitudes (nombres/areas de empleados se consultan en rh.usuarios)
CREATE OR REPLACE VIEW vw_solicitudes_resumen AS
SELECT
  s.id,
  s.folio,
  s.solicitante_nn,
  s.estado,
  s.motivo,
  s.destino_tipo,
  s.entidad_federativa,
  s.fecha_salida,
  s.hora_salida,
  s.fecha_devolucion,
  s.hora_devolucion,
  s.pasajeros,
  s.acepta_responsabilidad,
  sc.clave AS auto_solicitado,
  ac.clave AS auto_asignado,
  DATEDIFF(s.fecha_devolucion, s.fecha_salida) AS dias_solicitados,
  s.created_at,
  s.updated_at
FROM solicitudes s
LEFT JOIN autos sc ON sc.id = s.auto_solicitado_id
LEFT JOIN autos ac ON ac.id = s.auto_asignado_id;

-- =====================================================================
-- VERIFICACIÓN (ejecutar tras el alta para confirmar)
-- =====================================================================
-- SHOW TABLES;                                   -- 11 tablas + 3 vistas
-- SELECT clave, nombre, nivel FROM privilegios;  -- 6 filas
-- SELECT clave, modelo, placas FROM autos;       -- 4 filas
