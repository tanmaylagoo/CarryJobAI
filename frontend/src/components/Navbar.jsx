import { Layers, Lightbulb, Compass, ArrowRight } from "lucide-react";

export default function Navbar({ page, setPage, session }) {
  const hasIdeas = session && (session.ideas?.length > 0 || session.session_id);
  const hasPlan = session && (session.project_plan || session.evaluation);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-14">
        {/* Brand */}
        <button
          onClick={() => setPage && setPage("home")}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-95">
            C
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900">
              CarryJob
            </span>
            <span className="hidden sm:inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
              Project Strategist
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        {session && setPage ? (
          <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200/80">
            <button
              onClick={() => setPage("home")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                page === "home"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Compass size={14} className={page === "home" ? "text-blue-600" : "text-slate-400"} />
              <span>Setup</span>
            </button>

            {hasIdeas && (
              <button
                onClick={() => setPage("ideas")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                  page === "ideas"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Lightbulb size={14} className={page === "ideas" ? "text-blue-600" : "text-slate-400"} />
                <span>Ideas</span>
              </button>
            )}

            {hasPlan && (
              <button
                onClick={() => setPage("workspace")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                  page === "workspace"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Layers size={14} className={page === "workspace" ? "text-blue-600" : "text-slate-400"} />
                <span>Workspace</span>
              </button>
            )}
          </nav>
        ) : (
          <div className="hidden text-xs text-slate-500 sm:flex items-center gap-1.5 font-medium">
            <span>Problem statement</span>
            <ArrowRight size={12} className="text-slate-400" />
            <span>Feasible build plan</span>
          </div>
        )}
      </div>
    </header>
  );
}