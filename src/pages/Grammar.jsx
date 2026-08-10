import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
} from "lucide-react";
import { Badge, Button, Card, EmptyState } from "../components/ui.jsx";
import grammarData from "../data/grammarData.js";
import { useUser } from "../hooks/useUser.jsx";

function GrammarExercise({ exercise, index }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const choose = (option) => {
    setSelected(option);
    setAnswered(true);
  };
  const correct = selected === exercise.correctAnswer;

  return (
    <div
      className={`p-4 rounded-xl border ${
        answered
          ? correct
            ? `border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20`
            : `border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20`
          : `border-gray-200 dark:border-gray-700`
      }`}
    >
      <p className="text-sm font-medium mb-3">
        {index + 1}. {exercise.prompt}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              onClick={() => !answered && choose(option)}
              disabled={answered}
              className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                answered && option === exercise.correctAnswer
                  ? `border-green-500 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300`
                  : isSelected && !correct
                    ? `border-red-500 bg-red-100 dark:bg-red-900/30`
                    : `border-gray-200 dark:border-gray-600 hover:border-gray-300`
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className={`text-xs mt-2 ${correct ? `text-green-600` : `text-red-600`}`}>
          💡 {exercise.explanation}
        </p>
      )}
    </div>
  );
}

export default function Grammar() {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(null);
  const [showExercises, setShowExercises] = useState(null);

  return user ? (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="text-sky-500" /> Gramática
        </h1>
        <p className="text-gray-500">
          8 módulos gramaticales para el examen MEP
        </p>
      </div>

      <div className="space-y-4">
        {grammarData.length > 0 ? (
          grammarData.map((topic) => (
            <Card key={topic.id}>
              <div className="space-y-4">
                <button
                  onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-sky-500 text-white">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{topic.title}</h3>
                      <Badge variant="default">{topic.level}</Badge>
                    </div>
                  </div>
                  {expanded === topic.id ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {expanded === topic.id && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {topic.description}
                    </p>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-sm leading-relaxed">{topic.explanation}</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">📖 Reglas:</h4>
                      {topic.rules.map((rule, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <p className="font-medium text-sm">{rule.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {rule.content}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">💡 Ejemplos:</h4>
                      {topic.examples.map((ex, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Check
                            size={16}
                            className="text-green-500 mt-0.5 shrink-0"
                          />
                          <div>
                            <p className="font-medium">{ex.correct}</p>
                            <p className="text-xs text-gray-500">{ex.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setShowExercises(showExercises === topic.id ? null : topic.id)
                      }
                    >
                      {showExercises === topic.id
                        ? `Ocultar ejercicios`
                        : `Practicar (${topic.exercises.length} ejercicios)`}
                    </Button>
                    {showExercises === topic.id && (
                      <div className="space-y-3">
                        {topic.exercises.map((exercise, i) => (
                          <GrammarExercise
                            key={exercise.id}
                            exercise={exercise}
                            index={i}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<GraduationCap size={48} />}
            title="No hay temas gramaticales"
            description="Los módulos gramaticales no están disponibles en este momento. Vuelve más tarde."
          />
        )}
      </div>
    </div>
  ) : null;
}
