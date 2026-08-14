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
  const [current, setCurrent] = useState(0);
  const lesson = unitsData
    .find((u) => u.id === unitId)
    ?.lessons.find((l) => l.id === lessonId);

  if (!lesson || !user)
    return <p className="p-8 text-gray-400">Lección no encontrada</p>;

  const completed =
    user.completedLessons.includes(lesson.id) || justCompleted;
  const sections = lesson.content.sections;
  const total = sections.length;
  const section = sections[current];
  const isLast = current === total - 1;

  const goNext = () => {
    if (!isLast) setCurrent((c) => c + 1);
  };
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));

  const renderContent = () => {
    if (!section) return null;
    if (section.type === `explanation`) {
      return (
        <>
          <h3 className="font-semibold">{section.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {section.content}
          </p>
        </>
      );
    }
    if (section.type === `example`) {
      return (
        <>
          <h3 className="font-semibold">{section.title}</h3>
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
        </>
      );
    }
    if (section.type === `tip`) {
      return (
        <>
          <h3 className="font-semibold">{section.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {section.content}
          </p>
        </>
      );
    }
    if (section.type === `vocabulary`) {
      return (
        <>
          <h3 className="font-semibold">{section.title}</h3>
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
        </>
      );
    }
    if (section.type === `grammar`) {
      return (
        <>
          <h3 className="font-semibold">{section.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {section.content}
          </p>
        </>
      );
    }
    return (
      <>
        {section.title && <h3 className="font-semibold">{section.title}</h3>}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {section.content}
        </p>
      </>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(`/unit/${unitId}`)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} /> Volver a la unidad
      </button>

      <div className="space-y-3">
        <SkillBadge skill={lesson.type} showLabel />
        <span className="text-sm text-gray-400">{lesson.level}</span>
      </div>
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {lesson.description}
      </p>

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 mb-3">
            {section.type === `explanation` && (
              <BookText size={20} className="text-indigo-500 mt-0.5 shrink-0" />
            )}
            {section.type === `example` && (
              <Lightbulb size={20} className="text-yellow-500 mt-0.5 shrink-0" />
            )}
            {section.type === `tip` && (
              <Lightbulb size={20} className="text-violet-500 mt-0.5 shrink-0" />
            )}
          </div>
        </div>
        <div className="space-y-2">{renderContent()}</div>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Button variant="secondary" onClick={goPrev} disabled={current === 0}>
          ← Anterior
        </Button>
        <div className="flex items-center gap-1.5">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-indigo-500"
                  : "w-2.5 bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
        {!isLast ? (
          <Button onClick={goNext}>Siguiente →</Button>
        ) : (
          <span className="text-sm text-gray-400">Slide {total}/{total}</span>
        )}
      </div>

      <div className="text-center text-xs text-gray-400">
        Slide {current + 1} de {total}
      </div>

      {completed ? (
        <div className="w-full p-4 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 rounded-xl flex items-center justify-center gap-2 font-semibold">
          <CircleCheckBig size={20} /> ¡Lección completada!
        </div>
      ) : (
        isLast && (
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
        )
      )}
    </div>
  );
}
