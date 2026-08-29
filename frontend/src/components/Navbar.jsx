import { Sparkles, Layers, Lightbulb, Home as HomeIcon } from "lucide-react";

export default function Navbar({ page, setPage, session }) {
  const hasIdeas = session && (session.ideas?.length > 0 || session.session_id);
  const hasPlan = session && (session.project_plan || session.evaluation);

  return (
    <nav className="border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
        <button
          onClick={() => setPage && setPage("home")}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Sparkles size={19} />
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">
              CarryJob
            </span>
            <span className="text-[10px] text-zinc-500 font-medium hidden sm:block mt-0.5">
              AI Hackathon Copilot
            </span>
          </div>
        </button>

        {session && setPage ? (
          <div className="flex items-center gap-1 sm:gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1">
            <button
              onClick={() => setPage("home")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                page === "home"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <HomeIcon size={14} />
              <span className="hidden sm:inline">Setup</span>
            </button>

            {hasIdeas && (
              <button
                onClick={() => setPage("ideas")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  page === "ideas"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Lightbulb size={14} />
                <span>Ideas</span>
              </button>
            )}

            {hasPlan && (
              <button
                onClick={() => setPage("workspace")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  page === "workspace"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Layers size={14} />
                <span>Workspace</span>
              </button>
            )}
          </div>
        ) : (
          <div className="hidden text-xs text-zinc-500 sm:block font-medium">
            From hackathon brief → project plan
          </div>
        )}
      </div>
    </nav>
  );
}