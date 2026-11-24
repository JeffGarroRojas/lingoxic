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
import { RotateCw, X } from "lucide-react";
import { UserProvider, useUser } from "./hooks/useUser.jsx";
import { registerEntry } from "./services/firebase.js";
import { forceUpdate, checkForUpdate } from "./utils/appUpdate.js";
import { ThemeProvider, useTheme } from "./hooks/useTheme.jsx";
import { Button, ProgressBar } from "./components/ui.jsx";
import Layout from "./components/Layout.jsx";
import {
  computePlacementTest,
  PLACEMENT_QUESTIONS,
} from "./data/practiceData.js";
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
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
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
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
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
  const { needRefresh: [needRefresh, setNeedRefresh] } = useRegisterSW();
  const dismiss = React.useCallback(() => setNeedRefresh(false), [setNeedRefresh]);

  const handleUpdate = React.useCallback(async () => {
    const busy = window.__lingoxicBusy;
    if (busy && busy.pending) {
      if (!window.confirm("Tienes una actividad en curso (quiz, examen o diagnóstico) que se reiniciará al actualizar. ¿Quieres continuar?")) return;
    }
    await forceUpdate();
  }, []);

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
            <RotateCw size={20} className="text-teal-500" />
            <div>
              <p className="text-sm font-medium">Nueva versión disponible</p>
              <p className="text-xs text-gray-400">
                Actualiza para ver los últimos cambios
              </p>
            </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
        >
          Actualizar
        </button>
            <button
              onClick={dismiss}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
              aria-label="Cerrar aviso"
            >
              <X size={16} />
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
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState({});

  const goToDashboard = async () => {
    if (!name.trim()) return;
    await createUser(name.trim(), "A1");
    navigate("/dashboard");
  };

  const finishTest = async (newAnswers) => {
    const lvl = (computePlacementTest(newAnswers).level || "A1");
    await createUser(name.trim(), lvl);
    navigate("/dashboard");
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-700 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="bg-white rounded-3xl p-3 shadow-lg ring-2 ring-teal-200 border border-teal-50 inline-block">
            <img src="/icons/logo-mark.svg" alt="LinGoXiC" className="h-28 w-28 object-contain" width="112" height="112" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido a LinGoXiC</h1>
          <p className="text-gray-600 dark:text-gray-300">Aprende inglés con IA — niveles A1 a B2</p>
          <Button onClick={() => setStep("name")} className="w-full">Comenzar</Button>
        </div>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-700 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">¿Cómo te llamas?</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep("welcome")} className="flex-1">Atrás</Button>
            <Button onClick={() => setStep("choice")} disabled={!name.trim()} className="flex-1">Continuar</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "choice") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-700 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">¿Cómo quieres empezar?</h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Elige una opción para personalizar tu nivel</p>
          <div className="space-y-3">
            <Button onClick={() => { setCurrent(0); setAnswers({}); setStep("test"); }} className="w-full">
              Hacer diagnóstico — evalúa tu nivel (A1–B2)
            </Button>
            <Button variant="ghost" onClick={goToDashboard} className="w-full">
              Empezar desde cero (A1)
            </Button>
          </div>
          <Button variant="ghost" onClick={() => setStep("name")} className="w-full">Atrás</Button>
        </div>
      </div>
    );
  }

  // step === "test"
  const q = PLACEMENT_QUESTIONS[current];
  const progress = ((current + 1) / PLACEMENT_QUESTIONS.length) * 100;
  if (!q) return <div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">No hay preguntas disponibles</div></div>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-700 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-4">
        <ProgressBar value={current + 1} max={PLACEMENT_QUESTIONS.length} />
        <h3 className="font-semibold text-gray-800 dark:text-white">{q.prompt || q.question}</h3>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                const next = { ...answers, [q.id]: i };
                setAnswers(next);
                if (current + 1 < PLACEMENT_QUESTIONS.length) setCurrent((c) => c + 1);
                else finishTest(next);
              }}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            >
              {opt}
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={goToDashboard} className="w-full">Omitir y empezar en A1</Button>
      </div>
    </div>
  );
}


  function App() {
  const { user, initialized, loadUser, updateStreak } = useUser();
  const { darkMode } = useTheme();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!user?.id) return;
    updateStreak();
    // Una entrada por sesión de navegador (no en cada recarga interna).
    const key = `lingoxic_entry_${user.id}`;
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        registerEntry(user);
      }
    } catch {
      registerEntry(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloaded = false;

    const onControllerChange = () => {
      // Primera instalación: no recargar. Actualizaciones: recargar una vez,
      // salvo que haya un quiz/examen en curso.
      if (!hadController || reloaded) return;
      if (window.__lingoxicBusy?.pending) return;
      reloaded = true;
      window.location.reload();
    };

    const tick = () => {
      if (document.visibilityState === "visible") checkForUpdate();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    const timer = setInterval(tick, 30 * 60 * 1000);
    tick();

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
