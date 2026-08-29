import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Ideas from "./pages/Ideas";
import Workspace from "./pages/Workspace";

import { createPlan } from "./services/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null);
  const [planning, setPlanning] = useState(false);
  const [error, setError] = useState("");

  // After hackathon analysis
  const handleAnalyzed = (data) => {
    setSession(data);
    setError("");
    setPage("ideas");
  };

  // After user selects an idea
  const handleIdeaSelected = async (data) => {
    try {
      setPlanning(true);
      setError("");

      // Save the selected idea in frontend state
      setSession(data);

      /*
       * Selecting an idea only updates the backend session.
       * Now generate the complete game plan.
       */
      const result = await createPlan(data.session_id);

      // Merge the selected idea + generated plan
      const updatedSession = {
        ...data,

        evaluation: result.evaluation,
        project_plan: result.project_plan,
        team_plan: result.team_plan,
        timeline: result.timeline,
        pitch: result.pitch,
        judge_feedback: result.judge_feedback,
      };

      setSession(updatedSession);

      // Only go to workspace after the plan is ready
      setPage("workspace");
    } catch (err) {
      console.error("Planning failed:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to create the project plan."
      );

      // Stay on the ideas page if planning fails
      setPage("ideas");
    } finally {
      setPlanning(false);
    }
  };

  // Return to home (keeps session intact)
  const goHome = () => {
    setError("");
    setPage("home");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar page={page} setPage={setPage} session={session} />

      {/* Global planning error */}
      {error && (
        <div className="mx-auto mt-4 max-w-6xl px-6">
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* HOME */}
      {page === "home" && (
        <Home
          onAnalyzed={handleAnalyzed}
          session={session}
          onResumeWorkspace={() => setPage("workspace")}
          onResumeIdeas={() => setPage("ideas")}
        />
      )}

      {/* IDEAS */}
      {page === "ideas" && session && (
        <Ideas
          session={session}
          onIdeaSelected={handleIdeaSelected}
          onBack={goHome}
        />
      )}

      {/* WORKSPACE */}
      {page === "workspace" && session && (
        <Workspace
          session={session}
          onBack={() => setPage("ideas")}
        />
      )}

      {/* Planning overlay */}
      {planning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />

            <h2 className="text-lg font-semibold text-white">
              Building your game plan
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Evaluating the idea, planning the architecture,
              timeline and presentation...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}