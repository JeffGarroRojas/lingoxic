import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import unitsData from "../data/unitsData.js";
import { useActivityGuard } from "../hooks/useActivityGuard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Button } from "../components/ui.jsx";
import { Check, X } from "lucide-react";

export default function QuizPage() {
  const { unitId, quizId } = useParams();
  const navigate = useNavigate();
  const { user, completeQuiz, addXp } = useUser();
  if (!user) return <Navigate to="/" replace />;
  useActivityGuard(!finished);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);

  const unit = unitsData.find((u) => u.id === unitId);
  const quiz = unit?.quizzes?.find((q) => q.id === quizId) || unit?.quiz || unit?.quizzes?.[0];

  if (!quiz) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Card className="p-6 text-center">Quiz no encontrado.</Card>
        <Button className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const selectAnswer = (qId, opt) => {
    if (checked || finished) return;
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const total = questions.length;
  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const minPercent = quiz.minPercent ?? 70;
  const passed = percent >= minPercent;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleCheck = () => {
    setChecked(true);
  };

  const handleFinish = async () => {
    if (passed) {
      try {
        await completeQuiz(quiz.id || quizId);
        addXp(quiz.xp || 20);
      } catch {}
    }
    setFinished(true);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{quiz.title || "Quiz"}</h1>
        <span className="text-xs text-gray-500">Sin limite de tiempo</span>
      </div>
      {quiz.description && <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>}
      <Card className="p-4 space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30">
            <p className="font-medium text-sm mb-2">{idx + 1}. {q.text || q.question || q.prompt}</p>
            <div className="space-y-1">
              {q.options?.map((opt) => {
                const selected = answers[q.id] === opt;
                const isCorrectOpt = checked && q.correctAnswer === opt;
                const isWrongSel = checked && selected && q.correctAnswer !== opt;
                return (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(q.id, opt)}
                    className={`w-full text-left px-3 py-2 rounded border text-sm flex items-center justify-between ${
                      isCorrectOpt ? "border-green-500 bg-green-50 dark:bg-green-900/20" : isWrongSel ? "border-red-500 bg-red-50 dark:bg-red-900/20" : selected ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <span>{opt}</span>
                    {checked && isCorrectOpt && <Check size={16} className="text-green-600" />}
                    {isWrongSel && <X size={16} className="text-red-600" />}
                  </button>
                );
              })}
            </div>
            {checked && q.explanation && (
              <p className="text-xs text-gray-500 mt-2">{q.explanation}</p>
            )}
          </div>
        ))}
        {!checked ? (
          <Button onClick={handleCheck} disabled={!allAnswered} className="w-full">Verificar respuestas</Button>
        ) : !finished ? (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-lg font-bold">{correctCount}/{total} — {percent}%</p>
              <p className={`text-sm ${passed ? "text-green-600" : "text-red-600"}`}>
                {passed ? `¡Aprobado! (min ${minPercent}%)` : `No aprobado (min ${minPercent}%)`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFinish} className="flex-1">{passed ? "Cobrar XP y salir" : "Finalizar"}</Button>
              <Button variant="ghost" onClick={() => { setChecked(false); setAnswers({}); }}>Reintentar</Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="font-semibold">{passed ? "¡Quiz completado!" : "Quiz finalizado"}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate(`/unit/${unitId}`)}>Volver a la unidad</Button>
              <Button variant="ghost" onClick={() => { setChecked(false); setFinished(false); setAnswers({}); }}>Repetir</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
