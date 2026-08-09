import { useEffect, useState } from "react";
import { PenTool, Send, Sparkles } from "lucide-react";
import { useUser } from "../hooks/useUser.jsx";
import { Card, Button, EmptyState } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { correctWriting, getRemainingRequests, getAILimitInfo } from "../services/gemini.js";
import useOnlineStatus from "../hooks/useOnlineStatus.js";

export default function Writing() {
  const { user } = useUser();
  const [selectedUnit, setSelectedUnit] = useState(unitsData[0].id);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(15);
 const [resetLabel, setResetLabel] = useState("");
 const isOnline = useOnlineStatus();

  useEffect(() => {
    getRemainingRequests().then(setRemaining);
  }, []);

  const unit = unitsData.find((u) => u.id === selectedUnit);
  if (!user) return null;

 const submit = async () => {
 if (!text.trim()) return;
 setLoading(true);
 const result = await correctWriting(text, user.level);
 if (result && result.startsWith("LÍMITE")) {
   const info = await getAILimitInfo();
   setFeedback(`Agotaste los usos de IA de hoy. Se renueva a las ${info.resetLabel}.`);
   setResetLabel(info.resetLabel);
 } else {
   setFeedback(result);
 }
 setLoading(false);
 };

  const writingLesson = unit?.lessons.find((l) => l.type === "writing");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PenTool className="text-pink-500" /> Writing Practice
        </h1>
        <p className="text-gray-500">Escribe en inglés y recibe feedback con IA</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {unitsData.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnit(u.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedUnit === u.id
                ? `bg-gradient-to-r from-sky-500 to-emerald-500 text-white`
                : `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`
            }`}
          >
            {u.title}
          </button>
        ))}
      </div>

      {writingLesson ? (
        <Card>
          <h3 className="font-semibold mb-2">{writingLesson.title}</h3>
          <p className="text-sm text-gray-500">{writingLesson.description}</p>
        </Card>
      ) : (
        <EmptyState
          icon={<PenTool size={48} />}
          title="No hay lección de escritura"
          description="La unidad seleccionada no tiene una lección de escritura. Selecciona otra unidad que incluya práctica de writing."
        />
      )}

      <Card>
        <label className="font-semibold block mb-2">
          Escribe tu texto en inglés:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe al menos 3-4 oraciones en inglés sobre el tema de la unidad..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Sparkles size={12} /> Feedback IA: {remaining} solicitudes restantes
          </span>
          <Button onClick={submit} disabled={loading || !text.trim() || !isOnline}>
            {loading ? (
              `Analizando...`
            ) : (
              <>
                <Send size={16} /> Enviar para feedback
              </>
            )}
          </Button>
        </div>
      </Card>

      {feedback && (
        <Card>
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-purple-500 mt-0.5 shrink-0" />
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {feedback}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
