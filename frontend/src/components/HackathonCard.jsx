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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
          Hackathon Overview
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {hackathon.name || "Hackathon Analysis"}
        </h2>
        {hackathon.description && (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
            {hackathon.description}
          </p>
        )}
      </div>

      {/* Top Metrics Row */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <CalendarDays size={15} className="text-blue-600" />
            <span>Duration</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {hackathon.duration || "Not specified"}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Target size={15} className="text-blue-600" />
            <span>Tracks</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {hackathon.tracks?.length ? `${hackathon.tracks.length} track(s)` : "General Track"}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Trophy size={15} className="text-blue-600" />
            <span>Criteria</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {hackathon.judging_criteria?.length ? `${hackathon.judging_criteria.length} criteria` : "Standard Criteria"}
          </p>
        </div>
      </div>

      {/* Tracks */}
      {hackathon.tracks?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Available Tracks
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {hackathon.tracks.map((track, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
              >
                <p className="font-semibold text-xs text-slate-900">
                  {typeof track === "string" ? track : track.name}
                </p>
                {track.description && (
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
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
        <div className="mt-5 pt-5 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Judging Criteria
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {hackathon.judging_criteria.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800">
                    {typeof item === "string" ? item : item.criterion || item.title || item.name}
                  </p>
                  {item.weight && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                      {item.weight}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Links */}
      {hackathon.official_sources?.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-400">Sources:</span>
          {hackathon.official_sources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition hover:underline font-medium"
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