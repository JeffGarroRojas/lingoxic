import { useEffect, useState } from "react";
import { useActivityGuard } from "../hooks/useActivityGuard.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Brain, CircleCheckBig, CircleX, Clock } from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Button, ProgressBar, SkillBadge } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";

export default function QuizPage() {
  const { unitId, quizId } = useParams();
  const navigate = useNavigate();
  const { user, completeQuiz, addXP } = useUser();
  const quiz = unitsData
    .find((u) => u.id === unitId)
    ?.quizzes.find((q) => q.id === quizId);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 300);
  const [started, setStarted] = useState(false);
  useActivityGuard(started && !finished);

  useEffect(() => {
    if (!started || finished || !quiz?.timeLimit) return;
    const interval = setInterval(() => {
      setTimeLeft((t) =>
        t <= 1 ? (clearInterval(interval), setFinished(true), 0) : t - 1
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished, quiz?.timeLimit]);

  if (!quiz || !user) return <p className="p-8 text-gray-400">Quiz no encontrado</p>;

  const answer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1);
  };

  const finishQuiz = async () => {
    setFinished(true);
    const correct = quiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    if (Math.round((correct / quiz.questions.length) * 100) >= quiz.requiredScore) {
      await completeQuiz(quiz.id);
      await addXP(100);
    }
  };

  if (!started)
    return (
      <div className="max-w-lg mx-auto space-y-6 pt-12">
        <div className="text-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-sky-500 to-sky-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto text-white">
            <Brain size={32} />
          </div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-gray-500">{quiz.description}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <SkillBadge skill={quiz.type} showLabel />
            <span className="flex items-center gap-1">
              <Clock size={14} />{" "}
              {quiz.timeLimit ? `${Math.floor(quiz.timeLimit / 60)} min` : `Sin límite`}
            </span>
            <span>{quiz.questions.length} preguntas</span>
          </div>
          <p className="text-sm text-gray-400">
            Puntuación mínima: {quiz.requiredScore}%
          </p>
        </div>
        <Button className="w-full" size="lg" onClick={() => setStarted(true)}>
          Comenzar Quiz
        </Button>
      </div>
    );

  if (finished) {
    const correct = quiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const pct = Math.round((correct / quiz.questions.length) * 100);
    const passed = pct >= quiz.requiredScore;
    return (
      <div className="max-w-lg mx-auto space-y-6 pt-12">
        <div className="text-center space-y-4">
          <div
            className={`p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto ${
              passed ? `bg-green-100 dark:bg-green-900/30` : `bg-red-100 dark:bg-red-900/30`
            }`}
          >
            {passed ? (
              <CircleCheckBig size={40} className="text-green-600" />
            ) : (
              <CircleX size={40} className="text-red-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {passed ? `🎉 ¡Aprobado!` : `😅 Sigue practicando`}
          </h1>
          <p className="text-5xl font-bold">{pct}%</p>
          <p className="text-gray-500">
            {correct} de {quiz.questions.length} correctas
          </p>
          {passed && <p className="text-sm text-green-600">+100 XP ganados</p>}
        </div>

        <div className="space-y-3">
          {quiz.questions.map((question, idx) => {
            const ok = answers[question.id] === question.correctAnswer;
            return (
              <div
                key={question.id}
                className={`p-4 rounded-xl border ${
                  ok
                    ? `border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20`
                    : `border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20`
                }`}
              >
                <div className="flex items-start gap-2">
                  {ok ? (
                    <CircleCheckBig size={16} className="text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <CircleX size={16} className="text-red-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {idx + 1}. {question.prompt}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tu respuesta:{" "}
                      <span className={ok ? `text-green-600` : `text-red-600`}>
                        {answers[question.id]}
                      </span>
                      {!ok && (
                        <>
                          {" "}
                          · Correcta:{" "}
                          <span className="text-green-600">
                            {question.correctAnswer}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      💡 {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(`/unit/${unitId}`)}
          >
            Volver
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setStarted(false);
              setCurrent(0);
              setAnswers({});
              setFinished(false);
            }}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[current];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/unit/${unitId}`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} /> Salir
        </button>
        {quiz.timeLimit && (
          <span className="text-sm font-mono flex items-center gap-1">
            <Clock size={14} /> {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, `0`)}
          </span>
        )}
      </div>

      <ProgressBar value={current + 1} max={quiz.questions.length} className="mb-6" />

      <p className="text-sm text-gray-400 text-center">
        Pregunta {current + 1} de {quiz.questions.length}
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
        <p className="text-lg font-medium">{question.prompt}</p>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => answer(question.id, option)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                answers[question.id] === option
                  ? `border-sky-500 bg-sky-50 dark:bg-sky-900/20`
                  : `border-gray-200 dark:border-gray-600 hover:border-gray-300`
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>{" "}
              {option}
            </button>
          ))}
        </div>
      </div>

      {current === quiz.questions.length - 1 && answers[question.id] && (
        <Button className="w-full" size="lg" onClick={finishQuiz}>
          Ver resultados
        </Button>
      )}
    </div>
  );
}
