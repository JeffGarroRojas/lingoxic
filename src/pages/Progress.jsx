import { useNavigate } from "react-router-dom";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Flame, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { Button, Card, LevelBadge, ProgressBar, SkillBadge } from "../components/ui.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { nextLevelThreshold, streakEmoji } from "../utils/level.js";
import unitsData from "../data/unitsData.js";

const CHART_COLORS = [`#38bdf8`, `#34d399`, `#f59e0b`, `#a78bfa`, `#f472b6`, `#fb923c`];

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  if (!user) return null;

  const totalLessons = unitsData.reduce((e, t) => e + t.lessons.length, 0);
  const totalQuizzes = unitsData.reduce((e, t) => e + t.quizzes.length, 0);
  const threshold = nextLevelThreshold(user.level);
  const levelPct = Math.round((user.xp / threshold) * 100);
  const perUnit = unitsData.map((unit) => {
    const completedLessons = unit.lessons.filter((l) =>
      user.completedLessons.includes(l.id)
    ).length;
    const completedQuizzes = unit.quizzes.filter((q) =>
      user.completedQuizzes.includes(q.id)
    ).length;
    return {
      ...unit,
      completedLessons,
      completedQuizzes,
      totalLessons: unit.lessons.length,
      totalQuizzes: unit.quizzes.length,
    };
  });
  const chartData = perUnit.map((e) => ({
    name: e.title.split(` `).slice(0, 2).join(` `),
    Completado: e.completedLessons + e.completedQuizzes,
    Total: e.totalLessons + e.totalQuizzes,
  }));
  const completed = user.completedLessons.length + user.completedQuizzes.length;
  const total = totalLessons + totalQuizzes;
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="text-emerald-500" /> Mi Progreso
          </h1>
          <p className="text-gray-500">Sigue tu avance en el aprendizaje</p>
        </div>
        <LevelBadge level={user.level} size="lg" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Flame size={24} className="text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{user.streak}</p>
          <p className="text-xs text-gray-500">Racha {streakEmoji(user.streak)}</p>
        </Card>
        <Card className="text-center">
          <Zap size={24} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{user.xp}</p>
          <p className="text-xs text-gray-500">XP total</p>
        </Card>
        <Card className="text-center">
          <Target size={24} className="text-sky-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {user.completedLessons.length}/{totalLessons}
          </p>
          <p className="text-xs text-gray-500">Lecciones</p>
        </Card>
        <Card className="text-center">
          <Trophy size={24} className="text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {user.completedQuizzes.length}/{totalQuizzes}
          </p>
          <p className="text-xs text-gray-500">Quizzes</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-500" /> Progreso general
        </h2>
        <div className="flex items-center justify-between text-sm mb-2">
          <span>
            {user.level} {levelPct}% hacia el siguiente nivel
          </span>
          <span className="text-gray-400">
            {user.xp}/{threshold} XP
          </span>
        </div>
        <ProgressBar value={user.xp} max={threshold} color="primary" />
      </Card>

      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-sky-500" /> Progreso por unidad
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: `var(--tooltip-bg, #1f2937)`,
                  border: `none`,
                  borderRadius: `12px`,
                  color: `#fff`,
                  fontSize: `13px`,
                }}
              />
              <Bar
                dataKey="Completado"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {chartData.map((e, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {overallPct}% del curso completado
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-semibold mb-4">📊 Detalle por unidad</h2>
          <div className="space-y-4">
            {perUnit.map((e) => (
              <div key={e.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium truncate mr-2">{e.title}</span>
                  <span className="text-gray-400 text-xs shrink-0">
                    {e.completedLessons}/{e.totalLessons} lec · {e.completedQuizzes}/
                    {e.totalQuizzes} quiz
                  </span>
                </div>
                <ProgressBar
                  value={e.completedLessons + e.completedQuizzes}
                  max={e.totalLessons + e.totalQuizzes}
                  color={
                    e.completedLessons === e.totalLessons ? `green` : `primary`
                  }
                />
              </div>
            ))}
          </div>
        </Card>
        {user.weakAreas.length > 0 && (
          <Card>
            <h2 className="font-semibold mb-3">🎯 Áreas a mejorar</h2>
            <div className="flex flex-wrap gap-2">
              {user.weakAreas.map((e) => (
                <button
                  key={e}
                  onClick={() => navigate(`/practice?skill=${e}`)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm"
                >
                  <SkillBadge skill={e} />
                  <span className="text-amber-600 text-xs">Practicar →</span>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Card className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">🎯 Meta: completar el curso</h3>
            <p className="text-sm opacity-80">
              {completed}/{total} actividades • {overallPct}%
            </p>
            <p className="text-xs opacity-70 mt-1">
              {remaining === 0
                ? `¡Curso completado! 🎉`
                : `Te faltan ${remaining} actividades por completar`}
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-0"
            onClick={() => navigate(`/learn`)}
          >
            Seguir aprendiendo
          </Button>
        </div>
        <ProgressBar value={completed} max={total} className="mt-3" color="green" />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => navigate(`/practice`)}>
          Práctica Rápida
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => navigate(`/exam-sim`)}>
          Simulacro de Examen
        </Button>
      </div>
    </div>
  );
}
