PRAGMA foreign_keys = ON;

-- =====================================================
-- LIMPIAR DATOS PREVIOS
-- =====================================================
DELETE FROM informesAC;
DELETE FROM respuestas;
DELETE FROM inscripciones;
DELETE FROM estudiantes;
DELETE FROM docentes;
DELETE FROM materias;
DELETE FROM carreras;

-- =====================================================
-- CARRERAS
-- =====================================================
INSERT INTO carreras (id_carrera, nombre)
VALUES
    (1, 'Ingeniería en Informática'),
    (2, 'Licenciatura en Sistemas');

-- =====================================================
-- MATERIAS
-- =====================================================
INSERT INTO materias (id_materia, nombre, anio, id_carrera, encuesta_id)
VALUES
    (1, 'Programación I', 1, 1, 1),
    (2, 'Bases de Datos', 2, 1, 1),
    (3, 'Sistemas Operativos', 3, 2, 1);

-- =====================================================
-- DOCENTES
-- =====================================================
INSERT INTO docentes (id_docente, nombre, nroLegajo)
VALUES
    (1, 'Juan Pérez', 1001),
    (2, 'Ana Gómez', 1002),
    (3, 'Carlos López', 1003);

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
-- INSCRIPCIONES (todos a la materia 1)
-- =====================================================
INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion)
VALUES
    (1, 1, 1, '2025-08-01 10:00:00'),
    (2, 2, 1, '2025-08-01 10:05:00'),
    (3, 3, 1, '2025-08-01 10:10:00'),
    (4, 4, 1, '2025-08-01 10:15:00');

-- =====================================================
-- RESPUESTAS A PREGUNTAS (coherente con OpcionRespuesta y Respuesta)
-- =====================================================
-- Las IDs de pregunta y opción vienen del script de encuesta UNPSJB
-- Ejemplo: Pregunta 1 tiene opciones (id=1 Una, id=2 Más de una)
--          Pregunta 6 tiene opciones (id=17-20), etc.

INSERT INTO respuestas (id, pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
VALUES
    -- María (id 1)
    (1, 1, 1, 1, NULL),   -- "Una"
    (2, 6, 1, 19, NULL),  -- "Bueno, Satisfactorio."
    (3, 9, 1, 36, NULL),  -- "Muy Bueno, Muy satisfactorio."

    -- José (id 2)
    (4, 1, 2, 2, NULL),   -- "Más de una"
    (5, 6, 2, 20, NULL),  -- "Muy Bueno, Muy satisfactorio."
    (6, 9, 2, 35, NULL),  -- "Bueno, Satisfactorio."

    -- Lucía (id 3)
    (7, 1, 3, 1, NULL),
    (8, 6, 3, 19, NULL),
    (9, 9, 3, 35, NULL),

    -- Pedro (id 4)
    (10, 1, 4, 2, NULL),
    (11, 6, 4, 20, NULL),
    (12, 9, 4, 36, NULL);

-- Ejemplo de respuesta abierta (pregunta 30)
INSERT INTO respuestas (id, pregunta_id, inscripcion_id, opcion_respuesta_id, respuesta_abierta)
VALUES
    (13, 30, 1, NULL, 'Buena comunicación con el docente.'),
    (14, 30, 2, NULL, 'Clases claras y organizadas.');

-- =====================================================
-- INFORMES AC
-- =====================================================
INSERT INTO informesAC (id_informesAC, id_materia, id_docente, opinionSobreResumen, resumenSecciones)
VALUES
(
    1,
    1,
    1,
    'Los resultados muestran una percepción muy positiva de la comunicación y metodología.',
    '{
        "A": {"Una": 50, "Más de una": 50},
        "B": {"Muy Bueno": 60, "Bueno": 40},
        "G": {"Muy Bueno": 50, "Bueno": 30, "Regular": 20}
    }'
);
