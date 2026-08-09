# Lingoxic - Documento de negociación

**Autor:** Jeff Garro Rojas
**Versión:** 1.0
**Contexto:** Reunión con American Business Academy (ABA) - Costa Rica

---

## 1. Qué es Lingoxic

Aplicación web de aprendizaje de inglés para estudiantes costarricenses de
secundaria, alineada al currículo MEP (niveles A1-B2). Funciona sin backend:
los datos se guardan en el navegador del usuario (IndexedDB) y la inteligencia
artificial se obtiene de Google Gemini con caché local.

**Stack actual**

- Frontend: React 18 + Vite + Tailwind CSS
- Estado: Context API
- Base de datos: IndexedDB vía Dexie (local, sin servidor)
- IA: Google Gemini (clave hardcodeada en `src/services/gemini.js`)
- Hosting: Firebase Hosting
- PWA: instalable, funciona offline
- Sin login real: el usuario se crea en el Onboarding y se guarda en el navegador

**Funcionalidades**

- Unidades temáticas MEP con lecciones y quizzes
- Test de ubicación (diagnóstico inicial)
- Ejercicios por skill: listening, reading, writing, speaking, grammar, vocabulary
- Tutor de chat con Gemini
- Simulacro de examen (100 preguntas con temporizador)
- Progreso, streak, XP y gráficos
- Modo oscuro y personalización

---

## 2. Quién es American Business Academy (ABA)

- Empresa costarricense dedicada a **diplomados a nivel nacional**.
- Imparten **inglés como lengua extranjera** entre sus programas.
- Les interesa Lingoxic: la vieron, les gustó y quieren reunirse para definir
  monetización, funciones y alcance.
- No son una empresa de software: son una academia. Eso significa que **no saben
  cuánto cuesta mantener una app** y que probablemente **sobreestiman lo fácil
  que es** agregar funciones.

**Lo que probablemente quieren de ti**

1. Una app con su marca o bajo su programa de inglés.
2. Que sus estudiantes (cientos) tengan cuenta y progreso.
3. Que funcione bien, rápido y sin caerse.
4. Que les cobre un precio "justo" por estudiante.
5. Reportes o visibilidad del avance de sus alumnos (esto hoy la app NO lo tiene).

**Lo que te van a preguntar (prepárate)**

- ¿Cuánto cobra por estudiante / por año?
- ¿El progreso se guarda en la nube o solo en el teléfono?
- ¿Cuántos estudiantes soporta?
- ¿Se puede poner nuestro logo / nuestra marca?
- ¿Pueden los profesores ver el progreso de sus alumnos?
- ¿Qué pasa si se cae o si un estudiante cambia de teléfono?
- ¿Quién da mantenimiento y cuánto cuesta?
- ¿Qué pasa con los datos de nuestros estudiantes (privacidad)?

---

## 3. Estado técnico real (lo que hay que decirle a ABA)

Esto es lo más importante de la negociación: **hoy la app NO está lista para
500 usuarios en producción**, y hay que decirlo con honestidad para no prometer
lo que no se puede cumplir.

| Aspecto | Estado hoy | Lo que falta para 500+ usuarios |
|---|---|---|
| Hosting | Firebase Hosting (gratis / bajo costo) | Escalar o migrar |
| Base de datos | IndexedDB en cada navegador | Base de datos central (PostgreSQL) |
| Progreso | Solo local, se pierde al cambiar de dispositivo | Sincronización en la nube |
| Cuentas | Sin login real | Sistema de login por estudiante |
| Profesores | No existe rol de profesor | Panel con reportes por grupo |
| IA | Clave hardcodeada, límites de sesión | Gestión de límites y caché robusta |
| Dominio | No tiene (URL de Firebase) | Comprar dominio propio |
| Mantenimiento | 1 persona (el autor) | Definir SLA y horas |

**Conclusión técnica honesta:** con 500 estudiantes en Firebase Hosting la app
puede mantenerse viva, pero el gran riesgo no es el hosting: es que **el progreso
vive en cada navegador**. Si un estudiante cambia de teléfono o borra datos,
pierde todo. ABA va a querer que el progreso esté en la nube. Eso requiere la
migración a PostgreSQL (que ya se está considerando).

---

## 4. Monetización

### 4.1 Modelos de cobro

**Por usuario**

- Se cobra por cada estudiante habilitado.
- Ejemplo: 500 estudiantes x 3.000 CRC = 1.500.000 CRC (aprox. 3.000 USD).
- Pros: fácil de entender, escala con el tamaño del cliente.
- Contras: ABA controla cuántos estudiantes declara; incentiva a reportar menos.

