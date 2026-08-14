import React, { Component, Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RotateCw } from "lucide-react";
import { UserProvider, useUser } from "./hooks/useUser.jsx";
import { ThemeProvider, useTheme } from "./hooks/useTheme.jsx";
import { Button, ProgressBar } from "./components/ui.jsx";
import Layout from "./components/Layout.jsx";
import {
  computePlacementTest,
  PLACEMENT_QUESTIONS,
} from "./data/practiceData.js";
import {
  isValidAccessCode,
  getAccessCodeType,
} from "./utils/accessCode.js";
import {
  registerUser,
  checkAccessBlocked,
  getDeviceId,
} from "./services/accessRegistry.js";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Diagnostic = lazy(() => import("./pages/Diagnostic.jsx"));
const Learn = lazy(() => import("./pages/Learn.jsx"));
const UnitDetail = lazy(() => import("./pages/UnitDetail.jsx"));
const LessonDetail = lazy(() => import("./pages/LessonDetail.jsx"));
const QuizPage = lazy(() => import("./pages/QuizPage.jsx"));
const Listening = lazy(() => import("./pages/Listening.jsx"));
const Reading = lazy(() => import("./pages/Reading.jsx"));
const Writing = lazy(() => import("./pages/Writing.jsx"));
const Speaking = lazy(() => import("./pages/Speaking.jsx"));
const Vocabulary = lazy(() => import("./pages/Vocabulary.jsx"));
const Grammar = lazy(() => import("./pages/Grammar.jsx"));
const Progress = lazy(() => import("./pages/Progress.jsx"));
const Practice = lazy(() => import("./pages/Practice.jsx"));
const ExamSim = lazy(() => import("./pages/ExamSim.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

function Loading({ text = "Cargando...", fullPage }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
  return fullPage ? (
    <div className="min-h-screen flex items-center justify-center">{spinner}</div>
  ) : (
    spinner
  );
}

function SuspenseFallback() {
  return <Loading text="Preparando contenido..." fullPage />;
}

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    return this.state.hasError
      ? this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Algo salió mal</h2>
              <p className="text-gray-500 text-sm">
                {this.state.error?.message || "Error inesperado"}
              </p>
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      : this.props.children;
  }
}

