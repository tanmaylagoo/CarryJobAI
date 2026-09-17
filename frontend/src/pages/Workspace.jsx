import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  CheckSquare,
  XCircle,
  PlusCircle,
  Award,
  Presentation,
  TrendingUp,
  ShieldCheck,
  Lightbulb
} from "lucide-react";
import PlanSection from "../components/PlanSection";

const NAV_SECTIONS = [
  {
    category: "PROJECT",
    items: [
      { id: "section-idea", label: "Idea Overview" },
      { id: "section-evaluation", label: "Evaluation" },
    ],
  },
  {
    category: "BUILD",
    items: [
      { id: "section-architecture", label: "Architecture" },
      { id: "section-features", label: "Features & Scope" },
      { id: "section-team", label: "Team Workload" },
      { id: "section-timeline", label: "Execution Timeline" },
    ],
  },
  {
    category: "PITCH",
    items: [
      { id: "section-slides", label: "Pitch Slide Deck" },
      { id: "section-demo", label: "Demo Script" },
      { id: "section-judge", label: "Judge Feedback" },
    ],
  },
];

export default function Workspace({ session, onBack }) {
  const [activeSection, setActiveSection] = useState("section-idea");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">No project plan found</h2>
        <p className="mt-2 text-sm text-slate-500">
          Please select an idea and create your plan first.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
          >
            <ArrowLeft size={14} />
            Back to Ideas
          </button>
        )}
      </div>
    );
  }

  const selectedIdea = session.selected_idea || session.idea || {};
  const evaluation = session.evaluation || session.idea_evaluation || {};
  const projectPlan = session.project_plan || {};
  const teamPlan = session.team_plan || [];
  const timeline = session.timeline || [];
  const pitch = session.pitch || {};
  const judgeFeedback = session.judge_feedback || {};

  const slides = pitch.slides || [];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      {/* Top Breadcrumb / Return */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Ideas</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-700">
            {selectedIdea.difficulty || "Hackathon"} · {selectedIdea.estimated_hours ? `${selectedIdea.estimated_hours}h build` : "Complete Plan"}
          </span>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar */}
        <aside className="lg:col-span-3 lg:sticky lg:top-20 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
              Project Plan
            </h4>

            <nav className="space-y-4">
              {NAV_SECTIONS.map((group, gIdx) => (
                <div key={gIdx}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    {group.category}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left rounded-md px-2.5 py-1.5 text-xs transition ${
                            isActive
                              ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 rounded-l-none"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Quick Metrics Card in sidebar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-xs space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Project Summary
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Overall Score</span>
              <span className="font-bold text-slate-900">
                {evaluation.overall_score != null ? `${evaluation.overall_score}/100` : "—"}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Timeline</span>
              <span className="font-medium text-slate-800">
                {timeline.length ? `${timeline.length} Phases` : "4 Phases"}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Team Size</span>
              <span className="font-medium text-slate-800">
                {teamPlan.length ? `${teamPlan.length} Members` : "Ready"}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Slide Deck</span>
              <span className="font-medium text-slate-800">
                {slides.length ? `${slides.length} Slides` : "Generated"}
              </span>
            </div>
          </div>
        </aside>

        {/* Right Main Content Pane */}
        <main className="lg:col-span-9 space-y-8">
          {/* SECTION 1: IDEA OVERVIEW */}
          <PlanSection
            id="section-idea"
            title="1. Selected Project Idea"
            subtitle="Core problem and proposed MVP solution scope"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedIdea.title || "Project Specification"}
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selectedIdea.problem && (
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-200/80">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Problem Statement
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedIdea.problem}
                    </p>
                  </div>
                )}

                {selectedIdea.solution && (
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-200/80">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Proposed Solution
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedIdea.solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Tech Stack Chips */}
              {selectedIdea.tech_stack?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-400 mr-1">Stack:</span>
                  {selectedIdea.tech_stack.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </PlanSection>

          {/* SECTION 2: IDEA EVALUATION */}
          <PlanSection
            id="section-evaluation"
            title="2. Project Evaluation"
            subtitle="Strict judging assessment on feasibility, innovation, and impact"
          >
            <div className="space-y-5">
              {/* Verdict Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-blue-50/60 border border-blue-200 p-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Judge Verdict
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {evaluation.final_verdict || "High-potential MVP with strong alignment to hackathon judging criteria."}
                  </p>
                </div>
                {evaluation.overall_score != null && (
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                    <div className="text-xl font-extrabold text-blue-700">{evaluation.overall_score}/100</div>
                  </div>
                )}
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Strengths */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-3">
                    <TrendingUp size={14} />
                    Project Strengths
                  </h4>
                  {evaluation.strengths?.length > 0 ? (
                    <ul className="space-y-2">
                      {evaluation.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                          <CheckCircle2 size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Standard strengths identified.</p>
                  )}
                </div>

                {/* Weaknesses */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-3">
                    <AlertTriangle size={14} />
                    Bottlenecks & Weaknesses
                  </h4>
                  {evaluation.weaknesses?.length > 0 ? (
                    <ul className="space-y-2">
                      {evaluation.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">No major bottlenecks noted.</p>
                  )}
                </div>
              </div>

              {/* Technical Risks & Strategic Recommendations */}
              <div className="grid gap-4 sm:grid-cols-2">
                {evaluation.risks?.length > 0 && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck size={14} />
                      Technical Risks
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {evaluation.risks.map((r, idx) => (
                        <li key={idx} className="leading-relaxed">• {r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.recommendations?.length > 0 && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-2.5">
                      <Lightbulb size={14} />
                      Strategic Recommendations
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {evaluation.recommendations.map((rec, idx) => (
                        <li key={idx} className="leading-relaxed">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </PlanSection>

          {/* SECTION 3: ARCHITECTURE & TECH STACK */}
          <PlanSection
            id="section-architecture"
            title="3. System Architecture & Tech Stack"
            subtitle="Component diagram rationale and technology justifications"
          >
            <div className="space-y-6">
              {/* Architecture Overview */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Architecture Overview
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {typeof projectPlan.architecture === "string"
                    ? projectPlan.architecture
                    : JSON.stringify(projectPlan.architecture || "Modular API architecture with lightweight front-end and asynchronous LLM pipelines.")}
                </p>
              </div>

              {/* Tech Stack List */}
              {projectPlan.tech_stack?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Technology Justifications
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {projectPlan.tech_stack.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 bg-white p-3.5"
                      >
                        <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
                          <Cpu size={14} className="text-blue-600" />
                          <span>{typeof item === "string" ? item : item.technology}</span>
                        </div>
                        {item.reason && (
                          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                            {item.reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PlanSection>

          {/* SECTION 4: FEATURES & SCOPE CREEP GUARD */}
          <PlanSection
            id="section-features"
            title="4. Features & Scope Creep Guard"
            subtitle="Explicitly separating must-have MVP features from bonus and anti-goals"
          >
            <div className="space-y-6">
              {/* MVP Features */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                  <CheckSquare size={14} />
                  MVP Features (Must Build)
                </h4>
                {projectPlan.mvp_features?.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {projectPlan.mvp_features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800"
                      >
                        <CheckCircle2 size={14} className="shrink-0 text-blue-600 mt-0.5" />
                        <span className="font-medium leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">MVP features defined.</p>
                )}
              </div>

              {/* Nice to Have vs Don't Build */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Nice to have */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <PlusCircle size={14} className="text-slate-500" />
                    Nice to Have (If Time Permits)
                  </h4>
                  {projectPlan.nice_to_have?.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {projectPlan.nice_to_have.map((nth, idx) => (
                        <li key={idx} className="leading-relaxed">• {nth}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">No secondary features specified.</p>
                  )}
                </div>

                {/* Don't Build (Scope creep guard) */}
                <div className="rounded-lg border border-red-200 bg-red-50/30 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2.5 flex items-center gap-1.5">
                    <XCircle size={14} className="text-red-600" />
                    Don't Build (Scope Creep Guard)
                  </h4>
                  {projectPlan.do_not_build?.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-red-900">
                      {projectPlan.do_not_build.map((dnb, idx) => (
                        <li key={idx} className="leading-relaxed">• {dnb}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">No anti-goals listed.</p>
                  )}
                </div>
              </div>

              {/* Implementation Steps */}
              {projectPlan.implementation_steps?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Step-by-Step Implementation Sequence
                  </h4>
                  <div className="space-y-2">
                    {projectPlan.implementation_steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 leading-relaxed mt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PlanSection>

          {/* SECTION 5: TEAM WORKLOAD DISTRIBUTION */}
          <PlanSection
            id="section-team"
            title="5. Team Workload Distribution"
            subtitle="Balanced role assignment mapped to individual skills"
          >
            {teamPlan?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {teamPlan.map((tp, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Users size={15} className="text-blue-600" />
                        <span className="font-bold text-sm text-slate-900">
                          {tp.member || `Member ${idx + 1}`}
                        </span>
                      </div>
                      {tp.role && (
                        <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {tp.role}
                        </span>
                      )}
                    </div>

                    {tp.tasks?.length > 0 && (
                      <ul className="space-y-2 text-xs text-slate-700">
                        {tp.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No team distribution specified.</p>
            )}
          </PlanSection>

          {/* SECTION 6: BUILD TIMELINE (Visually clear execution roadmap) */}
          <PlanSection
            id="section-timeline"
            title="6. Execution Timeline"
            subtitle="Phase-by-phase execution answering: What to build first? What comes next? How much time?"
          >
            {timeline?.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((tl, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {tl.phase || `Phase ${idx + 1}`}
                        </h4>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        <Clock size={12} className="text-slate-400" />
                        {tl.time || tl.duration || "In progress"}
                      </span>
                    </div>

                    {tl.tasks?.length > 0 && (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {tl.tasks.map((task, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2 rounded bg-slate-50/60 p-2 text-xs text-slate-700"
                          >
                            <CheckSquare size={13} className="shrink-0 text-slate-400 mt-0.5" />
                            <span className="leading-relaxed">{task}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Timeline not specified.</p>
            )}
          </PlanSection>

          {/* SECTION 7: PITCH SLIDES (Presentation-oriented slide deck viewer) */}
          <PlanSection
            id="section-slides"
            title="7. Presentation & Pitch Deck"
            subtitle="Actual slide-like content presentation for demo pitches"
          >
            <div className="space-y-6">
              {/* One-Line Elevator Pitch */}
              {pitch.one_line_pitch && (
                <div className="rounded-lg bg-blue-50/50 border border-blue-200 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    One-Line Pitch
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 italic">
                    "{pitch.one_line_pitch}"
                  </p>
                </div>
              )}

              {/* Slide Presentation Viewer */}
              {slides.length > 0 && (
                <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
                  {/* Slide Top Navigation */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-slate-600">
                      Slide {activeSlideIndex + 1} of {slides.length}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeSlideIndex === 0}
                        className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
                        title="Previous Slide"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                        disabled={activeSlideIndex === slides.length - 1}
                        className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
                        title="Next Slide"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Active Slide Canvas */}
                  <div className="py-8 px-4 text-center min-h-[220px] flex flex-col justify-center items-center">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1 block">
                      {slides[activeSlideIndex].slide ? `SLIDE ${slides[activeSlideIndex].slide}` : `SLIDE ${activeSlideIndex + 1}`}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 max-w-xl">
                      {slides[activeSlideIndex].title}
                    </h3>

                    {slides[activeSlideIndex].content?.length > 0 && (
                      <ul className="space-y-2.5 text-left max-w-md mx-auto text-xs sm:text-sm text-slate-700">
                        {slides[activeSlideIndex].content.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-blue-600 font-bold mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Slide Dots / Quick Jumper */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
                    {slides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActiveSlideIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all ${
                          dotIdx === activeSlideIndex
                            ? "w-6 bg-blue-600"
                            : "w-2 bg-slate-200 hover:bg-slate-300"
                        }`}
                        title={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PlanSection>

          {/* SECTION 8: DEMO SCRIPT */}
          <PlanSection
            id="section-demo"
            title="8. Live Demo Script"
            subtitle="Step-by-step walkthrough for a winning presentation"
          >
            {pitch.demo_script?.length > 0 ? (
              <div className="space-y-2.5">
                {pitch.demo_script.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed mt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Demo script not specified.</p>
            )}
          </PlanSection>

          {/* SECTION 9: JUDGE FEEDBACK */}
          <PlanSection
            id="section-judge"
            title="9. Simulated Judge Assessment"
            subtitle="Anticipated judge critiques, strong points, and closing recommendations"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Judge Score Rating
                </span>
                {judgeFeedback.score != null ? (
                  <span className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    {judgeFeedback.score}/100
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Assessment unavailable
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {judgeFeedback.what_is_good?.length > 0 && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                      What Judges Liked
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {judgeFeedback.what_is_good.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="shrink-0 text-emerald-600 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {judgeFeedback.what_should_change?.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                      What Judges Suggested Changing
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {judgeFeedback.what_should_change.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {judgeFeedback.final_advice && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed italic">
                  <span className="font-bold text-slate-900 not-italic block mb-1">
                    Final Advisory Note:
                  </span>
                  "{judgeFeedback.final_advice}"
                </div>
              )}
            </div>
          </PlanSection>
        </main>
      </div>
    </div>
  );
}