PRAGMA foreign_keys = ON;

-- =====================================================
-- LIMPIAR RESPUESTAS EXISTENTES
-- =====================================================
DELETE FROM respuestas;

-- =====================================================
-- GENERAR RESPUESTAS ALEATORIAS (50 inscripciones simuladas)
-- =====================================================

-- Crear inscripciones simuladas (del id 5 al 54)
INSERT INTO inscripciones (id, estudiante_id, materia_id, fecha_inscripcion)
SELECT id + 4, ((id - 1) % 4) + 1, 1, datetime('2025-08-01 10:00:00', '+' || id || ' minutes')
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
