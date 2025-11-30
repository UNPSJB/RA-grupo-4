PRAGMA foreign_keys = ON;

--BEGIN TRANSACTION;

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

INSERT INTO periodos (
    id,
    ciclo_lectivo,
    cuatrimestre,
    fecha_apertura_encuestas,
    fecha_cierre_encuestas,
    fecha_apertura_informesAC,
    fecha_cierre_informesAC
)
VALUES

    -- Primer cuatrimestre 2025
    (1, 2025, 'PRIMER',
        '2025-03-01', '2025-03-31',
        '2025-06-15', '2025-07-01'
    ),

    -- Segundo cuatrimestre 2025
    (2, 2025, 'SEGUNDO',
        '2025-11-01', '2025-12-15',
        '2025-11-01', '2025-12-15'
    ),

    -- Primer cuatrimestre 2024
    (3, 2024, 'PRIMER',
        '2024-03-01', '2024-03-31',
        '2024-06-15', '2024-07-01'
    ),

    -- Segundo cuatrimestre 2024
    (4, 2024, 'SEGUNDO',
        '2024-08-01', '2024-08-31',
        '2024-11-15', '2024-12-01'
    ),

    -- Primer cuatrimestre 2023
    (5, 2023, 'PRIMER',
        '2023-03-01', '2023-03-31',
        '2023-06-15', '2023-07-01'
    ),

    -- Segundo cuatrimestre 2023
    (6, 2023, 'SEGUNDO',
        '2023-08-01', '2023-08-31',
        '2023-11-15', '2023-12-01'
    );




INSERT INTO estudiantes (nombre, usuario, contraseña) VALUES
('Admin', 'sgarcia', 'pass123'),
('Mateo Rodríguez', 'mrodriguez', 'pass123'),
('Valentina Fernández', 'vfernandez', 'pass123'),
('Santiago López', 'slopez', 'pass123'),
('Isabella Martínez', 'imartinez', 'pass123'),
('Benjamín González', 'bgonzalez', 'pass123'),
('Camila Pérez', 'cperez', 'pass123'),
('Matías Sánchez', 'msanchez', 'pass123'),
('Lucía Romero', 'lromero', 'pass123'),
('Thiago Torres', 'ttorres', 'pass123'),
('Martina Ramírez', 'mramirez', 'pass123'),
('Emiliano Díaz', 'ediaz', 'pass123'),
('Victoria Herrera', 'vherrera', 'pass123'),
('Agustín Vargas', 'avargas', 'pass123'),
('Julieta Castro', 'jcastro', 'pass123'),
('Diego Morales', 'dmorales', 'pass123'),
('Mía Rojas', 'mrojas', 'pass123'),
('Alejandro Cruz', 'acruz', 'pass123'),
('Renata Ortega', 'rortega', 'pass123'),
('Thiago Mendoza', 'tmendoza', 'pass123'),
('Emilia Silva', 'esilva', 'pass123'),
('Lucas Navarro', 'lnavarro', 'pass123'),
('Sofía Jiménez', 'sjimenez', 'pass123'),
('Benjamín Castillo', 'bcastillo', 'pass123'),
('Valentina Soto', 'vsoto', 'pass123'),
('Mateo Paredes', 'mparedes', 'pass123'),
('Isabella Molina', 'imolina', 'pass123'),
('Matías Delgado', 'mdelgado', 'pass123'),
('Camila Rivas', 'crivas', 'pass123'),
('Santiago Aguirre', 'saguirre', 'pass123'),
('Martina Peña', 'mpena', 'pass123'),
('Diego Figueroa', 'dfigueroa', 'pass123'),
('Lucía Campos', 'lcampos', 'pass123'),
('Alejandro Bravo', 'abravo', 'pass123'),
('Emiliano Valdez', 'evaldez', 'pass123'),
('Renata Herrera', 'rherrera', 'pass123'),
('Thiago Guerrero', 'tguerrero', 'pass123'),
('Victoria Salazar', 'vsalazar', 'pass123'),
('Lucas León', 'lleon', 'pass123'),
('Mía Rojas', 'mrojas2', 'pass123'),
('Agustín Morales', 'amorales', 'pass123'),
('Julieta Reyes', 'jreyes', 'pass123'),
('Diego Serrano', 'dserrano', 'pass123'),
('Camila Ortiz', 'cortiz', 'pass123'),
('Mateo Espinoza', 'mespinoza', 'pass123'),
('Sofía Fuentes', 'sfuentes', 'pass123'),
('Benjamín Cabrera', 'bcabrera', 'pass123'),
('Valentina Castro', 'vcastro', 'pass123'),
('Emilia Rojas', 'erojas', 'pass123'),
('Lucas Herrera', 'lherrera2', 'pass123'),
('Martina Vega', 'mvega', 'pass123');





