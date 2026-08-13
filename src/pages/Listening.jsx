import { useState } from "react";
import { Check, Headphones, Play, Square, X } from "lucide-react";
import { Badge, Button, Card, SkillBadge } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { getListeningExercise } from "../data/listeningData.js";
import { getBestEnglishVoice } from "../utils/tts.js";
import { useUser } from "../hooks/useUser.jsx";

export default function Listening() {
  const { user } = useUser();
  const [selectedUnit, setSelectedUnit] = useState(unitsData[0].id);
  const [speakingId, setSpeakingId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});

  const unit = unitsData.find((u) => u.id === selectedUnit);

  if (!user) return null;

  const speak = (text, id) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setSpeakingId(id);
      const utterance = new SpeechSynthesisUtterance(text);
      const bestVoice = getBestEnglishVoice();
      utterance.lang = bestVoice ? bestVoice.lang : "en-US";
      if (bestVoice) utterance.voice = bestVoice;
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingId(null);
      speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeakingId(null);
  };

  const selectAnswer = (questionId, option) => {
    checked[questionId.split("-").slice(0, -1).join("-")] ||
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const verify = (lessonId) => {
    setChecked((prev) => ({ ...prev, [lessonId]: true }));
  };

  const isCorrect = (questionId, correctAnswer) =>
    (Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]).includes(
      answers[questionId]
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Headphones className="text-emerald-500" /> Listening Lab
        </h1>
        <p className="text-gray-500">
          Practica comprensión auditiva con textos narrados por IA
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
                ? `bg-gradient-to-r from-sky-500 to-emerald-500 text-white`
                : `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`
            }`}
          >
            {u.title}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {unit?.lessons
          .filter((lesson) => lesson.type === "listening")
          .map((lesson) => {
            const transcription =
              exercise.script ||
              lesson.content.sections
                .map((s) => s.content)
                .join(". ");
            const exercise = getListeningExercise(lesson.id);
            return (
              <div key={lesson.id} className="space-y-4">
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <SkillBadge skill="listening" />
                      </div>
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        {speakingId === lesson.id ? (
                          <Button size="sm" variant="danger" onClick={stop}>
                            <Square size={14} /> Detener
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => speak(transcription, lesson.id)}
                          >
                            <Play size={14} /> Escuchar
                          </Button>
                        )}
                      </div>
                      <details className="mt-2">
                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                          Ver transcripción
                        </summary>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          {lesson.content.sections
                            .map((s) => s.content)
                            .join("\n\n")}
                        </p>
                      </details>
                    </div>
                  </div>
                </Card>

                {exercise && (
                  <Card>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Headphones size={18} className="text-emerald-500" />{" "}
                      Comprensión auditiva
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Responde después de escuchar el diálogo
                    </p>
                    <div className="space-y-4">
                      {exercise.questions.map((q, qi) => {
                        const isChecked = checked[lesson.id];
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
                                  borderClass = `border-emerald-500`;
                                if (isChecked && correct)
                                  borderClass = `border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20`;
                                if (isChecked && selected && !correct)
                                  borderClass = `border-red-500 bg-red-50 dark:bg-red-900/20`;
                                return (
                                  <button
                                    key={option}
                                    onClick={() => selectAnswer(q.id, option)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${borderClass} ${
                                      isChecked
                                        ? `cursor-default`
                                        : `hover:border-emerald-300 cursor-pointer`
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {isChecked && correct && (
                                        <Check
                                          size={16}
                                          className="text-emerald-500 shrink-0"
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
                                          selected && !isChecked
                                            ? `font-medium`
                                            : ``
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
                    {!checked[lesson.id] && (
                      <Button
                        className="mt-4"
                        onClick={() => verify(lesson.id)}
                        disabled={exercise.questions.some((q) => !answers[q.id])}
                      >
                        Verificar respuestas
                      </Button>
                    )}
                    {checked[lesson.id] && (
                      <div className="mt-4 flex items-center gap-2">
                        <Badge
                          variant={
                            exercise.questions.every((q) =>
                              isCorrect(q.id, q.correctAnswer)
                            )
                              ? `success`
                              : `info`
                          }
                        >
                          {
                            exercise.questions.filter((q) =>
                              isCorrect(q.id, q.correctAnswer)
                            ).length
                          }
                          /{exercise.questions.length} correctas
                        </Badge>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            );
          })}
        {unit?.lessons.filter((lesson) => lesson.type === "listening")
          .length === 0 && (
          <p className="text-center text-gray-400 py-8">
            No hay ejercicios de listening en esta unidad
          </p>
        )}
      </div>
    </div>
  );
}
