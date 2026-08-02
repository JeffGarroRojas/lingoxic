import { useNavigate } from "react-router-dom";
import { Flame, Zap, TrendingUp, BookOpen, ArrowRight, ClipboardCheck, Target } from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Badge, Button, SkillBadge, LevelBadge, ProgressBar } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { LEVEL_LABELS, streakEmoji, nextLevelThreshold } from "../utils/level.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) return (navigate("/"), null);

  const totalLessons = unitsData.reduce((sum, u) => sum + u.lessons.length, 0);
  const nextThreshold = nextLevelThreshold(user.level);

  const units = unitsData.map((u) => {
    const completed = u.lessons.filter((l) =>
      user.completedLessons.includes(l.id)
    ).length;
    return {
      ...u,
      completed,
      total: u.lessons.length,
      pct: u.lessons.length > 0 ? Math.round((completed / u.lessons.length) * 100) : 0,
    };
  });

  const nextUnit = units.find((u) => u.pct < 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, {user.name}! 👋</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Continúa tu aprendizaje de inglés
            </p>
          </div>
        </div>
        <LevelBadge level={user.level} size="lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Racha</p>
            <p className="text-2xl font-bold">
              {user.streak} días {streakEmoji(user.streak)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl text-white">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Experiencia</p>
            <p className="text-2xl font-bold">{user.xp} XP</p>
            <ProgressBar value={user.xp} max={nextThreshold} className="mt-2" />
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl text-white">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Siguiente nivel</p>
            <p className="text-lg font-bold">
              {LEVEL_LABELS[user.level]} → {nextThreshold} XP
            </p>
          </div>
        </Card>
      </div>

      {nextUnit && (
        <Card className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm opacity-80">Continúa aprendiendo</p>
              <p className="text-xl font-bold">{nextUnit.title}</p>
              <p className="text-sm opacity-80">
                {nextUnit.completed}/{nextUnit.total} lecciones completadas
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/learn")}
              className="bg-white/20 text-white hover:bg-white/30 border-0"
            >
              Continuar <ArrowRight size={16} />
            </Button>
          </div>
          <ProgressBar
            value={nextUnit.completed}
            max={nextUnit.total}
            className="mt-3"
            color="green"
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <BookOpen size={18} className="text-sky-500" />
              Unidades Temáticas
            </h2>
            <Badge variant="info">
              {user.completedLessons.length}/{totalLessons} lecciones
            </Badge>
          </div>
          <div className="space-y-3">
            {units.map((u) => {
              const color = u.color.split(` `)[0].replace(`from-`, ``).replace(/-/g, ``);
              return (
                <div key={u.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: `${color}20`,
                      color: u.color.split(` `)[0].replace(`from-`, ``),
                    }}
                  >
                    {u.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.title}</p>
                    <ProgressBar value={u.completed} max={u.total} className="mt-1" />
                  </div>
                  <span className="text-xs text-gray-400">{u.pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Áreas a Mejorar
            </h2>
          </div>
          {user.weakAreas.length > 0 ? (
            <div className="space-y-3">
              {user.weakAreas.map((skill) => (
                <div key={skill} className="flex items-center justify-between">
                  <SkillBadge skill={skill} showLabel />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/practice?skill=${skill}`)}
                  >
                    Practicar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Completa el test de diagnóstico para identificar áreas de mejora.
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/practice")}
            >
              Práctica Rápida 🎯
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <ClipboardCheck size={18} className="text-purple-500" />
            Diagnóstico CEFR
          </h2>
          <Badge variant="info">{user.diagnostic ? user.diagnostic.overallLevel : "Sin evaluar"}</Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {user.diagnostic
            ? `Tu nivel general actual es ${user.diagnostic.overallLevel}. Repite el diagnóstico para verificar tu avance real.`
            : "Evalúa tus 6 habilidades y conoce tu nivel CEFR real (A1–B2) en cada una."}
        </p>
        <Button className="w-full" onClick={() => navigate("/diagnostic")}>
          {user.diagnostic ? "Repetir diagnóstico" : "Hacer diagnóstico"} <Target size={16} />
        </Button>
      </Card>
    </div>
  );
}
