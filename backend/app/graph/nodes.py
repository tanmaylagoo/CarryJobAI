import json
import re

from app.services.llm import generate_text
from app.services.research import research_hackathon

from app.graph.prompts import (
    HACKATHON_ANALYZER_PROMPT,
    IDEATION_PROMPT,
    PROBLEM_IDEATION_PROMPT,
    EVALUATION_PROMPT,
    PROJECT_PLAN_PROMPT,
    TEAM_PLAN_PROMPT,
    TIMELINE_PROMPT,
    PITCH_PROMPT,
    FINAL_JUDGE_PROMPT,
    REFINE_IDEA_PROMPT,
)



def _clamp(value, lo, hi):
    """Clamp a numeric value to [lo, hi]. Returns None if value is not numeric."""
    try:
        v = float(value)
        return max(lo, min(hi, v))
    except (TypeError, ValueError):
        return None


def _clamp_idea_scores(idea):
    """Clamp all idea-level score fields to 0–10 in-place. Returns the idea dict."""
    if not isinstance(idea, dict):
        return idea
    score_fields = [
        "innovation_score",
        "feasibility_score",
        "impact_score",
        "judge_score",
        "time_fit_score",
        "team_fit_score",
        "resource_fit_score",
        "overall_score",
    ]
    for field in score_fields:
        if field in idea and idea[field] is not None:
            idea[field] = _clamp(idea[field], 0, 10)
    return idea


def get_hackathon_context_for_prompt(state):
    if state.get("hackathon"):
        return state["hackathon"]
    elif state.get("input_mode") == "problem_statement":
        constraints = state.get("constraints", {})
        return {
            "name": "Direct Problem Statement Project",
            "description": state.get("problem_statement", ""),
            "duration": constraints.get("available_time", "Unknown"),
            "judging_criteria": [
                {
                    "criterion": "Time Constraint Fit",
                    "description": f"Must be realistic for {constraints.get('available_time', 'the target time')}",
                },
                {
                    "criterion": "Resource & Skill Fit",
                    "description": f"Leverages available resources ({', '.join(constraints.get('resources', [])) if constraints.get('resources') else 'standard tools'}) and team skills",
                },
                {
                    "criterion": "Problem Solving & Impact",
                    "description": "Effectively addresses the stated problem",
                },
            ],
            "technologies_or_requirements": constraints.get("resources", []),
        }
    return {}

def parse_json(response: str):
    if not response or not isinstance(response, str) or not response.strip():
        return {}

    text = response.strip()

    # Match markdown code block ```json ... ```
    code_block_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if code_block_match:
        text = code_block_match.group(1).strip()

    # Extract JSON structure between outermost braces or brackets
    first_brace = text.find('{')
    first_bracket = text.find('[')

    start_idx = -1
    end_idx = -1

    if first_brace != -1 and (first_bracket == -1 or first_brace < first_bracket):
        start_idx = first_brace
        end_idx = text.rfind('}')
    elif first_bracket != -1:
        start_idx = first_bracket
        end_idx = text.rfind(']')

    if start_idx != -1 and end_idx != -1 and end_idx >= start_idx:
        text = text[start_idx:end_idx + 1].strip()

    # Attempt 1: Standard JSON parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # Attempt 2: Strip trailing commas inside arrays or objects
    cleaned_text = re.sub(r",\s*([\}\]])", r"\1", text)
    try:
        return json.loads(cleaned_text)
    except Exception:
        pass

    # Attempt 3: Remove ASCII control characters & parse with strict=False
    cleaned_text = re.sub(r"[\x00-\x1F\x7F]", " ", cleaned_text)
    try:
        return json.loads(cleaned_text, strict=False)
    except Exception as e:
        print(f"[parse_json error] JSON decode failed: {e}\nRaw response snippet: {response[:300]}")
        return {}



def research_node(state):

    research = research_hackathon(
        state["hackathon_url"]
    )

    return {
        "hackathon_content": research[
            "main_content"
        ],

        "research_results": research[
            "search_results"
        ]
    }



