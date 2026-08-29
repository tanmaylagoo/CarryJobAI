import { useState } from "react";
import {
  ArrowRight,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

import { analyzeHackathon } from "../services/api";
import Loading from "../components/Loading";
import TeamSetup from "../components/TeamSetup";

const INITIAL_TEAM = [
  {
    name: "Developer 1",
    skills: ["Python", "FastAPI", "React", "Machine Learning"],
  },
];

export default function Home({
  onAnalyzed,
  session,
  onResumeWorkspace,
  onResumeIdeas,
}) {
  const [url, setUrl] = useState(
    session?.hackathon_url || session?.hackathon?.url || ""
  );
  const [team, setTeam] = useState(
    session?.team && session.team.length > 0
      ? session.team
      : INITIAL_TEAM
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a hackathon URL.");
      return;
    }

    if (!team || team.length === 0) {
      setError("Please add at least one team member.");
      return;
    }

    const hasSkills = team.some(
      (m) => m.skills && m.skills.length > 0
    );
    if (!hasSkills) {
      setError("Please specify at least one skill for your team members.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await analyzeHackathon(url.trim(), team);
      onAnalyzed({
        ...data,
        team,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to analyze this hackathon with your team details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Active Session Notification Banner */}
      {session && (
        <div className="mb-8 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Active Session Preserved
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">
              {session.hackathon?.name || "Hackathon Analysis"}
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {session.ideas?.length > 0 && onResumeIdeas && (
              <button
                type="button"
                onClick={onResumeIdeas}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
              >
                View Ideas →
              </button>
            )}
            {(session.project_plan || session.evaluation) && onResumeWorkspace && (
              <button
                type="button"
                onClick={onResumeWorkspace}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
              >
                Go to Workspace →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="w-full text-center mb-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
          <Sparkles size={26} />
        </div>

        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Turn any hackathon into a{" "}
          <span className="text-indigo-400">
            build plan.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Provide your hackathon link and team skillsets first. CarryJob will research requirements and tailor AI project ideas specifically for your team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Hackathon URL */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-indigo-400">
            Step 1: Enter Hackathon URL
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <LinkIcon size={18} className="shrink-0 text-zinc-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://devpost.com/hackathons/example..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              required
            />
          </div>
        </div>

        {/* Step 2: Team Details */}
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400 px-1">
            Step 2: Define Your Team & Skillsets
          </div>
          <TeamSetup
            initialTeam={team}
            defaultOpen={true}
            hideHeaderToggle={true}
            showSaveButton={false}
            onTeamChange={setTeam}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs sm:text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <Loading text="Analyzing hackathon requirements and crafting project ideas for your team..." />
        )}

        {/* Submit Action */}
        {!loading && (
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <span>Analyze Hackathon & Generate Ideas</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </form>

      <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-zinc-600">
        <span>Team-first AI research</span>
        <span>•</span>
        <span>Skill-aware ideation</span>
        <span>•</span>
        <span>Tailored build workflow</span>
      </div>
    </main>
  );
}