INSERT INTO carreras (id_carrera, nombre) VALUES
(1, 'Analista Programador Universitario'),
(2, 'Profesorado en Matemática'),
(3, 'Contador Público Nacional'),
(4, 'Abogacia'),
(5, 'Ingeniería Civil');





INSERT INTO departamentos (id, nombre) VALUES
(1, 'Informática'),
(2, 'Matemática'),
(3, 'Ciencias Económicas'),
(4, 'Informatica'),
(5, 'Humanidades');







INSERT INTO docentes (id_docente, nombre, nroLegajo) VALUES
(1, 'Admin', 1001),
(2, 'Leonardo Ordinez', 1002),
(3, 'Carlos Ruiz', 1003),
(4, 'Ana Torres', 1004),
(5, 'Lucía Fernández', 1005),
(6, 'Pedro Ramírez', 1006),
(7, 'Sofía Díaz', 1007),
(8, 'Jorge López', 1008),
(9, 'Valentina Herrera', 1009),
(10, 'Martín Castro', 1010);








INSERT INTO materias (id_materia, nombre, id_periodo, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id) VALUES
(1, 'Aplicaciones Web', 2, 'IF050', 1, 1, 1, 0, 1),
(2, 'Sistemas Operativos', 2, 'IF037', 1, 1, 1, 0, 1),
(3, 'Bases de Datos', 2, 'IF007', 1, 1, 1, 0, 1),
(4, 'Ingeniería de Software', 2, 'IF040', 1, 1, 1, 0, 1),
(5, 'Redes y transmision de datos', 2, 'IF019', 1, 5, 1, 0, 1),

(6, 'Base de datos II', 2, 'IF044', 2, 6, 1, 0, 1),
(7, 'Modelos y Simulacion', 2, 'IF027', 2, 7, 2, 0, 1),
(8, 'Administracion de proyectos', 2, 'IF049', 2, 8, 2, 0, 1),

(9, 'Sistemas Distribuidos', 2, 'IF022', 3, 9, 3, 0, 1),
(10, 'Aspectos Legales y Profesionales', 2, 'IF016', 3, 10, 3, 0, 1),
(11, 'Administracion de Redes y Seguridad', 2, 'IF046', 3, 4, 1, 0, 1),

(12, 'Ingenieria de Software III', 2, 'IF047', 4, 2, 4, 0, 1),
(13, 'Sistema de Soporte para la Toma de Decisiones', 2, 'IF054', 4, 3, 4, 0, 1),

(14, 'Laboratorio de Programacion y Lenguajes', 2, 'IF009', 4, 4, 5, 0, 1),
(15, 'Paradigmas y Lenguajes de Programacion', 2, 'IF020', 4, 5, 1, 0, 1);









INSERT INTO inscripciones (estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada)
SELECT 
    e.id AS estudiante_id,
    m.id_materia AS materia_id,
    datetime('now') AS fecha_inscripcion,
    CASE 
        WHEN e.id = 1 AND m.id_materia IN (1, 2, 3) THEN 0  -- inscripciones "sin procesar" para estudiante 1
        ELSE 1
    END AS encuesta_procesada
FROM estudiantes e
CROSS JOIN materias m
WHERE m.id_materia <= 13;





-- =====================================================
-- GENERAR RESPUESTAS CERRADAS PARA TODAS LAS MATERIAS
-- =====================================================
-- Cada inscripción responde todas las preguntas cerradas
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
JOIN inscripciones i ON i.materia_id = i.materia_id
WHERE p.tipo = 'CERRADA';

-- =====================================================
-- GENERAR RESPUESTAS ABIERTAS PARA TODAS LAS MATERIAS
-- =====================================================
-- Preguntas abiertas ejemplo: 30 y 31
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
FROM inscripciones i;

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
FROM inscripciones i;

-- =====================================================
-- CONFIRMAR
-- =====================================================
SELECT COUNT(*) AS total_respuestas FROM respuestas;












INSERT INTO materias (id_materia, nombre, id_periodo, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id) VALUES
(16, 'Aplicaciones Web', 2, 'IF050', 1, 1, 1, 0, 1),
(17, 'Aplicaciones Web', 2, 'IF050', 1, 1, 1, 0, 1),
(18, 'Aplicaciones Web', 2, 'IF050', 1, 1, 1, 0, 1),
(19, 'Aplicaciones Web', 2, 'IF050', 1, 1, 1, 0, 1),

(20, 'Desarrollo de Software', 2, 'IF012', 1, 2, 1, 0, 1),
(21, 'Desarrollo de Software', 2, 'IF012', 1, 2, 1, 0, 1),
(22, 'Desarrollo de Software', 2, 'IF012', 1, 2, 1, 0, 1),
(23, 'Desarrollo de Software', 2, 'IF012', 1, 2, 1, 0, 1);


