import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import vocabularyBanks from "../data/vocabularyData.js";
import grammarData from "../data/grammarData.js";
import listeningExercises from "../data/listeningData.js";
import unitsData from "../data/unitsData.js";
// practiceData tiene exportaciones con nombre ( PLACEMENT_QUESTIONS / GRAMMAR_QUESTIONS ); no se usa default aqui
import { Card, Button } from "../components/ui.jsx";
import { saveExamResult } from "../services/db.js";
import { useActivityGuard } from "../hooks/useActivityGuard.jsx";

const EXAM_SECONDS = 3600; // 60 minutos — pedido del usuario

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExam() {
  const vocab = Object.entries(vocabularyBanks).flatMap(([unit, words]) =>
    words.map((w) => ({ id: `vocab-${unit}-${w.word}`, type: "vocab", text: w.word, translation: w.translation, options: [w.translation, ...shuffle(words.filter((x) => x.word !== w.word).slice(0, 3).map((x) => x.translation))].slice(0,4), correctAnswer: w.translation }))
  );
  const grammar = (grammarData || []).flatMap((g) => (g.exercises || g.questions || []).map((q, i) => ({ id: `grammar-${g.id || g.topic}-${i}`, type: "grammar", ...q })));
  const listening = (listeningExercises || []).flatMap((ex) => (ex.questions || []).map((q) => ({ id: `listening-${ex.id}-${q.id}`, type: "listening", script: ex.script, ...q })));
  const reading = unitsData.flatMap((u) => (u.readings || u.lessons || []).flatMap((r) => (r.questions || []).map((q,i) => ({ id: `reading-${u.id}-${i}`, type: "reading", ...q })))).slice(0, 30);
  const writing = [];
  const speaking = [];

  const pools = { vocab: shuffle(vocab), grammar: shuffle(grammar), listening: shuffle(listening), reading: shuffle(reading), writing: shuffle(writing), speaking: shuffle(speaking) };
  // Distribución objetivo 100: 20 vocab + 20 grammar + 14 listening + 20 reading + 13 writing + 13 speaking = 100 (ajustado a lo disponible)
  const want = { vocab: 20, grammar: 20, listening: 14, reading: 20, writing: 13, speaking: 13 };
  const exam = [];
  for (const k of Object.keys(want)) {
    exam.push(...pools[k].slice(0, want[k]));
  }
  // Si faltan por pool pequeño, rellenar con lo que quede hasta 100
  if (exam.length < 100) {
    const leftover = shuffle([...pools.vocab.slice(want.vocab), ...pools.grammar.slice(want.grammar), ...pools.listening.slice(want.listening), ...pools.reading.slice(want.reading)]);
    exam.push(...leftover.slice(0, 100 - exam.length));
  }
  return shuffle(exam).slice(0, Math.min(100, exam.length));
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
            <p className="text-sm font-medium mb-2">{idx + 1}. {q.text || q.question || q.prompt || q.script?.slice(0,80)}</p>
            {q.script && <p className="text-xs text-gray-500 mb-2 italic">{q.script.slice(0,120)}...</p>}
            <div className="space-y-1">
              {(q.options || []).map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`w-full text-left px-3 py-2 rounded border text-sm ${answers[q.id] === opt ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={finishExam} className="w-full">Finalizar y guardar</Button>
    </div>
  );
}
