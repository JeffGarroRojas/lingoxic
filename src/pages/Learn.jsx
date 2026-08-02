import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Lock } from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Badge, LevelBadge, ProgressBar } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { isLevelOrAbove } from "../utils/level.js";

export default function Learn() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Unidades Temáticas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            6 escenarios alineados con el examen MEP
          </p>
        </div>
        <LevelBadge level={user.level} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {unitsData.map((unit, index) => {
          const unlocked = isLevelOrAbove(user.level, unit.level) || index === 0;
          const completed = unit.lessons.filter((l) =>
            user.completedLessons.includes(l.id)
          ).length;
          const pct = Math.round((completed / unit.lessons.length) * 100);
          return (
            <Card
              key={unit.id}
              hover={unlocked}
              onClick={() => unlocked && navigate(`/unit/${unit.id}`)}
              className={`relative overflow-hidden ${unlocked ? `` : `opacity-60`}`}
            >
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 dark:bg-gray-900/20 z-10">
                  <Lock size={32} className="text-gray-400" />
                </div>
              )}
              <div className={`h-2 rounded-t-2xl mb-4 bg-gradient-to-r ${unit.color}`} />
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${unit.color} text-white`}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{unit.title}</h3>
                    <Badge variant="default">{unit.level}</Badge>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {unit.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>
                  {completed}/{unit.lessons.length} lecciones
                </span>
                <span>{pct}%</span>
              </div>
              <ProgressBar
                value={completed}
                max={unit.lessons.length}
                color={pct === 100 ? `green` : `primary`}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
