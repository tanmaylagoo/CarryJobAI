import { useEffect, useState } from "react";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { addTeam, generateIdeas, selectIdea, refineIdea } from "../services/api";
import HackathonCard from "../components/HackathonCard";
import ProblemCard from "../components/ProblemCard";
import IdeaCard from "../components/IdeaCard";
import IdeaDetailsModal from "../components/IdeaDetailsModal";
import FeedbackBox from "../components/FeedbackBox";
import TeamSetup from "../components/TeamSetup";
import Loading from "../components/Loading";

export default function Ideas({ session, onIdeaSelected, onBack }) {
  const [ideas, setIdeas] = useState(session.ideas || []);
  const [selectedIdea, setSelectedIdea] = useState(session.selected_idea || null);
  const [team, setTeam] = useState(session.team || []);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(!session.ideas || session.ideas.length === 0);
  const [selecting, setSelecting] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState("");
  const [activeModalIdea, setActiveModalIdea] = useState(null);

  const isProblemMode =
    session.input_mode === "problem_statement" || (!session.hackathon && session.problem_statement);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError("");

      if (team && team.length > 0) {
        const teamRes = await addTeam(session.session_id, team);
        if (teamRes.team) {
          setTeam(teamRes.team);
        }
      }

      const result = await generateIdeas(session.session_id);
      const generatedList = result.ideas || result.generated_ideas || [];
      setIdeas(generatedList);
    } catch (err) {
      console.error("Fetch ideas error:", err);
      setError("Unable to generate project ideas. Please verify your team configuration and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.ideas && session.ideas.length > 0) {
      setIdeas(session.ideas);
      setLoading(false);
      return;
    }

    fetchIdeas();
  }, [session.session_id]);

  const handleSaveTeam = async (updatedMembers) => {
    setLoading(true);
    setError("");
    setSelectedIdea(null);

    try {
      const res = await addTeam(session.session_id, updatedMembers);
      const savedTeam = res.team || updatedMembers;
      setTeam(savedTeam);

      const result = await generateIdeas(session.session_id);
      const generatedList = result.ideas || result.generated_ideas || [];
      setIdeas(generatedList);
    } catch (err) {
      console.error("Save team error:", err);
      setError("Failed to update team and regenerate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (idea) => {
    setSelecting(true);
    setError("");

    try {
      const result = await selectIdea(session.session_id, idea.id);
      const chosen = result.selected_idea || idea;
      setSelectedIdea(chosen);

      // Scroll to review box smoothly
      setTimeout(() => {
        const el = document.getElementById("refinement-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Select idea error:", err);
      setError("Unable to select this idea. Please try again.");
    } finally {
      setSelecting(false);
    }
  };

  const handleRefine = async () => {
    if (!selectedIdea || !feedback.trim()) return;

    setRefining(true);
    setError("");

    try {
      const result = await refineIdea(session.session_id, feedback.trim());
      const updatedIdea = result.selected_idea;

      setSelectedIdea(updatedIdea);
      setFeedback("");

      if (updatedIdea && updatedIdea.id != null) {
        setIdeas((prev) =>
          prev.map((item) => (item.id === updatedIdea.id ? updatedIdea : item))
        );
      }
    } catch (err) {
      console.error("Refine idea error:", err);
      setError("Unable to refine the idea. Please try again.");
    } finally {
      setRefining(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedIdea) return;

    onIdeaSelected({
      ...session,
      team,
      ideas,
      selected_idea: selectedIdea,
    });
  };

  // Find index of the highest rated idea to mark as recommended
  const highestIndex = ideas.reduce((bestIdx, cur, curIdx, arr) => {
    const curScore = Number(cur.overall_score ?? cur.judge_score ?? 0);
    const bestScore = Number(arr[bestIdx]?.overall_score ?? arr[bestIdx]?.judge_score ?? 0);
    return curScore > bestScore ? curIdx : bestIdx;
  }, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={14} />
          <span>{isProblemMode ? "Back to Problem Setup" : "Back to Hackathon Research"}</span>
        </button>
      </div>

      {/* Hackathon / Problem Overview */}
      {isProblemMode ? (
        <ProblemCard
          problemStatement={session.problem_statement}
          constraints={session.constraints}
          team={team}
        />
      ) : (
        session.hackathon && <HackathonCard hackathon={session.hackathon} />
      )}

      {/* Team Skills Configuration */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <TeamSetup
          initialTeam={team}
          onSaveTeam={handleSaveTeam}
          loading={loading}
          saveButtonText="Update Team & Regenerate Ideas"
        />
      </div>

      {/* Ideas Section Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Project Ideas & Decision Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select the project idea that best matches your team's skillset and hackathon timeline.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500 self-start sm:self-center">
            {ideas.length} concepts evaluated
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start justify-between gap-3 text-sm text-red-800">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">{error}</span>
              <span className="text-xs text-red-600 mt-0.5 block">
                Please check inputs or retry generating.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchIdeas}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-2xs shrink-0"
          >
            <RefreshCw size={12} />
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-8">
          <Loading
            text="Evaluating project feasibility, team skills match, and judging criteria..."
          />
        </div>
      )}

      {/* No Ideas Fallback */}
      {!loading && ideas.length === 0 && !error && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No project ideas were generated. Please adjust team skills or try again.
        </div>
      )}

      {/* Ideas Grid */}
      {!loading && ideas.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {ideas.map((idea, index) => (
            <IdeaCard
              key={idea.id ?? index}
              idea={idea}
              selected={selectedIdea?.id === idea.id || selectedIdea?.title === idea.title}
              onSelect={handleSelect}
              onViewDetails={() => setActiveModalIdea(idea)}
              isRecommended={index === highestIndex}
            />
          ))}
        </div>
      )}

      {/* Idea Details Modal */}
      {activeModalIdea && (
        <IdeaDetailsModal
          idea={activeModalIdea}
          selected={selectedIdea?.id === activeModalIdea.id || selectedIdea?.title === activeModalIdea.title}
          onSelect={handleSelect}
          onClose={() => setActiveModalIdea(null)}
          selecting={selecting}
        />
      )}

      {/* Selected Idea Refinement & Confirmation */}
      {selectedIdea && (
        <div id="refinement-section" className="pt-4">
          <FeedbackBox
            selectedIdea={selectedIdea}
            feedback={feedback}
            setFeedback={setFeedback}
            onRefine={handleRefine}
            onConfirm={handleConfirm}
            loading={refining || selecting}
          />
        </div>
      )}
    </main>
  );
}