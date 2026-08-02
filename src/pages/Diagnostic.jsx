import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Library, FileText, Headphones, PenLine, Mic,
  ArrowRight, RotateCcw, Award, Target, CheckCircle2,
} from "lucide-react";
import { Card, Button, ProgressBar } from "../components/ui.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useActivityGuard } from "../hooks/useActivityGuard.jsx";
import {
  SKILLS, DIAGNOSTIC_QUESTIONS, CEFR_DESCRIPTORS,
  scoreToLevel, levelRank,
} from "../data/diagnosticData.js";

const ICONS = { grammar: BookOpen, vocabulary: Library, reading: FileText, listening: Headphones, writing: PenLine, speaking: Mic };
const SKILL_LABELS = { grammar: "Gramática", vocabulary: "Vocabulario", reading: "Lectura", listening: "Escucha", writing: "Escritura", speaking: "Habla" };

export default function Diagnostic() {
  const { user, saveDiagnostic } = useUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentSkill, setCurrentSkill] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  useActivityGuard(started && !finished);

  const skill = SKILLS[currentSkill];
  const questions = DIAGNOSTIC_QUESTIONS[skill];
  const progress = step / (questions.length - 1) * 100;

  const results = useMemo(() => {
    const bySkill = {};
    SKILLS.forEach((sk) => {
      const qs = DIAGNOSTIC_QUESTIONS[sk];
      let correct = 0;
      qs.forEach((q) => { if (answers[q.prompt] === q.correctAnswer) correct++; });
      bySkill[sk] = { level: scoreToLevel(correct, qs.length), correct, total: qs.length };
    });
    const weakest = SKILLS.reduce((a, b) => (levelRank(bySkill[a].level) < levelRank(bySkill[b].level) ? a : b));
    const strongest = SKILLS.reduce((a, b) => (levelRank(bySkill[a].level) > levelRank(bySkill[b].level) ? a : b));
    const overallLevels = SKILLS.map((sk) => levelRank(bySkill[sk].level));
    const overall = Math.min(overallLevels.reduce((a, b) => a + b, 0) / SKILLS.length, 3);
    const overallLevel = ["A1", "A2", "B1", "B2"][Math.round(overall)];
    return { bySkill, weakest, strongest, overallLevel };
  }, [answers]);

  if (!user) return null;

  function start() { setStarted(true); }

  function answer(q, option) {
    const next = { ...answers, [q.prompt]: option };
    setAnswers(next);
    setTimeout(() => {
      if (step < questions.length - 1) setStep(step + 1);
      else if (currentSkill < SKILLS.length - 1) { setCurrentSkill(currentSkill + 1); setStep(0); }
      else { setFinished(true); saveDiagnostic(next); }
    }, 250);
  }

  function reset() {
    setAnswers({}); setStep(0); setCurrentSkill(0); setStarted(false); setFinished(false);
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="text-purple-500" /> Diagnóstico de nivel
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Evalúa tus 6 habilidades y obtén tu nivel CEFR real (A1–B2) en cada una.
          </p>
        </div>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">¿Cómo funciona?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SKILLS.map((sk) => {
              const Icon = ICONS[sk];
              return (
                <div key={sk} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Icon className="text-purple-500" size={22} />
                  <div>
                    <p className="font-medium text-sm">{SKILL_LABELS[sk]}</p>
                    <p className="text-xs text-gray-500">{DIAGNOSTIC_QUESTIONS[sk].length} preguntas</p>
                  </div>
                </div>
              );
            })}
          </div>
          {user.diagnostic && (
            <div className="mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30">
              <p className="text-sm">
                <span className="font-medium">Tu último diagnóstico:</span>{" "}
                Nivel general {user.diagnostic.overallLevel}
              </p>
            </div>
          )}
          <Button className="mt-5" onClick={start}>Comenzar diagnóstico <ArrowRight size={16} /></Button>
        </Card>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="text-purple-500" /> Tu diagnóstico
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Nivel general: <span className="font-semibold text-purple-600">{results.overallLevel}</span>
          </p>
        </div>
        <Card className="p-6">
          <div className="grid sm:grid-cols-2 gap-3">
            {SKILLS.map((sk) => {
              const Icon = ICONS[sk];
              const r = results.bySkill[sk];
              const isWeakest = results.weakest === sk;
              const isStrongest = results.strongest === sk;
              return (
                <div key={sk} className={`p-3 rounded-xl border ${isWeakest ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20" : isStrongest ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-gray-700"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 font-medium text-sm"><Icon size={16} /> {SKILL_LABELS[sk]}</span>
                    <span className="text-xs font-bold text-purple-600">{r.level}</span>
                  </div>
                  <ProgressBar value={r.correct} max={r.total} color="purple" />
                  <p className="text-xs text-gray-500 mt-1">{r.correct}/{r.total} correctas</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30">
            <h3 className="font-semibold text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Cómo interpretarlo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Tu habilidad más débil es <strong>{SKILL_LABELS[results.weakest]}</strong> y la más fuerte es{" "}
              <strong>{SKILL_LABELS[results.strongest]}</strong>. Para aprobar un examen oficial de nivel{" "}
              {results.overallLevel} con confianza, entrena todas las habilidades hasta ese nivel.
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={reset}><RotateCcw size={16} /> Repetir</Button>
            <Link to="/learn"><Button>Ir a estudiar <ArrowRight size={16} /></Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="text-purple-500" /> Diagnóstico
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {SKILL_LABELS[skill]} · Pregunta {step + 1} de {questions.length}
        </p>
        <ProgressBar value={step + 1} max={questions.length} color="purple" />
      </div>
      <Card className="p-6">
        <p className="text-lg font-medium">{q.prompt}</p>
        <div className="mt-5 space-y-2">
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => answer(q, option)}
              className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
            >
              {option}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