INSERT INTO inscripciones (estudiante_id, materia_id, fecha_inscripcion, encuesta_procesada) VALUES
(1, 16, datetime('now'), 0),
(1, 17, datetime('now'), 0),
(1, 18, datetime('now'), 0),
(1, 19, datetime('now'), 0),

(1, 20, datetime('now'), 0),
(1, 21, datetime('now'), 0),
(1, 22, datetime('now'), 0),
(1, 23, datetime('now'), 0);


WITH insc AS (
    SELECT id AS inscripcion_id, materia_id
    FROM inscripciones
    WHERE estudiante_id = 1
      AND materia_id BETWEEN 16 AND 23
)
INSERT INTO respuestas (pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
SELECT
    p.id AS pregunta_id,
    i.inscripcion_id,

    CASE 
        WHEN i.materia_id = 16 THEN (
            SELECT id FROM opciones_respuestas
            WHERE pregunta_id = p.id AND descripcion LIKE 'Malo%'
            LIMIT 1
        )
        WHEN i.materia_id = 17 THEN (
            SELECT id FROM opciones_respuestas
            WHERE pregunta_id = p.id AND (descripcion LIKE 'Malo%' OR descripcion LIKE 'Regular%')
            ORDER BY RANDOM() LIMIT 1
        )
        WHEN i.materia_id = 18 THEN (
            SELECT id FROM opciones_respuestas
            WHERE pregunta_id = p.id AND (descripcion LIKE 'Bueno%' OR descripcion LIKE 'Muy Bueno%')
            ORDER BY RANDOM() LIMIT 1
        )
        WHEN i.materia_id = 19 THEN (
            SELECT id FROM opciones_respuestas
            WHERE pregunta_id = p.id AND descripcion LIKE 'Muy Bueno%'
            LIMIT 1
        )
        WHEN i.materia_id BETWEEN 20 AND 23 THEN (
            SELECT id FROM opciones_respuestas
            WHERE pregunta_id = p.id AND (descripcion LIKE 'Bueno%' OR descripcion LIKE 'Muy Bueno%')
            ORDER BY RANDOM() LIMIT 1
        )
    END,
    NULL
FROM preguntas p
JOIN insc i
WHERE p.tipo = 'CERRADA';


-- Pregunta 30 (aspectos positivos)
WITH insc AS (
    SELECT id AS inscripcion_id, materia_id
    FROM inscripciones
    WHERE estudiante_id = 1
      AND materia_id BETWEEN 16 AND 23
)
INSERT INTO respuestas (pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
SELECT 
    30,
    i.inscripcion_id,
    NULL,
    CASE 
        WHEN i.materia_id IN (16, 17) THEN 'Experiencia poco satisfactoria en general'
        WHEN i.materia_id = 18 THEN 'Buena experiencia, materiales claros'
        WHEN i.materia_id = 19 THEN 'Excelente experiencia, clases muy claras'
        ELSE 'Buena comunicación y contenidos bien explicados'
    END
FROM insc i;


-- Pregunta 31 (aspectos a mejorar)
WITH insc AS (
    SELECT id AS inscripcion_id, materia_id
    FROM inscripciones
    WHERE estudiante_id = 1
      AND materia_id BETWEEN 16 AND 23
)
INSERT INTO respuestas (pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
SELECT 
    31,
    i.inscripcion_id,
    NULL,
    CASE 
        WHEN i.materia_id = 16 THEN 'Mejorar absolutamente toda la dinámica de enseñanza'
        WHEN i.materia_id = 17 THEN 'Se requiere mayor claridad en la explicación'
        WHEN i.materia_id = 18 THEN 'Podría haber más ejemplos prácticos'
        WHEN i.materia_id = 19 THEN 'Casi nada que mejorar'
        ELSE 'Nada significativo que mejorar'
    END
FROM insc i;



UPDATE inscripciones
SET encuesta_procesada = 1
WHERE estudiante_id = 1
    AND materia_id BETWEEN 16 AND 23;






INSERT INTO materias (id_materia, nombre, id_periodo, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id) VALUES
(24, 'Base de datos II', 2, 'IF044', 2, 1, 1, 0, 1),
(25, 'Modelos y Simulacion', 2, 'IF027', 3, 1, 1, 0, 1),
(26, 'Administracion de proyectos', 2, 'IF049', 2, 1, 2, 0, 1),
(27, 'Sistemas Distribuidos', 2, 'IF022', 3, 9, 3, 0, 1),
(28, 'Aspectos Legales y Profesionales', 2, 'IF016', 3, 1, 3, 0, 1),
(29, 'Administracion de Redes y Seguridad', 2, 'IF046', 3, 4, 1, 0, 1);