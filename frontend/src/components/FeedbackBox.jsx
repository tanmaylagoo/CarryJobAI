import { useState } from "react";
import { Send, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

export default function FeedbackBox({
  selectedIdea,
  feedback,
  setFeedback,
  onRefine,
  onConfirm,
  loading = false,
}) {
  const suggestions = [
    "Make it simpler to build",
    "Focus more on core AI logic",
    "Reduce feature scope for MVP",
    "Strengthen the live demo appeal",
    "Lower technical risk",
  ];

  const handleChipClick = (suggestion) => {
    if (feedback.trim()) {
      setFeedback(`${feedback.trim()} Also ${suggestion.toLowerCase()}.`);
    } else {
      setFeedback(suggestion + ".");
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
            Step 2: Selected Idea Review
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            {selectedIdea?.title || "Selected Project Concept"}
          </h3>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
        >
          <span>Generate Complete Build Plan</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Selected Idea Details Summary */}
      {selectedIdea && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Proposed Solution</span>
            <p className="text-slate-600 leading-relaxed">
              {selectedIdea.solution || selectedIdea.problem}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Architecture & Tech Stack</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedIdea.tech_stack?.map((t, idx) => (
                <span
                  key={idx}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
            {selectedIdea.difficulty && (
              <div className="mt-2 text-slate-500 text-[11px]">
                Target: {selectedIdea.difficulty} difficulty · {selectedIdea.estimated_hours || 24} hours
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          Want to adjust anything before generating the plan?
        </label>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(suggestion)}
              className="rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-2.5 py-1 text-xs text-slate-600 transition"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Textarea */}
      <div className="mt-3">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional: Specify any changes you'd like to make to this project concept before building the roadmap..."
          rows={2}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      {/* Action Row */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRefine}
          disabled={loading || !feedback.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40"
        >
          {loading ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>Refining...</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Refine with Feedback</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50"
        >
          <span>Use This Idea & Create Plan</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}