import { useState, useMemo, useEffect } from "react";
import vocabularyBanks from "../data/vocabularyData.js";
import unitsData from "../data/unitsData.js";
import { Card } from "../components/ui.jsx";
import { speak, stop, preloadVoices, hasVoices } from "../utils/tts.js";
import { Search, Volume2 } from "lucide-react";

const UNIT_TITLES = Object.fromEntries(unitsData.map((u) => [u.id, u.title]));

export default function Vocabulary() {
  const [query, setQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [ttsError, setTtsError] = useState(null);
  useEffect(() => () => { try{ stop(); }catch{} }, []);

  const allWords = useMemo(() => {
    return vocabularyBanks.flatMap((bank) =>
      (bank.words || []).map((w) => ({ ...w, unit: bank.unitId || bank.id }))
    );
  }, []);

  const units = useMemo(() => vocabularyBanks.map((b) => b.unitId || b.id), []);

  const filtered = useMemo(() => {
    return allWords.filter((w) => {
      const matchesQuery =
        !query ||
        w.word.toLowerCase().includes(query.toLowerCase()) ||
        w.translation.toLowerCase().includes(query.toLowerCase());
      const matchesUnit = unitFilter === "all" || w.unit === unitFilter;
      return matchesQuery && matchesUnit;
    });
  }, [allWords, query, unitFilter]);

  const playWord = (word) => {
    setTtsError(null);
    // (hasVoices check removido — intentamos igual, el warn sale en tts.js)
    try { stop(); } catch {}
    preloadVoices();
    speak(word, { rate: 0.9,
      onError: (e) => {
        const msg = e?.message === "no-voices" ? "Sin voces. Usa Chrome o instala voces del sistema." : "Error de audio. Probá en Chrome.";
        setTtsError(msg);
      }
    });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Vocabulary</h1>
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
          <Search size={18} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar palabra o traduccion..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-sm"
        >
          <option value="all">Todas las unidades</option>
          {units.map((u) => (
            <option key={u} value={u}>{UNIT_TITLES[u] || u}</option>
          ))}
        </select>
      </div>
      {ttsError && <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded p-2">{ttsError}</div>}
      <p className="text-sm text-gray-500">{filtered.length} palabras</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((w) => (
          <Card key={`${w.unit}-${w.word}`} className="p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{w.word}</p>
                <p className="text-sm text-gray-500">{w.translation}</p>
                {w.phonetic && <p className="text-xs text-gray-400">{w.phonetic}</p>}
              </div>
              <button
                onClick={() => playWord(w.word)}
                className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100"
                aria-label={`Escuchar ${w.word}`}
              >
                <Volume2 size={18} className="text-indigo-600" />
              </button>
            </div>
            {w.definition && <p className="text-sm text-gray-600 dark:text-gray-300">{w.definition}</p>}
            {w.example && <p className="text-sm italic text-gray-500">"{w.example}"</p>}
            <span className="text-xs text-gray-400">{UNIT_TITLES[w.unit] || w.unit}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
