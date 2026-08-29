from langgraph.graph import (
    StateGraph,
    START,
    END
)

from app.graph.state import HackathonState

from app.graph.nodes import (
    research_node,
    hackathon_analyzer_node,
    ideation_node,
    evaluate_idea_node,
    project_plan_node,
    team_plan_node,
    timeline_node,
    pitch_node,
    refine_idea_node,
    final_judge_node,
)


def build_hackathon_graph():

    graph = StateGraph(
        HackathonState
    )

    graph.add_node(
        "research",
        research_node
    )

    graph.add_node(
        "hackathon_analyzer",
        hackathon_analyzer_node
    )

    graph.add_edge(
        START,
        "research"
    )

    graph.add_edge(
        "research",
        "hackathon_analyzer"
    )

    graph.add_edge(
        "hackathon_analyzer",
        END
    )

    return graph.compile()


def build_ideation_graph():

    graph = StateGraph(
        HackathonState
    )

    graph.add_node(
        "ideation",
        ideation_node
    )

    graph.add_edge(
        START,
        "ideation"
    )

    graph.add_edge(
        "ideation",
        END
    )

    return graph.compile()


def build_planning_graph():

    graph = StateGraph(
        HackathonState
    )

    graph.add_node(
        "evaluate",
        evaluate_idea_node
    )

    graph.add_node(
        "project_plan",
        project_plan_node
    )

    graph.add_node(
        "team_plan",
        team_plan_node
    )

    graph.add_node(
        "timeline",
        timeline_node
    )

    graph.add_node(
        "pitch",
        pitch_node
    )

    graph.add_node(
        "final_judge",
        final_judge_node
    )

    graph.add_edge(
        START,
        "evaluate"
    )

    graph.add_edge(
        "evaluate",
        "project_plan"
    )

    graph.add_edge(
        "project_plan",
        "team_plan"
    )

    graph.add_edge(
        "project_plan",
        "timeline"
    )

    graph.add_edge(
        "team_plan",
        "pitch"
    )

    graph.add_edge(
        "timeline",
        "pitch"
    )

    graph.add_edge(
        "pitch",
        "final_judge"
    )

    graph.add_edge(
        "final_judge",
        END
    )

    return graph.compile()

def build_refinement_graph():

    graph = StateGraph(
        HackathonState
    )

    graph.add_node(
        "refine_idea",
        refine_idea_node
    )

    graph.add_edge(
        START,
        "refine_idea"
    )

    graph.add_edge(
        "refine_idea",
        END
    )

    return graph.compile()


hackathon_graph = build_hackathon_graph()

ideation_graph = build_ideation_graph()

refinement_graph = build_refinement_graph()

planning_graph = build_planning_graph()

