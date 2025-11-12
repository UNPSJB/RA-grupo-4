PRAGMA foreign_keys = ON;

-- =========================================
-- LIMPIAR DATOS PREVIOS
-- =========================================
DELETE FROM materias;
DELETE FROM docentes;
DELETE FROM carreras;
DELETE FROM departamentos;
DELETE FROM encuestas;

-- =========================================
-- CREAR CARRERAS
-- =========================================
INSERT INTO carreras (id_carrera, nombre)
VALUES
    (1, 'Ingeniería en Sistemas - APU UNPSJB'),
    (2, 'Licenciatura en Informática'),
    (3, 'Tecnicatura Universitaria en Programación');

-- =========================================
-- CREAR DEPARTAMENTOS
-- =========================================
INSERT INTO departamentos (id, nombre)
VALUES
    (1, 'Departamento de Ingeniería'),
    (2, 'Departamento de Ciencias Básicas'),
    (3, 'Departamento de Computación');

-- =========================================
-- CREAR DOCENTES
-- =========================================
INSERT INTO docentes (id_docente, nombre, nroLegajo)
VALUES
    (1, 'Juan Pérez', 1001),
    (2, 'Ana Gómez', 1002),
    (3, 'Carlos López', 1003);

-- =========================================
-- CREAR ENCUESTA BASE
-- =========================================
INSERT INTO encuestas (id_encuesta, nombre, disponible)
VALUES
    (1, 'Encuesta Académica 2025', 1);

-- =========================================
-- CREAR MATERIAS
-- =========================================
-- Nota: todas referencian carrera, docente, departamento y encuesta

INSERT INTO materias (
    id_materia, nombre, anio, codigoMateria,
    id_carrera, id_docente, id_departamento, encuesta_id
)
VALUES
    (1, 'Bases de Datos I', 2, 'BD101', 1, 1, 3, 1),
    (2, 'Algoritmos y Estructuras de Datos', 1, 'ALG102', 2, 2, 3, 1),
    (3, 'Sistemas Operativos', 3, 'SO201', 1, 3, 1, 1);

-- =========================================
-- CONSULTA DE VERIFICACIÓN
-- =========================================
SELECT 
    m.id_materia,
    m.nombre AS materia,
    m.anio,
    m.codigoMateria,
    c.nombre AS carrera,
    d.nombre AS docente,
    dp.nombre AS departamento,
    e.nombre AS encuesta
FROM materias m
JOIN carreras c ON m.id_carrera = c.id_carrera
JOIN docentes d ON m.id_docente = d.id_docente
JOIN departamentos dp ON m.id_departamento = dp.id
JOIN encuestas e ON m.encuesta_id = e.id_encuesta;

-- =========================================
-- CONFIRMAR
-- =========================================
SELECT COUNT(*) AS total_materias FROM materias;
