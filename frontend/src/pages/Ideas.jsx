import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { addTeam, generateIdeas, selectIdea, refineIdea } from "../services/api";
import HackathonCard from "../components/HackathonCard";
import IdeaCard from "../components/IdeaCard";
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

  useEffect(() => {
    // If we already have ideas in session, no need to re-fetch on first render
    if (session.ideas && session.ideas.length > 0) {
      setIdeas(session.ideas);
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        // If team wasn't set in backend state yet, register it now
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
        setError(
          err.response?.data?.detail || err.message || "Unable to generate ideas for this hackathon."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [session.session_id]);

  const handleSaveTeam = async (updatedMembers) => {
    setLoading(true);
    setError("");
    setSelectedIdea(null);

    try {
      // Save team to backend
      const res = await addTeam(session.session_id, updatedMembers);
      const savedTeam = res.team || updatedMembers;
      setTeam(savedTeam);

      // Regenerate ideas matching the new team skills
      const result = await generateIdeas(session.session_id);
      const generatedList = result.ideas || result.generated_ideas || [];
      setIdeas(generatedList);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to update team and generate ideas."
      );
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
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Unable to select this idea."
      );
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

      // Update in ideas array if present
      if (updatedIdea && updatedIdea.id != null) {
        setIdeas((prev) =>
          prev.map((item) => (item.id === updatedIdea.id ? updatedIdea : item))
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Unable to refine the idea."
      );
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

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Hackathon Research
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Sparkles size={16} />
          Hackathon Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {session.hackathon?.name || "Hackathon Analysis"}
        </h1>
      </div>

      {/* Hackathon Research Summary Card */}
      {session.hackathon && (
        <HackathonCard hackathon={session.hackathon} />
      )}

      {/* Team & Skills Setup Section */}
      <div className="mt-10">
        <TeamSetup
          initialTeam={team}
          onSaveTeam={handleSaveTeam}
          loading={loading}
        />
      </div>

      {/* Ideas Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Project Ideas
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Tailored hackathon project ideas matching guidelines, judging criteria, and your team's skills.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs sm:text-sm text-red-400">
          <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Loading text="Generating project ideas based on hackathon guidelines and team skills..." />
      )}

      {/* No Ideas Fallback */}
      {!loading && ideas.length === 0 && !error && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-xs sm:text-sm text-zinc-500">
          No project ideas were generated. Please update team skills or analyze again.
        </div>
      )}

      {/* Ideas Grid */}
      {!loading && ideas.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {ideas.map((idea, index) => (
            <IdeaCard
              key={idea.id ?? index}
              idea={idea}
              selected={selectedIdea?.id === idea.id || selectedIdea?.title === idea.title}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* Human-in-the-Loop Refinement Section */}
      {selectedIdea && (
        <div className="mt-12" id="refinement-section">
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
