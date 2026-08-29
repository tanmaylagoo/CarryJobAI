import {
  ArrowLeft,
  Sparkles,
  Layers,
  Cpu,
  CheckSquare,
  PlusCircle,
  XCircle,
  ListOrdered,
  Users,
  Clock,
  Presentation,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Award,
  CheckCircle2
} from "lucide-react";
import PlanSection from "../components/PlanSection";

export default function Workspace({ session, onBack }) {
  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">No game plan found</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Please select an idea and create your plan first.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white"
          >
            <ArrowLeft size={16} />
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

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Navigation & Header */}
      <div>
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Idea Selection
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-3">
              <Sparkles size={14} />
              CarryJob Execution Blueprint
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Hackathon Game Plan
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
              Complete build roadmap, architectural design, team breakdown, presentation slides, and judge feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Idea Summary Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Selected Project Idea
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              {selectedIdea.title || "Hackathon Project"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIdea.difficulty && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 border border-zinc-700">
                Difficulty: {selectedIdea.difficulty}
              </span>
            )}
            {selectedIdea.estimated_hours != null && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 border border-zinc-700">
                Est. Time: {selectedIdea.estimated_hours} Hours
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {selectedIdea.problem && (
            <div className="rounded-xl bg-zinc-950/60 p-4 border border-zinc-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Problem Statement
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedIdea.problem}
              </p>
            </div>
          )}

          {selectedIdea.solution && (
            <div className="rounded-xl bg-zinc-950/60 p-4 border border-zinc-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Proposed Solution
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedIdea.solution}
              </p>
            </div>
          )}
        </div>

        {/* Tech Stack Chips */}
        {selectedIdea.tech_stack?.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">Tech Stack:</span>
            {selectedIdea.tech_stack.map((t, idx) => (
              <span
                key={idx}
                className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1: IDEA EVALUATION */}
      <PlanSection title="1. Idea Evaluation">
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Evaluation Verdict
              </div>
              <p className="text-sm font-medium text-zinc-200 mt-1">
                {evaluation.final_verdict || "Strong hackathon contender with high feasibility."}
              </p>
            </div>
            {evaluation.overall_score != null && (
              <div className="shrink-0 flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase text-zinc-400">Overall Score</div>
                  <div className="text-2xl font-black text-indigo-400">{evaluation.overall_score}/100</div>
                </div>
              </div>
            )}
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
                <TrendingUp size={15} />
                Project Strengths
              </h4>
              {evaluation.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-400 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500">No specific strengths listed.</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                <AlertTriangle size={15} />
                Weaknesses & Bottlenecks
              </h4>
              {evaluation.weaknesses?.length > 0 ? (
                <ul className="space-y-2">
                  {evaluation.weaknesses.map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                      <span className="shrink-0 text-amber-400">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500">No specific weaknesses listed.</p>
              )}
            </div>
          </div>

          {/* Risks & Recommendations */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Risks */}
            {evaluation.risks?.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-3">
                  <ShieldCheck size={15} />
                  Technical Risks
                </h4>
                <ul className="space-y-2">
                  {evaluation.risks.map((rk, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 leading-relaxed">
                      • {rk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {evaluation.recommendations?.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2 mb-3">
                  <Lightbulb size={15} />
                  Strategic Recommendations
                </h4>
                <ul className="space-y-2">
                  {evaluation.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 leading-relaxed">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </PlanSection>

      {/* SECTION 2: PROJECT ARCHITECTURE */}
      <PlanSection title="2. Project Architecture">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center gap-2 text-indigo-400 mb-3 text-xs font-semibold uppercase tracking-wider">
            <Layers size={16} />
            System Architecture Overview
          </div>
          {typeof projectPlan.architecture === "string" ? (
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {projectPlan.architecture}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-zinc-400">
              {JSON.stringify(projectPlan.architecture || "Modular monolithic architecture with lightweight API endpoints and responsive frontend dashboard.")}
            </p>
          )}
        </div>
      </PlanSection>

      {/* SECTION 3: TECH STACK */}
      <PlanSection title="3. Tech Stack">
        {projectPlan.tech_stack?.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectPlan.tech_stack.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 transition hover:border-zinc-700"
              >
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <Cpu size={16} />
                  <span>{typeof item === "string" ? item : item.technology}</span>
                </div>
                {item.reason && (
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {item.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No tech stack details provided.</p>
        )}
      </PlanSection>

      {/* SECTION 4: MVP FEATURES */}
      <PlanSection title="4. MVP Features">
        {projectPlan.mvp_features?.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {projectPlan.mvp_features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4"
              >
                <CheckSquare size={18} className="shrink-0 text-indigo-400 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No MVP features specified.</p>
        )}
      </PlanSection>

      {/* SECTION 5: NICE TO HAVE */}
      <PlanSection title="5. Nice To Have">
        {projectPlan.nice_to_have?.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {projectPlan.nice_to_have.map((nth, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
              >
                <PlusCircle size={17} className="shrink-0 text-indigo-400/80 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {nth}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No bonus features listed.</p>
        )}
      </PlanSection>

      {/* SECTION 6: DON'T BUILD */}
      <PlanSection title="6. Don't Build (Scope Creep Guard)">
        {projectPlan.do_not_build?.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {projectPlan.do_not_build.map((dnb, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4"
              >
                <XCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
                <span className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                  {dnb}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No anti-goals listed.</p>
        )}
      </PlanSection>

      {/* SECTION 7: IMPLEMENTATION STEPS */}
      <PlanSection title="7. Implementation Steps">
        {projectPlan.implementation_steps?.length > 0 ? (
          <div className="space-y-3">
            {projectPlan.implementation_steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 font-bold text-indigo-400 text-xs">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm text-zinc-200 leading-relaxed mt-0.5">
                  {step}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No implementation steps defined.</p>
        )}
      </PlanSection>

      {/* SECTION 8: TEAM DISTRIBUTION */}
      <PlanSection title="8. Team Workload Distribution">
        {teamPlan?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {teamPlan.map((tp, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5"
              >
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-400" />
                    <h4 className="font-semibold text-white text-sm">
                      {tp.member || `Member ${idx + 1}`}
                    </h4>
                  </div>
                  {tp.role && (
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs text-indigo-300 font-medium">
                      {tp.role}
                    </span>
                  )}
                </div>

                {tp.tasks?.length > 0 && (
                  <ul className="space-y-2">
                    {tp.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No team breakdown provided.</p>
        )}
      </PlanSection>

      {/* SECTION 9: BUILD TIMELINE */}
      <PlanSection title="9. Build Timeline">
        {timeline?.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
            {timeline.map((tl, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-indigo-400 bg-zinc-950" />
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={13} />
                      {tl.time || tl.duration || `Phase ${idx + 1}`}
                    </span>
                    {tl.phase && (
                      <span className="text-xs font-semibold text-white">
                        {tl.phase}
                      </span>
                    )}
                  </div>
                  {tl.tasks?.length > 0 && (
                    <ul className="space-y-1.5 mt-3">
                      {tl.tasks.map((tsk, tIdx) => (
                        <li key={tIdx} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                          <span className="text-zinc-500">•</span>
                          <span>{tsk}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No timeline information defined.</p>
        )}
      </PlanSection>

      {/* SECTION 10: PRESENTATION / PPT */}
      <PlanSection title="10. Presentation & Pitch Deck">
        <div className="space-y-6">
          {/* One-Line Pitch Spotlight */}
          {pitch.one_line_pitch && (
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                One-Line Elevator Pitch
              </span>
              <p className="text-base sm:text-lg font-semibold text-white mt-1 italic">
                "{pitch.one_line_pitch}"
              </p>
            </div>
          )}

          {/* Slides Deck Grid */}
          {pitch.slides?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-4">
                <Presentation size={16} className="text-indigo-400" />
                Slide Deck Structure
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pitch.slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-400 mb-2">
                        <span>SLIDE {slide.slide || idx + 1}</span>
                      </div>
                      <h5 className="font-bold text-white text-base mb-3 border-b border-zinc-800/80 pb-2">
                        {slide.title}
                      </h5>
                      {slide.content?.length > 0 && (
                        <ul className="space-y-2">
                          {slide.content.map((pt, pIdx) => (
                            <li key={pIdx} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-1.5">
                              <span className="text-indigo-400 mt-0.5">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Script Box */}
          {pitch.demo_script?.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-3">
                <Sparkles size={15} className="text-indigo-400" />
                Demo Script Walkthrough
              </h4>
              <ol className="space-y-2">
                {pitch.demo_script.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-400">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </PlanSection>

      {/* SECTION 11: FINAL JUDGE FEEDBACK */}
      <PlanSection title="11. Final Judge Feedback">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Award size={16} />
                Simulated Hackathon Judge Assessment
              </span>
            </div>
            {judgeFeedback.score != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Score:</span>
                <span className="rounded-xl bg-indigo-600 px-3 py-1 text-sm font-extrabold text-white">
                  {judgeFeedback.score}/10
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* What is Good */}
            {judgeFeedback.what_is_good?.length > 0 && (
              <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                  What is Good
                </h4>
                <ul className="space-y-1.5">
                  {judgeFeedback.what_is_good.map((good, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-400 mt-0.5" />
                      <span>{good}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What Should Change */}
            {judgeFeedback.what_should_change?.length > 0 && (
              <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  What Should Change
                </h4>
                <ul className="space-y-1.5">
                  {judgeFeedback.what_should_change.map((change, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Final Advice */}
          {judgeFeedback.final_advice && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Final Advice
              </span>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
                "{judgeFeedback.final_advice}"
              </p>
            </div>
          )}
        </div>
      </PlanSection>
    </main>
  );
}