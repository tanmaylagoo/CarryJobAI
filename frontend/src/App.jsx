import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Ideas from "./pages/Ideas";
import Workspace from "./pages/Workspace";
import Loading from "./components/Loading";

import { createPlan } from "./services/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null);
  const [planning, setPlanning] = useState(false);
  const [error, setError] = useState("");

  // After hackathon analysis or problem submission
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
        "Something went wrong while creating your project build plan. Please try again."
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar page={page} setPage={setPage} session={session} />

      {/* Global planning error */}
      {error && (
        <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-xs font-semibold text-red-600 hover:text-red-800 ml-4"
            >
              Dismiss
            </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
          <div className="w-full max-w-md">
            <Loading text="Building architecture, timeline, workloads, and pitch slides..." />
          </div>
        </div>
      )}
    </div>
  );
}