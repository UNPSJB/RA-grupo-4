PRAGMA foreign_keys = ON;

-- =================================================================
-- NIVEL 0: TABLAS INDEPENDIENTES (Sin claves foráneas obligatorias)
-- =================================================================

-- 1. Departamentos
INSERT INTO departamentos (id, nombre) VALUES (1, 'Departamento de Informática');
INSERT INTO departamentos (id, nombre) VALUES (2, 'Departamento de Matemática');
INSERT INTO departamentos (id, nombre) VALUES (3, 'Departamento de Electrónica');

-- 2. Carreras
INSERT INTO carreras (id_carrera, nombre) VALUES (1, 'Licenciatura en Sistemas');
INSERT INTO carreras (id_carrera, nombre) VALUES (2, 'Analista Programador Universitario');
INSERT INTO carreras (id_carrera, nombre) VALUES (3, 'Ingeniería Civil');

-- 3. Docentes
INSERT INTO docentes (id_docente, nombre, nroLegajo) VALUES (101, 'Lic. Juan Pérez', 1001);
INSERT INTO docentes (id_docente, nombre, nroLegajo) VALUES (102, 'Dra. Laura García', 1002);
INSERT INTO docentes (id_docente, nombre, nroLegajo) VALUES (103, 'Mg. Carlos López', 1003);
INSERT INTO docentes (id_docente, nombre, nroLegajo) VALUES (104, 'Ing. Ana Fernández', 1004);

-- 4. Estudiantes
INSERT INTO estudiantes (id, nombre, usuario, contraseña) VALUES (501, 'Martín Rodriguez', 'mrodriguez', 'hashpass1');
INSERT INTO estudiantes (id, nombre, usuario, contraseña) VALUES (502, 'Sofía Martinez', 'smartinez', 'hashpass2');
INSERT INTO estudiantes (id, nombre, usuario, contraseña) VALUES (503, 'Lucas Ruiz', 'lruiz', 'hashpass3');

-- =================================================================
-- NIVEL 1: DEPENDEN DE NIVEL 0
-- =================================================================

-- 5. Encuestas (Base)
-- Creamos una encuesta general que usarán las materias.
INSERT INTO encuestas (id_encuesta, nombre, disponible, estudiante_id) 
VALUES (1, 'Encuesta de Cátedra 2024 - General', 1, NULL);

-- 6. Materias (Dependen de Carreras, Docentes, Departamentos, Encuestas)
INSERT INTO materias (id_materia, nombre, anio, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id)
VALUES (201, 'Programación Orientada a Objetos', 2, 'INT201', 1, 101, 1, 1, 1);

INSERT INTO materias (id_materia, nombre, anio, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id)
VALUES (202, 'Análisis Matemático II', 2, 'MAT201', 1, 102, 2, 1, 1);

INSERT INTO materias (id_materia, nombre, anio, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id)
VALUES (203, 'Sistemas Operativos', 3, 'INT301', 1, 103, 1, 0, 1); -- Informe NO completado

-- =================================================================
-- NIVEL 2: ESTRUCTURA DE ENCUESTA (Secciones) E INSCRIPCIONES
-- =================================================================

-- 7. Secciones de Encuesta (Dependen de Encuesta)
INSERT INTO secciones (id, sigla, descripcion, encuesta_id) VALUES (1, 'GEN', 'Aspectos Generales', 1);
INSERT INTO secciones (id, sigla, descripcion, encuesta_id) VALUES (2, 'TEO', 'Teoría', 1);
INSERT INTO secciones (id, sigla, descripcion, encuesta_id) VALUES (3, 'PRA', 'Práctica', 1);

-- 8. Inscripciones (Estudiantes se inscriben a Materias)
-- Martín se inscribe en POO
INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada)
VALUES (1001, 501, 201, '2024-03-01 10:00:00', 1);

-- Sofía se inscribe en POO y Análisis II
INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada)
VALUES (1002, 502, 201, '2024-03-02 11:00:00', 0);
INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada)
VALUES (1003, 502, 202, '2024-03-02 11:05:00', 0);

