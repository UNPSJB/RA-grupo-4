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




INSERT INTO estudiantes (nombre, usuario, contraseña) VALUES
('Sofía García', 'sgarcia', 'pass123'),
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
(2, 'Licenciatura en Matemática'),
(3, 'Contador Público Nacional'),
(4, 'Licenciatura en Biología'),
(5, 'Ingeniería Química');





INSERT INTO departamentos (id, nombre) VALUES
(1, 'Departamento de Ingeniería en Sistemas'),
(2, 'Departamento de Matemática'),
(3, 'Departamento de Ciencias Económicas'),
(4, 'Departamento de Biología'),
(5, 'Departamento de Ingeniería Química');







INSERT INTO docentes (id_docente, nombre, nroLegajo) VALUES
(1, 'Ing. Juan Pérez', 1001),
(2, 'Lic. María Gómez', 1002),
(3, 'Dr. Carlos Ruiz', 1003),
(4, 'Mg. Ana Torres', 1004),
(5, 'Ing. Lucía Fernández', 1005),
(6, 'Lic. Pedro Ramírez', 1006),
(7, 'Dr. Sofía Díaz', 1007),
(8, 'Mg. Jorge López', 1008),
(9, 'Ing. Valentina Herrera', 1009),
(10, 'Lic. Martín Castro', 1010);








INSERT INTO materias (id_materia, nombre, anio, codigoMateria, id_carrera, id_docente, id_departamento, informeACCompletado, encuesta_id) VALUES
(1, 'Programación I', 2025, 'SIS101', 1, 1, 1, 0, 1),
(2, 'Programación II', 2025, 'SIS201', 1, 2, 1, 0, 1),
(3, 'Bases de Datos', 2025, 'SIS301', 1, 1, 1, 0, 1),
(4, 'Ingeniería de Software', 2025, 'SIS401', 1, 1, 1, 0, 1),
(5, 'Redes de Computadoras', 2025, 'SIS501', 1, 5, 1, 0, 1),

(6, 'Cálculo I', 2025, 'MAT101', 2, 6, 2, 0, 1),
(7, 'Álgebra Lineal', 2025, 'MAT201', 2, 7, 2, 0, 1),
(8, 'Probabilidad y Estadística', 2025, 'MAT301', 2, 8, 2, 0, 1),

(9, 'Contabilidad I', 2025, 'ECO101', 3, 9, 3, 0, 1),
(10, 'Economía General', 2025, 'ECO201', 3, 10, 3, 0, 1),
(11, 'Auditoría', 2025, 'ECO401', 3, 4, 3, 0, 1),

(12, 'Biología General', 2025, 'BIO101', 4, 2, 4, 0, 1),
(13, 'Ecología', 2025, 'BIO201', 4, 3, 4, 0, 1),

(14, 'Química General', 2025, 'QUI101', 5, 4, 5, 0, 1),
(15, 'Operaciones Unitarias', 2025, 'QUI301', 5, 5, 5, 0, 1);










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

















