PRAGMA foreign_keys = ON;

--BEGIN TRANSACTION;

-- Limpiar datos previos
DELETE FROM opciones_respuestas;
DELETE FROM preguntas;
DELETE FROM secciones;
DELETE FROM encuestas;

-- --------------------------------------------------
-- Crear encuesta
-- --------------------------------------------------
INSERT INTO encuestas (id_encuesta, nombre, disponible)
VALUES
    (1, 'Encuesta UNPSJB', 1);

-- --------------------------------------------------
-- Crear secciones
-- --------------------------------------------------
INSERT INTO secciones (id, sigla, descripcion, encuesta_id)
VALUES
    (1, 'A','Informacion general', 1),
    (2, 'B', 'Comunicacion y desarrollo de la asignatura', 1),
    (3, 'C','Metodologia', 1),
    (4, 'D', 'Evaluacion', 1),
    (5, 'E-Teoria', 'Actuacion de los miembros de la Catedra', 1),
    (6, 'E-Practica', 'Actuacion de los miembros de la Catedra', 1),
    (7, 'G', 'Opinion global', 1);

-- --------------------------------------------------
-- Crear preguntas
-- --------------------------------------------------
-- Sección A: Información general
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id)
VALUES
    (1, '¿Cuántas veces te has inscripto para cursar esta asignatura?', 'CERRADA', 1, 1),
    (2, '¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases teóricas?', 'CERRADA', 1, 1),
    (3, '¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases prácticas?', 'CERRADA', 1, 1),
    (4, 'Los conocimientos previos para comprender los contenidos de la asignatura fueron', 'CERRADA', 1, 1),
    (5, '¿Cuales fueron los motivos por los cuales no asististe regularmente a clases?', 'CERRADA', 0, 1);

-- Sección B: Comunicación y desarrollo de la asignatura
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id) 
VALUES
    (6, 'El profesor brindó al inicio del curso, información referida al desarrollo de la asignatura (programa, cronograma, régimen de cursada y criterios de evaluación.).', 'CERRADA', 1, 2),
    (7, 'Se respetó la planificación de las actividades programadas al inicio del cursado y el calendario académico.', 'CERRADA', 1, 2),
    (8, 'La bibliografía propuesta por la cátedra estuvo disponible en la biblioteca o centros de documentación.', 'CERRADA', 1, 2),
    (9, 'El profesor ofreció la posibilidad de establecer una buena comunicación en diferentes aspectos de la vida universitaria.', 'CERRADA', 1, 2);

-- Sección C: Metodología
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id) 
VALUES
    (10, 'Se propusieron clases de apoyo y consulta.', 'CERRADA', 1, 3),
    (11, 'Existe relación entre los contenidos desarrollados en las clases teóricas y los trabajos prácticos.', 'CERRADA', 1, 3),
    (12, 'Las clases prácticas de laboratorio resultaron de utilidad para la compresión de los contenidos.', 'CERRADA', 1, 3);

-- Sección D: Evaluación
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id) 
VALUES
    (13, 'Las clases teóricas y las clases prácticas tuvieron correlación.', 'CERRADA', 1, 4),
    (14, 'La profundidad de los temas tratados en las clases teóricas y prácticas es equivalente al nivel de exigencia en las evaluaciones.', 'CERRADA', 1, 4),
    (15, 'La revisión de evaluaciones o trabajos presentados resulta una instancia para mejorar la compresión de los contenidos.', 'CERRADA', 1, 4),
    (16, 'Las alternativas de evaluación propuestos por la cátedra (Promoción directa, informes, trabajos prácticos, monografías, etc.) te resultaron convenientes para el aprendizaje.', 'CERRADA', 1, 4);