function UpdateToast() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } =
    useRegisterSW();
  const dismiss = React.useCallback(() => setNeedRefresh(false), [setNeedRefresh]);

  const handleUpdate = React.useCallback(() => {
    const busy = window.__lingoxicBusy;
    if (busy && busy.pending) {
      if (!window.confirm("Tienes una actividad en curso (quiz, examen o diagnóstico) que se reiniciará al actualizar. ¿Quieres continuar?")) return;
    }
    updateServiceWorker();
  }, [updateServiceWorker]);

  useEffect(() => {
    if (needRefresh) {
      const timer = setTimeout(dismiss, 30000);
      return () => clearTimeout(timer);
    }
  }, [needRefresh, dismiss]);

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="bg-gray-900 dark:bg-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-700">
            <RotateCw size={20} className="text-sky-400" />
            <div>
              <p className="text-sm font-medium">Nueva versión disponible</p>
              <p className="text-xs text-gray-400">
                Actualiza para ver los últimos cambios
              </p>
            </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
        >
          Actualizar
        </button>
            <button
              onClick={dismiss}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<SuspenseFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />
            <Route
              path="/diagnostic"
              element={
                <PageTransition>
                  <Diagnostic />
                </PageTransition>
              }
            />
            <Route
              path="/learn"
              element={
                <PageTransition>
                  <Learn />
                </PageTransition>
              }
            />
            <Route
              path="/unit/:unitId"
              element={
                <PageTransition>
                  <UnitDetail />
                </PageTransition>
              }
            />
            <Route
              path="/lesson/:unitId/:lessonId"
              element={
                <PageTransition>
                  <LessonDetail />
                </PageTransition>
              }
            />
            <Route
              path="/quiz/:unitId/:quizId"
              element={
                <PageTransition>
                  <QuizPage />
                </PageTransition>
              }
            />
            <Route
              path="/listening"
              element={
                <PageTransition>
                  <Listening />
                </PageTransition>
              }
            />
            <Route
              path="/reading"
              element={
                <PageTransition>
                  <Reading />
                </PageTransition>
              }
            />
            <Route
              path="/writing"
              element={
                <PageTransition>
                  <Writing />
                </PageTransition>
              }
            />
            <Route
              path="/speaking"
              element={
                <PageTransition>
                  <Speaking />
                </PageTransition>
              }
            />
            <Route
              path="/vocabulary"
              element={
                <PageTransition>
                  <Vocabulary />
                </PageTransition>
              }
            />
            <Route
              path="/grammar"
              element={
                <PageTransition>
                  <Grammar />
                </PageTransition>
              }
            />
            <Route
              path="/progress"
              element={
                <PageTransition>
                  <Progress />
                </PageTransition>
              }
            />
            <Route
              path="/practice"
              element={
                <PageTransition>
                  <Practice />
                </PageTransition>
              }
            />
            <Route
              path="/exam-sim"
              element={
                <PageTransition>
                  <ExamSim />
                </PageTransition>
              }
            />
            <Route
              path="/settings"
              element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const { createUser } = useUser();
  const [step, setStep] = React.useState("welcome");
  const [name, setName] = React.useState("");
  const [accessCode, setAccessCode] = React.useState("");
  const [codeError, setCodeError] = React.useState("");
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState({});

  const goToTest = async () => {
    if (!name.trim()) return;
    if (!isValidAccessCode(accessCode)) {
      setCodeError("Código de acceso incorrecto. Verifícalo e intenta de nuevo.");
      return;
    }
    const blocked = await checkAccessBlocked(accessCode);
    if (blocked.blocked) {
      setCodeError("Este código ya expiró. Contacta a tu academia.");
      return;
    }
    setCodeError("");
    setStep("test");
  };

  const answer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setCurrent((c) => (c < PLACEMENT_QUESTIONS.length - 1 ? c + 1 : c));
  };

  const finishTest = async () => {
    const level = computePlacementTest(answers).level || "A1";
    const blocked = await checkAccessBlocked(accessCode);
    if (blocked.blocked) {
      setCodeError("Este código ya expiró. Contacta a tu academia.");
      return;
    }
    await registerUser(name.trim(), accessCode);
    await createUser(name.trim(), level, "", accessCode.trim().toUpperCase());
    navigate("/dashboard");
  };

  const skipTest = async () => {
    if (!name.trim()) {
      setCodeError("Escribe tu nombre para continuar.");
      return;
    }
    if (!isValidAccessCode(accessCode)) {
      setCodeError("Código de acceso incorrecto. Verifícalo e intenta de nuevo.");
      return;
    }
    const blocked = await checkAccessBlocked(accessCode);
    if (blocked.blocked) {
      setCodeError("Este código ya expiró. Contacta a tu academia.");
      return;
    }
    await registerUser(name.trim(), accessCode);
    await createUser(name.trim(), "A1", "", accessCode.trim().toUpperCase());
    navigate("/dashboard");
  };

  if (step === "welcome")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-950 dark:via-violet-950 dark:to-indigo-950 p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              LinGoXiC
            </h1>
            <p className="text-xl text-indigo-100 font-light">
              Prepárate para las Pruebas Nacionales de Inglés del MEP con IA
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-indigo-100 dark:border-gray-700 space-y-4 text-left">
            <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">🎯 ¿Qué vas a encontrar?</h2>
            <ul className="space-y-3 text-sm text-indigo-900 dark:text-indigo-100">
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 mt-0.5">📝</span>
                <span>
                  <strong className="text-indigo-700 dark:text-indigo-300">Test de diagnóstico</strong> para conocer tu nivel
                  exacto (A1-B2)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-0.5">📚</span>
                <span>
                  <strong className="text-indigo-700 dark:text-indigo-300">6 escenarios temáticos</strong> alineados con el
                  examen MEP
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 mt-0.5">🤖</span>
                <span>
                  <strong className="text-indigo-700 dark:text-indigo-300">Tutor IA</strong> con Gemini para feedback
                  personalizado
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-0.5">📊</span>
                <span>
                  <strong className="text-indigo-700 dark:text-indigo-300">Simulacro completo</strong> de 100 preguntas tipo
                  examen
                </span>
              </li>
            </ul>
          </div>
          <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
              size="lg"
              onClick={() => setStep("name")}
            >
            Comenzar ahora
          </Button>
        </div>
      </div>
    );

  if (step === "name")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-950 dark:via-violet-950 dark:to-indigo-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-indigo-100 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">¿Cómo te llamas?</h2>
        <p className="text-indigo-700 dark:text-indigo-300 text-sm">
          Usaremos tu nombre para personalizar tu experiencia
        </p>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-indigo-700 dark:text-indigo-300">
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && goToTest()}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-indigo-700 dark:text-indigo-300">
            Código de acceso
          </label>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Ingresa tu código de acceso..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && goToTest()}
          />
          {codeError && (
            <p className="text-sm text-red-500">{codeError}</p>
          )}
        </div>
        <div className="space-y-3 pt-1">
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
            size="lg"
            onClick={goToTest}
            disabled={!name.trim() || !accessCode.trim()}
          >
            Hacer test de diagnóstico
          </Button>
          <button
            onClick={skipTest}
            className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Omitir test y empezar desde cero (A1)
          </button>
        </div>
        </div>
      </div>
    );

  const question = PLACEMENT_QUESTIONS[current];
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-950 dark:via-violet-950 dark:to-indigo-950 p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Test de Diagnóstico</h2>
          <p className="text-sm text-gray-500">
            Pregunta {current + 1} de {PLACEMENT_QUESTIONS.length}
          </p>
        </div>
        <ProgressBar value={current + 1} max={PLACEMENT_QUESTIONS.length} />
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {question.skillArea === "grammar"
                ? "Gramática"
                : question.skillArea === "vocabulary"
                  ? "Vocabulario"
                  : "Lectura"}
            </p>
            <p className="text-lg font-medium">{question.prompt}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => answer(question.id, option)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                  answers[question.id] === option
                    ? `border-sky-500 bg-sky-50 dark:bg-sky-900/20`
                    : `border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500`
                }`}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + idx)}.
                </span>{" "}
                {option}
              </button>
            ))}
          </div>
          {current === PLACEMENT_QUESTIONS.length - 1 && answers[question.id] && (
            <Button className="w-full" size="lg" onClick={finishTest}>
              Ver mi nivel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user, initialized, loadUser } = useUser();
  const { darkMode } = useTheme();
  const [blocked, setBlocked] = React.useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!user || !user.accessCode) return;
    (async () => {
      const result = await checkAccessBlocked(user.accessCode);
      setBlocked(result.blocked);
    })();
  }, [user]);

  if (blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <span className="text-5xl">🔒</span>
          <h1 className="text-xl font-bold">Acceso expirado</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tu código de acceso ya no es válido. Para seguir usando la app,
            contacta a tu academia para obtener un nuevo código.
          </p>
        </div>
      </div>
    );
  }

  if (!initialized) return <SuspenseFallback />;
  return user ? <AnimatedRoutes /> : <Onboarding />;
}

export default function Root() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ThemeProvider>
          <App />
          <UpdateToast />
        </ThemeProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}
