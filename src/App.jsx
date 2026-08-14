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
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
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
            <RotateCw size={20} className="text-indigo-400" />
            <div>
              <p className="text-sm font-medium">Nueva versión disponible</p>
              <p className="text-xs text-gray-400">
                Actualiza para ver los últimos cambios
              </p>
            </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
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
  const [focusedField, setFocusedField] = React.useState(null);
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

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-800 via-indigo-600 to-violet-600">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-violet-400/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-violet-300/20 blur-2xl" />
        <div className="relative z-10 max-w-lg w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              LinGoXiC
            </h1>
            <p className="text-xl text-indigo-100 font-light">
              Prepárate para las Pruebas Nacionales de Inglés del MEP con IA
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-indigo-100 dark:border-gray-700 space-y-5 text-left">
            <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
              🎯 ¿Qué vas a encontrar?
            </h2>
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                ),
                label: "Test de diagnóstico",
                desc: "para conocer tu nivel exacto (A1-B2)",
                color: "#0EA5E9",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                ),
                label: "6 escenarios temáticos",
                desc: "alineados con el examen MEP",
                color: "#10B981",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="16" r="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                label: "Tutor IA con Gemini",
                desc: "feedback personalizado",
                color: "#0EA5E9",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                label: "Simulacro completo",
                desc: "100 preguntas tipo examen",
                color: "#8B5CF6",
              },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: f.color + "1A", color: f.color }}
                >
                  {f.icon}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-indigo-700 dark:text-indigo-300">{f.label}</strong> {f.desc}
                </span>
              </div>
            ))}
            <button
              onClick={() => setStep("name")}
              className="w-full h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg, #4F46E5, #8B5CF6)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.45)",
              }}
            >
              Comenzar ahora →
            </button>

          </div>
        </div>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-800 via-indigo-600 to-violet-600">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-400/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => setStep("welcome")}
            className="mb-6 flex items-center gap-2 text-sm text-indigo-100 hover:text-white transition-colors"
          >
            ← Volver
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-indigo-100 dark:border-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              ¿Cómo te llamas?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4">
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
                className="w-full h-12 rounded-xl px-4 text-sm font-medium text-gray-800 dark:text-gray-100 outline-none transition-all bg-gray-50 dark:bg-gray-700 border"
                style={{ borderColor: focusedField === "name" ? "#4F46E5" : "#E5E7EB", boxShadow: focusedField === "name" ? "0 0 0 3px rgba(79,70,229,0.15)" : "none" }}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
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
                className="w-full h-12 rounded-xl px-4 text-sm font-medium text-gray-800 dark:text-gray-100 outline-none transition-all bg-gray-50 dark:bg-gray-700 border"
                style={{ borderColor: focusedField === "code" ? "#4F46E5" : "#E5E7EB", boxShadow: focusedField === "code" ? "0 0 0 3px rgba(79,70,229,0.15)" : "none" }}
                onFocus={() => setFocusedField("code")}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => e.key === "Enter" && goToTest()}
              />
              {codeError && (
                <p className="text-sm text-red-500">{codeError}</p>
              )}
            </div>
            <button
              onClick={goToTest}
              disabled={!name.trim() || !accessCode.trim()}
              className="w-full h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(90deg, #4F46E5, #8B5CF6)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.45)",
              }}
            >
              Hacer test de diagnóstico
            </button>
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
  }
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
