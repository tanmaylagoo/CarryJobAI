import { Clock, Check, ArrowRight, ChevronRight } from "lucide-react";

export default function IdeaCard({
  idea,
  selected,
  onSelect,
  onViewDetails,
  isRecommended = false,
}) {
  if (!idea) return null;

  const overallScore =
    idea.overall_score ??
    idea.judge_score ??
    (idea.feasibility_score && idea.innovation_score
      ? ((idea.feasibility_score + idea.innovation_score + (idea.impact_score || 7)) / 3).toFixed(1)
      : null);

  const constraintMetrics = [
    { label: "Time Fit",     value: idea.time_fit_score },
    { label: "Team Fit",     value: idea.team_fit_score },
    { label: "Resource Fit", value: idea.resource_fit_score },
  ].filter((m) => m.value != null);

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border bg-white shadow-xs transition-all ${
        selected
          ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/10"
          : isRecommended
          ? "border-blue-300 ring-1 ring-blue-100 hover:border-blue-400"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Clickable card body — opens detail modal */}
      <button
        type="button"
        onClick={onViewDetails}
        className="flex-1 text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded-t-xl"
        aria-label={`View details for ${idea.title}`}
      >
        {/* Top row: badges + score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {isRecommended && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                Recommended
              </span>
            )}
            {idea.difficulty && (
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {idea.difficulty}
              </span>
            )}
            {idea.estimated_hours != null && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <Clock size={11} className="text-slate-400" />
                {idea.estimated_hours}h
              </span>
            )}
          </div>

          {overallScore != null && (
            <span className="text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
              {overallScore}/10
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight leading-snug">
          {idea.title}
        </h3>

        {/* Track */}
        {idea.track && (
          <div className="mt-1 text-xs font-medium text-blue-700">Track: {idea.track}</div>
        )}

        {/* Problem / Solution — clamped to 2 lines each */}
        <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
          {idea.problem && (
            <div>
              <span className="font-semibold text-slate-800">Problem: </span>
              <span className="line-clamp-2">{idea.problem}</span>
            </div>
          )}
          {idea.solution && (
            <div>
              <span className="font-semibold text-slate-800">Solution: </span>
              <span className="line-clamp-2">{idea.solution}</span>
            </div>
          )}
        </div>

        {/* Constraint fit scores (problem mode) */}
        {constraintMetrics.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            {constraintMetrics.map((cm, idx) => (
              <div key={idx} className="rounded bg-slate-50 border border-slate-200/60 py-1 px-1.5">
                <div className="text-[10px] text-slate-500">{cm.label}</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{cm.value}/10</div>
              </div>
            ))}
          </div>
        )}

        {/* "View details" affordance */}
        <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <span>View idea details</span>
          <ChevronRight size={11} />
        </div>
      </button>

      {/* Select button — separate from clickable area */}
      <div className="px-5 pb-5 pt-0">
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onSelect(idea)}
            className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition ${
              selected
                ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {selected ? (
              <>
                <Check size={14} />
                <span>Selected for Plan</span>
              </>
            ) : (
              <>
                <span>Select this Idea</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}