# Prompt para Figma - Rediseño del Dashboard

Documento con el prompt listo para diseñar en Figma (o herramienta de UI/IA) el Dashboard de LinGoXiC.

## Identidad visual de la marca

- **Nombre:** LinGoXiC
- **Fondo claro:** `#F8FAFC`
- **Fondo oscuro:** `#0F172A`
- **Tarjetas:** blancas (`#FFFFFF`), modo oscuro `#1E293B`
- **Acentos:** sky `#0EA5E9` y emerald `#10B981`
- **Niveles:** A1 verde, A2 azul, B1 amarillo, B2 morado
- **Público:** estudiantes de secundaria (12-18 años), Costa Rica

---

## Prompt general

> Diseña una pantalla de dashboard móvil (375x812) y desktop (1440x900) para la
> app de aprendizaje de inglés "LinGoXiC", para estudiantes de secundaria.
> Estilo general: fondo claro gris suave (#F8FAFC) en modo claro, gris oscuro
> (#0F172A) en modo oscuro; tarjetas blancas (#FFFFFF) con esquinas redondeadas
> (16-20px), sombra suave, sin bordes gruesos. Acentos: azul cielo (#0EA5E9) y
> esmeralda (#10B981); el perfil y los niveles con badges de color (A1 verde,
> A2 azul, B1 amarillo, B2 morado).

> **Header superior:** fila con saludo "¡Hola, [nombre]! 👋" en grande y bold,
> debajo un subtítulo en gris "Continúa tu aprendizaje de inglés". A la derecha
> del header, una pill de XP con ícono ⭐ y "0 XP" en gris oscuro, y el badge de
> nivel "A1 - Principiante" con fondo verde suave y texto verde.

> **Tarjetas de estado (fila de 3 en desktop, apiladas en móvil):** 1) "Racha"
> con ícono de fuego 🔥, número "0 días" grande y subtexto; 2) "Experiencia" con
> ícono ⚡, "0 XP" grande; 3) "Siguiente nivel" con barra de progreso delgada y
> texto "Principiante → 1000 XP". Cada tarjeta: ícono con fondo de color suave
> (sky-100 / emerald-100), valor en negrita, etiqueta en gris.

> **Sección "Continúa aprendiendo":** una tarjeta destacada con gradiente de
> fondo (de sky a emerald o de índigo a violeta), con el título "Mi Perfil",
> progreso "0/4 lecciones completadas" y un botón blanco "Continuar". Esta
> tarjeta resalta sobre el resto.

> **Sección "Unidades Temáticas":** encabezado con título y contador "0/31
> lecciones". Lista de 7 tarjetas horizontales (Mi Perfil, Compras Tecnológicas,
> Estilos de Vida Saludables, Viajes Seguros, Variedad Cultural, Mercado
> Laboral, Global Competence), cada una con: número en un círculo con gradiente
> de color (cada unidad con su propio gradiente: sky→emerald, índigo→violeta,
> etc.), nombre de la unidad, y una barra de progreso delgada con porcentaje
> "0%". Las unidades desbloqueadas con opacidad normal, las bloqueadas con
> opacidad 50% y candado 🔒.

> **Sección "Áreas a Mejorar":** estado vacío elegante: ícono 🎯 en un círculo
> de fondo sky-100, texto "Completa el test de diagnóstico para identificar
> áreas de mejora." y un botón secundario "Hacer diagnóstico" con borde sky.

> **Sección "Práctica Rápida":** tarjeta con gradiente índigo→violeta, título
> "Práctica Rápida 🎯", texto "Evalúa tus 6 habilidades y conoce tu nivel CEFR
> real (A1–B2) en cada una." y botón blanco "Hacer diagnóstico".

> **Móvil:** todo apilado vertical con espaciado 16-20px entre tarjetas.
> **Desktop:** grid de 2-3 columnas para las tarjetas de estado y las unidades.

---

## Notas de implementación

- Tarjetas: `bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm`.
- Tarjeta destacada: `bg-gradient-to-br from-sky-500 to-emerald-500 text-white`.
- Tarjeta práctica rápida: `bg-gradient-to-br from-indigo-500 to-violet-500 text-white`.
- Badges de nivel: `A1 bg-green-500`, `A2 bg-blue-500`, `B1 bg-yellow-500`, `B2 bg-purple-500`.
- Gradientes por unidad (unidadesData.js): sky→emerald, sky→blue, emerald→teal, etc.
