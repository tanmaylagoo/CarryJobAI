from typing import TypedDict, List, Dict, Any


class HackathonState(TypedDict, total=False):

    session_id: str

    hackathon_url: str

    hackathon_content: str
    research_results: List[Dict[str, Any]]

    hackathon: Dict[str, Any]

    team: List[Dict[str, Any]]

    ideas: List[Dict[str, Any]]
    selected_idea: Dict[str, Any]

    idea_feedback: str
    idea_evaluation: Dict[str, Any]

    project_plan: Dict[str, Any]
    team_plan: List[Dict[str, Any]]
    timeline: List[Dict[str, Any]]

    pitch: Dict[str, Any]

    judge_feedback: Dict[str, Any]