import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Brain, CircleCheckBig, Play } from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Badge, SkillBadge, EmptyState } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";

export default function UnitDetail() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const unit = unitsData.find((u) => u.id === unitId);

  if (!unit || !user) return <p className="p-8 text-gray-400">Unidad no encontrada</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/learn")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={16} /> Volver a unidades
      </button>

      <div className={`rounded-2xl p-6 bg-gradient-to-r ${unit.color} text-white`}>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="default" className="bg-white/20 text-white">
            {unit.level}
          </Badge>
          <span className="text-sm opacity-80">
            {unit.lessons.length} lecciones
          </span>
        </div>
        <h1 className="text-2xl font-bold">{unit.title}</h1>
        <p className="mt-1 opacity-90">{unit.description}</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Play size={18} className="text-sky-500" /> Lecciones
        </h2>
        {unit.lessons.length > 0 ? (
          unit.lessons.map((lesson, index) => {
            const completed = user.completedLessons.includes(lesson.id);
            return (
              <Card
                key={lesson.id}
                hover
                onClick={() => navigate(`/lesson/${unit.id}/${lesson.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      completed
                        ? `bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400`
                        : `bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400`
                    }`}
                  >
                    {completed ? <CircleCheckBig size={20} /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <SkillBadge skill={lesson.type} />
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {lesson.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={<Play size={48} />}
            title="No hay lecciones disponibles"
            description="Esta unidad no tiene lecciones. Explora otras unidades para comenzar a aprender."
          />
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Brain size={18} className="text-purple-500" /> Quizzes
        </h2>
        {unit.quizzes.length > 0 ? (
          unit.quizzes.map((quiz) => {
            const completed = user.completedQuizzes.includes(quiz.id);
            return (
              <Card
                key={quiz.id}
                hover
                onClick={() => navigate(`/quiz/${unit.id}/${quiz.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        completed
                          ? `bg-green-100 dark:bg-green-900/30`
                          : `bg-purple-100 dark:bg-purple-900/30`
                      }`}
                    >
                      <Brain
                        size={18}
                        className={completed ? `text-green-600` : `text-purple-600`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-xs text-gray-500">
                        {quiz.questions.length} preguntas · {quiz.requiredScore}% mínimo
                      </p>
                    </div>
                  </div>
                  <Badge variant={completed ? `success` : `warning`}>
                    {completed ? `Completado` : `${quiz.questions.length} preg`}
                  </Badge>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={<Brain size={48} />}
            title="No hay quizzes disponibles"
            description="Esta unidad no tiene quizzes. Vuelve más tarde para encontrar nuevos desafíos."
          />
        )}
      </div>
    </div>
  );
}
