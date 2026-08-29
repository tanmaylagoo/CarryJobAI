import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Check
} from "lucide-react";

export default function IdeaCard({
  idea,
  selected,
  onSelect,
}) {
  if (!idea) return null;

  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border p-6 transition duration-200 ${
        selected
          ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Sparkles size={18} />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {idea.difficulty && (
              <span className="rounded-full bg-zinc-800/90 border border-zinc-700/60 px-2.5 py-0.5 text-xs text-zinc-300">
                {idea.difficulty}
              </span>
            )}
            {idea.estimated_hours != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800/90 border border-zinc-700/60 px-2.5 py-0.5 text-xs text-zinc-400">
                <Clock size={12} />
                {idea.estimated_hours}h
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
          {idea.title}
        </h3>

        {/* Track Badge if available */}
        {idea.track && (
          <div className="mt-1.5 text-xs font-medium text-indigo-400">
            Track: {idea.track}
          </div>
        )}

        {/* Problem & Solution */}
        <div className="mt-4 space-y-2">
          {idea.problem && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Problem:
              </span>
              <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2">
                {idea.problem}
              </p>
            </div>
          )}
          {idea.solution && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Solution:
              </span>
              <p className="text-xs leading-relaxed text-zinc-300 line-clamp-3">
                {idea.solution}
              </p>
            </div>
          )}
        </div>

        {/* Key Features */}
        {idea.key_features?.length > 0 && (
          <div className="mt-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
              Key Features:
            </span>
            <ul className="space-y-1">
              {idea.key_features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-300">
                  <CheckCircle2 size={13} className="shrink-0 text-indigo-400 mt-0.5" />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {idea.tech_stack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {idea.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-md bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Why this team */}
        {idea.why_this_team && (
          <div className="mt-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 p-3">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-medium mb-1">
              <Users size={13} />
              <span>Why This Team</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400 line-clamp-2">
              {idea.why_this_team}
            </p>
          </div>
        )}

        {/* Risks if any */}
        {idea.risks?.length > 0 && (
          <div className="mt-3 text-[11px] text-amber-400/90 flex items-start gap-1.5">
            <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-400" />
            <span className="line-clamp-1">Risk: {idea.risks[0]}</span>
          </div>
        )}

        {/* Score Grid */}
        <div className="mt-5 grid grid-cols-4 gap-2 pt-4 border-t border-zinc-800/60 text-center">
          <div className="rounded-lg bg-zinc-950/50 p-1.5">
            <div className="text-[10px] text-zinc-500">Innovation</div>
            <div className="text-xs font-semibold text-zinc-200">{idea.innovation_score ?? "-"}/10</div>
          </div>
          <div className="rounded-lg bg-zinc-950/50 p-1.5">
            <div className="text-[10px] text-zinc-500">Feasibility</div>
            <div className="text-xs font-semibold text-zinc-200">{idea.feasibility_score ?? "-"}/10</div>
          </div>
          <div className="rounded-lg bg-zinc-950/50 p-1.5">
            <div className="text-[10px] text-zinc-500">Impact</div>
            <div className="text-xs font-semibold text-zinc-200">{idea.impact_score ?? "-"}/10</div>
          </div>
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-1.5">
            <div className="text-[10px] text-indigo-400">Judge</div>
            <div className="text-xs font-bold text-indigo-300">{idea.judge_score ?? "-"}/10</div>
          </div>
        </div>
      </div>

      {/* Select Button */}
      <button
        onClick={() => onSelect(idea)}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition ${
          selected
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500"
            : "bg-zinc-800 text-zinc-200 hover:bg-indigo-600 hover:text-white"
        }`}
      >
        {selected ? (
          <>
            <Check size={15} />
            Selected Idea
          </>
        ) : (
          <>
            Select Idea
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}