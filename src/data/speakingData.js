const speakingExercises = [
  {
    lessonId: "my-profile-speaking-1",
    unitId: "my-profile",
    questions: [
      {
        id: "sp-mp-1",
        type: "multiple-choice",
        prompt: "Someone asks you to introduce yourself. What do you say?",
        options: [
          "Hi, I am Carlos. I am from Costa Rica and I enjoy playing soccer.",
          "Hi, I am fine, thank you.",
          "Hello, I am here for the first time.",
          "Hi, my name is Carlos and I am 25 years young.",
        ],
        correctAnswer:
          "Hi, I am Carlos. I am from Costa Rica and I enjoy playing soccer.",
        explanation:
          "Al presentarte, dices tu nombre, de dónde eres y algo sobre ti, como tus pasatiempos.",
        skillArea: "speaking",
      },
      {
        id: "sp-mp-2",
        type: "multiple-choice",
        prompt: "A new classmate asks about your family. What do you say?",
        options: [
          "I have a big family. There are five people in my family.",
          "My family is very good, thank you.",
          "I live in a house with my family.",
          "Family is important for everyone.",
        ],
        correctAnswer:
          "I have a big family. There are five people in my family.",
        explanation:
          "Cuando te preguntan por tu familia, describes su tamaño o quiénes la componen.",
        skillArea: "speaking",
      },
      {
        id: "sp-mp-3",
        type: "multiple-choice",
        prompt: "A friend asks what you like to do in your free time. What do you say?",
        options: [
          "I like reading books and listening to music.",
          "I am free on weekends.",
          "I do not have free time.",
          "Free time is the best time.",
        ],
        correctAnswer: "I like reading books and listening to music.",
        explanation:
          'Para hablar de tus pasatiempos, usas "I like" seguido de las actividades que disfrutas.',
        skillArea: "speaking",
      },
    ],
  },
  {
    lessonId: "high-tech-shopping-speaking-1",
    unitId: "high-tech-shopping",
    questions: [
      {
        id: "sp-hts-1",
        type: "multiple-choice",
        prompt:
          "You are in an electronics store and want to know the price of a laptop. What do you say?",
        options: [
          "Excuse me, how much does this laptop cost?",
          "Excuse me, this laptop is very nice.",
          "I want to buy this laptop right now.",
          "Tell me about laptops, please.",
        ],
        correctAnswer: "Excuse me, how much does this laptop cost?",
        explanation:
          'Para preguntar el precio, usas "how much does this ... cost?" de forma educada.',
        skillArea: "speaking",
      },
      {
        id: "sp-hts-2",
        type: "multiple-choice",
        prompt:
          "You want to know if a smartphone comes with a warranty. What do you say?",
        options: [
          "Does this smartphone come with a warranty?",
          "How long does the battery last?",
          "Is this smartphone on sale?",
          "Can I pay with a credit card?",
        ],
        correctAnswer: "Does this smartphone come with a warranty?",
        explanation:
          'Para preguntar por la garantía, usas "Does this ... come with a warranty?"',
        skillArea: "speaking",
      },
      {
        id: "sp-hts-3",
        type: "multiple-choice",
        prompt:
          "The salesperson asks if you need help. You want to compare two headphones. What do you say?",
        options: [
          "Yes, can you tell me the difference between these two headphones?",
          "No, I am just looking, thank you.",
          "Yes, I need the cheapest one.",
          "Show me all the headphones you have.",
        ],
        correctAnswer:
          "Yes, can you tell me the difference between these two headphones?",
        explanation:
          'Para comparar productos, pides ayuda con "can you tell me the difference between...?"',
        skillArea: "speaking",
      },
    ],
  },
  {
    lessonId: "healthy-choices-speaking-1",
    unitId: "healthy-choices",
    questions: [
      {
        id: "sp-hc-1",
        type: "multiple-choice",
        prompt:
          "You are at the doctor and need to describe your symptoms. What do you say?",
        options: [
          "I have a headache and I feel dizzy.",
          "I do not feel good today.",
          "I think I am sick.",
          "My body hurts somewhere.",
        ],
        correctAnswer: "I have a headache and I feel dizzy.",
        explanation:
          'Para describir síntomas al doctor, usas "I have" seguido del síntoma específico.',
        skillArea: "speaking",
      },
      {
        id: "sp-hc-2",
        type: "multiple-choice",
        prompt:
          "Your friend looks tired and stressed. You want to give advice. What do you say?",
        options: [
          "You should take a break and get some rest.",
          "You are very tired, I know.",
          "Maybe you need to work less.",
          "Tired people should sleep more.",
        ],
        correctAnswer: "You should take a break and get some rest.",
        explanation:
          'Para dar consejos, usas "you should" seguido de la recomendación.',
        skillArea: "speaking",
      },
      {
        id: "sp-hc-3",
        type: "multiple-choice",
        prompt: "The doctor asks about your eating habits. How do you respond?",
        options: [
          "I usually eat vegetables and drink a lot of water.",
          "I eat three times a day.",
          "My favorite food is pasta.",
          "I do not like vegetables very much.",
        ],
        correctAnswer: "I usually eat vegetables and drink a lot of water.",
        explanation:
          "Para hablar de tus hábitos alimenticios, describes lo que comes y bebes regularmente.",
        skillArea: "speaking",
      },
    ],
  },
  {
    lessonId: "safe-travels-speaking-1",
    unitId: "safe-travels",
    questions: [
      {
        id: "sp-st-1",
        type: "multiple-choice",
        prompt: "You arrive at a hotel and want to check in. What do you say?",
        options: [
          "Hello, I have a reservation under the name Pérez.",
          "Hello, I want a room please.",
          "Hello, what is the price of a room?",
          "Hello, is this a good hotel?",
        ],
        correctAnswer: "Hello, I have a reservation under the name Pérez.",
        explanation:
          'Al llegar al hotel, dices que tienes una reservación con "I have a reservation under the name..."',
        skillArea: "speaking",
      },
      {
        id: "sp-st-2",
        type: "multiple-choice",
        prompt:
          "You are lost in a new city and need directions to the museum. What do you say?",
        options: [
          "Excuse me, can you tell me how to get to the museum?",
          "Excuse me, where is the museum located?",
          "I am looking for a museum around here.",
          "Tell me the way to the museum.",
        ],
        correctAnswer: "Excuse me, can you tell me how to get to the museum?",
        explanation:
          'Para pedir direcciones, usas "can you tell me how to get to..." de manera cortés.',
        skillArea: "speaking",
      },
      {
        id: "sp-st-3",
        type: "multiple-choice",
        prompt:
          "The hotel receptionist asks how many nights you plan to stay. What do you say?",
        options: [
          "I will stay for four nights, from Monday to Friday.",
          "I plan to stay many nights here.",
          "I do not know yet, maybe a few days.",
          "Four nights, if the room is available.",
        ],
        correctAnswer: "I will stay for four nights, from Monday to Friday.",
        explanation:
          'Para indicar la duración de tu estancia, usas "I will stay for ... nights, from ... to ..."',
        skillArea: "speaking",
      },
    ],
  },
  {
    lessonId: "cultural-variety-speaking-1",
    unitId: "cultural-variety",
    questions: [
      {
        id: "sp-cv-1",
        type: "multiple-choice",
        prompt:
          "A foreign friend asks about a traditional festival in your country. What do you say?",
        options: [
          "We celebrate the Day of the Dead with altars, food, and music.",
          "The Day of the Dead is a very famous festival.",
          "I like the Day of the Dead because it is colorful.",
          "There are many festivals in my country.",
        ],
        correctAnswer:
          "We celebrate the Day of the Dead with altars, food, and music.",
        explanation:
          'Para describir una celebración, dices "we celebrate ... with" seguido de las actividades y tradiciones.',
        skillArea: "speaking",
      },
      {
        id: "sp-cv-2",
        type: "multiple-choice",
        prompt:
          "Someone asks what people wear during a local festival. What do you say?",
        options: [
          "People wear traditional costumes with colorful masks and hats.",
          "People dress very nicely for the festival.",
          "The costumes are very beautiful and colorful.",
          "Everyone wears special clothes that day.",
        ],
        correctAnswer:
          "People wear traditional costumes with colorful masks and hats.",
        explanation:
          'Para describir la vestimenta tradicional, usas "people wear ..." con detalles específicos.',
        skillArea: "speaking",
      },
      {
        id: "sp-cv-3",
        type: "multiple-choice",
        prompt:
          "A friend wants to know why a certain celebration is important. What do you say?",
        options: [
          "It is important because it brings families together and honors our traditions.",
          "It is important because it is very old.",
          "Many people celebrate it every year.",
          "It is a special date on the calendar.",
        ],
        correctAnswer:
          "It is important because it brings families together and honors our traditions.",
        explanation:
          'Para explicar la importancia de una celebración, usas "It is important because..." seguido de las razones.',
        skillArea: "speaking",
      },
    ],
  },
  {
    lessonId: "careers-speaking-1",
    unitId: "careers",
    questions: [
      {
        id: "sp-cr-1",
        type: "multiple-choice",
        prompt:
          "In a job interview, the interviewer asks about your skills. What do you say?",
        options: [
          "I am good at working in a team and I speak English fluently.",
          "I am a very hardworking person.",
          "I have many skills that are useful.",
          "I can learn anything quickly.",
        ],
        correctAnswer:
          "I am good at working in a team and I speak English fluently.",
        explanation:
          'Para describir tus habilidades en una entrevista, usas "I am good at..." y mencionas habilidades específicas.',
        skillArea: "speaking",
      },
      {
        id: "sp-cr-2",
        type: "multiple-choice",
        prompt: "The interviewer asks about your career goals. What do you say?",
        options: [
          "I want to grow as a professional and contribute to the success of the company.",
          "I want to make a lot of money in this job.",
          "My goal is to get a promotion soon.",
          "I hope to have a successful career one day.",
        ],
        correctAnswer:
          "I want to grow as a professional and contribute to the success of the company.",
        explanation:
          'Para hablar de metas profesionales, usas "I want to..." con objetivos claros y relacionados al puesto.',
        skillArea: "speaking",
      },
      {
        id: "sp-cr-3",
        type: "multiple-choice",
        prompt:
          "The interviewer asks about your previous work experience. What do you say?",
        options: [
          "I worked as a sales assistant for two years at a retail store.",
          "I have previous experience in different jobs.",
          "I worked before and I learned a lot.",
          "My last job was very interesting and fun.",
        ],
        correctAnswer:
          "I worked as a sales assistant for two years at a retail store.",
        explanation:
          'Para describir experiencia laboral previa, usas "I worked as ... for ... at ..." con detalles específicos.',
        skillArea: "speaking",
      },
    ],
  },
];

export function getSpeakingExercise(lessonId) {
  return speakingExercises.find((ex) => ex.lessonId === lessonId);
}

export default speakingExercises;