-- =================================================================
-- NIVEL 3: DETALLE ENCUESTA (Preguntas) E INFORMES AC
-- =================================================================

-- 9. Preguntas (Dependen de Secciones)
-- Pregunta 1 (Cerrada) en Aspectos Generales
INSERT INTO preguntas (id, enunciado, obligatoria, tipo, seccion_id) 
VALUES (1, '¿La planificación de la cátedra fue clara?', 1, 'CERRADA', 1);

-- Pregunta 2 (Cerrada) en Teoría
INSERT INTO preguntas (id, enunciado, obligatoria, tipo, seccion_id) 
VALUES (2, '¿El docente explica con claridad los conceptos teóricos?', 1, 'CERRADA', 2);

-- Pregunta 3 (Abierta) en Práctica
INSERT INTO preguntas (id, enunciado, obligatoria, tipo, seccion_id) 
VALUES (3, 'Sugerencias para mejorar los trabajos prácticos:', 0, 'ABIERTA', 3);

-- 10. Informes de Actividad Curricular (InformesAC)
-- Informe 1: POO (Trelew)
INSERT INTO informesAC (
    id_informesAC, id_materia, id_docente, sede, ciclo_lectivo,
    cantidad_alumnos_inscriptos, cantidad_comisiones_teoricas, cantidad_comisiones_practicas,
    porcentaje_teoricas, porcentaje_practicas, justificacion_porcentaje,
    porcentaje_contenido_abordado, valoracion_auxiliares,
    aspectos_positivos_enseñanza, aspectos_positivos_aprendizaje,
    obstaculos_enseñanza, obstaculos_aprendizaje,
    estrategias_a_implementar, resumen_reflexion,
    opinionSobreResumen, _resumenSecciones,
    necesidades_equipamiento, necesidades_bibliografia
) VALUES (
    1, 201, 101, 'Trelew', 2024,
    45, 1, 2,
    100, 90, 'Paro de transporte afectó una clase práctica.',
    95, '[{"auxiliar": "JTP Juan Gomez", "valoracion": "MB"}]',
    'Uso de proyector y live-coding muy efectivo.', 'Alumnos muy participativos en los proyectos finales.',
    'Laboratorio 1 con equipos lentos para IDEs modernos.', 'Cuesta la transición al paradigma de objetos.',
    'Reforzar ejercicios de modelado UML antes de codificar.', 'El equipo funcionó bien, se cumplieron objetivos.',
    'Encuestas positivas, destacan la práctica.', '[{"seccion": "GEN", "promedio": 4.5}, {"seccion": "TEO", "promedio": 4.2}]',
    '["Actualizar 10 PCs del Lab 1 con SSD"]', '["Design Patterns, Gamma et al (2 copias)"]'
);

-- Informe 2: Análisis Matemático II (Trelew)
INSERT INTO informesAC (
    id_informesAC, id_materia, id_docente, sede, ciclo_lectivo,
    cantidad_alumnos_inscriptos, cantidad_comisiones_teoricas, cantidad_comisiones_practicas,
    porcentaje_teoricas, porcentaje_practicas, justificacion_porcentaje,
    porcentaje_contenido_abordado, valoracion_auxiliares,
    aspectos_positivos_enseñanza, aspectos_positivos_aprendizaje,
    obstaculos_enseñanza, obstaculos_aprendizaje,
    estrategias_a_implementar, resumen_reflexion,
    opinionSobreResumen, _resumenSecciones,
    necesidades_equipamiento, necesidades_bibliografia
) VALUES (
    2, 202, 102, 'Trelew', 2024,
    30, 1, 1,
    100, 100, NULL,
    100, '[{"auxiliar": "Ayudante Maria", "valoracion": "E"}]',
    'La guía de trabajos prácticos está muy consolidada.', 'Buen nivel general en parciales.',
    'Aula 22 muy ruidosa por obras cercanas.', 'Dificultad con integrales múltiples.',
    'Solicitar cambio de aula si continúan las obras.', 'Año normal, sin sobresaltos.',
    'Conforme con los resultados.', '[]',
    '["Pizarrón nuevo para aula 22"]', '[]'
);

