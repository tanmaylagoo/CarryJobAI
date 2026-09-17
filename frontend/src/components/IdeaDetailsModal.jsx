import { useEffect, useRef } from "react";
import { X, Clock, Check, ArrowRight, AlertTriangle, Users, Layers } from "lucide-react";

export default function IdeaDetailsModal({ idea, selected, onSelect, onClose, selecting = false }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Auto-focus the close button on mount for accessibility
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  if (!idea) return null;

  // Close when clicking the overlay backdrop
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Score rows — only non-null values
  const scoreRows = [
    { label: "Innovation",   value: idea.innovation_score },
    { label: "Impact",       value: idea.impact_score },
    { label: "Feasibility",  value: idea.feasibility_score },
    { label: "Judge Appeal", value: idea.judge_score },
    { label: "Time Fit",     value: idea.time_fit_score },
    { label: "Team Fit",     value: idea.team_fit_score },
    { label: "Resource Fit", value: idea.resource_fit_score },
  ].filter((s) => s.value != null);

  const overallScore =
    idea.overall_score ??
    idea.judge_score ??
    (idea.feasibility_score && idea.innovation_score
      ? Number(
          ((idea.feasibility_score + idea.innovation_score + (idea.impact_score || 7)) / 3).toFixed(1)
        )
      : null);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Idea details: ${idea.title}`}
      className="idea-modal-overlay"
    >
      <div className="idea-modal-panel">

        {/* ── Header ── */}
        <div className="idea-modal-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="idea-modal-eyebrow">Detailed project strategy</p>
            <h2 className="idea-modal-title">{idea.title}</h2>

            <div className="idea-modal-meta-row">
              {idea.difficulty && (
                <span className="idea-badge">{idea.difficulty}</span>
              )}
              {idea.estimated_hours != null && (
                <span className="idea-badge idea-badge-flex">
                  <Clock size={11} className="idea-badge-icon" />
                  {idea.estimated_hours}h
                </span>
              )}
              {overallScore != null && (
                <span className="idea-badge idea-badge-strong">
                  Score&nbsp;{overallScore}/10
                </span>
              )}
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close idea details"
            className="idea-modal-close-btn"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="idea-modal-body">

          {/* 1. Overview */}
          <section className="idea-modal-section">
            <SectionLabel>Overview</SectionLabel>
            {idea.problem && (
              <DetailBlock label="Problem">{idea.problem}</DetailBlock>
            )}
            {idea.solution && (
              <div style={{ marginTop: "10px" }}>
                <DetailBlock label="Solution">{idea.solution}</DetailBlock>
              </div>
            )}
          </section>

          {/* 2. Key Features */}
          {idea.key_features?.length > 0 && (
            <section className="idea-modal-section">
              <SectionLabel>Key Features</SectionLabel>
              <ul className="idea-feature-list">
                {idea.key_features.map((f, i) => (
                  <li key={i} className="idea-feature-item">
                    <span className="idea-bullet">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Why This Team */}
          {idea.why_this_team && (
            <section className="idea-modal-section">
              <SectionLabel icon={<Users size={13} className="idea-section-icon-blue" />}>
                Why This Team
              </SectionLabel>
              <p className="idea-why-text">{idea.why_this_team}</p>
            </section>
          )}

          {/* 4. Tech Stack */}
          {idea.tech_stack?.length > 0 && (
            <section className="idea-modal-section">
              <SectionLabel icon={<Layers size={13} className="idea-section-icon-muted" />}>
                Tech Stack
              </SectionLabel>
              <div className="idea-tech-chips">
                {idea.tech_stack.map((t, i) => (
                  <span key={i} className="idea-badge">{t}</span>
                ))}
              </div>
            </section>
          )}

          {/* 5. Evaluation */}
          {scoreRows.length > 0 && (
            <section className="idea-modal-section">
              <SectionLabel>Evaluation</SectionLabel>
              <div className="idea-scores-grid">
                {scoreRows.map((s, i) => (
                  <ScoreRow key={i} label={s.label} value={s.value} />
                ))}
              </div>

              {overallScore != null && (
                <div className="idea-overall-score">
                  <span className="idea-overall-label">Overall Score</span>
                  <span className="idea-overall-value">
                    {overallScore}
                    <span className="idea-overall-denom">/10</span>
                  </span>
                </div>
              )}
            </section>
          )}

          {/* 6. Effort */}
          {(idea.estimated_hours != null || idea.difficulty) && (
            <section className="idea-modal-section">
              <SectionLabel>Effort</SectionLabel>
              <div className="idea-meta-tiles">
                {idea.estimated_hours != null && (
                  <MetaTile label="Estimated Time" value={`~${idea.estimated_hours} hours`} />
                )}
                {idea.difficulty && (
                  <MetaTile label="Difficulty" value={idea.difficulty} />
                )}
              </div>
            </section>
          )}

          {/* 7. Risks */}
          {idea.risks?.length > 0 && (
            <section className="idea-modal-section">
              <SectionLabel icon={<AlertTriangle size={13} className="idea-section-icon-amber" />}>
                Risks
              </SectionLabel>
              <div className="idea-risks-box">
                {idea.risks.map((r, i) => (
                  <div key={i} className="idea-risk-item">
                    <span className="idea-bullet idea-bullet-amber">•</span>
                    {r}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Footer CTA ── */}
        <div className="idea-modal-footer">
          <button
            type="button"
            onClick={() => { onSelect(idea); onClose(); }}
            disabled={selecting}
            className={`idea-modal-select-btn${selected ? " idea-modal-select-btn--selected" : ""}`}
          >
            {selected ? (
              <>
                <Check size={14} />
                <span>Selected for Plan</span>
              </>
            ) : (
              <>
                <span>Select This Idea</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionLabel({ children, icon }) {
  return (
    <div className="idea-section-label">
      {icon}
      <h3 className="idea-section-label-text">{children}</h3>
    </div>
  );
}

function DetailBlock({ label, children }) {
  return (
    <div>
      <span className="idea-detail-label">{label}</span>
      <p className="idea-detail-text">{children}</p>
    </div>
  );
}

function ScoreRow({ label, value }) {
  const pct = Math.min(100, Math.max(8, value * 10));
  return (
    <div className="idea-score-row">
      <div className="idea-score-row-header">
        <span className="idea-score-label">{label}</span>
        <span className="idea-score-value">
          {value}<span className="idea-score-denom">/10</span>
        </span>
      </div>
      <div className="idea-score-track">
        <div className="idea-score-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MetaTile({ label, value }) {
  return (
    <div className="idea-meta-tile">
      <span className="idea-meta-tile-label">{label}</span>
      <span className="idea-meta-tile-value">{value}</span>
    </div>
  );
}
