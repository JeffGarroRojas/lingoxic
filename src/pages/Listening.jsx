import { useState, useEffect, useRef } from "react";
import listeningExercises from "../data/listeningData.js";
import { Card, Button } from "../components/ui.jsx";
import { useActivityGuard } from "../hooks/useActivityGuard.jsx";
import { speak, stop } from "../utils/tts.js";
import { Volume2, Check, X } from "lucide-react";

function friendlyTitle(id) {
  const map = {
    "high-tech-shopping-listening-1": "Compras tecnológicas",
    "healthy-choices-listening-1": "Vida saludable",
    "safe-travels-listening-1": "Viajes seguros",
    "my-profile-listening-1": "Mi perfil — Presentación",
    "my-profile-listening-2": "Mi perfil — Rutina diaria",
    "cultural-variety-listening-1": "Cultural — Festival",
    "cultural-variety-listening-2": "Cultural — Comidas típicas",
    "careers-listening-1": "Trabajo — Entrevista",
    "careers-listening-2": "Trabajo — Día laboral",
    "global-competence-listening-1": "Global — Aeropuerto",
    "global-competence-listening-2": "Global — Indicaciones",
  };
  return map[id] || id;
}

export default function Listening() {
  const exercises = listeningExercises;
  const [selectedId, setSelectedId] = useState(exercises[0]?.lessonId || "");
  const exercise = exercises.find((e) => e.lessonId === selectedId) || exercises[0];
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useActivityGuard(isPlaying);

  useEffect(() => {
    setAnswers({});
    setChecked(false);
    setAudioError(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !exercise?.audioUrl) return;
    audio.src = exercise.audioUrl;
    audio.load();
  }, [exercise?.audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    setAudioError(null);
    try {
      if (audio.readyState < 2) {
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            resolve();
          };
          const onError = () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            reject(new Error("load failed"));
          };
          audio.addEventListener("canplay", onCanPlay);
          audio.addEventListener("error", onError);
          audio.load();
        });
      }
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      if (e.name === "NotAllowedError") {
        setAudioError("Tocá Escuchar de nuevo para reproducir (el navegador bloqueó el autoplay).");
      } else {
        setAudioError("No se pudo reproducir el audio. Verificá tu conexión o probá en Chrome.");
      }
      setIsPlaying(false);
    }
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setAudioError("Error al cargar el audio. Probá en Chrome o verifica tu conexión. Usando voz del sistema como respaldo.");
  };

  const fallbackSpeak = () => {
    stop();
    speak(exercise.script, {
      onEnd: () => {},
      onError: () => setAudioError("Error de audio. Probá en Chrome o instala voces."),
    });
  };

  const selectAnswer = (qId, opt) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  if (!exercise) return <div className="p-8 text-center">No hay ejercicios</div>;

  const totalQuestions = exercise.questions?.length || 0;
  const allAnswered =
    totalQuestions > 0 &&
    exercise.questions.every((q) => answers[q.id] !== undefined);
  const correctCount = (exercise.questions || []).filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Volume2 size={24} className="text-teal-700" /> Listening
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {exercises.map((ex) => (
          <button
            key={ex.lessonId}
            onClick={() => setSelectedId(ex.lessonId)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
              ex.lessonId === selectedId
                ? "bg-teal-700 text-white border-teal-700"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            {friendlyTitle(ex.lessonId)}
          </button>
        ))}
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Button onClick={togglePlay} className="gap-2">
            <Volume2 size={16} /> {isPlaying ? "Pausar" : "Escuchar"}
          </Button>
          <span className="text-sm text-gray-500">{friendlyTitle(exercise.lessonId)}</span>
        </div>

        <audio
          ref={audioRef}
          preload="metadata"
          onLoadedData={() => setAudioError(null)}
          onCanPlay={() => setAudioError(null)}
          onEnded={() => setIsPlaying(false)}
          onError={handleAudioError}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="w-full"
          controls
        />

        {audioError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded p-2 space-y-2">
            <p>{audioError}</p>
            <Button variant="ghost" size="sm" onClick={fallbackSpeak} className="gap-2">
              <Volume2 size={14} /> Probar voz del sistema
            </Button>
          </div>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer text-teal-700 dark:text-teal-500">Ver transcripción</summary>
          <p className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 leading-relaxed">
            {exercise.script}
          </p>
        </details>
      </Card>

      <div className="space-y-3">
        {exercise.questions?.map((q) => (
          <div key={q.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900/40">
            <p className="font-medium text-sm mb-2">{q.prompt || q.question}</p>
            <div className="space-y-1">
              {q.options?.map((opt) => {
                const selected = answers[q.id] === opt;
                const correct = checked && q.correctAnswer === opt;
                const wrong = checked && selected && !correct;
                return (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(q.id, opt)}
                    className={`w-full text-left px-3 py-2 rounded border text-sm flex items-center justify-between ${
                      correct
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : wrong
                        ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        : selected
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <span>{opt}</span>
                    {checked && correct && <Check size={16} className="text-green-600" />}
                    {wrong && <X size={16} className="text-red-600" />}
                  </button>
                );
              })}
            </div>
            {checked && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setChecked(true)} disabled={checked || !allAnswered} className="flex-1">
          {checked ? `${correctCount}/${totalQuestions} correctas` : "Verificar"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setAnswers({});
            setChecked(false);
          }}
          className="flex-1"
        >
          Reiniciar
        </Button>
      </div>
    </div>
  );
}
