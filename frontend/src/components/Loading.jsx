import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function Loading({
  text = "Processing request...",
  mode = "ideation"
}) {
  const defaultSteps = [
    { label: "Analyzing requirements & constraints", duration: 1800 },
    { label: "Generating constraint-aware project concepts", duration: 2500 },
    { label: "Evaluating feasibility & team skills match", duration: 2500 },
    { label: "Finalizing actionable project recommendations", duration: 2000 },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (currentStepIndex < defaultSteps.length - 1) {
      timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, defaultSteps[currentStepIndex].duration);
    }
    return () => clearTimeout(timeout);
  }, [currentStepIndex]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-xs max-w-lg mx-auto text-left">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {defaultSteps[currentStepIndex].label}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            This typically takes 10–20 seconds
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {defaultSteps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                isDone
                  ? "text-slate-700 font-medium"
                  : isCurrent
                  ? "text-blue-700 font-semibold"
                  : "text-slate-400 opacity-60"
              }`}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                )}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {text && (
        <p className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          {text}
        </p>
      )}
    </div>
  );
}