import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BrainCircuit, RefreshCw } from "lucide-react";
import { Button, Card, ProgressBar, SkillBadge } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import grammarData from "../data/grammarData.js";
import { useUser } from "../hooks/useUser.jsx";

export default function Practice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skill = searchParams.get(`skill`);
  const { user } = useUser();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [filter, setFilter] = useState(skill);

  const pool = useMemo(() => {
    let questions = [];
    unitsData.forEach((u) => u.quizzes.forEach((q) => questions.push(...q.questions)));
    grammarData.forEach((t) => questions.push(...t.exercises));
    return questions;
  }, []);

  const exercises = useMemo(
    () => (filter ? pool.filter((q) => q.skillArea === filter) : pool).slice(0, 10),
    [pool, filter]
  );

  const answer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    if (index < exercises.length - 1)
      setTimeout(() => setIndex((i) => i + 1), 300);
  };

  const finish = () => setShowResults(true);
  const restart = () => {
    setIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  if (!user || exercises.length === 0)
    return (
      <div className="text-center py-12 space-y-4">
        <BrainCircuit size={48} className="text-gray-300 mx-auto" />
        <p className="text-gray-400">
          No hay preguntas disponibles{filter ? ` para ${filter}` : ``}
        </p>
        <Button variant="secondary" onClick={() => setFilter(null)}>
          Ver todas
        </Button>
      </div>
    );

  if (showResults) {
    const correct = exercises.filter((q) => answers[q.id] === q.correctAnswer).length;
    const pct = Math.round((correct / exercises.length) * 100);
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center">
        <h2 className="text-2xl font-bold">Resultados</h2>
        <p className="text-5xl font-bold">{pct}%</p>
        <p className="text-gray-500">
          {correct} de {exercises.length} correctas
        </p>
        <div className="space-y-2">
          {exercises.map((q, i) => (
            <div
              key={q.id}
              className={`p-3 rounded-xl text-sm text-left ${
                answers[q.id] === q.correctAnswer
                  ? `bg-green-50 dark:bg-green-900/20`
                  : `bg-red-50 dark:bg-red-900/20`
              }`}
            >
              <p>
                <strong>{i + 1}.</strong> {q.prompt}
              </p>
              <p className="text-xs text-gray-500 mt-1">💡 {q.explanation}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={restart} className="flex-1">
            <RefreshCw size={16} /> Reintentar
          </Button>
          <Button onClick={() => navigate(`/learn`)} className="flex-1">
            Estudiar
          </Button>
        </div>
      </div>
    );
  }

  const question = exercises[index];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BrainCircuit className="text-sky-500" /> Práctica Rápida
        </h1>
        <div className="flex items-center gap-2">
          <SkillBadge skill={filter || question.skillArea} showLabel />
          <span className="text-sm text-gray-400">
            {index + 1}/{exercises.length}
          </span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[`grammar`, `vocabulary`, `reading`, `listening`, `writing`, `speaking`].map(
          (s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                setIndex(0);
                setAnswers({});
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filter === s
                  ? `bg-sky-500 text-white`
                  : `bg-gray-100 dark:bg-gray-800 text-gray-600`
              }`}
            >
              {s}
            </button>
          )
        )}
        {filter && (
          <button
            onClick={() => setFilter(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      <ProgressBar value={index + 1} max={exercises.length} />

      <Card>
        <p className="text-lg font-medium mb-4">{question.prompt}</p>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => answer(question.id, option)}
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

      {index === exercises.length - 1 && answers[question.id] && (
        <Button className="w-full" size="lg" onClick={finish}>
          Ver resultados
        </Button>
      )}
    </div>
  );
}
