import { useNavigate, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  ClipboardCheck,
  Flame,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Badge, Button, SkillBadge, LevelBadge, ProgressBar } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { LEVEL_LABELS, streakText, nextLevelThreshold } from "../utils/level.js";

const ACCENTS = [
  "from-teal-500 to-cyan-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-500 to-teal-700",
  "from-orange-400 to-rose-500",
  "from-emerald-500 to-teal-600",
  "from-pink-400 to-rose-600",
];

function Tile({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) return <Navigate to="/" replace />;

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
  const coursePct = totalLessons
    ? Math.round((user.completedLessons.length / totalLessons) * 100)
    : 0;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hola, {user.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tu inglés, paso a paso.
          </p>
        </div>
        <div className="self-start sm:hidden">
          <LevelBadge level={user.level} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {/* Hero: siguiente lección */}
        <div className="relative col-span-2 flex min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-700 via-teal-700 to-teal-900 p-5 text-white md:row-span-2 md:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-12 h-56 w-56 rounded-full bg-amber-300/15"
          />
          <div className="relative space-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              <BookOpen size={14} /> Continúa aprendiendo
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {nextUnit ? nextUnit.title : "Curso completado"}
            </p>
            <p className="text-sm text-white/80">
              {nextUnit
                ? `${nextUnit.completed}/${nextUnit.total} lecciones · ${nextUnit.level}`
                : "Repasa con práctica rápida o un simulacro"}
            </p>
          </div>
          <div className="relative mt-5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-rose-300 transition-all duration-500"
                style={{ width: `${nextUnit?.pct || 100}%` }}
              />
            </div>
            <button
              onClick={() => navigate(nextUnit ? "/learn" : "/practice")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-teal-800 transition hover:bg-amber-50"
            >
              {nextUnit ? "Continuar" : "Practicar"} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <Tile>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Racha
              </p>
              <p className="mt-1 text-2xl font-bold">{user.streak}</p>
              <p className="text-xs text-gray-500">{streakText(user.streak)}</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-900/25">
              <Flame size={20} />
            </span>
          </div>
        </Tile>

        <Tile>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Experiencia
              </p>
              <p className="mt-1 text-2xl font-bold">{user.xp} XP</p>
              <p className="text-xs text-gray-500">Meta {nextThreshold} XP</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-900/25">
              <Zap size={20} />
            </span>
          </div>
          <ProgressBar value={user.xp} max={nextThreshold} className="mt-3" />
        </Tile>

        <Tile>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Nivel
              </p>
              <p className="mt-1 text-2xl font-bold">{user.level}</p>
              <p className="text-xs text-gray-500">{LEVEL_LABELS[user.level]}</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-900/25 dark:text-teal-300">
              <Award size={20} />
            </span>
          </div>
        </Tile>

        <Tile>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Curso
              </p>
              <p className="mt-1 text-2xl font-bold">{coursePct}%</p>
              <p className="text-xs text-gray-500">
                {user.completedLessons.length}/{totalLessons} lecciones
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/25 dark:text-cyan-300">
              <TrendingUp size={20} />
            </span>
          </div>
        </Tile>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        <Card className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <BookOpen size={18} className="text-teal-600" />
              Unidades temáticas
            </h2>
            <Badge variant="info">
              {user.completedLessons.length}/{totalLessons}
            </Badge>
          </div>
          <div className="space-y-3">
            {units.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-xs font-bold text-white`}
                >
                  {u.order}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{u.title}</p>
                    <span className="shrink-0 text-xs text-gray-400">{u.pct}%</span>
                  </div>
                  <ProgressBar value={u.completed} max={u.total} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <Target size={18} className="text-rose-500" />
              Áreas a mejorar
            </h2>
          </div>
          {user.weakAreas.length > 0 ? (
            <div className="space-y-3">
              {user.weakAreas.map((skill) => (
                <div key={skill} className="flex items-center justify-between gap-2">
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
              Completa el diagnóstico para identificar tus áreas de mejora.
            </p>
          )}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/practice")}
            >
              Práctica rápida
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold">
            <ClipboardCheck size={18} className="text-teal-600" />
            Diagnóstico CEFR
          </h2>
          <Badge variant="info">
            {user.diagnostic ? user.diagnostic.overallLevel : "Sin evaluar"}
          </Badge>
        </div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {user.diagnostic
            ? `Tu nivel general es ${user.diagnostic.overallLevel}. Repite el diagnóstico para verificar tu avance.`
            : "Evalúa tus 6 habilidades y conoce tu nivel CEFR real (A1–B2)."}
        </p>
        <Button className="w-full" onClick={() => navigate("/diagnostic")}>
          {user.diagnostic ? "Repetir diagnóstico" : "Hacer diagnóstico"}
          <Target size={16} />
        </Button>
      </Card>
    </div>
  );
}