-- Sección E-Teoría: Actuación de los miembros de la Cátedra
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id) 
VALUES
    (17, 'Se respetó la planificación de actividades programadas.', 'CERRADA', 1, 5),
    (18, 'El profesor/es asistió/asistieron a clases en el horario establecido.', 'CERRADA', 1, 5),
    (19, 'Se presentaron aplicaciones, ejemplos, demostraciones, formas de transferencias a la vida cotidiana y profesional en el desarrollo de las clases.', 'CERRADA', 1, 5),
    (20, 'Los recursos didácticos utilizados facilitaron el aprendizaje.', 'CERRADA', 1, 5),
    (21, 'Los profesores ofrecen la posibilidad de plantear dudas y dificultades en la comprensión de los temas.', 'CERRADA', 1, 5),
    (22, 'Los temas desarrollados son explicados con claridad.', 'CERRADA', 1, 5);

-- Sección E-Práctica
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id) 
VALUES
    (23, 'Se respetó la planificación de actividades programadas.', 'CERRADA', 1, 6),
    (24, 'El profesor/es asistió/asistieron a clases en el horario establecido.', 'CERRADA', 1, 6),
    (25, 'Se presentaron aplicaciones, ejemplos, demostraciones, formas de transferencias a la vida cotidiana y profesional en el desarrollo de las clases.', 'CERRADA', 1, 6),
    (26, 'Los recursos didácticos utilizados facilitaron el aprendizaje.', 'CERRADA', 1, 6),
    (27, 'Los profesores ofrecen la posibilidad de plantear dudas y dificultades en la comprensión de los temas.', 'CERRADA', 1, 6),
    (28, 'Los temas desarrollados son explicados con claridad.', 'CERRADA', 1, 6);

-- Sección G: Opinión global
INSERT INTO preguntas (id, enunciado, tipo, obligatoria, seccion_id) 
VALUES
    (29, 'En general ¿cómo evalúas tu experiencia de aprendizaje en esta asignatura?', 'CERRADA', 1, 7),
    (30, '¿Qué aspectos valoras como positivos en los procesos de enseñanza aprendizaje de la asignatura? Menciona los que consideres importantes.', 'ABIERTA', 0, 7),
    (31, '¿Qué aspectos consideras que se pueden mejorar para la enseñanza aprendizaje de la asignatura?', 'ABIERTA', 0, 7);


-- --------------------------------------------------
-- Crear opciones de respuesta para preguntas cerradas
-- --------------------------------------------------

-- Seccion A
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Una', 1), ('Mas de una',1),
    ('Entre 0 y 50%', 2), ('mas 50%', 2),
    ('Entre 0 y 50%', 3), ('mas 50%', 3),
    ('Escasos', 4), ('Suficientes', 4),

    ('Superposición de horarios con materias de otros años',5),
    ('Incompatibilidad de horarios con tu trabajo.',5),
    ('Preferí formarte por tu cuenta con bibliografía y / o material de trabajo',5),
    ('Enfermedad de larga duración',5),
    ('Problemas personales',5),
    ('Otros',5);

--Seccion B
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Malo, No Satisfactorio', 6), ('Regular, Poco Satisfactorio.', 6), ('Bueno, Satisfactorio.', 6), ('Muy Bueno, Muy satisfactorio.', 6),
    ('Malo, No Satisfactorio', 7), ('Regular, Poco Satisfactorio.', 7), ('Bueno, Satisfactorio.', 7), ('Muy Bueno, Muy satisfactorio.', 7),
    ('Malo, No Satisfactorio', 8), ('Regular, Poco Satisfactorio.', 8), ('Bueno, Satisfactorio.', 8), ('Muy Bueno, Muy satisfactorio.', 8),
    ('Malo, No Satisfactorio', 9), ('Regular, Poco Satisfactorio.', 9), ('Bueno, Satisfactorio.', 9), ('Muy Bueno, Muy satisfactorio.', 9);

-- Sección C
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Malo, No Satisfactorio', 10), ('Regular, Poco Satisfactorio.', 10), ('Bueno, Satisfactorio.', 10), ('Muy Bueno, Muy satisfactorio.', 10),
    ('Malo, No Satisfactorio', 11), ('Regular, Poco Satisfactorio.', 11), ('Bueno, Satisfactorio.', 11), ('Muy Bueno, Muy satisfactorio.', 11),
    ('Malo, No Satisfactorio', 12), ('Regular, Poco Satisfactorio.', 12), ('Bueno, Satisfactorio.', 12), ('Muy Bueno, Muy satisfactorio.', 12);

