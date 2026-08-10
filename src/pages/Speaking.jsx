import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  MessageSquare,
  Mic,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { Badge, Button, Card, SkillBadge } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import { getSpeakingExercise } from "../data/speakingData.js";
import { useUser } from "../hooks/useUser.jsx";
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import {
  chatWithTutor,
  evaluateSpeaking,
  getRemainingRequests,
  getAILimitInfo,
} from "../services/gemini.js";

function SpeakingLesson({ lesson, quiz, isCompleted, onComplete, onAddXP }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const selectAnswer = (questionId, option) => {
    checked || setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const verify = () => {
    setChecked(true);
  };

  const markComplete = () => {
    setCompleted(true);
    onComplete();
    onAddXP();
  };

  const correctCount = quiz
    ? quiz.questions.filter((q) =>
        (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]).includes(
          answers[q.id]
        )
      ).length
    : 0;
  const allCorrect = quiz ? correctCount === quiz.questions.length : false;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <SkillBadge skill="speaking" />
          {completed && <Badge variant="success">Completado</Badge>}
        </div>
        <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{lesson.description}</p>
        {lesson.content.sections.map((section, i) => {
          switch (section.type) {
            case "explanation":
              return (
                <div key={i} className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  {section.title && (
                    <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              );
            case "example":
              return (
                <div key={i} className="mb-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                  {section.title && (
                    <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {section.content}
                  </p>
                  {section.examples?.map((ex, ei) => (
                    <p
                      key={ei}
                      className="text-sm text-gray-600 dark:text-gray-400 mt-1 pl-3 border-l-2 border-sky-300"
                    >
                      🗣️ {ex}
                    </p>
                  ))}
                </div>
              );
            case "tip":
              return (
                <div
                  key={i}
                  className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                >
                  {section.title && (
                    <h4 className="font-medium text-sm mb-1">💡 {section.title}</h4>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {section.content}
                  </p>
                </div>
              );
            case "exercise":
              return (
                <div key={i} className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  {section.title && (
                    <h4 className="font-medium text-sm mb-2">✏️ {section.title}</h4>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {section.content}
                  </p>
                </div>
              );
            default:
              return null;
          }
        })}
      </Card>

      {quiz && (
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare size={18} className="text-sky-500" /> Comprensión oral
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Elige la mejor respuesta para cada situación
          </p>
          <div className="space-y-4">
            {quiz.questions.map((q, qi) => (
              <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-sm font-medium mb-3">
                  {qi + 1}. {q.prompt}
                </p>
                <div className="space-y-2">
                  {q.options.map((option) => {
                    const selected = answers[q.id] === option;
                    const correct =
                      checked &&
                      (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer])
                        .includes(option);
                    let borderClass = `border-gray-200 dark:border-gray-600`;
                    if (selected && !checked) borderClass = `border-sky-500`;
                    if (checked && correct)
                      borderClass = `border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20`;
                    if (checked && selected && !correct)
                      borderClass = `border-red-500 bg-red-50 dark:bg-red-900/20`;
                    return (
                      <button
                        key={option}
                        onClick={() => selectAnswer(q.id, option)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${borderClass} ${
                          checked ? `cursor-default` : `hover:border-sky-300 cursor-pointer`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {checked && correct && (
                            <Check size={16} className="text-emerald-500 shrink-0" />
                          )}
                          {checked && selected && !correct && (
                            <X size={16} className="text-red-500 shrink-0" />
                          )}
                          <span className={selected && !checked ? `font-medium` : ``}>
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {checked && <p className="text-xs mt-2 text-gray-500">{q.explanation}</p>}
              </div>
            ))}
          </div>
          {!checked && (
            <Button
              className="mt-4"
              onClick={verify}
              disabled={quiz.questions.some((q) => !answers[q.id])}
            >
              Verificar respuestas
            </Button>
          )}
          {checked && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant={allCorrect ? `success` : `info`}>
                {correctCount}/{quiz.questions.length} correctas
              </Badge>
              {!completed && (
                <Button size="sm" onClick={markComplete}>
                  Marcar como completado (+50 XP)
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {!quiz && !completed && (
        <Button onClick={markComplete} className="w-full">
          Marcar como completado (+50 XP)
        </Button>
      )}
    </div>
  );
}

function Conversation({ lesson, userLevel }) {
  const [messages, setMessages] = useState([]);
  const isOnline = useOnlineStatus();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(15);
  const endRef = useRef(null);

  useEffect(() => {
    getRemainingRequests().then(setRemaining);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: `smooth` });
  }, [messages]);

  const topic = lesson.title;

  const start = async () => {
    setStarted(true);
    setLoading(true);
    setError("");
    let result = await chatWithTutor("", topic, userLevel, [], 1);
    if (result.startsWith(`LÍMITE`) || result === `ERROR_RED`) {
      setError(result);
      setLoading(false);
      return;
    }
    setMessages([{ role: `assistant`, content: result }]);
    setCount(1);
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    const updated = [...messages, { role: `user`, content: text }];
    setMessages(updated);
    setLoading(true);
    setError("");
    const next = count + 1;
    let result = await chatWithTutor(text, topic, userLevel, updated, next);
    if (result.startsWith(`LÍMITE`) || result === `ERROR_RED`) {
      setError(result);
      setLoading(false);
      return;
    }
    setMessages([...updated, { role: `assistant`, content: result }]);
    setCount(next);
    setLoading(false);
  };

  return (
    <Card>
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <MessageSquare size={18} className="text-sky-500" /> Conversación simulada
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Tema: <strong>{topic}</strong> — La IA actúa como tu interlocutor. Responde
        en inglés.
        {remaining > 0 && (
          <span className="ml-2 text-xs text-gray-400">
            ({remaining} solicitudes restantes)
          </span>
        )}
      </p>

      {started ? (
        <div className="space-y-4">
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === `user` ? `justify-end` : `justify-start`}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.role === `user`
                      ? `bg-sky-500 text-white rounded-br-md`
                      : `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md`
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-400">
                  <span className="animate-pulse">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === `Enter` && send()}
              placeholder="Escribe tu respuesta en inglés..."
              disabled={loading || count >= 5}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
            />
            <Button onClick={send} disabled={!input.trim() || loading || !isOnline || count >= 5}>
              <Send size={16} />
            </Button>
          </div>

          {count >= 5 && !loading && (
            <div className="flex items-center gap-2">
              <Badge variant="info">Conversación completada</Badge>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setMessages([]);
                  setCount(0);
                  setStarted(false);
                  setInput("");
                  setError("");
                }}
              >
                <RefreshCw size={14} /> Nueva conversación
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={start} disabled={loading || !isOnline}>
          <Play size={16} /> Iniciar conversación
        </Button>
      )}
    </Card>
  );
}

function VoiceRecorder({ userLevel }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const [remaining, setRemaining] = useState(15);
  const recognitionRef = useRef(null);

  useEffect(() => {
    getRemainingRequests().then(setRemaining);
    setSupported(`webkitSpeechRecognition` in window || `SpeechRecognition` in window);
    return () => {
      recognitionRef.current && (recognitionRef.current.abort(), (recognitionRef.current = null));
    };
  }, []);

  return (
    <Card>
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Mic size={18} className="text-sky-500" /> Graba tu voz
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Habla en inglés y recibe feedback con IA sobre tu pronunciación, gramática y
        vocabulario.
      </p>

      {!supported && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 mb-4">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-medium">Reconocimiento de voz no disponible</p>
            <p>Usa Chrome o Edge en tu computadora o celular para esta función.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {recording ? (
          <Button
            onClick={() => {
              recognitionRef.current && (recognitionRef.current.stop(), (recognitionRef.current = null));
              setRecording(false);
              setInterim("");
            }}
            variant="danger"
          >
            <Square size={16} /> Detener
          </Button>
        ) : (
          <Button
            onClick={() => {
              setError("");
              setTranscript("");
              setInterim("");
              setFeedback("");
              const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
              if (!SR) {
                setSupported(false);
                return;
              }
              const rec = new SR();
              rec.lang = `en-US`;
              rec.continuous = false;
              rec.interimResults = true;
              rec.maxAlternatives = 1;
              rec.onresult = (e) => {
                let final = ``;
                let interim = ``;
                for (let i = e.resultIndex; i < e.results.length; i++) {
                  const res = e.results[i];
                  if (res.isFinal) final += res[0].transcript + ` `;
                  else interim += res[0].transcript;
                }
                if (final) setTranscript((prev) => prev + final);
                setInterim(interim);
              };
              rec.onerror = (e) => {
                console.error(`Speech error:`, e.error);
                setRecording(false);
                if (e.error === `not-allowed`)
                  setError(
                    `Permiso de micrófono denegado. Permite el acceso en la configuración de tu navegador.`
                  );
                else if (e.error === `no-speech`)
                  setError(`No se detectó voz. Intenta hablar más alto o verifica tu micrófono.`);
                else setError(`Error: ${e.error}. Intenta de nuevo.`);
              };
              rec.onend = () => {
                setRecording(false);
                setInterim("");
              };
              try {
                rec.start();
                recognitionRef.current = rec;
                setRecording(true);
              } catch {
                setError(`No se pudo iniciar el reconocimiento de voz.`);
              }
            }}
            disabled={!supported}
          >
            <Mic size={16} /> Grabar
          </Button>
        )}

        {recording && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-500">Grabando...</span>
            {interim && <span className="text-sm text-gray-400 italic">"{interim}"</span>}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!supported && !transcript && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Escribe tu respuesta en inglés:</p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Escribe lo que dirías en una conversación..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
      )}

      {transcript && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm font-medium">Lo que dijiste:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{transcript}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles size={12} /> Feedback IA: {remaining} solicitudes restantes
            </span>
            <Button
              onClick={async () => {
                if (transcript.trim()) {
                  setLoading(true);
                  setFeedback(await evaluateSpeaking(transcript, `general`, userLevel));
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {loading ? (
                `Analizando...`
              ) : (
                <>
                  <Sparkles size={16} /> Obtener feedback
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-sky-500 mt-0.5 shrink-0" />
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{feedback}</div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Speaking() {
  const { user, completeLesson, addXP } = useUser();
  const [selectedUnit, setSelectedUnit] = useState(unitsData[0]?.id || `my-profile`);
  const [mode, setMode] = useState(`learn`);
  const speakingLessons =
    unitsData.find((u) => u.id === selectedUnit)?.lessons.filter(
      (l) => l.type === `speaking`
    ) || [];
  const [selectedLesson, setSelectedLesson] = useState(speakingLessons[0]?.id || ``);

  useEffect(() => {
    if (speakingLessons.length > 0 && !speakingLessons.find((l) => l.id === selectedLesson))
      setSelectedLesson(speakingLessons[0].id);
  }, [selectedUnit, speakingLessons, selectedLesson]);

  if (!user) return null;

  const lesson = speakingLessons.find((l) => l.id === selectedLesson);
  const exercise = lesson ? getSpeakingExercise(lesson.id) : undefined;
  const isCompleted = lesson ? user.completedLessons.includes(lesson.id) : false;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="text-sky-500" /> Conversación
        </h1>
        <p className="text-gray-500">
          Practica tu expresión oral con lecciones, conversaciones simuladas y feedback
          con IA
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {unitsData.map((u) => (
          <button
            key={u.id}
            onClick={() => {
              setSelectedUnit(u.id);
              setMode(`learn`);
            }}
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

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[
          { id: `learn`, label: `Aprender`, icon: BookOpen },
          { id: `converse`, label: `Conversar`, icon: MessageSquare },
          { id: `record`, label: `Grabar`, icon: Mic },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === tab.id
                ? `bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-400 shadow-sm`
                : `text-gray-500`
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {speakingLessons.length > 0 && mode !== `record` && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {speakingLessons.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLesson(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                selectedLesson === l.id
                  ? `bg-sky-500 text-white`
                  : `bg-gray-100 dark:bg-gray-800 text-gray-600`
              }`}
            >
              {l.title}
            </button>
          ))}
        </div>
      )}

      {mode === `learn` && lesson && (
        <SpeakingLesson
          lesson={lesson}
          quiz={exercise}
          isCompleted={isCompleted}
          onComplete={() => completeLesson(lesson.id)}
          onAddXP={() => addXP(50)}
        />
      )}
      {mode === `learn` && !lesson && (
        <p className="text-sm text-gray-400 text-center py-8">
          No hay guías de conversación en esta unidad.
        </p>
      )}

      {mode === `converse` && lesson && <Conversation lesson={lesson} userLevel={user.level} />}
      {mode === `converse` && !lesson && (
        <p className="text-sm text-gray-400 text-center py-8">
          Selecciona una unidad con guía de conversación para practicar.
        </p>
      )}

      {mode === `record` && <VoiceRecorder userLevel={user.level} />}
    </div>
  );
}
