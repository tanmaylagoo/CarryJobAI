import { Clock, Users, Wrench, FileText } from "lucide-react";

export default function ProblemCard({ problemStatement, constraints, team }) {
  if (!problemStatement && !constraints) return null;

  const availableTime = constraints?.available_time || "Not specified";
  const resources = constraints?.resources || [];
  const teamMembers = team || constraints?.team_members || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
          Problem Overview
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
          {problemStatement}
        </h2>
      </div>

      {/* Constraints Summary Metrics */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Clock size={15} className="text-blue-600" />
            <span>Available Time</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {availableTime}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Users size={15} className="text-blue-600" />
            <span>Team Size</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {teamMembers.length} Member{teamMembers.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Wrench size={15} className="text-blue-600" />
            <span>Resources</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {resources.length > 0 ? (
              resources.map((res, idx) => (
                <span
                  key={idx}
                  className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-700 font-medium"
                >
                  {res}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Standard tools</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
