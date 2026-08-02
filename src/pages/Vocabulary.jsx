import { useState } from "react";
import { Search, SpellCheck, Volume1, Volume2 } from "lucide-react";
import { Card } from "../components/ui.jsx";
import unitsData from "../data/unitsData.js";
import vocabularyBanks from "../data/vocabularyData.js";
import { useUser } from "../hooks/useUser.jsx";

export default function Vocabulary() {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [playing, setPlaying] = useState(null);

  function playWord(word) {
    setPlaying(word);
    let audio = new Audio(`/audio/vocabulary/${encodeURIComponent(word)}.mp3`);
    audio.onended = () => setPlaying(null);
    audio.onerror = () => {
      if ("speechSynthesis" in window) {
        let utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        utterance.onend = () => setPlaying(null);
        utterance.onerror = () => setPlaying(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPlaying(null);
      }
    };
    audio.play();
  }

  if (!user) return null;

  const words = vocabularyBanks
    .filter((bank) => filter === "all" || bank.unitId === filter)
    .flatMap((bank) => bank.words);
  const filtered = query
    ? words.filter(
        (w) =>
          w.word.toLowerCase().includes(query.toLowerCase()) ||
          w.translation.toLowerCase().includes(query.toLowerCase())
      )
    : words;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SpellCheck className="text-blue-500" /> Vocabulario
        </h1>
        <p className="text-gray-500">
          Bancos de vocabulario por unidad temática
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar palabra en inglés o español..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "all"
              ? `bg-gradient-to-r from-sky-500 to-emerald-500 text-white`
              : `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`
          }`}
        >
          Todas
        </button>
        {unitsData.map((u) => (
          <button
            key={u.id}
            onClick={() => setFilter(u.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filter === u.id
                ? `bg-gradient-to-r from-sky-500 to-emerald-500 text-white`
                : `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`
            }`}
          >
            {u.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((w, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{w.word}</h3>
                  <button
                    onClick={() => playWord(w.word)}
                    disabled={playing === w.word}
                    className={`p-1.5 rounded-lg transition-all ${
                      playing === w.word
                        ? `bg-sky-100 dark:bg-sky-900/30 text-sky-600 animate-pulse`
                        : `hover:bg-gray-100 dark:hover:bg-gray-700 text-sky-500`
                    }`}
                    title="Escuchar pronunciación"
                  >
                    {playing === w.word ? (
                      <Volume1 size={16} />
                    ) : (
                      <Volume2 size={14} />
                    )}
                  </button>
                </div>
                {w.phonetic && (
                  <p className="text-xs text-gray-400">{w.phonetic}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{w.translation}</p>
                <p className="text-xs text-gray-400 mt-1">{w.definition}</p>
                <p className="text-xs italic text-gray-500 mt-1">"{w.example}"</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          No se encontraron palabras
        </p>
      )}
    </div>
  );
}