def hackathon_analyzer_node(state):

    prompt = HACKATHON_ANALYZER_PROMPT.replace(
        "{main_content}",
        state.get(
            "hackathon_content",
            ""
        )
    ).replace(
        "{research_results}",
        json.dumps(
            state.get(
                "research_results",
                []
            ),
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    hackathon = parse_json(
        response
    )

    return {
        "hackathon": hackathon
    }


def ideation_node(state):
    if state.get("input_mode") == "problem_statement":
        constraints = state.get("constraints", {})
        prompt = (
            PROBLEM_IDEATION_PROMPT.replace(
                "{problem_statement}", state.get("problem_statement", "")
            )
            .replace(
                "{available_time}",
                str(constraints.get("available_time", "24 hours")),
            )
            .replace(
                "{team_size}",
                str(constraints.get("team_size", len(state.get("team", [])))),
            )
            .replace("{resources}", json.dumps(constraints.get("resources", [])))
            .replace("{team}", json.dumps(state.get("team", []), indent=2))
        )
    else:
        prompt = IDEATION_PROMPT.replace(
            "{hackathon}", json.dumps(state.get("hackathon", {}), indent=2)
        ).replace("{team}", json.dumps(state.get("team", []), indent=2))

    response = generate_text(prompt)

    ideas = parse_json(response)

    if isinstance(ideas, dict):
        ideas = ideas.get("ideas", ideas.get("generated_ideas", []))

    if not isinstance(ideas, list):
        ideas = []

    # Clamp all idea-level scores to 0-10
    ideas = [_clamp_idea_scores(idea) for idea in ideas]

    return {"ideas": ideas}


def evaluate_idea_node(state):
    hackathon_ctx = get_hackathon_context_for_prompt(state)

    prompt = (
        EVALUATION_PROMPT.replace("{hackathon}", json.dumps(hackathon_ctx, indent=2))
        .replace("{team}", json.dumps(state.get("team", []), indent=2))
        .replace("{idea}", json.dumps(state.get("selected_idea", {}), indent=2))
    )

    response = generate_text(prompt)

    evaluation = parse_json(response)

    # Clamp overall_score to 0-100 (evaluation uses 100-point scale)
    if isinstance(evaluation, dict) and "overall_score" in evaluation:
        clamped = _clamp(evaluation["overall_score"], 0, 100)
        if clamped is not None:
            evaluation["overall_score"] = int(round(clamped))

    return {"idea_evaluation": evaluation}


def project_plan_node(state):
    hackathon_ctx = get_hackathon_context_for_prompt(state)

    prompt = (
        PROJECT_PLAN_PROMPT.replace("{hackathon}", json.dumps(hackathon_ctx, indent=2))
        .replace("{team}", json.dumps(state.get("team", []), indent=2))
        .replace("{idea}", json.dumps(state.get("selected_idea", {}), indent=2))
    )

    response = generate_text(prompt)

    return {"project_plan": parse_json(response)}


def team_plan_node(state):

    prompt = TEAM_PLAN_PROMPT.replace(
        "{team}", json.dumps(state.get("team", []), indent=2)
    ).replace("{project}", json.dumps(state.get("project_plan", {}), indent=2))

    response = generate_text(prompt)

    result = parse_json(response)

    if isinstance(result, dict):
        team_plan = result.get("team_plan", [])
    elif isinstance(result, list):
        team_plan = result
    else:
        team_plan = []

    return {"team_plan": team_plan}


def timeline_node(state):
    duration = (
        (state.get("hackathon") or {}).get("duration")
        or (state.get("constraints") or {}).get("available_time")
        or "Unknown"
    )

    prompt = (
        TIMELINE_PROMPT.replace("{hours}", str(duration))
        .replace("{project}", json.dumps(state.get("project_plan", {}), indent=2))
        .replace("{team}", json.dumps(state.get("team", []), indent=2))
    )

    response = generate_text(prompt)

    result = parse_json(response)

    if isinstance(result, dict):
        timeline = result.get("timeline", [])
    elif isinstance(result, list):
        timeline = result
    else:
        timeline = []

    return {"timeline": timeline}


def pitch_node(state):

    prompt = PITCH_PROMPT.replace(
        "{project}", json.dumps(state.get("project_plan", {}), indent=2)
    )

    response = generate_text(prompt)

    pitch_data = parse_json(response)

    if not isinstance(pitch_data, dict):
        pitch_data = {}

    selected_title = state.get("selected_idea", {}).get("title", "Project MVP")
    selected_solution = state.get("selected_idea", {}).get(
        "solution", "An AI-powered solution built to solve the challenge."
    )

    if (
        "slides" not in pitch_data
        or not isinstance(pitch_data.get("slides"), list)
        or len(pitch_data.get("slides")) == 0
    ):
        pitch_data["slides"] = [
            {
                "slide": 1,
                "title": f"Project Overview: {selected_title}",
                "content": [
                    "Problem Statement & Target Market",
                    "Core Value Proposition",
                    "Why Now & Why This Matters",
                ],
            },
            {
                "slide": 2,
                "title": "Architecture & Technology Stack",
                "content": [
                    "Modular System Architecture",
                    "Integration & Data Pipeline",
                    "Performance & Feasibility",
                ],
            },
            {
                "slide": 3,
                "title": "Demo Script & Future Roadmap",
                "content": [
                    "Live MVP Prototype Walkthrough",
                    "Key Differentiators & Impact",
                    "Post-Hackathon Expansion Plan",
                ],
            },
        ]

    if "one_line_pitch" not in pitch_data or not pitch_data.get("one_line_pitch"):
        pitch_data["one_line_pitch"] = selected_solution

    if (
        "demo_script" not in pitch_data
        or not isinstance(pitch_data.get("demo_script"), list)
        or len(pitch_data.get("demo_script")) == 0
    ):
        pitch_data["demo_script"] = [
            "Introduction: Introduce the team and the core problem being solved.",
            "Live Demo: Show the primary MVP user flow in action.",
            "Impact & Future: Summarize technical achievements and market potential.",
        ]

    return {"pitch": pitch_data}


def final_judge_node(state):
    hackathon_ctx = get_hackathon_context_for_prompt(state)

    prompt = (
        FINAL_JUDGE_PROMPT.replace(
            "{hackathon}", json.dumps(hackathon_ctx, indent=2)
        )
        .replace("{project}", json.dumps(state.get("project_plan", {}), indent=2))
        .replace("{team}", json.dumps(state.get("team", []), indent=2))
        .replace("{pitch}", json.dumps(state.get("pitch", {}), indent=2))
    )

    response = generate_text(prompt)

    judge_data = parse_json(response)

    # Clamp judge score to 0-100 (final judge uses 100-point scale)
    if isinstance(judge_data, dict) and "score" in judge_data:
        clamped = _clamp(judge_data["score"], 0, 100)
        if clamped is not None:
            judge_data["score"] = int(round(clamped))

    return {"judge_feedback": judge_data}


def refine_idea_node(state):
    hackathon_ctx = get_hackathon_context_for_prompt(state)

    prompt = (
        REFINE_IDEA_PROMPT.replace(
            "{hackathon}", json.dumps(hackathon_ctx, indent=2)
        )
        .replace("{team}", json.dumps(state.get("team", []), indent=2))
        .replace("{idea}", json.dumps(state.get("selected_idea", {}), indent=2))
        .replace("{feedback}", state.get("idea_feedback", ""))
    )

    response = generate_text(prompt)

    refined_idea = parse_json(response)

    if not isinstance(refined_idea, dict):
        refined_idea = dict(state.get("selected_idea", {}))

    refined_idea["id"] = state.get("selected_idea", {}).get("id", 1)

    # Clamp refined idea-level scores to 0-10
    _clamp_idea_scores(refined_idea)

    return {"selected_idea": refined_idea}