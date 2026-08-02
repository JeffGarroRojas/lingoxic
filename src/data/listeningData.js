const listeningExercises = [
  {
    lessonId: "high-tech-shopping-listening-1",
    unitId: "high-tech-shopping",
    questions: [
      {
        id: "l-hts-1",
        type: "multiple-choice",
        prompt: "What is the customer's problem with the laptop?",
        options: [
          "It is too expensive.",
          "It does not turn on.",
          "It is the wrong color.",
          "It is too slow.",
        ],
        correctAnswer: "It does not turn on.",
        explanation:
          'El cliente dice: "I bought this laptop yesterday, but it does not turn on."',
        skillArea: "listening",
      },
      {
        id: "l-hts-2",
        type: "multiple-choice",
        prompt: "What does the clerk ask the customer for?",
        options: [
          "The laptop box",
          "The receipt",
          "The password",
          "The warranty card",
        ],
        correctAnswer: "The receipt",
        explanation: 'El vendedor pregunta: "Do you have the receipt?"',
        skillArea: "listening",
      },
      {
        id: "l-hts-3",
        type: "multiple-choice",
        prompt: "What two solutions does the clerk offer?",
        options: [
          "A discount or a free accessory",
          "An exchange or a refund",
          "A repair or a replacement",
          "A store credit or a coupon",
        ],
        correctAnswer: "An exchange or a refund",
        explanation:
          'El vendedor dice: "We can exchange it for a new one or give you a refund."',
        skillArea: "listening",
      },
      {
        id: "l-hts-4",
        type: "multiple-choice",
        prompt: "How much does the smartphone charger cost?",
        options: [
          "10,000 colones",
          "12,000 colones",
          "15,000 colones",
          "20,000 colones",
        ],
        correctAnswer: "15,000 colones",
        explanation:
          'El vendedor dice: "Here is the compatible charger. It costs 15,000 colones."',
        skillArea: "listening",
      },
    ],
  },
  {
    lessonId: "healthy-choices-listening-1",
    unitId: "healthy-choices",
    questions: [
      {
        id: "l-hc-1",
        type: "multiple-choice",
        prompt: "What symptoms does the patient have?",
        options: [
          "A headache and a stomachache",
          "A sore throat and a fever",
          "A cough and a runny nose",
          "Back pain and dizziness",
        ],
        correctAnswer: "A sore throat and a fever",
        explanation: 'El paciente dice: "I have a sore throat and a fever."',
        skillArea: "listening",
      },
      {
        id: "l-hc-2",
        type: "multiple-choice",
        prompt: "How long has the patient felt sick?",
        options: ["One day", "Two days", "Three days", "One week"],
        correctAnswer: "Two days",
        explanation: 'El paciente responde: "For two days."',
        skillArea: "listening",
      },
      {
        id: "l-hc-3",
        type: "multiple-choice",
        prompt: "What does the doctor recommend?",
        options: [
          "Take antibiotics and rest",
          "Drink warm tea and take ibuprofen",
          "Drink lots of water and rest",
          "Get a flu shot and exercise",
        ],
        correctAnswer: "Drink lots of water and rest",
        explanation:
          'El doctor recomienda: "Drink lots of water and rest for a few days."',
        skillArea: "listening",
      },
      {
        id: "l-hc-4",
        type: "multiple-choice",
        prompt: "When should the patient come back to the clinic?",
        options: [
          "If the fever goes away",
          "If the symptoms get worse",
          "Next week for a check-up",
          "In one month",
        ],
        correctAnswer: "If the symptoms get worse",
        explanation: 'El doctor dice: "Come back if the symptoms get worse."',
        skillArea: "listening",
      },
    ],
  },
  {
    lessonId: "safe-travels-listening-1",
    unitId: "safe-travels",
    questions: [
      {
        id: "l-st-1",
        type: "multiple-choice",
        prompt: "What type of room does the customer want?",
        options: [
          "A single room",
          "A double room",
          "A suite",
          "A family room",
        ],
        correctAnswer: "A double room",
        explanation: 'El cliente dice: "I would like a double room, please."',
        skillArea: "listening",
      },
      {
        id: "l-st-2",
        type: "multiple-choice",
        prompt: "How many nights will the customer stay?",
        options: ["Two nights", "Three nights", "Four nights", "Five nights"],
        correctAnswer: "Three nights",
        explanation:
          'El cliente dice: "Three nights, from July 10th to July 13th."',
        skillArea: "listening",
      },
      {
        id: "l-st-3",
        type: "multiple-choice",
        prompt: "How much is the room per night?",
        options: ["$60", "$70", "$80", "$90"],
        correctAnswer: "$80",
        explanation: 'El recepcionista dice: "The room is $80 per night."',
        skillArea: "listening",
      },
      {
        id: "l-st-4",
        type: "multiple-choice",
        prompt: "What does the breakfast include?",
        options: [
          "Coffee, juice, and toast",
          "Cereal, fruit, and eggs",
          "Pancakes, bacon, and coffee",
          "Fruit, toast, and eggs",
        ],
        correctAnswer: "Fruit, toast, and eggs",
        explanation:
          'El recepcionista dice: "Breakfast includes fruit, toast, and eggs."',
        skillArea: "listening",
      },
    ],
  },
];

export function getListeningExercise(lessonId) {
  return listeningExercises.find((ex) => ex.lessonId === lessonId);
}

export default listeningExercises;
