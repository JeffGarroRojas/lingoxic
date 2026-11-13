const listeningExercises = [
  {
    lessonId: "high-tech-shopping-listening-1",
    audioUrl: "/audio/listening/high-tech-shopping-listening-1.mp3",
    unitId: "high-tech-shopping",

    script: "Good afternoon, sir. How can I help you? - Hello. I bought this laptop yesterday, but it does not turn on. - I see. Do you have the receipt with you? - Yes, here it is. - Thank you. We can either repair it or give you a replacement. Which would you prefer? - A replacement, please. - Very good. We will have it ready tomorrow.",    questions: [
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
    audioUrl: "/audio/listening/healthy-choices-listening-1.mp3",
    unitId: "healthy-choices",

    script: "Hello, doctor. I have a headache and my throat hurts. - How long have you felt sick? - Since Monday, about three days. - Let me check your temperature. Yes, you have a slight fever. I recommend you rest and drink plenty of water. - Should I take medicine? - Yes, take this syrup twice a day. Please come back to the clinic next week if you do not feel better.",    questions: [
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
    audioUrl: "/audio/listening/safe-travels-listening-1.mp3",
    unitId: "safe-travels",

    script: "Welcome to the Sunset Hotel. How can I help you? - I would like a room for two nights, please. - Single or double room? - A double room, please. - That is sixty dollars per night. - And does the breakfast include coffee? - Yes, breakfast includes coffee, juice, eggs and toast, from seven to ten in the morning.",    questions: [
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
,
 {
  lessonId: "my-profile-listening-1",
    audioUrl: "/audio/listening/my-profile-listening-1.mp3",
  unitId: "my-profile",
  script: "Hi, my name is Sofia. I am 16 years old and I live in Heredia, Costa Rica. I have one brother and one sister. My brother is 14 and my sister is 18. I like music and I play the guitar every day. My father is a teacher and my mother is a nurse. On weekends, we visit my grandparents in Alajuela. I want to be an English teacher in the future.",
  questions: [
   { id: "l-myp-1", type: "multiple-choice", prompt: "How old is Sofia?", options: ["14 years old", "16 years old", "18 years old", "20 years old"], correctAnswer: "16 years old", explanation: 'Sofia dice: "I am 16 years old"', skillArea: "listening" },
   { id: "l-myp-2", type: "multiple-choice", prompt: "What instrument does Sofia play?", options: ["The piano", "The drums", "The guitar", "The violin"], correctAnswer: "The guitar", explanation: 'Sofia dice: "I play the guitar every day"', skillArea: "listening" },
   { id: "l-myp-3", type: "multiple-choice", prompt: "What does Sofia want to be in the future?", options: ["A nurse", "A teacher", "A musician", "A doctor"], correctAnswer: "A teacher", explanation: 'Sofia dice: "I want to be an English teacher in the future"', skillArea: "listening" },
   { id: "l-myp-4", type: "multiple-choice", prompt: "Where do they visit on weekends?", options: ["Their cousins in Cartago", "Their grandparents in Alajuela", "Their friends in San Jose", "The beach in Limon"], correctAnswer: "Their grandparents in Alajuela", explanation: 'Sofia dice: "On weekends, we visit my grandparents in Alajuela"', skillArea: "listening" }
  ]
 },
 {
  lessonId: "my-profile-listening-2",
    audioUrl: "/audio/listening/my-profile-listening-2.mp3",
  unitId: "my-profile",
  script: "My daily routine starts at six o clock in the morning. I get up, brush my teeth, and take a shower. Then I have breakfast with my family at six thirty. I usually eat gallo pinto and drink coffee. I go to school by bus at seven o clock. Classes finish at three in the afternoon. After school, I do my homework and play soccer with my friends. I have dinner at seven and I go to bed at ten o clock.",
  questions: [
   { id: "l-myp2-1", type: "multiple-choice", prompt: "What time does the speaker get up?", options: ["At 5 o clock", "At 6 o clock", "At 6:30", "At 7 o clock"], correctAnswer: "At 6 o clock", explanation: '"My daily routine starts at six o clock"', skillArea: "listening" },
   { id: "l-myp2-2", type: "multiple-choice", prompt: "How does he go to school?", options: ["By car", "By bike", "By bus", "Walking"], correctAnswer: "By bus", explanation: '"I go to school by bus at seven o clock"', skillArea: "listening" },
   { id: "l-myp2-3", type: "multiple-choice", prompt: "What does he do after school?", options: ["He watches TV", "He does homework and plays soccer", "He works", "He cooks dinner"], correctAnswer: "He does homework and plays soccer", explanation: '"After school, I do my homework and play soccer"', skillArea: "listening" }
  ]
 },
 {
  lessonId: "cultural-variety-listening-1",
    audioUrl: "/audio/listening/cultural-variety-listening-1.mp3",
  unitId: "cultural-variety",
  script: "Welcome to the International Culture Festival in San Jose! Today we celebrate diversity. You can see traditional dances from Guanacaste, listen to calypso music from Limon, and try food from different regions. The Boruca mask exhibition is very popular. Many tourists come every year to learn about Costa Rican traditions. The festival lasts three days and it is free for everyone. Do not miss the parade tomorrow at ten in the morning!",
  questions: [
   { id: "l-cul-1", type: "multiple-choice", prompt: "Where is the festival?", options: ["In Limon", "In Guanacaste", "In San Jose", "In Alajuela"], correctAnswer: "In San Jose", explanation: '"Welcome to the International Culture Festival in San Jose!"', skillArea: "listening" },
   { id: "l-cul-2", type: "multiple-choice", prompt: "What music can you listen to from Limon?", options: ["Salsa", "Calypso", "Marimba", "Reggaeton"], correctAnswer: "Calypso", explanation: '"listen to calypso music from Limon"', skillArea: "listening" },
   { id: "l-cul-3", type: "multiple-choice", prompt: "How long does the festival last?", options: ["One day", "Two days", "Three days", "One week"], correctAnswer: "Three days", explanation: '"The festival lasts three days"', skillArea: "listening" },
   { id: "l-cul-4", type: "multiple-choice", prompt: "When is the parade?", options: ["Today at ten", "Tomorrow at ten in the morning", "Next week", "Tonight"], correctAnswer: "Tomorrow at ten in the morning", explanation: '"Do not miss the parade tomorrow at ten in the morning!"', skillArea: "listening" }
  ]
 },
 {
  lessonId: "cultural-variety-listening-2",
    audioUrl: "/audio/listening/cultural-variety-listening-2.mp3",
  unitId: "cultural-variety",
  script: "If you visit Costa Rica, you must try gallo pinto. It is rice and beans mixed together, usually served for breakfast with eggs, cheese, and plantains. The casado is another typical dish. It has rice, beans, salad, picadillo, and meat or fish. People often drink natural juices like cas or mango. For dessert, try tres leches cake or arroz con leche. Costa Rican food is not very spicy, but it is delicious!",
  questions: [
   { id: "l-cul2-1", type: "multiple-choice", prompt: "What is gallo pinto?", options: ["Rice and beans mixed together", "Only rice", "A dessert", "A drink"], correctAnswer: "Rice and beans mixed together", explanation: '"It is rice and beans mixed together"', skillArea: "listening" },
   { id: "l-cul2-2", type: "multiple-choice", prompt: "When is gallo pinto usually served?", options: ["For lunch", "For dinner", "For breakfast", "As a snack"], correctAnswer: "For breakfast", explanation: '"usually served for breakfast"', skillArea: "listening" },
   { id: "l-cul2-3", type: "multiple-choice", prompt: "What is NOT mentioned as part of casado?", options: ["Rice", "Beans", "Salad", "Pizza"], correctAnswer: "Pizza", explanation: "El casado tiene rice, beans, salad, picadillo, meat or fish — no pizza", skillArea: "listening" }
  ]
 },
 {
  lessonId: "careers-listening-1",
    audioUrl: "/audio/listening/careers-listening-1.mp3",
  unitId: "careers",
  script: "Interviewer: Good morning, thank you for coming. Can you tell me about yourself? Candidate: Good morning. I am Carlos, I studied business administration and I worked for two years in a call center. Interviewer: Why do you want to work here? Candidate: I want to improve my English and I like working with international customers. Interviewer: What are your strengths? Candidate: I am responsible, punctual, and I learn fast. Interviewer: When can you start? Candidate: I can start next Monday.",
  questions: [
   { id: "l-car-1", type: "multiple-choice", prompt: "What did Carlos study?", options: ["English", "Business administration", "Tourism", "Engineering"], correctAnswer: "Business administration", explanation: '"I studied business administration"', skillArea: "listening" },
   { id: "l-car-2", type: "multiple-choice", prompt: "Where did Carlos work before?", options: ["In a hotel", "In a call center", "In a school", "In a hospital"], correctAnswer: "In a call center", explanation: '"I worked for two years in a call center"', skillArea: "listening" },
   { id: "l-car-3", type: "multiple-choice", prompt: "What is one of Carlos's strengths?", options: ["He is funny", "He is responsible and punctual", "He speaks French", "He is very tall"], correctAnswer: "He is responsible and punctual", explanation: '"I am responsible, punctual, and I learn fast"', skillArea: "listening" },
   { id: "l-car-4", type: "multiple-choice", prompt: "When can Carlos start?", options: ["Tomorrow", "Next Monday", "Next month", "Next year"], correctAnswer: "Next Monday", explanation: '"I can start next Monday"', skillArea: "listening" }
  ]
 },
 {
  lessonId: "careers-listening-2",
    audioUrl: "/audio/listening/careers-listening-2.mp3",
  unitId: "careers",
  script: "My name is Ana and I work as a receptionist in a hotel in Tamarindo. I start work at eight in the morning. I answer the phone, help tourists, and make reservations. At twelve, I have lunch with my colleagues. In the afternoon, I organize tours to the beach and the national park. I finish work at five o clock. I like my job because I meet people from all over the world and I practice English every day.",
  questions: [
   { id: "l-car2-1", type: "multiple-choice", prompt: "Where does Ana work?", options: ["In a school", "In a hotel in Tamarindo", "In a hospital", "In a restaurant"], correctAnswer: "In a hotel in Tamarindo", explanation: '"I work as a receptionist in a hotel in Tamarindo"', skillArea: "listening" },
   { id: "l-car2-2", type: "multiple-choice", prompt: "What time does she start work?", options: ["At 7", "At 8", "At 9", "At 12"], correctAnswer: "At 8", explanation: '"I start work at eight in the morning"', skillArea: "listening" },
   { id: "l-car2-3", type: "multiple-choice", prompt: "Why does she like her job?", options: ["Because it is easy", "Because she meets people and practices English", "Because she earns a lot", "Because she works at night"], correctAnswer: "Because she meets people and practices English", explanation: '"I meet people from all over the world and I practice English"', skillArea: "listening" }
  ]
 },
 {
  lessonId: "global-competence-listening-1",
    audioUrl: "/audio/listening/global-competence-listening-1.mp3",
  unitId: "global-competence",
  script: "At the airport, the agent asks: May I see your passport and ticket, please? Passenger: Yes, here they are. Agent: Thank you. Do you have any luggage to check in? Passenger: Yes, one suitcase. Agent: Please put it on the scale. Your flight to New York leaves at gate twelve at three thirty. Do you have any carry-on bags? Passenger: Yes, this backpack. Agent: That's fine. Please go to security now. Have a good flight!",
  questions: [
   { id: "l-glo-1", type: "multiple-choice", prompt: "What does the agent ask to see first?", options: ["The visa", "The passport and ticket", "The vaccination card", "The hotel reservation"], correctAnswer: "The passport and ticket", explanation: '"May I see your passport and ticket, please?"', skillArea: "listening" },
   { id: "l-glo-2", type: "multiple-choice", prompt: "How many suitcases does the passenger check in?", options: ["None", "One suitcase", "Two suitcases", "Three bags"], correctAnswer: "One suitcase", explanation: '"Yes, one suitcase"', skillArea: "listening" },
   { id: "l-glo-3", type: "multiple-choice", prompt: "What gate is the flight to New York?", options: ["Gate 10", "Gate 11", "Gate 12", "Gate 30"], correctAnswer: "Gate 12", explanation: '"Your flight to New York leaves at gate twelve"', skillArea: "listening" }
  ]
 },
 {
  lessonId: "global-competence-listening-2",
    audioUrl: "/audio/listening/global-competence-listening-2.mp3",
  unitId: "global-competence",
  script: "Tourist: Excuse me, how can I get to the National Museum? Local: Go straight for two blocks, then turn left on Central Avenue. The museum is next to the National Theatre, on your right. Tourist: Is it far from here? Local: No, it is about five minutes walking. Tourist: Thank you very much! Local: You are welcome. Enjoy your visit!",
  questions: [
   { id: "l-glo2-1", type: "multiple-choice", prompt: "Where does the tourist want to go?", options: ["To the National Museum", "To the beach", "To the airport", "To the hotel"], correctAnswer: "To the National Museum", explanation: '"how can I get to the National Museum?"', skillArea: "listening" },
   { id: "l-glo2-2", type: "multiple-choice", prompt: "What should the tourist do on Central Avenue?", options: ["Turn right", "Turn left", "Go straight", "Go back"], correctAnswer: "Turn left", explanation: '"then turn left on Central Avenue"', skillArea: "listening" },
   { id: "l-glo2-3", type: "multiple-choice", prompt: "How far is the museum?", options: ["About five minutes walking", "About one hour by bus", "About 30 minutes", "Very far"], correctAnswer: "About five minutes walking", explanation: '"it is about five minutes walking"', skillArea: "listening" }
  ]
 },
];

export function getListeningExercise(lessonId) {
  return listeningExercises.find((ex) => ex.lessonId === lessonId);
}

export default listeningExercises;
