import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ClipboardCheck, Clock } from "lucide-react";
import { Button, Card, EmptyState, ProgressBar } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import grammarData from "../data/grammarData.js";
import { useUser } from "../hooks/useUser.jsx";
import { saveExamResult } from "../services/db.js";

export default function ExamSim() {
  const navigate = useNavigate();
  const { user, addXP } = useUser();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3600);

  let pool = [];
  unitsData.forEach((u) => u.quizzes.forEach((q) => pool.push(...q.questions)));
  grammarData.forEach((t) => pool.push(...t.exercises));
  const all = pool.filter((q) => q.correctAnswer);
  const SKILLS = [`grammar`, `vocabulary`, `reading`, `listening`, `writing`, `speaking`];
  const SKILL_MAX = { grammar: 20, vocabulary: 20, reading: 18, listening: 18, writing: 12, speaking: 12 };
  const exam = SKILLS.flatMap((sk) => all.filter((q) => q.skillArea === sk).slice(0, SKILL_MAX[sk]));
  const maxScore = exam.length;

  const timerRef = useRef(undefined);

  useEffect(() => {
    if (!started || finished) return;
    if (secondsLeft <= 0) {
      finishExam();
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? (clearInterval(timerRef.current), finishExam(), 0) : s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  const finishExam = async () => {
    setFinished(true);
    const correct = exam.filter((q) => answers[q.id] === q.correctAnswer).length;
    const listeningScore = exam.filter(
      (q) => q.skillArea === `listening` && answers[q.id] === q.correctAnswer
    ).length;
    const readingScore = exam.filter(
      (q) => q.skillArea === `reading` && answers[q.id] === q.correctAnswer
    ).length;
    await     saveExamResult({
      date: Date.now(),
      score: correct,
      total: exam.length,
      level,
      listeningScore,
      readingScore,
      grammarScore,
      vocabularyScore,
      writingScore,
      speakingScore,
      timeSpent: 3600 - secondsLeft,
    });
    await addXP(200);
  };

  const selectAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    if (index < exam.length - 1) setIndex((i) => i + 1);
  };

  if (!user) return null;

  if (exam.length === 0)
    return (
      <EmptyState
        icon={<ClipboardCheck size={48} />}
        title="No hay preguntas disponibles"
        description="No se encontraron preguntas para el simulacro. Asegúrate de que hay contenido cargado en la aplicación."
        action={<Button onClick={() => navigate(`/learn`)}>Ir a aprender</Button>}
      />
    );

  if (!started)
    return (
      <div className="max-w-lg mx-auto space-y-6 pt-12">
        <div className="text-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto text-white">
            <ClipboardCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold">Simulacro de Examen</h1>
          <p className="text-gray-500">100 preguntas tipo MEP (selección única)</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              <Clock size={14} /> 60 minutos
            </p>
            <p className="flex items-center justify-center gap-2">
              <AlertCircle size={14} /> 50 Listening · 25 Reading · 25 Grammar
            </p>
            <p className="flex items-center justify-center gap-2 text-xs text-amber-600">
              Sin penalización por respuestas incorrectas
            </p>
          </div>
        </div>
        <Button className="w-full" size="lg" onClick={() => setStarted(true)}>
          Comenzar Simulacro
        </Button>
      </div>
    );

  if (finished) {
    const correct = exam.filter((q) => answers[q.id] === q.correctAnswer).length;
    const pct = Math.round((correct / exam.length) * 100);
    const listeningScore = exam.filter(
      (q) => q.skillArea === `listening` && answers[q.id] === q.correctAnswer
    ).length;
    const readingScore = exam.filter(
      (q) => q.skillArea === `reading` && answers[q.id] === q.correctAnswer
    ).length;
    const grammarScore = exam.filter(
      (q) => q.skillArea === `grammar` && answers[q.id] === q.correctAnswer
    ).length;
    const vocabularyScore = exam.filter(
      (q) => q.skillArea === `vocabulary` && answers[q.id] === q.correctAnswer
    ).length;
    const writingScore = exam.filter(
      (q) => q.skillArea === `writing` && answers[q.id] === q.correctAnswer
    ).length;
    const speakingScore = exam.filter(
      (q) => q.skillArea === `speaking` && answers[q.id] === q.correctAnswer
    ).length;
    let level = `A1`;
    if (pct >= 85) level = `B2`;
    else if (pct >= 65) level = `B1`;
    else if (pct >= 40) level = `A2`;
    const skillScores = [
      { name: `Gramática`, value: `${grammarScore}/${SKILL_MAX.grammar}` },
      { name: `Vocabulario`, value: `${vocabularyScore}/${SKILL_MAX.vocabulary}` },
      { name: `Lectura`, value: `${readingScore}/${SKILL_MAX.reading}` },
      { name: `Escucha`, value: `${listeningScore}/${SKILL_MAX.listening}` },
      { name: `Escritura`, value: `${writingScore}/${SKILL_MAX.writing}` },
      { name: `Habla`, value: `${speakingScore}/${SKILL_MAX.speaking}` },
    ];

    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">📊 Resultados</h1>
          <p className="text-5xl font-bold">{pct}%</p>
          <p className="text-lg">
            Nivel estimado: <strong>{level}</strong>
          </p>
          <p className="text-green-600">+200 XP ganados</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          {skillScores.map((s) => (
            <Card key={s.name}>
              <p className="text-sm text-gray-500">{s.name}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </Card>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          {correct} de {exam.length} correctas
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setStarted(false);
              setIndex(0);
              setAnswers({});
              setFinished(false);
              setSecondsLeft(3600);
            }}
          >
            Reintentar
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/progress`)}>
            Ver progreso
          </Button>
        </div>
      </div>
    );
  }

  const question = exam[index];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">
            {index + 1} / {exam.length}
          </span>
          <div className="flex gap-1 mt-1">
            {exam.slice(0, Math.min(exam.length, 20)).map((q, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  answers[q.id] ? `bg-sky-500` : `bg-gray-200 dark:bg-gray-700`
                }`}
              />
            ))}
            {exam.length > 20 && (
              <span className="text-xs text-gray-400 ml-1">...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-lg font-mono">
          <Clock size={18} className="text-red-500" />
          {Math.floor(secondsLeft / 60)}:
          {String(secondsLeft % 60).padStart(2, `0`)}
        </div>
      </div>

      <ProgressBar value={index + 1} max={exam.length} />

      <Card>
        <p className="text-xs text-gray-400 uppercase mb-2">
          {question.skillArea === `listening`
            ? `🎧 Listening`
            : question.skillArea === `reading`
              ? `📖 Reading`
              : `📝 Grammar`}
        </p>
        <p className="text-lg font-medium mb-4">{question.prompt}</p>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(question.id, option)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                answers[question.id] === option
                  ? `border-sky-500 bg-sky-50 dark:bg-sky-900/20`
                  : `border-gray-200 dark:border-gray-600 hover:border-gray-300`
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + i)}.</span>{" "}
              {option}
            </button>
          ))}
        </div>
      </Card>

      {index === exam.length - 1 && answers[question.id] && (
        <Button className="w-full" size="lg" onClick={finishExam}>
          Finalizar examen
        </Button>
      )}
    </div>
  );
}
