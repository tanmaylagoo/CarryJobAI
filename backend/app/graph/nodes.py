import json

from app.services.llm import generate_text
from app.services.research import research_hackathon

from app.graph.prompts import (
    HACKATHON_ANALYZER_PROMPT,
    IDEATION_PROMPT,
    EVALUATION_PROMPT,
    PROJECT_PLAN_PROMPT,
    TEAM_PLAN_PROMPT,
    TIMELINE_PROMPT,
    PITCH_PROMPT,
    FINAL_JUDGE_PROMPT,
    REFINE_IDEA_PROMPT,
)


import re

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

    # Attempt 3: Remove ASCII control characters
    cleaned_text = re.sub(r"[\x00-\x1F\x7F]", " ", cleaned_text)
    try:
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"[parse_json error] JSON decode failed: {e}\nRaw snippet: {text[:200]}")
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

    prompt = IDEATION_PROMPT.replace(
        "{hackathon}",
        json.dumps(
            state["hackathon"],
            indent=2
        )
    ).replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    ideas = parse_json(
        response
    )

    if isinstance(ideas, dict):
        ideas = ideas.get("ideas", ideas.get("generated_ideas", []))

    if not isinstance(ideas, list):
        ideas = []

    return {
        "ideas": ideas
    }



def evaluate_idea_node(state):

    prompt = EVALUATION_PROMPT.replace(
        "{hackathon}",
        json.dumps(
            state["hackathon"],
            indent=2
        )
    ).replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    ).replace(
        "{idea}",
        json.dumps(
            state["selected_idea"],
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    evaluation = parse_json(
        response
    )

    return {
        "idea_evaluation": evaluation
    }



def project_plan_node(state):

    prompt = PROJECT_PLAN_PROMPT.replace(
        "{hackathon}",
        json.dumps(
            state["hackathon"],
            indent=2
        )
    ).replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    ).replace(
        "{idea}",
        json.dumps(
            state["selected_idea"],
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    return {
        "project_plan": parse_json(
            response
        )
    }

def team_plan_node(state):

    prompt = TEAM_PLAN_PROMPT.replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    ).replace(
        "{project}",
        json.dumps(
            state["project_plan"],
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    result = parse_json(
        response
    )

    if isinstance(result, dict):
        team_plan = result.get("team_plan", [])
    elif isinstance(result, list):
        team_plan = result
    else:
        team_plan = []

    return {
        "team_plan": team_plan
    }



def timeline_node(state):

    prompt = TIMELINE_PROMPT.replace(
        "{hours}",
        str(
            state["hackathon"].get(
                "duration",
                "Unknown"
            )
        )
    ).replace(
        "{project}",
        json.dumps(
            state["project_plan"],
            indent=2
        )
    ).replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    result = parse_json(
        response
    )

    if isinstance(result, dict):
        timeline = result.get("timeline", [])
    elif isinstance(result, list):
        timeline = result
    else:
        timeline = []

    return {
        "timeline": timeline
    }



def pitch_node(state):

    prompt = PITCH_PROMPT.replace(
        "{project}",
        json.dumps(
            state.get("project_plan", {}),
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    pitch_data = parse_json(
        response
    )

    if not isinstance(pitch_data, dict):
        pitch_data = {}

    selected_title = state.get("selected_idea", {}).get("title", "Hackathon Project")
    selected_solution = state.get("selected_idea", {}).get("solution", "An AI-powered solution built to solve the hackathon challenge.")

    if "slides" not in pitch_data or not isinstance(pitch_data.get("slides"), list) or len(pitch_data.get("slides")) == 0:
        pitch_data["slides"] = [
            {
                "slide": 1,
                "title": f"Project Overview: {selected_title}",
                "content": [
                    "Problem Statement & Target Market",
                    "Core Value Proposition",
                    "Why Now & Why This Matters"
                ]
            },
            {
                "slide": 2,
                "title": "Architecture & Technology Stack",
                "content": [
                    "Modular System Architecture",
                    "Integration & Data Pipeline",
                    "Performance & Feasibility"
                ]
            },
            {
                "slide": 3,
                "title": "Demo Script & Future Roadmap",
                "content": [
                    "Live MVP Prototype Walkthrough",
                    "Key Differentiators & Impact",
                    "Post-Hackathon Expansion Plan"
                ]
            }
        ]

    if "one_line_pitch" not in pitch_data or not pitch_data.get("one_line_pitch"):
        pitch_data["one_line_pitch"] = selected_solution

    if "demo_script" not in pitch_data or not isinstance(pitch_data.get("demo_script"), list) or len(pitch_data.get("demo_script")) == 0:
        pitch_data["demo_script"] = [
            "Introduction: Introduce the team and the core problem being solved.",
            "Live Demo: Show the primary MVP user flow in action.",
            "Impact & Future: Summarize technical achievements and market potential."
        ]

    return {
        "pitch": pitch_data
    }



def final_judge_node(state):

    prompt = FINAL_JUDGE_PROMPT.replace(
        "{hackathon}",
        json.dumps(
            state["hackathon"],
            indent=2
        )
    ).replace(
        "{project}",
        json.dumps(
            state["project_plan"],
            indent=2
        )
    ).replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    ).replace(
        "{pitch}",
        json.dumps(
            state["pitch"],
            indent=2
        )
    )

    response = generate_text(
        prompt
    )

    return {
        "judge_feedback": parse_json(
            response
        )
    }

def refine_idea_node(state):

    prompt = REFINE_IDEA_PROMPT.replace(
        "{hackathon}",
        json.dumps(
            state["hackathon"],
            indent=2
        )
    ).replace(
        "{team}",
        json.dumps(
            state["team"],
            indent=2
        )
    ).replace(
        "{idea}",
        json.dumps(
            state["selected_idea"],
            indent=2
        )
    ).replace(
        "{feedback}",
        state.get(
            "idea_feedback",
            ""
        )
    )

    response = generate_text(
        prompt
    )

    refined_idea = parse_json(
        response
    )

    if not isinstance(refined_idea, dict):
        refined_idea = dict(state.get("selected_idea", {}))

    refined_idea["id"] = state.get("selected_idea", {}).get("id", 1)

    return {
        "selected_idea": refined_idea
    }