**Por paquete**

- Se venden bloques fijos: 100, 250, 500, 1.000 estudiantes.
- Ejemplo: paquete de 500 estudiantes = 1.350.000 CRC (con descuento por volumen).
- Pros: flujo predecible, sin pelear por cada estudiante.
- Contras: menos flexible.

**Por institución / licencia anual**

- Se cobra un monto fijo al año por usar la app con toda su población.
- Ejemplo: 1.200.000 CRC/año (2.400 USD).
- Pros: flujo estable, mínimo trabajo administrativo.
- Contras: puede parecer caro a primera vista.

### 4.2 Tabla comparativa: semanal vs mensual vs anual

| Frecuencia | Precio sugerido | Monto por 500 usuarios | Ventaja | Desventaja |
|---|---|---|---|---|
| **Anual (adelantado)** | 3.000 CRC/usuario/año | 1.500.000 CRC (3.000 USD) | Te pagan TODO al inicio; riesgo cero; menos administración | Monto grande de golpe; ABA puede regatear o pedir financiamiento |
| **Mensual** | 250 CRC/usuario/mes | 125.000 CRC/mes (250 USD) | Flujo constante cada mes; parece barato al cliente; fácil de ajustar | Te toca cobrar cada mes; si ABA deja de pagar, pierdes el ingreso; más administración |
| **Semanal** | 60 CRC/usuario/semana | 30.000 CRC/semana (60 USD) | Flujo muy constante; sensación de "poco dinero" para ABA | MUCHA administración (cobrar 48 veces al año); montos chicos difíciles de justificar; peor relación costo/beneficio |

**Recomendación: mensual o anual, nunca semanal.**

- **Anual adelantado** si quieres flujo grande y seguro de una vez (y ABA acepta).
- **Mensual** como plan "parece barato" (125.000 CRC/mes suena mucho menor que
  1.500.000 CRC de golpe) y te da ingreso recurrente.
- **Semanal es el peor**: por 500 usuarios serían solo 30.000 CRC por semana y
  48 cobros al año. La fricción administrativa (cobrar, cuadrar, facturar) se
  come la ganancia. No lo recomiendo.

### 4.3 Comparación de precios por usuario (con ejemplo de 500)

| Frecuencia | Precio unitario | Total por 500 usuarios | Total en USD (aprox.) |
|---|---|---|---|
| Anual | 3.000 CRC | 1.500.000 CRC | 3.000 USD |
| Mensual | 250 CRC/mes | 125.000 CRC/mes | 250 USD/mes |
| Semanal | 60 CRC/semana | 30.000 CRC/semana | 60 USD/semana |

*Referencia: 1 USD = aprox. 500 CRC.*

---

## 5. Costos de mantenimiento y nube

### 5.1 Costos mensuales estimados (producción con 500 usuarios)

| Concepto | Costo mensual estimado |
|---|---|
| Firebase Hosting (uso moderado) | 0 - 5 USD |
| Dominio propio (.com/.cr) | 1 - 2 USD |
| PostgreSQL / Supabase (500 usuarios) | 25 - 100 USD |
| API Gemini (uso real con 500 usuarios) | 20 - 150 USD |
| **Total aproximado** | **50 - 250 USD/mes** |

*Estos números son estimaciones con precios públicos de 2025. Hay que validarlos
antes de firmar.*

### 5.2 Costo de tu trabajo (mantenimiento)

- Valor de tu hora (junior/mid en Costa Rica): 2.000 - 6.000 CRC/hora.
- Mantenimiento estimado con tu horario de estudio (7:00 - 16:30): 4 - 8
  horas/semana como máximo realista.
- Costo mensual de mantenimiento: 30.000 - 150.000 CRC/mes.

**Regla práctica:** el mantenimiento debe cobrarse por separado del uso, o
incluirse en un porcentaje del plan. No lo regales: tu tiempo es lo que ABA no
puede comprar en otro lado.

---

## 6. Aspectos fiscales (Hacienda, Costa Rica)

Este es el punto que te advirtieron en la reunión: **todo ingreso tiene que
declararse**, y Hacienda puede cobrar después si no se hace.

### 6.1 Opciones para tributar

**Opción A: Servicios profesionales (persona física)**

- Te registras en Hacienda como profesional / servicios profesionales.
- Presentas declaración una vez al año (resumen de ingresos).
- Paga impuestos al final del ciclo anual.
- Se necesita llevar control de ingresos (un contador te ayuda).
- No se puede ignorar: es peor que pagar.

