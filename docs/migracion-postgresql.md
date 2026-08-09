# Migración a PostgreSQL - Lingoxic

**Cliente:** American Business Academy (ABA)
**Autor:** Jeff Garro Rojas
**Tipo:** Servicio de fase 2 (se cotiza aparte)

---

## 1. Por qué migrar

Hoy el progreso de cada estudiante se guarda en el navegador de su dispositivo
(IndexedDB). Esto funciona para uso individual, pero al crecer el número de
usuarios y al querer que los profesores vean el avance, se necesita una base de
datos central:

- Guardar el progreso de todos los estudiantes en un solo lugar.
- Sincronizar entre dispositivos (celular, tablet, computadora).
- Que ABA pueda ver reportes y avance por grupo.
- Escalar de 50 a cientos o miles de usuarios sin perder datos.

## 2. Qué se implementa

| Componente | Detalle |
|---|---|
| Base de datos | PostgreSQL (vía Supabase, alojada en la nube) |
| Login | Cuenta real por estudiante (correo + contraseña, o nombre + PIN en nube) |
| Sincronización | El progreso se guarda en la nube automáticamente |
| Reportes | Panel para profesores: avance, quizzes aprobados, nivel, XP |
| Seguridad | Datos de estudiantes protegidos, acceso por rol |

## 3. Alcance del servicio

- Creación y configuración de la base de datos (Supabase/PostgreSQL).
- Migración del modelo de datos actual (usuario, progreso, quizzes, resultados)
  al esquema en nube.
- Sistema de login y autenticación para estudiantes y administradores.
- Sincronización bidireccional entre la app y la nube.
- Panel de reportes para profesores (avance por grupo y por estudiante).
- Pruebas de estabilidad con volumen (500+ usuarios).
- Documentación del sistema y guía de uso para ABA.

## 4. Lo que NO incluye

- Mantenimiento continuo (se cotiza en el contrato de mantenimiento aparte).
- Funciones de IA nuevas (cotización aparte).
- Adaptación de marca y dominio (cotización aparte).

## 5. Precio estimado

Se cotiza como proyecto con monto fijo, previa definición del alcance final con
ABA. Monto de referencia por evaluar según el detalle que ABA requiera.

## 6. Tiempo estimado

- Migración base: 3-4 semanas de desarrollo.
- Panel de reportes: 1-2 semanas adicionales.
- Total estimado: 4-6 semanas.

## 7. Qué garantiza la migración

- El estudiante NO pierde progreso al cambiar de dispositivo.
- Los profesores ven el avance de sus grupos.
- La app queda lista para escalar a cientos de usuarios.
- Los datos quedan respaldados en la nube (no solo en un navegador).

---

## Preguntas probables sobre la nube y reportes

**1. "¿El progreso de los estudiantes se guarda en la nube?"**
Hoy se guarda en el navegador de cada estudiante. La sincronización en nube llega con la migración a PostgreSQL (esta fase).

**2. "¿Pueden los profesores ver el avance de sus alumnos?"**
No aún. Es un módulo de esta fase: panel de profesores con avance por grupo y por estudiante.

**3. "¿Qué pasa si un estudiante pierde su progreso?"**
Sin respaldo central, el progreso depende del navegador del dispositivo. Por eso esta migración es clave: al completarse, el progreso queda respaldado en la nube.

**4. "¿Cuántos estudiantes soporta después de la migración?"**
La base de datos central permite escalar a cientos o miles de usuarios sin perder datos ni rendimiento.

**5. "¿Cuánto tiempo toma la migración?"**
4-6 semanas estimadas (base + panel de reportes).
