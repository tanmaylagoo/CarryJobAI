import { useState } from "react";
import { Plus, X, Users, Check } from "lucide-react";

const SUGGESTED_SKILLS = [
  "Python",
  "React",
  "FastAPI",
  "Node.js",
  "TypeScript",
  "Machine Learning",
  "PostgreSQL",
  "PyTorch",
  "Docker",
  "Tailwind CSS",
  "Next.js",
  "Go",
];

export default function TeamSetup({
  initialTeam,
  onSaveTeam,
  loading = false,
  showSaveButton = true,
  saveButtonText = "Save Team & Regenerate Ideas",
  onTeamChange,
}) {
  const [members, setMembers] = useState(
    initialTeam && initialTeam.length > 0
      ? initialTeam
      : [
          {
            name: "Team Member 1",
            skills: ["Python", "FastAPI", "Machine Learning"],
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
    const nextIndex = members.length + 1;
    const updated = [
      ...members,
      {
        name: `Team Member ${nextIndex}`,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Team Members ({members.length})
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Add team members and technical skills to align idea feasibility with team capacity.
          </p>
        </div>
      </div>

      {/* Member Cards List */}
      <div className="space-y-3">
        {members.map((member, memberIdx) => (
          <div
            key={memberIdx}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs transition-colors hover:border-slate-300"
          >
            {/* Top row: Name + Remove button */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleNameChange(memberIdx, e.target.value)}
                placeholder="Member name or role (e.g. Alice)"
                className="font-semibold text-sm text-slate-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder:text-slate-400 w-full"
              />

              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(memberIdx)}
                  className="text-xs font-medium text-slate-400 hover:text-red-600 transition shrink-0"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Skills display & management */}
            <div className="pt-3">
              {/* Active skill chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {member.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(memberIdx, skill)}
                      className="text-slate-400 hover:text-slate-700"
                      title="Remove skill"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom skill input */}
              <div className="flex items-center gap-2 max-w-sm">
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
                  placeholder="Type skill and press enter..."
                  className="flex-1 rounded-md border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(memberIdx, skillInputs[memberIdx] || "")}
                  className="rounded-md bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-slate-400 mr-1">Suggestions:</span>
                {SUGGESTED_SKILLS.filter((s) => !member.skills.includes(s))
                  .slice(0, 5)
                  .map((suggested, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleAddSkill(memberIdx, suggested)}
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-600 hover:border-blue-400 hover:text-blue-700 transition"
                    >
                      + {suggested}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Button */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleAddMember}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs"
        >
          <Plus size={14} className="text-slate-500" />
          <span>Add team member</span>
        </button>

        {showSaveButton && (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating Ideas..." : saveButtonText}
          </button>
        )}
      </div>
    </div>
  );
}