**Opción B: Sociedad Anónima (S.A.)**

- Se crea con un abogado; hay costos de constitución.
- Tributa de forma distinta (ganancias de la sociedad).
- Requiere un pago anual por tenerla (mantenimiento de la sociedad).
- Más formal, útil si el negocio crece o si quieres contratar gente.

**Resumen:**

| Criterio | Servicios profesionales | Sociedad Anónima |
|---|---|---|
| Costo de inicio | Bajo (registro) | Medio (abogado + constitución) |
| Costo anual | Impuesto sobre la renta | Impuesto + mantenimiento anual |
| Complejidad contable | Baja (1 declaración/año) | Media (cada trimestre/año) |
| Ideal si... | Empiezas solo, ingresos moderados | El negocio crece, contratas, tienes inversión |

**Recomendación para tu caso (18 años, ingresos iniciales):**

- Empezar como **servicios profesionales** es lo más simple y barato.
- Contratar un contador desde el principio te evita sustos de Hacienda.
- Migrar a S.A. solo si el ingreso se vuelve constante y grande (o si ABA lo
  exige para firmar un contrato grande).

**Dato clave:** los montos que manejas (1.500.000 CRC/año) son bajos y entran en
los tramos menores de impuesto. El problema no es el monto, es **no declarar**.
Un contador te cobra poco y te quita el dolor de cabeza.

---

## 7. Pregunta técnica: tokens de Gemini (respondida)

La pregunta que te hicieron: "el prompt de Gemini, carga por sección o por
pregunta? Porque eso depende de los tokens que gastes. ¿Es más eficiente pedir
todo de una sola vez?"

**Cómo está hoy la app:**

- La IA se usa en 3 funciones: `correctWriting` (corrige textos), `evaluateSpeaking`
  (evalúa habla) y `chatWithTutor` (tutor de chat).
- Cada llamada hace UNA petición a Gemini (`callGemini`), con un prompt completo.

**Respuesta técnica:**

- **Es más eficiente (y más barato) pedir todo de una sola vez** en un solo
  prompt (ej. "genera 20 preguntas") que hacer 20 llamadas individuales.
- Hoy la app hace una llamada por acción (una corrección, un mensaje de chat).
  Para generar quizzes masivos conviene pedir varias preguntas en un solo prompt.
- Se debe implementar un **caché por prompt** (ya existe `aiCache` en la DB
  local) para no gastar tokens dos veces en la misma petición.
- Los límites actuales: 15 solicitudes por sesión y un límite diario
  (`LÍMITE_GEMINI`). Con 500 usuarios esto hay que rediseñarlo (por ejemplo,
  cuota por estudiante o por día).

**Conclusión para ABA:** el costo de IA es manejable si se cachean respuestas y
se piden preguntas en lotes. Es un costo que hay que trasladar al precio (está
incluido en el ítem "API Gemini" de la tabla de costos).

---

## 8. Migración a PostgreSQL (cuando se decida)

Motivo de la migración: pasar de datos locales (IndexedDB) a una base de datos
central que permita:

- Guardar el progreso de todos los estudiantes en un solo lugar.
- Sincronizar entre dispositivos (celular, tablet, PC).
- Que los profesores vean el avance de sus alumnos.
- Escalar a cientos o miles de usuarios.

**Opciones recomendadas:**

- **Supabase** (PostgreSQL hosteado + API + auth): ideal para empezar, ya que
  no requiere levantar servidor propio. Plan gratis para probar.
- **Backend propio (Node/Express) + PostgreSQL**: más control, más trabajo y más
  costo de operación.

**Recomendación:** Supabase primero. Es el puente más corto entre "todo local"
y "todo en la nube" para una persona que trabaja sola.

---

## 9. Plan propuesto para la reunión con ABA

### 9.1 Modelo recomendado

1. **Plan piloto**: 50 estudiantes por 2 meses, a precio preferencial, para
   validar estabilidad y uso real en el contexto de ABA.
2. **Modelo de cobro**: por estudiante, mensual o anual (adelantado).
3. **Precio sugerido inicial**: 3.000 CRC/estudiante/año (o 250 CRC/mes).
4. **Mantenimiento**: contrato aparte o incluido como porcentaje del plan.
5. **Alcance**: definir claramente qué funciones incluye el plan y cuáles son
   desarrollos extra (login, panel de profesores, reportes, marca propia).

### 9.4 Plan piloto detallado (propuesta concreta)

**Propuesta:** 50 usuarios durante 2 meses a 25.000 CRC.