-- Sección D
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Malo, No Satisfactorio', 13), ('Regular, Poco Satisfactorio.', 13), ('Bueno, Satisfactorio.', 13), ('Muy Bueno, Muy satisfactorio.', 13),
    ('Malo, No Satisfactorio', 14), ('Regular, Poco Satisfactorio.', 14), ('Bueno, Satisfactorio.', 14), ('Muy Bueno, Muy satisfactorio.', 14),
    ('Malo, No Satisfactorio', 15), ('Regular, Poco Satisfactorio.', 15), ('Bueno, Satisfactorio.', 15), ('Muy Bueno, Muy satisfactorio.', 15),
    ('Malo, No Satisfactorio', 16), ('Regular, Poco Satisfactorio.', 16), ('Bueno, Satisfactorio.', 16), ('Muy Bueno, Muy satisfactorio.', 16);

-- Sección E-Teoría
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Malo, No Satisfactorio', 17), ('Regular, Poco Satisfactorio.', 17), ('Bueno, Satisfactorio.', 17), ('Muy Bueno, Muy satisfactorio.', 17),
    ('Malo, No Satisfactorio', 18), ('Regular, Poco Satisfactorio.', 18), ('Bueno, Satisfactorio.', 18), ('Muy Bueno, Muy satisfactorio.', 18),
    ('Malo, No Satisfactorio', 19), ('Regular, Poco Satisfactorio.', 19), ('Bueno, Satisfactorio.', 19), ('Muy Bueno, Muy satisfactorio.', 19),
    ('Malo, No Satisfactorio', 20), ('Regular, Poco Satisfactorio.', 20), ('Bueno, Satisfactorio.', 20), ('Muy Bueno, Muy satisfactorio.', 20),
    ('Malo, No Satisfactorio', 21), ('Regular, Poco Satisfactorio.', 21), ('Bueno, Satisfactorio.', 21), ('Muy Bueno, Muy satisfactorio.', 21),
    ('Malo, No Satisfactorio', 22), ('Regular, Poco Satisfactorio.', 22), ('Bueno, Satisfactorio.', 22), ('Muy Bueno, Muy satisfactorio.', 22);

-- Sección E-Práctica
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Malo, No Satisfactorio', 23), ('Regular, Poco Satisfactorio.', 23), ('Bueno, Satisfactorio.', 23), ('Muy Bueno, Muy satisfactorio.', 23),
    ('Malo, No Satisfactorio', 24), ('Regular, Poco Satisfactorio.', 24), ('Bueno, Satisfactorio.', 24), ('Muy Bueno, Muy satisfactorio.', 24),
    ('Malo, No Satisfactorio', 25), ('Regular, Poco Satisfactorio.', 25), ('Bueno, Satisfactorio.', 25), ('Muy Bueno, Muy satisfactorio.', 25),
    ('Malo, No Satisfactorio', 26), ('Regular, Poco Satisfactorio.', 26), ('Bueno, Satisfactorio.', 26), ('Muy Bueno, Muy satisfactorio.', 26),
    ('Malo, No Satisfactorio', 27), ('Regular, Poco Satisfactorio.', 27), ('Bueno, Satisfactorio.', 27), ('Muy Bueno, Muy satisfactorio.', 27),
    ('Malo, No Satisfactorio', 28), ('Regular, Poco Satisfactorio.', 28), ('Bueno, Satisfactorio.', 28), ('Muy Bueno, Muy satisfactorio.', 28);

-- Sección G
INSERT INTO opciones_respuestas (descripcion, pregunta_id)
VALUES
    ('Malo, No Satisfactorio', 29), ('Regular, Poco Satisfactorio.', 29), ('Bueno, Satisfactorio.', 29), ('Muy Bueno, Muy satisfactorio.', 29);

