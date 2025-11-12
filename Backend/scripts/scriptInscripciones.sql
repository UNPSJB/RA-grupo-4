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
INSERT INTO informesAC (
    id_informesAC,
    completado,
    id_materia,
    id_docente,
    sede,
    ciclo_lectivo,
    opinionSobreResumen,
    resumenSecciones
)
VALUES
    (1, 0, 1, 1, 'Trelew', 2025, NULL, '{}'),
    (2, 0, 2, 2, 'Madryn', 2025, NULL, '{}'),
    (3, 0, 3, 3, 'Trelew', 2025, NULL, '{}');
