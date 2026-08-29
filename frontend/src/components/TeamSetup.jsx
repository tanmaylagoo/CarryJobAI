import { useState } from "react";
import { Users, Plus, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const SUGGESTED_SKILLS = [
  "Python",
  "React",
  "FastAPI",
  "Generative AI",
  "Machine Learning",
  "TypeScript",
  "Node.js",
  "UI/UX Design",
  "PyTorch",
  "Tailwind CSS",
  "PostgreSQL",
  "Docker",
];

export default function TeamSetup({
  initialTeam,
  onSaveTeam,
  loading,
  defaultOpen = false,
  hideHeaderToggle = false,
  showSaveButton = true,
  saveButtonText = "Save Team & Regenerate Ideas",
  onTeamChange,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [members, setMembers] = useState(
    initialTeam && initialTeam.length > 0
      ? initialTeam
      : [
          {
            name: "Developer 1",
            skills: ["Python", "FastAPI", "React", "Machine Learning"],
          },
        ]
  );
  const [skillInputs, setSkillInputs] = useState({});

  const notifyChange = (updatedMembers) => {
    if (onTeamChange) {
      onTeamChange(updatedMembers);
    }
  };

  const handleNameChange = (index, name) => {
    const updated = [...members];
    updated[index].name = name;
    setMembers(updated);
    notifyChange(updated);
  };

  const handleAddSkill = (index, skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    const updated = [...members];
    if (!updated[index].skills.includes(trimmed)) {
      updated[index].skills = [...updated[index].skills, trimmed];
      setMembers(updated);
      notifyChange(updated);
    }
    setSkillInputs({ ...skillInputs, [index]: "" });
  };

  const handleRemoveSkill = (memberIndex, skillToRemove) => {
    const updated = [...members];
    updated[memberIndex].skills = updated[memberIndex].skills.filter(
      (s) => s !== skillToRemove
    );
    setMembers(updated);
    notifyChange(updated);
  };

  const handleAddMember = () => {
    const updated = [
      ...members,
      {
        name: `Developer ${members.length + 1}`,
        skills: ["React", "Python"],
      },
    ];
    setMembers(updated);
    notifyChange(updated);
  };

  const handleRemoveMember = (index) => {
    if (members.length <= 1) return;
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
    notifyChange(updated);
  };

  const handleSave = () => {
    if (onSaveTeam) {
      onSaveTeam(members);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6 shadow-xl mb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Users size={18} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              Team & Skills Configuration
              <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-indigo-400 font-medium">
                {members.length} Member{members.length > 1 ? "s" : ""}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Specify your teammates and technical skillsets to customize AI project ideation.
            </p>
          </div>
        </div>

        {!hideHeaderToggle && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white"
          >
            {isOpen ? (
              <>
                Hide Team Editor
                <ChevronUp size={15} />
              </>
            ) : (
              <>
                Customize Team Skills
                <ChevronDown size={15} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Summary View when collapsed */}
      {!isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {members.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs">
                <span className="font-semibold text-zinc-200">{m.name}:</span>
                <div className="flex flex-wrap gap-1">
                  {m.skills.slice(0, 3).map((s, sIdx) => (
                    <span key={sIdx} className="rounded bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 text-[10px]">
                      {s}
                    </span>
                  ))}
                  {m.skills.length > 3 && (
                    <span className="text-[10px] text-zinc-500">+{m.skills.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-xs text-indigo-400 hover:underline font-medium"
          >
            Edit Teammates →
          </button>
        </div>
      )}

      {/* Expanded Editor Form */}
      {isOpen && (
        <div className="mt-6 space-y-6 pt-6 border-t border-zinc-800/80">
          <div className="space-y-4">
            {members.map((member, memberIdx) => (
              <div
                key={memberIdx}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex-1 max-w-sm">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                      Teammate Name / Role
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleNameChange(memberIdx, e.target.value)}
                      placeholder="e.g. Developer, Alex, Frontend Lead"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(memberIdx)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 self-end sm:self-center"
                    >
                      <X size={14} /> Remove Teammate
                    </button>
                  )}
                </div>

                {/* Skills Input & Tags */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                    Skills & Technologies
                  </label>

                  {/* Existing Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-medium text-indigo-300"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(memberIdx, skill)}
                          className="hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Custom Skill Input */}
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={skillInputs[memberIdx] || ""}
                      onChange={(e) =>
                        setSkillInputs({ ...skillInputs, [memberIdx]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill(memberIdx, skillInputs[memberIdx] || "");
                        }
                      }}
                      placeholder="Type a skill and press Enter (e.g. PyTorch)..."
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(memberIdx, skillInputs[memberIdx] || "")}
                      className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                    >
                      Add
                    </button>
                  </div>

                  {/* Suggested Skills */}
                  <div className="mt-3">
                    <span className="text-[10px] text-zinc-500 block mb-1">Quick add popular skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {SUGGESTED_SKILLS.filter((s) => !member.skills.includes(s)).map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddSkill(memberIdx, s)}
                          className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-300"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddMember}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              <Plus size={15} /> Add Another Teammate
            </button>

            {showSaveButton && (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Sparkles size={14} />
                    {saveButtonText}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
