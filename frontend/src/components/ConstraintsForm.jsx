import { useState } from "react";
import { Clock, Wrench, X, Check } from "lucide-react";
import TeamSetup from "./TeamSetup";

const TIME_OPTIONS = [
  { label: "6h", value: "6 hours" },
  { label: "12h", value: "12 hours" },
  { label: "24h", value: "24 hours" },
  { label: "48h", value: "48 hours" },
  { label: "72h", value: "72 hours" },
  { label: "Custom", value: "Custom" },
];

const SUGGESTED_RESOURCES = [
  "AWS",
  "OpenRouter",
  "Tavily",
  "GPU Server",
  "OpenAI API",
  "Supabase",
  "Paid APIs",
  "Modal",
];

export default function ConstraintsForm({
  availableTime,
  setAvailableTime,
  customTime,
  setCustomTime,
  team,
  setTeam,
  resources,
  setResources,
}) {
  const [customResourceInput, setCustomResourceInput] = useState("");

  const handleToggleResource = (res) => {
    if (resources.includes(res)) {
      setResources(resources.filter((r) => r !== res));
    } else {
      setResources([...resources, res]);
    }
  };

  const handleAddCustomResource = () => {
    const trimmed = customResourceInput.trim();
    if (!trimmed) return;
    if (!resources.includes(trimmed)) {
      setResources([...resources, trimmed]);
    }
    setCustomResourceInput("");
  };

  const handleRemoveResource = (resToRemove) => {
    setResources(resources.filter((r) => r !== resToRemove));
  };

  const isCustomTimeActive =
    availableTime === "Custom" ||
    !TIME_OPTIONS.some((opt) => opt.value === availableTime);

  return (
    <div className="space-y-6">
      {/* 1. Available Time Segmented Control */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
          Available Time
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Projects will be scoped to provide a complete, working MVP within this window.
        </p>

        <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          {TIME_OPTIONS.map((opt) => {
            const isSelected =
              opt.value === "Custom"
                ? isCustomTimeActive
                : availableTime === opt.value;

            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAvailableTime(opt.value)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {isCustomTimeActive && (
          <div className="mt-3 max-w-xs">
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="e.g. 36 hours or 3 days"
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        )}
      </div>

      {/* 2. Team Members and Skills */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <TeamSetup
          initialTeam={team}
          showSaveButton={false}
          onTeamChange={setTeam}
        />
      </div>

      {/* 3. Available Resources */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
          Available Resources & Infrastructure
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Select APIs, credits, hardware, or services your team has access to.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_RESOURCES.map((res) => {
            const isSelected = resources.includes(res);
            return (
              <button
                key={res}
                type="button"
                onClick={() => handleToggleResource(res)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {isSelected ? <Check size={13} className="text-blue-600" /> : null}
                <span>{res}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Resources list */}
        {resources.filter((r) => !SUGGESTED_RESOURCES.includes(r)).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-slate-100">
            {resources
              .filter((r) => !SUGGESTED_RESOURCES.includes(r))
              .map((customRes, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                >
                  <span>{customRes}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(customRes)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
          </div>
        )}

        {/* Custom Resource Input */}
        <div className="flex items-center gap-2 max-w-sm">
          <input
            type="text"
            value={customResourceInput}
            onChange={(e) => setCustomResourceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomResource();
              }
            }}
            placeholder="Add other resource (e.g. Pinecone, Azure)..."
            className="flex-1 rounded-md border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomResource}
            className="rounded-md bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
