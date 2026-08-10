import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  BookText,
  PenTool,
  MessageSquare,
  SpellCheck,
  GraduationCap,
  BrainCircuit,
  ClipboardCheck,
  ChartColumn,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Flame,
  Zap,
} from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { useTheme } from "../hooks/useTheme.jsx";
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import { LevelBadge } from "./ui.jsx";
import { streakEmoji } from "../utils/level.js";
import { buildReportMailto } from "../utils/reportBug.js";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { path: "/diagnostic", label: "Diagnóstico", icon: ClipboardCheck },
  { path: "/learn", label: "Aprender", icon: BookOpen },
  { path: "/listening", label: "Escucha", icon: Headphones },
  { path: "/reading", label: "Lectura", icon: BookText },
  { path: "/writing", label: "Escritura", icon: PenTool },
  { path: "/speaking", label: "Conversación", icon: MessageSquare },
  { path: "/vocabulary", label: "Vocabulario", icon: SpellCheck },
  { path: "/grammar", label: "Gramática", icon: GraduationCap },
  { path: "/practice", label: "Práctica Rápida", icon: BrainCircuit },
  { path: "/exam-sim", label: "Simulacro", icon: ClipboardCheck },
  { path: "/progress", label: "Progreso", icon: ChartColumn },
  { path: "/settings", label: "Ajustes", icon: Settings },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { darkMode, toggleDarkMode, sidebarOpen } = useTheme();
  const isOnline = useOnlineStatus();
  const [collapsed, setCollapsed] = useState(false);

  const go = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 flex flex-col ${
        collapsed ? `w-16` : `w-64`
      } ${sidebarOpen ? `translate-x-0` : `-translate-x-full`} lg:translate-x-0`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        {!collapsed && (
          <span className="text-lg font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
            LinGoXiC
          </span>
        )}
      </div>

      {user && !collapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <LevelBadge level={user.level} size="sm" />
          <p className="text-xs text-gray-500 mt-1">{user.xp} XP</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => go(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? `bg-gradient-to-r from-sky-500/10 to-emerald-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800`
                : `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{darkMode ? `Modo Claro` : `Modo Oscuro`}</span>}
        </button>
      </div>
    </aside>
  );
}

function Header({ onMenuClick }) {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-600 dark:text-gray-400"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <span className="text-lg font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
            LinGoXiC
          </span>
        </div>
        {user && (
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5 text-sm">
              <Flame size={16} className="text-orange-500" />
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {user.streak}
              </span>
              <span className="text-xs text-gray-400">
                {streakEmoji(user.streak)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Zap size={16} className="text-yellow-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {user.xp}
              </span>
              <span className="text-xs text-gray-400">XP</span>
            </div>
            <LevelBadge level={user.level} size="sm" />
          </div>
        )}
      </div>
    </header>
  );
}

export default function Layout() {
  const { sidebarOpen, setSidebarOpen } = useTheme();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          {!isOnline && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Sin conexión a internet. Las funciones que requieren IA (Writing, Speaking) no están disponibles hasta que vuelvas a conectarte.
            </div>
          )}
          <Outlet />
        </main>
        <a
          href={buildReportMailto({
            page: window.location.pathname,
            browser: navigator.userAgent,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          title="Reportar un error"
        >
          <span className="text-base">⚙</span>
          Reportar error
        </a>
      </div>
    </div>
  );
}