**¿Por qué 50 y no 500?**
- 500 usuarios exigiría desde el día 1 base de datos central (Supabase/Postgres),
  límites de IA robustos y login real. No está listo todavía.
- 50 usuarios es manejable con la infraestructura actual (Firebase Hosting +
  IndexedDB local), con riesgo técnico mínimo.
- Un piloto pequeño valida lo que importa: que los estudiantes usen la app, que
  el progreso se guarde, y que ABA vea valor real. Eso es lo que decide la venta.

**¿Por qué 2 meses y no 1?**
- 1 mes es poco tiempo para que los estudiantes usen la app con regularidad y
  para que ABA vea resultados. Un piloto de 1 mes suele terminar "sin datos".
- 2 meses cubre un ciclo real de estudio: suficiente para probar quizzes,
  lecciones, y que se note el progreso.
- 2 meses también compromete a ABA a participar; si es solo 1 mes, muchos no se
  conectan y al final el piloto no prueba nada.

**¿Por qué 25.000 CRC?**
- Se calcula con la tarifa mensual base (250 CRC/estudiante/mes): 250 x 50
  estudiantes = 12.500 CRC/mes, por 2 meses = 25.000 CRC.
- Es un precio simbólico que valida el interés real de ABA sin parecer caro
  (equivale a 250 CRC por estudiante al mes, unos 0,5 USD).
- Cubre los costos mínimos del periodo (hosting, dominio, consumo de Gemini).
- Al final del piloto, el salto a la tarifa real (250-300 CRC/estudiante/mes o
  el paquete anual) se presenta con la evidencia del piloto: cuánto se usó,
  cuánto gastó la IA, qué funciones pidieron los estudiantes.

**Condiciones del piloto (importante):**

- Los 50 usuarios se entregan con login simple (nombre + PIN).
- El progreso se guarda por navegador; se documenta que el sincronizado en nube
  llega en la siguiente fase (con la base de datos).
- Al terminar los 2 meses, si ABA quiere continuar, se firma el plan comercial
  real. El piloto NO se renueva gratis.
- El piloto incluye soporte y mantenimiento básico durante esos 2 meses.

**El guion para ofrecerlo:**

> "Tengo un plan piloto listo: 50 usuarios por 2 meses a 25.000 colones.
> Es una prueba real para que vean la estabilidad y cómo la usan sus
> estudiantes. Al final del piloto vemos los datos y definimos el plan
> comercial. Si les funciona, seguimos; si no, se acabó y no pagan más."

**Lo que se negocia al final del piloto (es el objetivo real):**

- Tarifa por estudiante (mensual o anual).
- Migración a base de datos en la nube (progreso centralizado).
- Panel para profesores/reportes (desarrollo extra, se cotiza aparte).
- Contrato de mantenimiento y soporte.

### 9.2 Qué NO prometer en la primera reunión

- No prometer 500 usuarios "ya": ser honesto con el estado técnico.
- No prometer reportes de profesores que aún no existen: es desarrollo extra.
- No comprometer plazos de funciones nuevas sin fecha estimada.

### 9.3 Checklist para la reunión

- [ ] Definir modelo de cobro (por usuario / paquete / licencia).
- [ ] Definir frecuencia (anual recomendado, mensual como alternativa).
- [ ] Definir precio unitario.
- [ ] Definir qué funciones incluye la primera versión (MVP del cliente).
- [ ] Definir el plan piloto (grupo, duración, precio).
- [ ] Aclarar quién crea los usuarios (ABA o el autor).
- [ ] Aclarar la política de datos y privacidad.
- [ ] Proponer el contrato de mantenimiento.
- [ ] Verificar tema fiscal con un contador antes de firmar nada.

---

## 10. Resumen ejecutivo

1. Tienes una app real y funcional que a ABA le gustó.
2. El modelo de cobro más simple es **por estudiante, mensual o anual**.
3. El mejor plan inicial es **plan piloto: 50 usuarios por 2 meses a 25.000
   CRC** para validar estabilidad y uso real, y luego cobrar la tarifa real.
4. El mantenimiento se cobra aparte: tu tiempo vale.
5. Los costos de nube son bajos al inicio (50 - 250 USD/mes con 500 usuarios).
6. El tema de Hacienda se resuelve con un contador y declarando como servicios
   profesionales (la opción más simple al empezar).
7. La migración a PostgreSQL (vía Supabase) es el siguiente paso técnico para
   soportar muchos usuarios con progreso en la nube.
8. En la primera reunión: escuchar, no prometer de más, y dejar todo por escrito.
