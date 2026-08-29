import { Send, Sparkles, Check, RefreshCw } from "lucide-react";

export default function FeedbackBox({
  selectedIdea,
  feedback,
  setFeedback,
  onRefine,
  onConfirm,
  loading,
}) {
  const suggestions = [
    "Make it simpler",
    "Focus more on AI",
    "Make it more innovative",
    "Reduce the number of features",
    "Make it easier to build",
    "Improve the demo potential",
  ];

  const handleChipClick = (suggestion) => {
    if (feedback.trim()) {
      setFeedback(`${feedback.trim()} ${suggestion.toLowerCase()}.`);
    } else {
      setFeedback(suggestion + ".");
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/40 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl ring-1 ring-indigo-500/20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Is this idea right for you?
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Refine it using human feedback or confirm it to generate your project plan.
          </p>
        </div>
      </div>

      {/* Selected Idea Summary Banner */}
      {selectedIdea && (
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-white text-base">
              {selectedIdea.title}
            </h4>
            {selectedIdea.difficulty && (
              <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-300">
                {selectedIdea.difficulty}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            {selectedIdea.solution || selectedIdea.problem}
          </p>
          {selectedIdea.tech_stack?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedIdea.tech_stack.map((t, idx) => (
                <span key={idx} className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
          Quick suggestions
        </label>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(suggestion)}
              className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Textarea */}
      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
          Tell CarryJob what you'd like to change...
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="e.g. Make the project simpler and focus more on AI..."
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs sm:text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Actions Row */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRefine}
          disabled={loading || !feedback.trim()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-500/50 bg-indigo-500/20 px-5 py-3 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/30 hover:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              Refining Idea...
            </>
          ) : (
            <>
              <Send size={15} />
              Refine Idea
            </>
          )}
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50"
        >
          <Check size={16} />
          Use This Idea
        </button>
      </div>
    </div>
  );
}