-- =================================================================
-- NIVEL 4: OPCIONES Y ACTIVIDADES
-- =================================================================

-- 11. Opciones de Respuesta (Para preguntas cerradas)
-- Opciones para Pregunta 1 y 2 (Escala 1-5)
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (1, 'Muy en desacuerdo', 1);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (2, 'En desacuerdo', 1);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (3, 'Neutro', 1);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (4, 'De acuerdo', 1);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (5, 'Muy de acuerdo', 1);

INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (6, 'Muy malo', 2);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (7, 'Malo', 2);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (8, 'Regular', 2);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (9, 'Bueno', 2);
INSERT INTO opciones_respuestas (id, descripcion, pregunta_id) VALUES (10, 'Excelente', 2);

-- 12. Actividades (Dependen de InformesAC)
-- Actividades para Informe 1 (POO)
INSERT INTO actividades (id_actividades, id_informeAC, integranteCatedra, capacitacion, investigacion, extension, gestion, observacionComentarios)
VALUES (1, 1, 'Lic. Juan Pérez', 'Curso Java Avanzado', NULL, 'Taller de Programación para Escuelas', 'Consejero Departamental', NULL);

-- Actividades para Informe 2 (Análisis II)
INSERT INTO actividades (id_actividades, id_informeAC, integranteCatedra, capacitacion, investigacion, extension, gestion, observacionComentarios)
VALUES (2, 2, 'Dra. Laura García', NULL, 'Directora Proyecto PICT Matemática Aplicada', NULL, NULL, 'Dedica 80% a investigación');

-- =================================================================
-- NIVEL 5: RESPUESTAS Y INFORMES SINTÉTICOS
-- =================================================================

-- 13. Respuestas de Encuestas (Dependen de Inscripciones, Preguntas y Opciones)
-- Martín responde sobre POO (Inscripción 1001)
-- P1: Muy de acuerdo (id 5)
INSERT INTO respuestas (id, pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
VALUES (1, 1, 1001, 5, NULL);
-- P2: Excelente (id 10)
INSERT INTO respuestas (id, pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
VALUES (2, 2, 1001, 10, NULL);
-- P3: Abierta
INSERT INTO respuestas (id, pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
VALUES (3, 3, 1001, NULL, 'Agregar más ejercicios tipo parcial en las guías.');

-- 14. Informes Sintéticos (Resumen por Departamento)
-- Informe Sintético 1: Informática
INSERT INTO informesSinteticos (
    id, descripcion, periodo, sede, integrantes, departamento_id,
    resumen_general, resumen_necesidades, valoracion_miembros, comentarios
) VALUES (
    1, 'Sintético Depto Informática 2024', '2024', 'Trelew', 'Juan Pérez, Carlos López, Ana Fernández', 1,
    'El departamento cumplió sus objetivos académicos. Se detectan necesidades críticas en equipamiento de laboratorios.',
    '[{"tipo": "Equipamiento", "descripcion": "Discos SSD para Laboratorio 1", "prioridad": "Alta"}, {"tipo": "RRHH", "descripcion": "Un cargo Ayudante 1ra para S.O.", "prioridad": "Media"}]',
    '[{"claustro": "Docentes", "valoracion": "Muy Buena"}, {"claustro": "Auxiliares", "valoracion": "Excelente"}]',
    'Se solicita reunión urgente por presupuesto de laboratorio.'
);

-- Informe Sintético 2: Matemática
INSERT INTO informesSinteticos (
    id, descripcion, periodo, sede, integrantes, departamento_id,
    resumen_general, resumen_necesidades, valoracion_miembros, comentarios
) VALUES (
    2, 'Sintético Depto Matemática 2024', '2024', 'Trelew', 'Laura García, Equipo Cátedra Matemática', 2,
    'Desempeño estable. Problemas edilicios afectaron algunas clases (ruidos molestos).',
    '[{"tipo": "Infraestructura", "descripcion": "Mejorar aislación acústica aulas sector B", "prioridad": "Alta"}]',
    NULL,
    'Sin comentarios adicionales.'
);