--COMMIT;







-- =========================================
-- CREACIÓN DE TABLAS
-- =========================================

DROP TABLE IF EXISTS informesSinteticos;
DROP TABLE IF EXISTS departamentos;

CREATE TABLE departamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE informesSinteticos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    departamento_id INTEGER NOT NULL,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);





-- Departamentos
INSERT INTO departamentos (nombre) VALUES
('Informatica'),
('Física'),
('Computación'),
('Química');

-- Informes Sintéticos
INSERT INTO informesSinteticos (descripcion, departamento_id) VALUES
('Informe anual sobre rendimiento académico 2024', 1),
('Análisis de encuestas docentes 2024', 1),
('Informe de proyectos de investigación 2024', 2),
('Síntesis de actividades de laboratorio 2024', 4),
('Evaluación de estudiantes en programación 2024', 3),
('Comparativa interdepartamental 2024', 3);



PRAGMA foreign_keys = ON;

-- =====================================================
-- LIMPIAR DATOS PREVIOS
-- =====================================================
DELETE FROM informesAC;
DELETE FROM respuestas;
DELETE FROM inscripciones;
DELETE FROM materias;
DELETE FROM docentes;
DELETE FROM estudiantes;
DELETE FROM carreras;

-- =====================================================
-- CARRERAS
-- =====================================================
INSERT INTO carreras (id_carrera, nombre)
VALUES
    (1, 'Ingeniería en Informática'),
    (2, 'Licenciatura en Sistemas');

-- =====================================================
-- DOCENTES
-- =====================================================
INSERT INTO docentes (id_docente, nombre, nroLegajo)
VALUES
    (1, 'Juan Pérez', 1001),
    (2, 'Ana Gómez', 1002),
    (3, 'Carlos López', 1003);

-- =====================================================
-- MATERIAS
-- =====================================================
INSERT INTO materias (id_materia, nombre, anio, codigoMateria, id_carrera, id_docente, id_departamento, encuesta_id)
VALUES
    (1, 'Algoritmica y Programacion I', 1, 'IF003', 1, 1, 1, 1),
    (2, 'Bases de Datos I', 2, 'IF007', 1, 2, 1, 1),
    (3, 'Sistemas Operativos', 3, 'IF011', 2, 3, 1, 1);

-- =====================================================
-- ESTUDIANTES
-- =====================================================
INSERT INTO estudiantes (id, nombre, usuario, contraseña)
VALUES
    (1, 'María Rodríguez', 'mrodriguez', '1234'),
    (2, 'José Fernández', 'jfernandez', '1234'),
    (3, 'Lucía Torres', 'ltorres', '1234'),
    (4, 'Pedro Díaz', 'pdiaz', '1234');

-- =====================================================
-- INSCRIPCIONES
-- =====================================================

INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada)
VALUES
    (1, 1, 1, '2025-08-01 10:00:00', 1),
    (2, 2, 1, '2025-08-01 10:05:00', 1),
    (3, 3, 1, '2025-08-01 10:10:00', 1),
    (4, 4, 1, '2025-08-01 10:15:00', 0);

-- =====================================================
-- RESPUESTAS
-- =====================================================
-- IDs de opciones de respuesta según tu primer script
-- Pregunta 1 (id=1): opciones 1="Una", 2="Más de una"
-- Pregunta 6 (id=6): opciones 17-20
-- Pregunta 9 (id=9): opciones 34-37
-- Pregunta 30 (id=30): abierta, opcion_respuesta_id=NULL

