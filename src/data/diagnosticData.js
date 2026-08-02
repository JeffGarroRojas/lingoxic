export const CEFR_LEVELS = ["A1", "A2", "B1", "B2"];

export const SKILLS = ["grammar", "vocabulary", "reading", "listening", "writing", "speaking"];

export const DIAGNOSTIC_QUESTIONS = {
  grammar: [
    { level: "A1", prompt: `She ___ a teacher.`, options: [`am`, `is`, `are`, `be`], correctAnswer: `is`, skillArea: `grammar` },
    { level: "A1", prompt: `I ___ two brothers.`, options: [`has`, `have`, `having`, `am`], correctAnswer: `have`, skillArea: `grammar` },
    { level: "A2", prompt: `Look! It ___ raining.`, options: [`is`, `was`, `will`, `does`], correctAnswer: `is`, skillArea: `grammar` },
    { level: "A2", prompt: `We ___ to the cinema last night.`, options: [`go`, `went`, `gone`, `going`], correctAnswer: `went`, skillArea: `grammar` },
    { level: "B1", prompt: `If I ___ rich, I would travel the world.`, options: [`am`, `was`, `were`, `will be`], correctAnswer: `were`, skillArea: `grammar` },
    { level: "B1", prompt: `She has lived here ___ 2010.`, options: [`for`, `since`, `during`, `while`], correctAnswer: `since`, skillArea: `grammar` },
    { level: "B2", prompt: `The report ___ by the time we arrived.`, options: [`finished`, `had been finished`, `has finished`, `was finishing`], correctAnswer: `had been finished`, skillArea: `grammar` },
    { level: "B2", prompt: `I wish I ___ more time to study.`, options: [`have`, `had`, `would have`, `will have`], correctAnswer: `had`, skillArea: `grammar` },
  ],
  vocabulary: [
    { level: "A1", prompt: `Which word means "padre" in English?`, options: [`mother`, `father`, `brother`, `sister`], correctAnswer: `father`, skillArea: `vocabulary` },
    { level: "A1", prompt: `The opposite of "hot" is ___.`, options: [`warm`, `cold`, `cool`, `freezing`], correctAnswer: `cold`, skillArea: `vocabulary` },
    { level: "A2", prompt: `A place where you can borrow books is a ___.`, options: [`market`, `library`, `museum`, `station`], correctAnswer: `library`, skillArea: `vocabulary` },
    { level: "A2", prompt: `If you are "tired", you ___.`, options: [`need rest`, `feel happy`, `are angry`, `are hungry`], correctAnswer: `need rest`, skillArea: `vocabulary` },
    { level: "B1", prompt: `"To quit" means to ___.`, options: [`continue`, `stop`, `start`, `finish quickly`], correctAnswer: `stop`, skillArea: `vocabulary` },
    { level: "B1", prompt: `Which word means "avergonzado"?`, options: [`proud`, `embarrassed`, `excited`, `nervous`], correctAnswer: `embarrassed`, skillArea: `vocabulary` },
    { level: "B2", prompt: `"To mitigate" means to ___.`, options: [`increase`, `reduce the severity of`, `ignore`, `celebrate`], correctAnswer: `reduce the severity of`, skillArea: `vocabulary` },
    { level: "B2", prompt: `Which is a synonym of "significant"?`, options: [`tiny`, `important`, `unclear`, `rare`], correctAnswer: `important`, skillArea: `vocabulary` },
  ],
  reading: [
    { level: "A1", prompt: `Read: "Maria is from Costa Rica. She is a student." Where is Maria from?`, options: [`Mexico`, `Costa Rica`, `Spain`, `Brazil`], correctAnswer: `Costa Rica`, skillArea: `reading` },
    { level: "A2", prompt: `Read: "The bus leaves at seven in the morning. Ana gets up at six." When does Ana get up?`, options: [`At seven`, `At six`, `At eight`, `At nine`], correctAnswer: `At six`, skillArea: `reading` },
    { level: "B1", prompt: `Read: "Despite the heavy rain, the event continued as planned." What does this mean?`, options: [`The event was cancelled`, `The rain stopped`, `The event happened anyway`, `The event was moved inside`], correctAnswer: `The event happened anyway`, skillArea: `reading` },
    { level: "B2", prompt: `Read: "The findings suggest that while the treatment is effective in the short term, its long-term benefits remain uncertain." The author's tone is ___.`, options: [`confident`, `cautious`, `dismissive`, `excited`], correctAnswer: `cautious`, skillArea: `reading` },
  ],
  listening: [
    { level: "A1", prompt: `You hear: "Hi, I'm Tom. I like pizza and soccer." What does Tom like?`, options: [`Basketball`, `Pizza and soccer`, `Pasta`, `Movies`], correctAnswer: `Pizza and soccer`, skillArea: `listening` },
    { level: "A2", prompt: `You hear: "Sorry, I can't come to the party. I have to work tomorrow." Why can't he come?`, options: [`He is sick`, `He has to work`, `He is busy cooking`, `He forgot`], correctAnswer: `He has to work`, skillArea: `listening` },
    { level: "B1", prompt: `You hear: "The flight was delayed by two hours, so we missed our connection in Madrid." What happened?`, options: [`They arrived early`, `They missed a connecting flight`, `They flew to Madrid`, `The flight was cancelled`], correctAnswer: `They missed a connecting flight`, skillArea: `listening` },
    { level: "B2", prompt: `You hear: "While the proposal has merit, the committee is hesitant to allocate additional funds given the current budget constraints." What is the committee's attitude?`, options: [`Fully supportive`, `Reluctant`, `Indifferent`, `Enthusiastic`], correctAnswer: `Reluctant`, skillArea: `listening` },
  ],
  writing: [
    { level: "A1", prompt: `Choose the correct sentence:`, options: [`I like pizza very much.`, `I very much like pizza.`, `I liking pizza a lot.`, `Me like pizza.`], correctAnswer: `I like pizza very much.`, skillArea: `writing` },
    { level: "A2", prompt: `Choose the best sentence to describe your weekend:`, options: [`I went to the beach and played volleyball with my friends.`, `I go beach and play volleyball.`, `Weekend I beach.`, `I am going beach last weekend.`], correctAnswer: `I went to the beach and played volleyball with my friends.`, skillArea: `writing` },
    { level: "B1", prompt: `Choose the best opening for a formal email:`, options: [`Dear Sir or Madam, I am writing to inquire about...`, `Hey man, what's up...`, `Hi, I want a job...`, `Yo, gimme info...`], correctAnswer: `Dear Sir or Madam, I am writing to inquire about...`, skillArea: `writing` },
    { level: "B2", prompt: `Choose the most natural and accurate sentence:`, options: [`Despite the challenges, the team managed to deliver the project on time.`, `The team despite challenges managed deliver project on time.`, `Despite challenges, team delivering project on time.`, `Challenges despite, project delivered on time by team.`], correctAnswer: `Despite the challenges, the team managed to deliver the project on time.`, skillArea: `writing` },
  ],
  speaking: [
    { level: "A1", prompt: `You want to introduce yourself. Choose the best response:`, options: [`Hello, my name is Ana. I am from San José.`, `Me Ana.`, `Hello, I from San José Ana.`, `Ana name is.`], correctAnswer: `Hello, my name is Ana. I am from San José.`, skillArea: `speaking` },
    { level: "A2", prompt: `Someone asks: "What did you do last weekend?" Choose the best answer:`, options: [`I visited my grandparents and we cooked together.`, `I visit grandparents.`, `Last weekend I visiting my grandparents.`, `Yes, I did.`], correctAnswer: `I visited my grandparents and we cooked together.`, skillArea: `speaking` },
    { level: "B1", prompt: `Someone asks: "Could you tell me about a book you've enjoyed?" Choose the best answer:`, options: [`I recently read a mystery novel. It was gripping because the plot had unexpected twists.`, `I like books.`, `Books are good.`, `I read a book once.`], correctAnswer: `I recently read a mystery novel. It was gripping because the plot had unexpected twists.`, skillArea: `speaking` },
    { level: "B2", prompt: `You must disagree politely in a meeting. Choose the best response:`, options: [`While I understand your point, I believe there are other factors we should consider.`, `You're wrong.`, `No, that's bad.`, `I don't agree with anything.`], correctAnswer: `While I understand your point, I believe there are other factors we should consider.`, skillArea: `speaking` },
  ],
};

export function levelRank(level) {
  return CEFR_LEVELS.indexOf(level);
}

export function scoreToLevel(correct, total) {
  if (total === 0) return "A1";
  const pct = correct / total;
  if (pct >= 0.8) return "B2";
  if (pct >= 0.6) return "B1";
  if (pct >= 0.4) return "A2";
  return "A1";
}
