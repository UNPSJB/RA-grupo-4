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

-- =========================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- =========================================

-- Departamentos
INSERT INTO departamentos (nombre) VALUES
('Matemática'),
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
