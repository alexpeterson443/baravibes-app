import { useState, useMemo } from "react";
import { statesData, stateGrid } from "@shared/data";
import { Search } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  legal: { label: "legal", color: "text-green-700", bg: "bg-green-100", emoji: "✅" },
  permit: { label: "permit needed", color: "text-amber-700", bg: "bg-amber-100", emoji: "📝" },
  illegal: { label: "not allowed", color: "text-red-700", bg: "bg-red-100", emoji: "🚫" },
};

const statusMapColors: Record<string, string> = {
  legal: "bg-green-400 hover:bg-green-500",
  permit: "bg-amber-400 hover:bg-amber-500",
  illegal: "bg-red-400 hover:bg-red-500",
};

export default function PetLawsSection() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateStatusMap = useMemo(() => {
    const map: Record<string, string> = {};
    statesData.forEach((s) => { map[s.name] = s.status; });
    return map;
  }, []);

  const filteredStates = useMemo(() => {
    return statesData.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || s.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  return (
    <section id="pet-laws" className="py-20 bg-gradient-to-b from-white to-[oklch(0.97_0.02_85)]">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">can you own a capybara?</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            the answer depends on where you live. here is every single US state so you can check yours.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="mb-10 overflow-x-auto">
          <div className="min-w-[500px] max-w-3xl mx-auto">
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(11, 1fr)", gridTemplateRows: "repeat(8, 1fr)" }}>
              {stateGrid.map((s) => {
                const status = stateStatusMap[s.name] || "illegal";
                return (
                  <div
                    key={s.abbr}
                    className={`${statusMapColors[status]} rounded text-[10px] md:text-xs font-bold text-white flex items-center justify-center aspect-square cursor-pointer transition-all ${hoveredState === s.name ? "ring-2 ring-primary scale-110 z-10" : ""}`}
                    style={{ gridColumn: s.col + 1, gridRow: s.row + 1 }}
                    onMouseEnter={() => setHoveredState(s.name)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => setHoveredState(s.name === hoveredState ? null : s.name)}
                    title={`${s.name}: ${status}`}
                  >
                    {s.abbr}
                  </div>
                );
              })}
            </div>
            {hoveredState && (
              <div className="text-center mt-3 text-sm font-semibold">
                <span>{hoveredState}: </span>
                <span className={statusLabels[stateStatusMap[hoveredState] || "illegal"]?.color}>
                  {statusLabels[stateStatusMap[hoveredState] || "illegal"]?.emoji}{" "}
                  {statusLabels[stateStatusMap[hoveredState] || "illegal"]?.label}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400 inline-block" /> legal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 inline-block" /> permit needed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> not allowed</span>
          </div>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="search your state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 justify-center">
            {["all", "legal", "permit", "illegal"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f === "all" ? "all" : statusLabels[f]?.label || f}
              </button>
            ))}
          </div>
        </div>

        {/* State list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-w-4xl mx-auto">
          {filteredStates.map((s) => {
            const info = statusLabels[s.status];
            return (
              <div key={s.name} className={`${info.bg} rounded-xl px-3 py-2.5 text-center`}>
                <div className="text-sm font-bold">{s.name}</div>
                <div className={`text-xs ${info.color} font-semibold`}>{info.emoji} {info.label}</div>
              </div>
            );
          })}
        </div>

        {filteredStates.length === 0 && (
          <p className="text-center text-muted-foreground mt-6">no states match your search</p>
        )}

        {/* Disclaimer */}
        <div className="mt-10 max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <p className="font-bold mb-1">🐾 real talk though</p>
          <p>
            capybaras are amazing but they are not easy pets. they need a LOT of space, access to water, specialized vet care, and they are social animals so you really should have at least two. please do your research before considering one as a pet. laws also change so always double check with your local wildlife agency.
          </p>
        </div>
      </div>
    </section>
  );
}
