# Prompt para Figma - Rediseño del Onboarding

Documento con prompts listos para diseñar en Figma (o en otra herramienta de UI/IA) las 2 primeras pantallas de LinGoXiC.

## Identidad visual de la marca

- **Nombre:** LinGoXiC
- **Paleta principal:** gradiente índigo → violeta para fondos de pantallas iniciales.
  - Indigo: `#4F46E5`
  - Violeta: `#8B5CF6`
  - Indigo oscuro (fondo): `#312E81`
- **Acentos de marca (logotipo/sistema):** sky → emerald.
  - Sky: `#0EA5E9`
  - Emerald: `#10B981`
- **Tarjeta:** blanca (`#FFFFFF`), en modo oscuro gris `#1F2937`.
- **Texto de acento en tarjeta:** índigo `#4338CA` (claro) / índigo claro `#C7D2FE` (oscuro).
- **Público:** estudiantes de secundaria (12-18 años), Costa Rica.

---

## PANTALLA 1 — Bienvenida (Welcome)

**Prompt general para Figma:**

> Diseña una pantalla de bienvenida móvil (375x812) y desktop (1440x900) para la app de aprendizaje de inglés "LinGoXiC". Fondo: gradiente vertical de índigo (#4F46E5) a violeta (#8B5CF6), con brillos suaves difuminados (blobs radiales) en índigo claro y violeta claro en las esquinas superiores. Centrado vertical y horizontalmente. El logo "LinGoXiC" en grande (48-56px), tipografía sans-serif bold, color blanco con sombra suave. Debajo, un subtítulo en índigo claro (#E0E7FF), sin negritas: "Prepárate para las Pruebas Nacionales de Inglés del MEP con IA". Luego una tarjeta blanca (modo oscuro: gris #1F2937) con esquinas redondeadas (24px), sombra profunda, borde índigo suave (#E0E7FF). Dentro de la tarjeta, un título "🎯 ¿Qué vas a encontrar?" en índigo (claro) / índigo claro (oscuro), seguido de 4 filas con ícono emoji + texto, cada fila con un texto en gris oscuro (#374151) y la palabra clave en negrita índigo (#4338CA): 1) "Test de diagnóstico" para conocer tu nivel exacto (A1-B2), 2) "6 escenarios temáticos" alineados con el examen MEP, 3) "Tutor IA" con Gemini para feedback personalizado, 4) "Simulacro completo" de 100 preguntas tipo examen. Al final de la tarjeta, un botón de ancho completo "Comenzar ahora" con gradiente índigo a violeta (#4F46E5 → #8B5CF6), texto blanco, esquinas redondeadas (12px), alto 48px.

---

## PANTALLA 2 — Nombre y código de acceso

**Prompt general para Figma:**

> Diseña la segunda pantalla móvil (375x812) y desktop (1440x900) de la app "LinGoXiC". Mismo fondo: gradiente índigo a violeta (#4F46E5 → #8B5CF6) con brillos suaves difuminados. Centrada, una tarjeta blanca (modo oscuro: gris #1F2937), esquinas 24px, sombra profunda, borde índigo suave, ancho máximo 448px. Dentro de la tarjeta: el título "¿Cómo te llamas?" en índigo (#4338CA, oscuro: #C7D2FE), subtítulo en gris (#6B7280) "Usaremos tu nombre para personalizar tu experiencia". Luego dos campos de formulario, cada uno con su etiqueta en índigo (#4338CA, tamaño 12px): 1) "Tu nombre" — input con placeholder "Escribe tu nombre...", borde gris (#D1D5DB), esquinas 12px, alto 48px, foco con borde índigo (#4F46E5) y anillo suave; 2) "Código de acceso" — input tipo password con placeholder "Ingresa tu código de acceso...", mismo estilo. Debajo, un botón de ancho completo "Hacer test de diagnóstico" con gradiente índigo a violeta, texto blanco, esquinas 12px, alto 48px. Debajo del botón, un enlace discreto en gris (#9CA3AF): "Omitir test y empezar desde cero (A1)". Los campos deben estar bien espaciados (16-20px entre cada elemento) para que se vean limpios y modernos.

---

## Notas de implementación

- El fondo degradado se implementa con `bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700` (Tailwind).
- Los brillos difuminados se logran con `blur-3xl` sobre círculos de colores en las esquinas.
- Las tarjetas: `bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-indigo-100 dark:border-gray-700`.
- Botones: `bg-gradient-to-r from-indigo-500 to-violet-500`.
- Fuentes: sans-serif (Inter o similar).
- Móvil: contenido apilado vertical, tarjeta con margen 20px. Desktop: tarjeta centrada con max-w-md/lg.
