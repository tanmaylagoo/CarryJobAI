import {
  CalendarDays,
  Trophy,
  Target,
  FileText,
  Clock,
  Code2,
  Gift,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export default function HackathonCard({ hackathon }) {
  if (!hackathon) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {hackathon.name || "Hackathon Analysis"}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400 text-sm sm:text-base">
            {hackathon.description}
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-indigo-400">
            <CalendarDays size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Duration
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-200">
            {hackathon.duration || "Not specified"}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-indigo-400">
            <Target size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Tracks
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-200">
            {hackathon.tracks?.length ? `${hackathon.tracks.length} track(s)` : "General Track"}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-indigo-400">
            <Trophy size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Criteria
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-200">
            {hackathon.judging_criteria?.length ? `${hackathon.judging_criteria.length} criteria` : "Standard Hackathon Criteria"}
          </p>
        </div>
      </div>

      {/* Tracks Section */}
      {hackathon.tracks?.length > 0 && (
        <div className="mt-7">
          <h3 className="mb-3 text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Target size={16} className="text-indigo-400" />
            Hackathon Tracks
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {hackathon.tracks.map((track, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4 transition hover:border-zinc-700"
              >
                <p className="font-semibold text-zinc-200 text-sm">
                  {typeof track === "string" ? track : track.name}
                </p>
                {track.description && (
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    {track.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Judging Criteria */}
      {hackathon.judging_criteria?.length > 0 && (
        <div className="mt-7">
          <h3 className="mb-3 text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Trophy size={16} className="text-indigo-400" />
            Judging Criteria
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hackathon.judging_criteria.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-zinc-200">
                    {typeof item === "string" ? item : item.criterion || item.title || item.name}
                  </p>
                  {item.weight && (
                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                      {item.weight}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid for Rules, Requirements, Deadlines, Prizes */}
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        {/* Important Rules & Submission Requirements */}
        {((hackathon.important_rules?.length > 0) || (hackathon.submission_requirements?.length > 0)) && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileText size={15} className="text-indigo-400" />
              Rules & Requirements
            </h3>
            <ul className="space-y-2">
              {hackathon.important_rules?.map((rule, idx) => (
                <li key={`rule-${idx}`} className="text-xs text-zinc-300 flex items-start gap-2">
                  <CheckCircle2 size={14} className="shrink-0 text-indigo-400 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
              {hackathon.submission_requirements?.map((req, idx) => (
                <li key={`req-${idx}`} className="text-xs text-zinc-300 flex items-start gap-2">
                  <CheckCircle2 size={14} className="shrink-0 text-indigo-400 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Tech & Deadlines */}
        {((hackathon.technologies_or_requirements?.length > 0) || (hackathon.deadlines?.length > 0)) && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4">
            {hackathon.technologies_or_requirements?.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Code2 size={15} className="text-indigo-400" />
                  Featured Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {hackathon.technologies_or_requirements.map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hackathon.deadlines?.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Clock size={15} className="text-indigo-400" />
                  Important Deadlines
                </h3>
                <ul className="space-y-1.5">
                  {hackathon.deadlines.map((dl, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 leading-relaxed">
                      • {dl}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prizes */}
      {hackathon.prizes?.length > 0 && (
        <div className="mt-7">
          <h3 className="mb-3 text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Gift size={16} className="text-indigo-400" />
            Prizes & Rewards
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hackathon.prizes.map((prize, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-3.5">
                <p className="font-semibold text-xs text-indigo-300">
                  {typeof prize === "string" ? prize : prize.name}
                </p>
                {prize.description && (
                  <p className="mt-1 text-xs text-zinc-400">
                    {prize.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Links */}
      {hackathon.official_sources?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center gap-4">
          <span className="text-xs font-medium text-zinc-500">Sources:</span>
          {hackathon.official_sources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition hover:underline"
            >
              <span>{src.title || src.url}</span>
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}