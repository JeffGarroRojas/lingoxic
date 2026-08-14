import { useState } from "react";
import { BookOpen, Check, X } from "lucide-react";
import { Badge, Button, Card, SkillBadge } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { useUser } from "../hooks/useUser.jsx";

export default function Reading() {
  const { user } = useUser();
  const [selectedUnit, setSelectedUnit] = useState(unitsData[0].id);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});

  const unit = unitsData.find((u) => u.id === selectedUnit);
  const quiz = unit?.quizzes.find((q) => q.type === "reading");

  if (!user) return null;

  const selectAnswer = (questionId, option) => {
    checked[quiz?.id || ""] || setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const verify = (quizId) => {
    setChecked((prev) => ({ ...prev, [quizId]: true }));
  };

  const isCorrect = (questionId, correctAnswer) =>
    (Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]).includes(
      answers[questionId]
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-green-500" /> Reading Room
        </h1>
        <p className="text-gray-500">
          Mejora tu comprensión lectora con textos tipo MEP
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {unitsData.map((u) => (
          <button
            key={u.id}
            onClick={() => {
              setSelectedUnit(u.id);
              setAnswers({});
              setChecked({});
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedUnit === u.id
                ? `bg-gradient-to-r from-indigo-500 to-violet-500 text-white`
                : `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`
            }`}
          >
            {u.title}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {unit?.lessons
          .filter((lesson) => lesson.type === "reading")
          .map((lesson) => (
            <Card key={lesson.id}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <SkillBadge skill="reading" />
                </div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {lesson.content.sections
                      .map((s) => s.content)
                      .join("\n\n")}
                  </p>
                </div>
                {lesson.content.sections
                  .filter((s) => s.type === "exercise")
                  .map((s, i) => (
                    <div key={i} className="space-y-2">
                      <p className="font-medium text-sm">
                        {s.title || `Preguntas de comprensión:`}
                      </p>
                      {s.examples?.map((example, ei) => (
                        <div key={ei} className="text-sm">
                          <p>{example}</p>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        {unit?.lessons.filter((lesson) => lesson.type === "reading").length ===
          0 && (
          <p className="text-center text-gray-400 py-8">
            No hay ejercicios de lectura en esta unidad
          </p>
        )}

        {quiz && (
          <Card>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-green-500" /> Quiz de
              comprensión: {quiz.title}
            </h3>
            <div className="space-y-4">
              {quiz.questions.map((q, qi) => {
                const isChecked = checked[quiz.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <p className="text-sm font-medium mb-3">
                      {qi + 1}. {q.prompt}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option) => {
                        const selected = answers[q.id] === option;
                        const correct =
                          isChecked &&
                          (Array.isArray(q.correctAnswer)
                            ? q.correctAnswer
                            : [q.correctAnswer]
                          ).includes(option);
                        let borderClass = `border-gray-200 dark:border-gray-600`;
                        if (selected && !isChecked)
                          borderClass = `border-indigo-500`;
                        if (isChecked && correct)
                          borderClass = `border-violet-500 bg-violet-50 dark:bg-violet-900/20`;
                        if (isChecked && selected && !correct)
                          borderClass = `border-red-500 bg-red-50 dark:bg-red-900/20`;
                        return (
                          <button
                            key={option}
                            onClick={() => selectAnswer(q.id, option)}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${borderClass} ${
                              isChecked
                                ? `cursor-default`
                                : `hover:border-indigo-300 cursor-pointer`
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isChecked && correct && (
                                <Check
                                  size={16}
                                  className="text-violet-500 shrink-0"
                                />
                              )}
                              {isChecked && selected && !correct && (
                                <X
                                  size={16}
                                  className="text-red-500 shrink-0"
                                />
                              )}
                              <span
                                className={
                                  selected && !isChecked ? `font-medium` : ``
                                }
                              >
                                {option}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {isChecked && (
                      <p className="text-xs mt-2 text-gray-500">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {!checked[quiz.id] && (
              <Button
                className="mt-4"
                onClick={() => verify(quiz.id)}
                disabled={quiz.questions.some((q) => !answers[q.id])}
              >
                Verificar respuestas
              </Button>
            )}
            {checked[quiz.id] && (
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant={
                    quiz.questions.every((q) =>
                      isCorrect(q.id, q.correctAnswer)
                    )
                      ? `success`
                      : `info`
                  }
                >
                  {quiz.questions.filter((q) =>
                    isCorrect(q.id, q.correctAnswer)
                  ).length}
                  /{quiz.questions.length} correctas
                </Badge>
                <p className="text-xs text-gray-400">
                  Se requiere {quiz.requiredScore}% para aprobar
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
