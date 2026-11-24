import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import grammarData from "../data/grammarData.js";
import listeningExercises from "../data/listeningData.js";
import speakingExercises from "../data/speakingData.js";
import unitsData from "../data/unitsData.js";
import {
  GRAMMAR_QUESTIONS,
  VOCABULARY_QUESTIONS,
  READING_QUESTIONS,
} from "../data/practiceData.js";
import { Card, Button } from "../components/ui.jsx";
import { saveExamResult } from "../services/db.js";
import { useActivityGuard } from "../hooks/useActivityGuard.jsx";

const EXAM_SECONDS = 3600; // 60 minutos — pedido del usuario
const EXAM_LENGTH = 100;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExam() {
  const pools = {
    vocabulary: [],
    grammar: [],
    reading: [],
    listening: [],
    writing: [],
    speaking: [],
  };
  const add = (skill, q) => {
    const pool = pools[skill] || pools.reading;
    pool.push(q);
  };

  unitsData.forEach((unit) => {
    (unit.quizzes || []).forEach((quiz) => {
      (quiz.questions || []).forEach((q) =>
        add(q.skillArea, { ...q, id: `unit-${unit.id}-${q.id}` })
      );
    });
  });

  grammarData.forEach((topic) => {
    (topic.exercises || []).forEach((q) =>
      pools.grammar.push({ ...q, id: `gram-${q.id}` })
    );
  });

  listeningExercises.forEach((exercise) => {
    (exercise.questions || []).forEach((q) =>
      pools.listening.push({
        ...q,
        id: `listen-${exercise.lessonId}-${q.id}`,
        audioUrl: exercise.audioUrl,
        script: exercise.script,
      })
    );
  });

  speakingExercises.forEach((exercise) => {
    (exercise.questions || []).forEach((q) =>
      pools.speaking.push({ ...q, id: `speak-${exercise.lessonId}-${q.id}` })
    );
  });

  [
    ...GRAMMAR_QUESTIONS,
    ...VOCABULARY_QUESTIONS,
    ...READING_QUESTIONS,
  ].forEach((q) => add(q.skillArea, { ...q, id: `practice-${q.id}` }));

  // Distribución objetivo: 20 vocab + 30 gramática + 20 lectura + 15 escucha
  // + 10 habla + 5 escritura = 100. Si un pool no alcanza, se rellena con el resto.
  const want = {
    vocabulary: 20,
    grammar: 30,
    reading: 20,
    listening: 15,
    speaking: 10,
    writing: 5,
  };
  const exam = [];
  Object.entries(want).forEach(([skill, n]) => {
    exam.push(...shuffle(pools[skill]).slice(0, n));
  });
  if (exam.length < EXAM_LENGTH) {
    const used = new Set(exam.map((q) => q.id));
    const rest = shuffle(
      Object.values(pools)
        .flat()
        .filter((q) => !used.has(q.id))
    );
    exam.push(...rest.slice(0, EXAM_LENGTH - exam.length));
  }
  return shuffle(exam).slice(0, EXAM_LENGTH);
}

export default function ExamSim() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(() => buildExam());
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  useActivityGuard(started && !finished);

  const finishExam = useCallback(async () => {
    if (finished) return;
    const total = questions.length;
    const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const payload = { date: new Date().toISOString(), total, correct, score, answers };
    try { await saveExamResult(payload); } catch {}
    setResult(payload);
    setFinished(true);
    setStarted(false);
  }, [answers, questions, finished]);

  useEffect(() => {
    if (!started || finished) return;
    if (secondsLeft <= 0) { finishExam(); return; }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [started, finished, secondsLeft, finishExam]);

  const selectAnswer = (qId, opt) => {
    if (finished) return;
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const startExam = () => {
    setQuestions(buildExam());
    setAnswers({});
    setSecondsLeft(EXAM_SECONDS);
    setFinished(false);
    setResult(null);
    setStarted(true);
  };

  if (!started && !finished) {
    return (
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Simulacro de examen</h1>
        <Card className="p-6 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {questions.length} preguntas (vocabulario, gramatica, listening, lectura y mas) · 60 minutos · Se guarda el resultado.
          </p>
          <Button onClick={startExam} className="w-full">Comenzar (60 min)</Button>
        </Card>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Resultado</h1>
        <Card className="p-6 text-center space-y-3">
          <p className="text-3xl font-bold">{result.correct}/{result.total} — {result.score}%</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startExam}>Repetir</Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Examen en curso</h1>
        <span className="font-mono text-sm bg-gray-900 text-white px-3 py-1 rounded">
          {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}
        </span>
      </div>
      <p className="text-xs text-gray-500">{questions.length} preguntas · 60 min</p>
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <Card key={q.id} className="p-3">
            <p className="text-sm font-medium mb-2">{idx + 1}. {q.text || q.question || q.prompt}</p>
            {q.audioUrl && (
              <audio controls preload="none" src={q.audioUrl} className="w-full mb-2 h-9" />
            )}
            {q.script && !q.audioUrl && <p className="text-xs text-gray-500 mb-2 italic">{q.script.slice(0, 120)}...</p>}
            <div className="space-y-1">
              {(q.options || []).map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`w-full text-left px-3 py-2 rounded border text-sm ${answers[q.id] === opt ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Button
        onClick={() => {
          const missing = questions.filter((q) => answers[q.id] === undefined).length;
          if (
            missing > 0 &&
            !window.confirm(
              `Te quedan ${missing} preguntas sin responder. ¿Finalizar y guardar de todos modos?`
            )
          )
            return;
          finishExam();
        }}
        className="w-full"
      >
        Finalizar y guardar
      </Button>
    </div>
  );
}