INSERT INTO respuestas (id, pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
VALUES
    -- María
    (1, 1, 1, 1, NULL),
    (2, 6, 1, 19, NULL),
    (3, 9, 1, 36, NULL),
    (13, 30, 1, NULL, 'Buena comunicación con el docente.'),
    
    -- José
    (4, 1, 2, 2, NULL),
    (5, 6, 2, 20, NULL),
    (6, 9, 2, 35, NULL),
    (14, 30, 2, NULL, 'Clases claras y organizadas.'),
    
    -- Lucía
    (7, 1, 3, 1, NULL),
    (8, 6, 3, 19, NULL),
    (9, 9, 3, 35, NULL),
    
    -- Pedro
    (10, 1, 4, 2, NULL),
    (11, 6, 4, 20, NULL),
    (12, 9, 4, 36, NULL);

-- =====================================================
-- INFORMES AC
-- =====================================================
-- =====================================================
-- INFORMES AC
-- =====================================================
INSERT INTO informesAC (
    id_informesAC,
    id_materia,
    id_docente,
    sede,
    ciclo_lectivo,
    opinionSobreResumen,
    resumenSecciones
)
VALUES
    (1, 1, 1, 'Trelew', 2025, NULL, '{}'),
    (2, 2, 2, 'Madryn', 2025, NULL, '{}'),
    (3, 3, 3, 'Trelew', 2025, NULL, '{}');





















PRAGMA foreign_keys = ON;

-- =====================================================
-- LIMPIAR RESPUESTAS EXISTENTES
-- =====================================================
DELETE FROM respuestas;

-- =====================================================
-- GENERAR RESPUESTAS ALEATORIAS (50 inscripciones simuladas)
-- =====================================================

-- Crear inscripciones simuladas (del id 5 al 54)
INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada)
SELECT id + 4, ((id - 1) % 4) + 1, 1, datetime('2025-08-01 10:00:00', '+' || id || ' minutes'), 1
FROM (SELECT 1 AS id UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
      SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL
      SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL
      SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL
      SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL
      SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL
      SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL
      SELECT 29 UNION ALL SELECT 30 UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL
      SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35 UNION ALL SELECT 36 UNION ALL
      SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40 UNION ALL
      SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL
      SELECT 45 UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL
      SELECT 49 UNION ALL SELECT 50);

-- =====================================================
-- INSERTAR RESPUESTAS CERRADAS
-- =====================================================
-- Cada inscripción responde todas las preguntas cerradas (1–29)
INSERT INTO respuestas (pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
SELECT 
    p.id AS pregunta_id,
    i.id AS inscripcion_id,
    (
        SELECT id 
        FROM opciones_respuestas 
        WHERE pregunta_id = p.id 
        ORDER BY RANDOM() 
        LIMIT 1
    ) AS opcion_respuesta_id,
    NULL AS respuesta_abierta
FROM preguntas p
JOIN inscripciones i ON i.materia_id = 1
WHERE p.tipo = 'CERRADA';

-- =====================================================
-- INSERTAR RESPUESTAS ABIERTAS (preguntas 30 y 31)
-- =====================================================
INSERT INTO respuestas (pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
SELECT 
    30 AS pregunta_id,
    i.id AS inscripcion_id,
    NULL AS opcion_respuesta_id,
    CASE (abs(random()) % 5)
        WHEN 0 THEN 'Excelente experiencia de aprendizaje'
        WHEN 1 THEN 'El profesor explicó con claridad'
        WHEN 2 THEN 'Se utilizaron buenos recursos didácticos'
        WHEN 3 THEN 'Buena comunicación y planificación'
        ELSE 'Clases dinámicas y participativas'
    END AS respuesta_abierta
FROM inscripciones i
WHERE i.materia_id = 1;

INSERT INTO respuestas (pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
SELECT 
    31 AS pregunta_id,
    i.id AS inscripcion_id,
    NULL AS opcion_respuesta_id,
    CASE (abs(random()) % 4)
        WHEN 0 THEN 'Mejorar la coordinación de prácticas'
        WHEN 1 THEN 'Actualizar materiales de lectura'
        WHEN 2 THEN 'Más instancias de consulta personal'
        ELSE 'Distribuir mejor las evaluaciones'
    END AS respuesta_abierta
FROM inscripciones i
WHERE i.materia_id = 1;

-- =====================================================
-- CONFIRMAR
-- =====================================================
SELECT COUNT(*) AS total_respuestas FROM respuestas;
