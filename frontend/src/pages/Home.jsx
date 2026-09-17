import { useState } from "react";
import {
  ArrowRight,
  Link as LinkIcon,
  Globe,
  FileText,
  AlertCircle,
  RefreshCw
} from "lucide-react";

import { analyzeHackathon, analyzeProblem } from "../services/api";
import Loading from "../components/Loading";
import ConstraintsForm from "../components/ConstraintsForm";

const INITIAL_TEAM = [
  {
    name: "Team Member 1",
    skills: ["Python", "FastAPI", "React", "Machine Learning"],
  },
];

export default function Home({
  onAnalyzed,
  session,
  onResumeWorkspace,
  onResumeIdeas,
}) {
  const [inputMode, setInputMode] = useState(
    session?.input_mode || "hackathon_url"
  );
  const [url, setUrl] = useState(
    session?.hackathon_url || session?.hackathon?.url || ""
  );
  const [problemStatement, setProblemStatement] = useState(
    session?.problem_statement || ""
  );

  // Direct Problem Mode Constraints
  const [availableTime, setAvailableTime] = useState(
    session?.constraints?.available_time || "24 hours"
  );
  const [customTime, setCustomTime] = useState("");
  const [team, setTeam] = useState(
    session?.team && session.team.length > 0 ? session.team : INITIAL_TEAM
  );
  const [resources, setResources] = useState(
    session?.constraints?.resources || ["AWS", "OpenRouter"]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (inputMode === "hackathon_url") {
      if (!url.trim()) {
        setError("Please enter a valid hackathon URL to proceed.");
        return;
      }

      setLoading(true);

      try {
        const data = await analyzeHackathon(url.trim(), team);
        onAnalyzed({
          ...data,
          team,
        });
      } catch (err) {
        console.error("Analysis error:", err);
        setError("Something went wrong while analyzing this hackathon. Please verify the URL and try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Direct Problem Mode
      if (!problemStatement.trim()) {
        setError("Please describe the problem you want to solve.");
        return;
      }

      const finalTime =
        availableTime === "Custom" ? customTime.trim() : availableTime;
      if (!finalTime) {
        setError("Please specify your available time constraint.");
        return;
      }

      if (!team || team.length === 0) {
        setError("Please configure at least one team member.");
        return;
      }

      const hasSkills = team.some(
        (m) => m.skills && m.skills.length > 0
      );
      if (!hasSkills) {
        setError("Please specify technical skills for your team members.");
        return;
      }

      const constraints = {
        available_time: finalTime,
        team_size: team.length,
        team_members: team,
        resources: resources,
      };

      setLoading(true);

      try {
        const data = await analyzeProblem(
          problemStatement.trim(),
          constraints,
          team
        );
        onAnalyzed({
          ...data,
          team,
        });
      } catch (err) {
        console.error("Ideation error:", err);
        setError("Something went wrong while generating your project ideas. Please review your inputs and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Active Session Notification */}
      {session && (
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Active Session Available
            </div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {session.hackathon?.name || session.problem_statement || "Current Session"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session.ideas?.length > 0 && onResumeIdeas && (
              <button
                type="button"
                onClick={onResumeIdeas}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                View Ideas
              </button>
            )}
            {(session.project_plan || session.evaluation) && onResumeWorkspace && (
              <button
                type="button"
                onClick={onResumeWorkspace}
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
              >
                Open Workspace →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Turn your hackathon or problem into an actionable build plan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Scope realistic architectures, team workloads, and pitch decks tailored to real development constraints.
        </p>
      </div>

      {/* Choice Selector: What do you want to start with? */}
      <div className="mb-8">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center mb-3">
          What do you want to start with?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {/* Choice 1 */}
          <button
            type="button"
            onClick={() => {
              setInputMode("hackathon_url");
              setError("");
            }}
            className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
              inputMode === "hackathon_url"
                ? "border-blue-600 bg-white shadow-sm ring-1 ring-blue-600"
                : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 rounded-md ${inputMode === "hackathon_url" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                <Globe size={16} />
              </div>
              <span className="font-semibold text-sm text-slate-900">Find a Hackathon</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Analyze official guidelines, tracks, and judging criteria from Devpost or any hackathon URL.
            </p>
          </button>

          {/* Choice 2 */}
          <button
            type="button"
            onClick={() => {
              setInputMode("problem_statement");
              setError("");
            }}
            className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
              inputMode === "problem_statement"
                ? "border-blue-600 bg-white shadow-sm ring-1 ring-blue-600"
                : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 rounded-md ${inputMode === "problem_statement" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                <FileText size={16} />
              </div>
              <span className="font-semibold text-sm text-slate-900">I already have a problem</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define your own problem statement with explicit time, team skills, and resource constraints.
            </p>
          </button>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MODE 1: Hackathon URL */}
        {inputMode === "hackathon_url" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs max-w-2xl mx-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Hackathon URL
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Paste the public overview page (Devpost, MLH, Hackathon site).
            </p>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-blue-500 focus-within:bg-white">
              <LinkIcon size={16} className="text-slate-400 shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://devpost.com/hackathons/..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* MODE 2: Direct Problem Statement & Constraints */}
        {inputMode === "problem_statement" && (
          <div className="space-y-6">
            {/* Problem Statement Textarea */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Problem Statement
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Describe the specific challenge, user friction, or opportunity you want to solve.
              </p>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="e.g. Hospital triage staff waste hours predicting wait times during emergency surges without unified data..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* Constraints Form (Only in Direct Problem Mode) */}
            <ConstraintsForm
              availableTime={availableTime}
              setAvailableTime={setAvailableTime}
              customTime={customTime}
              setCustomTime={setCustomTime}
              team={team}
              setTeam={setTeam}
              resources={resources}
              setResources={setResources}
            />
          </div>
        )}

        {/* User-friendly Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 max-w-2xl mx-auto flex items-start justify-between gap-3 text-sm text-red-800">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{error}</span>
                <span className="text-xs text-red-600 mt-0.5 block">
                  Check your network connection or verify the input parameters.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-2xs shrink-0"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-4">
            <Loading
              text={
                inputMode === "hackathon_url"
                  ? "Researching hackathon requirements and evaluating judging criteria..."
                  : "Applying time limits and team skills to scope realistic projects..."
              }
            />
          </div>
        )}

        {/* Submit Action */}
        {!loading && (
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.99] disabled:opacity-50"
            >
              <span>
                {inputMode === "hackathon_url"
                  ? "Analyze Hackathon & Generate Ideas"
                  : "Generate Constraint-Aware Ideas"}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </form>
    </main>
  );
}