import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CircleCheckBig, BookText, Lightbulb } from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Button, SkillBadge } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";

export default function LessonDetail() {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson, addXP } = useUser();
  const [justCompleted, setJustCompleted] = useState(false);
  const lesson = unitsData
    .find((u) => u.id === unitId)
    ?.lessons.find((l) => l.id === lessonId);

  if (!lesson || !user)
    return <p className="p-8 text-gray-400">Lección no encontrada</p>;

  const completed = user.completedLessons.includes(lesson.id) || justCompleted;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(`/unit/${unitId}`)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} /> Volver a la unidad
      </button>

      <div className="flex items-center gap-3">
        <SkillBadge skill={lesson.type} showLabel />
        <span className="text-sm text-gray-400">{lesson.level}</span>
      </div>
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
      <p className="text-gray-500 dark:text-gray-400">{lesson.description}</p>

      <div className="space-y-4">
        {lesson.content.sections.map((section, index) => (
          <Card key={index}>
            <div className="flex items-start gap-3">
              {section.type === `explanation` && (
                <BookText size={20} className="text-sky-500 mt-0.5 shrink-0" />
              )}
              {section.type === `example` && (
                <Lightbulb size={20} className="text-yellow-500 mt-0.5 shrink-0" />
              )}
              {section.type === `tip` && (
                <Lightbulb size={20} className="text-emerald-500 mt-0.5 shrink-0" />
              )}
              <div className="space-y-2">
                {section.title && <h3 className="font-semibold">{section.title}</h3>}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </p>
                {section.examples && (
                  <ul className="space-y-2 mt-3">
                    {section.examples.map((example, idx) => (
                      <li
                        key={idx}
                        className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm border border-gray-200 dark:border-gray-700"
                      >
                        📌 {example}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {completed ? (
        <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center justify-center gap-2 font-semibold">
          <CircleCheckBig size={20} /> ¡Lección completada!
        </div>
      ) : (
        <Button
          className="w-full"
          size="lg"
          onClick={async () => {
            await completeLesson(lesson.id);
            await addXP(50);
            setJustCompleted(true);
          }}
        >
          Marcar como completada (+50 XP)
        </Button>
      )}
    </div>
  );
}
