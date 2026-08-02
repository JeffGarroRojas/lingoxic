const grammarData = [
  {
    id: `present-simple-continuous`,
    title: `Present Simple vs Present Continuous`,
    level: `A1`,
    description: `Diferencia entre acciones rutinarias y acciones que ocurren ahora`,
    explanation: `El Present Simple se usa para rutinas, hechos generales y acciones habituales. El Present Continuous se usa para acciones que están ocurriendo en este momento o alrededor del momento actual.`,
    rules: [
      {
        title: `Present Simple - Formación`,
        content: `Sujeto + verbo (con -s/-es para he/she/it). Ej: I play, He plays. Para preguntas: Do/Does + sujeto + verbo. Para negativas: Sujeto + don't/doesn't + verbo.`,
      },
      {
        title: `Present Simple - Usos`,
        content: `Rutinas (I wake up at 6am), Hechos generales (Water boils at 100°C), Gustos (She likes music), Horarios (The bus leaves at 8pm).`,
      },
      {
        title: `Present Continuous - Formación`,
        content: `Sujeto + am/is/are + verbo-ing. Ej: I am studying, She is reading. Para preguntas: Am/Is/Are + sujeto + verbo-ing.`,
      },
      {
        title: `Present Continuous - Usos`,
        content: `Acciones ahora (I am studying right now), Planes futuros cercanos (We are traveling tomorrow), Acciones temporales (He is staying with us this week).`,
      },
    ],
    examples: [
      {
        correct: `I wake up at 7:00 every morning.`,
        explanation: `Acción habitual → Present Simple`,
      },
      {
        correct: `I am studying English right now.`,
        explanation: `Acción en progreso ahora → Present Continuous`,
      },
      {
        correct: `She works at a hospital.`,
        explanation: `Hecho general/trabajo permanente → Present Simple`,
      },
      {
        correct: `They are playing soccer at the moment.`,
        explanation: `Acción en desarrollo ahora → Present Continuous`,
      },
    ],
    exercises: [
      {
        id: `g1`,
        type: `multiple-choice`,
        prompt: `She ___ to school every day.`,
        options: [`go`, `goes`, `is going`, `going`],
        correctAnswer: `goes`,
        explanation: `Every day indica rutina → Present Simple con he/she/it: goes`,
        skillArea: `grammar`,
      },
      {
        id: `g2`,
        type: `multiple-choice`,
        prompt: `Right now, they ___ lunch.`,
        options: [`have`, `has`, `are having`, `is having`],
        correctAnswer: `are having`,
        explanation: `"Right now" indica acción en progreso → Present Continuous con they: are having`,
        skillArea: `grammar`,
      },
      {
        id: `g3`,
        type: `multiple-choice`,
        prompt: `My brother ___ video games every weekend.`,
        options: [`play`, `plays`, `is playing`, `are playing`],
        correctAnswer: `plays`,
        explanation: `Every weekend indica rutina → Present Simple: he plays`,
        skillArea: `grammar`,
      },
      {
        id: `g4`,
        type: `multiple-choice`,
        prompt: `Listen! Someone ___ at the door.`,
        options: [`knocks`, `knock`, `is knocking`, `are knocking`],
        correctAnswer: `is knocking`,
        explanation: `"Listen!" indica acción ahora → Present Continuous: someone is knocking`,
        skillArea: `grammar`,
      },
      {
        id: `g5`,
        type: `multiple-choice`,
        prompt: `We ___ to the beach every summer.`,
        options: [`go`, `goes`, `are going`, `is going`],
        correctAnswer: `go`,
        explanation: `Every summer indica rutina → Present Simple: we go`,
        skillArea: `grammar`,
      },
    ],
    order: 1,
  },
  {
    id: `past-simple-continuous`,
    title: `Past Simple vs Past Continuous`,
    level: `A2`,
    description: `Acciones completadas en pasado y acciones en progreso en el pasado`,
    explanation: `El Past Simple se usa para acciones completadas en el pasado. El Past Continuous se usa para acciones que estaban en progreso en un momento específico del pasado.`,
    rules: [
      {
        title: `Past Simple - Formación`,
        content: `Verbo regular: -ed (played, walked). Verbo irregular: 2da columna (went, ate, saw). Para preguntas: Did + sujeto + verbo base. Para negativas: didn't + verbo base.`,
      },
      {
        title: `Past Simple - Usos`,
        content: `Acciones terminadas (I visited Paris last year), Secuencia de eventos (He arrived, ate dinner, and went to bed), Estados pasados (She was a teacher).`,
      },
      {
        title: `Past Continuous - Formación`,
        content: `Sujeto + was/were + verbo-ing. I/he/she/it was playing. You/we/they were playing.`,
      },
      {
        title: `Past Continuous - Usos`,
        content: `Acción interrumpida (I was watching TV when she called), Acciones simultáneas (While I was cooking, he was cleaning), Acción en progreso en un momento pasado (At 8pm, I was studying).`,
      },
    ],
    examples: [
      {
        correct: `I visited my grandmother yesterday.`,
        explanation: `Acción completada → Past Simple`,
      },
      {
        correct: `I was watching TV when the phone rang.`,
        explanation: `Acción en progreso (was watching) interrumpida por acción corta (rang)`,
      },
      {
        correct: `We went to the beach last weekend.`,
        explanation: `Acción completada en tiempo definido → Past Simple`,
      },
      {
        correct: `At 7pm, she was doing her homework.`,
        explanation: `Acción en progreso en un momento específico → Past Continuous`,
      },
    ],
    exercises: [
      {
        id: `g6`,
        type: `multiple-choice`,
        prompt: `Yesterday, I ___ a great movie.`,
        options: [`see`, `saw`, `was seeing`, `seen`],
        correctAnswer: `saw`,
        explanation: `Yesterday indica pasado completado → Past Simple: saw (verbo irregular)`,
        skillArea: `grammar`,
      },
      {
        id: `g7`,
        type: `multiple-choice`,
        prompt: `She ___ dinner when I arrived.`,
        options: [`cooks`, `cooked`, `was cooking`, `is cooking`],
        correctAnswer: `was cooking`,
        explanation: `Acción en progreso cuando otra ocurrió → Past Continuous: was cooking`,
        skillArea: `grammar`,
      },
      {
        id: `g8`,
        type: `multiple-choice`,
        prompt: `They ___ soccer last Saturday.`,
        options: [`play`, `played`, `were playing`, `plays`],
        correctAnswer: `played`,
        explanation: `Last Saturday indica acción completada → Past Simple: played`,
        skillArea: `grammar`,
      },
    ],
    order: 2,
  },
  {
    id: `present-perfect`,
    title: `Present Perfect`,
    level: `A2`,
    description: `Experiencias de vida y acciones con relevancia en el presente`,
    explanation: `El Present Perfect conecta el pasado con el presente. Se usa para experiencias de vida, acciones que empezaron en el pasado y continúan, y acciones pasadas con resultados presentes.`,
    rules: [
      {
        title: `Formación`,
        content: `Sujeto + have/has + participio pasado. Ej: I have visited, She has eaten. Preguntas: Have/Has + sujeto + participio? Negativas: haven't/hasn't + participio.`,
      },
      {
        title: `Uso 1: Experiencias`,
        content: `Se usa con ever/never para hablar de experiencias. Ej: "Have you ever been to London?" "I have never tried sushi." No importa cuándo ocurrió exactamente.`,
      },
      {
        title: `Uso 2: Acciones que continúan`,
        content: `Con since (desde un punto) y for (por duración). Ej: "I have studied English for 2 years." "She has lived here since 2020."`,
      },
      {
        title: `Uso 3: Resultados presentes`,
        content: `Acciones pasadas con resultados en el presente. Ej: "I have lost my keys" (no las tengo ahora). "She has finished her homework" (está libre ahora).`,
      },
    ],
    examples: [
      {
        correct: `I have visited Costa Rica three times.`,
        explanation: `Experiencia de vida sin tiempo específico`,
      },
      {
        correct: `She has lived here since 2019.`,
        explanation: `Acción que empezó en el pasado y continúa`,
      },
      {
        correct: `They have already finished the exam.`,
        explanation: `Resultado presente: ya terminaron`,
      },
      {
        correct: `Have you ever tried gallo pinto?`,
        explanation: `Pregunta sobre experiencia de vida`,
      },
    ],
    exercises: [
      {
        id: `g9`,
        type: `multiple-choice`,
        prompt: `I ___ never ___ to the United States.`,
        options: [`have/been`, `has/been`, `have/go`, `has/go`],
        correctAnswer: `have/been`,
        explanation: `Never + experiencia → Present Perfect con I: have been`,
        skillArea: `grammar`,
      },
      {
        id: `g10`,
        type: `multiple-choice`,
        prompt: `She ___ English for three years.`,
        options: [`study`, `studied`, `has studied`, `is studying`],
        correctAnswer: `has studied`,
        explanation: `For three years = duración → Present Perfect: has studied`,
        skillArea: `grammar`,
      },
      {
        id: `g11`,
        type: `multiple-choice`,
        prompt: `___ you ever ___ sushi?`,
        options: [`Have/eat`, `Have/eaten`, `Has/eaten`, `Did/eat`],
        correctAnswer: `Have/eaten`,
        explanation: `Ever + experiencia → Have + participio: Have you ever eaten?`,
        skillArea: `grammar`,
      },
    ],
    order: 3,
  },
  {
    id: `future-will-going-to`,
    title: `Future: Will vs Going To`,
    level: `A2`,
    description: `Diferencias entre predicciones, promesas, planes y decisiones espontáneas`,
    explanation: `En inglés hay dos formas principales de hablar del futuro: "will" para decisiones espontáneas, promesas y predicciones; "going to" para planes y predicciones con evidencia.`,
    rules: [
      {
        title: `Will - Formación`,
        content: `Sujeto + will + verbo base. Contracciones: I'll, you'll, she'll. Negativo: won't (will not). Preguntas: Will + sujeto + verbo?`,
      },
      {
        title: `Will - Usos`,
        content: `Decisiones espontáneas (I'll answer the phone), Promesas (I won't tell anyone), Predicciones sin evidencia (I think it will rain tomorrow), Ofrecimientos (I'll help you).`,
      },
      {
        title: `Going to - Formación`,
        content: `Sujeto + am/is/are + going to + verbo base. Ej: I am going to study. She is going to travel.`,
      },
      {
        title: `Going to - Usos`,
        content: `Planes e intenciones (We are going to visit Manuel Antonio next month), Predicciones con evidencia (Look at those clouds! It is going to rain).`,
      },
    ],
    examples: [
      {
        correct: `I am going to study medicine at the university.`,
        explanation: `Plan ya decidido → going to`,
      },
      {
        correct: `The phone is ringing! I'll get it.`,
        explanation: `Decisión espontánea → will`,
      },
      {
        correct: `Look at the clouds! It is going to rain.`,
        explanation: `Predicción con evidencia visible → going to`,
      },
      {
        correct: `Don't worry, I won't forget your birthday.`,
        explanation: `Promesa → will/won't`,
      },
    ],
    exercises: [
      {
        id: `g12`,
        type: `multiple-choice`,
        prompt: `A: "I'm so hungry." B: "I ___ make you a sandwich."`,
        options: [`will`, `am going to`, `going to`, `go`],
        correctAnswer: `will`,
        explanation: `Ofrecimiento espontáneo → will`,
        skillArea: `grammar`,
      },
      {
        id: `g13`,
        type: `multiple-choice`,
        prompt: `Next year, we ___ visit our family in Limón.`,
        options: [`will`, `are going to`, `won't`, `going to`],
        correctAnswer: `are going to`,
        explanation: `Plan ya decidido → going to con we: are going to`,
        skillArea: `grammar`,
      },
      {
        id: `g14`,
        type: `multiple-choice`,
        prompt: `I think Costa Rica ___ win the match.`,
        options: [`is going to`, `will`, `going to`, `wins`],
        correctAnswer: `will`,
        explanation: `Predicción sin evidencia → will (I think)`,
        skillArea: `grammar`,
      },
    ],
    order: 4,
  },
  {
    id: `modal-verbs`,
    title: `Modal Verbs`,
    level: `A2`,
    description: `Can, could, should, must, have to - habilidad, permiso, consejo y obligación`,
    explanation: `Los verbos modales son auxiliares que expresan habilidad, posibilidad, permiso, obligación o consejo. No cambian su forma (no -s en he/she) y van seguidos de verbo base.`,
    rules: [
      {
        title: `Can / Could`,
        content: `Can = habilidad presente (I can swim), permiso (Can I go?). Could = habilidad pasada (I could run fast), petición cortés (Could you help me?).`,
      },
      {
        title: `Should / Ought to`,
        content: `Should = consejo o recomendación (You should study more, You should eat vegetables). Es menos fuerte que must.`,
      },
      {
        title: `Must / Have to`,
        content: `Must = obligación fuerte (You must wear a uniform). Have to = obligación externa (I have to do homework). Mustn't = prohibido (You mustn't run in the hall).`,
      },
      {
        title: `Características`,
        content: `Los modales no usan do/does en preguntas (Can you swim? NO Do you can swim?). No añaden -s en tercera persona (He can, NO he cans).`,
      },
    ],
    examples: [
      {
        correct: `She can speak English and French.`,
        explanation: `Can = habilidad presente`,
      },
      {
        correct: `You should drink more water every day.`,
        explanation: `Should = consejo de salud`,
      },
      {
        correct: `Students must wear a uniform at school.`,
        explanation: `Must = obligación/regla`,
      },
      {
        correct: `Could you please repeat that?`,
        explanation: `Could = petición cortés`,
      },
    ],
    exercises: [
      {
        id: `g15`,
        type: `multiple-choice`,
        prompt: `You ___ eat more fruits and vegetables.`,
        options: [`should`, `can`, `must`, `could`],
        correctAnswer: `should`,
        explanation: `Consejo de salud → should`,
        skillArea: `grammar`,
      },
      {
        id: `g16`,
        type: `multiple-choice`,
        prompt: `___ you swim when you were 5?`,
        options: [`Can`, `Could`, `Should`, `Must`],
        correctAnswer: `Could`,
        explanation: `Habilidad en el pasado → could`,
        skillArea: `grammar`,
      },
      {
        id: `g17`,
        type: `multiple-choice`,
        prompt: `You ___ touch that. It's dangerous!`,
        options: [`mustn't`, `don't have to`, `shouldn't`, `can't`],
        correctAnswer: `mustn't`,
        explanation: `Prohibición fuerte → mustn't`,
        skillArea: `grammar`,
      },
    ],
    order: 5,
  },
  {
    id: `comparatives-superlatives`,
    title: `Comparatives & Superlatives`,
    level: `A2`,
    description: `Comparar personas, lugares y cosas usando adjetivos`,
    explanation: `Los comparativos se usan para comparar dos cosas. Los superlativos para destacar una cosa dentro de un grupo. La regla depende del número de sílabas del adjetivo.`,
    rules: [
      {
        title: `Comparativos - 1 sílaba`,
        content: `Adjetivo + -er + than. Ej: tall → taller than, fast → faster than. Si termina en vocal+consonante, se dobla la consonante: big → bigger than.`,
      },
      {
        title: `Comparativos - 2+ sílabas`,
        content: `More + adjetivo + than. Ej: more beautiful than, more expensive than. Excepción: 2 sílabas terminadas en -y cambian a -ier: happy → happier than.`,
      },
      {
        title: `Superlativos - 1 sílaba`,
        content: `The + adjetivo + -est. Ej: the tallest, the fastest. Con vocal+consonante se dobla: the biggest.`,
      },
      {
        title: `Superlativos - 2+ sílabas`,
        content: `The most + adjetivo. Ej: the most beautiful, the most expensive. Los terminados en -y: the happiest.`,
      },
    ],
    examples: [
      {
        correct: `San José is bigger than Limón.`,
        explanation: `Comparativo de 1 sílaba: big → bigger`,
      },
      {
        correct: `English is easier than Japanese.`,
        explanation: `Adjetivo terminado en -y: easy → easier`,
      },
      {
        correct: `Costa Rica is more beautiful than many countries.`,
        explanation: `2+ sílabas: more beautiful`,
      },
      {
        correct: `Manuel Antonio is the most beautiful beach in Costa Rica.`,
        explanation: `Superlativo: the most beautiful`,
      },
    ],
    exercises: [
      {
        id: `g18`,
        type: `multiple-choice`,
        prompt: `My brother is ___ than me.`,
        options: [`tall`, `taller`, `tallest`, `more tall`],
        correctAnswer: `taller`,
        explanation: `Comparativo 1 sílaba: tall → taller than`,
        skillArea: `grammar`,
      },
      {
        id: `g19`,
        type: `multiple-choice`,
        prompt: `This is ___ movie I have ever seen.`,
        options: [`good`, `better`, `the best`, `more good`],
        correctAnswer: `the best`,
        explanation: `Superlativo irregular: good → the best`,
        skillArea: `grammar`,
      },
      {
        id: `g20`,
        type: `multiple-choice`,
        prompt: `A car is ___ than a bicycle.`,
        options: [`fast`, `faster`, `fastest`, `more fast`],
        correctAnswer: `faster`,
        explanation: `Comparativo 1 sílaba: fast → faster`,
        skillArea: `grammar`,
      },
    ],
    order: 6,
  },
  {
    id: `conditionals`,
    title: `Conditionals (Zero, 1st, 2nd)`,
    level: `B1`,
    description: `Condicionales para expresar causas, efectos y situaciones hipotéticas`,
    explanation: `Los condicionales expresan que una acción depende de otra. El Zero Conditional es para hechos generales, el First Conditional para situaciones reales futuras, y el Second Conditional para situaciones irreales o improbables.`,
    rules: [
      {
        title: `Zero Conditional`,
        content: `If + presente simple, presente simple. Hechos generales/científicos. Ej: If you heat ice, it melts. If it rains, the ground gets wet.`,
      },
      {
        title: `First Conditional`,
        content: `If + presente simple, will + verbo base. Situaciones reales/posibles en futuro. Ej: If you study, you will pass the exam. If it rains, I will stay home.`,
      },
      {
        title: `Second Conditional`,
        content: `If + pasado simple, would + verbo base. Situaciones irreales/improbables en presente/futuro. Ej: If I won the lottery, I would travel the world. If I were you, I would study more.`,
      },
      {
        title: `Nota importante`,
        content: `En el Second Conditional, siempre usamos "were" en lugar de "was" con I/he/she/it: "If I were you..." (no "If I was you").`,
      },
    ],
    examples: [
      {
        correct: `If you heat water to 100°C, it boils.`,
        explanation: `Zero Conditional = hecho científico`,
      },
      {
        correct: `If you study hard, you will pass the MEP exam.`,
        explanation: `First Conditional = situación real futura`,
      },
      {
        correct: `If I won the lottery, I would buy a house in Guanacaste.`,
        explanation: `Second Conditional = situación improbable`,
      },
      {
        correct: `If I were you, I would practice listening every day.`,
        explanation: `Second Conditional con "were" para dar consejo`,
      },
    ],
    exercises: [
      {
        id: `g21`,
        type: `multiple-choice`,
        prompt: `If you ___ ice, it melts.`,
        options: [`will heat`, `heat`, `heated`, `would heat`],
        correctAnswer: `heat`,
        explanation: `Zero Conditional: if + presente simple`,
        skillArea: `grammar`,
      },
      {
        id: `g22`,
        type: `multiple-choice`,
        prompt: `If she studies, she ___ the exam.`,
        options: [`pass`, `will pass`, `passed`, `would pass`],
        correctAnswer: `will pass`,
        explanation: `First Conditional: if + presente, will + verbo`,
        skillArea: `grammar`,
      },
      {
        id: `g23`,
        type: `multiple-choice`,
        prompt: `If I ___ rich, I would travel around the world.`,
        options: [`am`, `will be`, `were`, `was`],
        correctAnswer: `were`,
        explanation: `Second Conditional: if + pasado simple (were)`,
        skillArea: `grammar`,
      },
    ],
    order: 7,
  },
  {
    id: `connectors`,
    title: `Connectors (Linkers)`,
    level: `B1`,
    description: `Conectores para unir ideas, contrastar y expresar causa y efecto`,
    explanation: `Los conectores (linkers) son palabras que conectan ideas y oraciones. Son esenciales para el examen MEP, especialmente en la sección de Reading, donde ayudan a entender la relación entre ideas.`,
    rules: [
      {
        title: `Contraste`,
        content: `However (sin embargo), Although/Even though (aunque), But (pero), On the other hand (por otro lado). Ej: "I studied a lot; however, the exam was difficult."`,
      },
      {
        title: `Adición`,
        content: `Furthermore (además), Moreover (además), In addition (adicionalmente), Besides (además de), Also (también). Ej: "She speaks English. Furthermore, she speaks French."`,
      },
      {
        title: `Causa y Efecto`,
        content: `Therefore (por lo tanto), Because of (debido a), Due to (debido a), So (así que), Consequently (en consecuencia). Ej: "He was sick; therefore, he didn't go to school."`,
      },
      {
        title: `Orden y Tiempo`,
        content: `First/Firstly (primero), Then (luego), Next (después), Finally (finalmente), Meanwhile (mientras tanto), After that (después de eso).`,
      },
    ],
    examples: [
      {
        correct: `The exam was difficult; however, I passed it.`,
        explanation: `However introduce un contraste`,
      },
      {
        correct: `She is very intelligent. Furthermore, she is hardworking.`,
        explanation: `Furthermore añade otra idea positiva`,
      },
      {
        correct: `He studied a lot for the test; therefore, he got a good grade.`,
        explanation: `Therefore muestra resultado/causa-efecto`,
      },
      {
        correct: `Although it was raining, we went to the beach.`,
        explanation: `Although introduce contraste al inicio`,
      },
    ],
    exercises: [
      {
        id: `g24`,
        type: `multiple-choice`,
        prompt: `She was tired; ___, she finished her homework.`,
        options: [`however`, `furthermore`, `because`, `so`],
        correctAnswer: `however`,
        explanation: `Contraste entre estar cansada y terminar la tarea → however`,
        skillArea: `grammar`,
      },
      {
        id: `g25`,
        type: `multiple-choice`,
        prompt: `He didn't study; ___, he failed the exam.`,
        options: [`however`, `furthermore`, `therefore`, `although`],
        correctAnswer: `therefore`,
        explanation: `Causa (no estudió) y efecto (falló) → therefore`,
        skillArea: `grammar`,
      },
      {
        id: `g26`,
        type: `multiple-choice`,
        prompt: `___ it was expensive, she bought the phone.`,
        options: [`Because`, `Although`, `So`, `Therefore`],
        correctAnswer: `Although`,
        explanation: `Contraste entre caro y comprarlo → although`,
        skillArea: `grammar`,
      },
    ],
    order: 8,
  },
];
export default grammarData;
