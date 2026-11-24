import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Info, Moon, Palette, RefreshCw, Settings, Sparkles, Sun, Trash2, User } from "lucide-react";
import { Button, Card } from "../components/ui.jsx";
import { useTheme } from "../hooks/useTheme.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { getRemainingRequests } from "../services/gemini.js";
import { isFirebaseEnabled } from "../services/firebase.js";

export default function SettingsPage() {
  const { user, resetProgress } = useUser();
  const { darkMode, toggleDarkMode } = useTheme();
  const [requests, setRequests] = useState(20);

  useEffect(() => {
    getRemainingRequests().then(setRequests);
  }, []);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="text-gray-500" /> Ajustes
        </h1>
        <p className="text-gray-500">Configura tu experiencia en LinGoXiC</p>
      </div>

      <Card>
        <h2 className="mb-4 flex items-center gap-2 font-semibold"><User size={18} className="text-teal-600" /> Perfil</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Nombre</span>
            <span className="font-medium">{user.name}</span>
          </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Nivel actual</span>
        <span className="font-medium">{user.level}</span> </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Nivel diagnóstico CEFR</span>
        <span className="font-medium">{user.diagnostic ? user.diagnostic.overallLevel : "Sin evaluar"}</span> </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">XP total</span>
            <span className="font-medium">{user.xp} XP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Lecciones completadas</span>
            <span className="font-medium">{user.completedLessons.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Sincronización en la nube</span>
            <span className={`text-sm font-medium ${isFirebaseEnabled ? "text-green-600" : "text-gray-400"}`}>
              {isFirebaseEnabled ? "Activa" : "Solo local"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Racha actual</span>
            <span className="font-medium">{user.streak} {user.streak === 1 ? "día" : "días"}</span>
          </div>
        </div>
      </Card>

      {user.level === "B2" && !user.diagnostic && (
        <Card>
          <h2 className="font-semibold mb-2">Nivel B2 pendiente de validación</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tu XP te permite estar en B2, pero para que tu nivel sea creíble ante un examen oficial
            (certificado CEFR), completa el diagnóstico y alcanza B2 en al menos 5 de 6 habilidades.
          </p>
          <Link to="/diagnostic">
            <Button className="w-full">Hacer diagnóstico <ArrowRight size={16} /></Button>
          </Link>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 flex items-center gap-2 font-semibold"><Palette size={18} className="text-teal-600" /> Apariencia</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm">{darkMode ? `Modo Oscuro` : `Modo Claro`}</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? `bg-teal-600` : `bg-gray-300`}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? `translate-x-6` : `translate-x-0.5`}`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-teal-600" /> Gemini IA
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Solicitudes restantes hoy</span>
            <span className="font-medium">{requests} / 20</span>
          </div>
          <p className="text-xs text-gray-400">
            Las funcionalidades IA incluyen: feedback en writing, corrección de speaking, y
            generación de ejercicios personalizados.
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Info size={18} className="text-teal-600" /> Acerca de
        </h2>
        <div className="space-y-2 text-sm text-gray-500">
          <p>
            <strong>LinGoXiC</strong> v1.0.0
          </p>
          <p>
            App educativa para preparar las Pruebas Nacionales Estandarizadas de Inglés del MEP
            (Costa Rica).
          </p>
          <p>Basada en el MCER (A1-B2) y los 7 escenarios temáticos oficiales.</p>
          <p className="pt-2 text-xs">
            Datos almacenados localmente en tu dispositivo. Con tecnología de Gemini Flash Lite.
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4 text-red-500 flex items-center gap-2">
          <Trash2 size={18} /> Zona de peligro
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Esto reiniciará todo tu progreso. No se puede deshacer.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            confirm(`¿Estás seguro? Todo tu progreso se eliminará.`) && resetProgress();
          }}
        >
          <RefreshCw size={16} /> Reiniciar progreso
        </Button>
      </Card>
    </div>
  );
}
