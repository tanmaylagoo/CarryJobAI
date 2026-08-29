import uuid

from fastapi import (
    FastAPI,
    HTTPException
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.schemas import (
    HackathonURLRequest,
    TeamInput,
    SelectIdeaRequest,
    RefineIdeaRequest,
    PlanRequest,
)

from app.graph.workflow import (
    hackathon_graph,
    ideation_graph,
    refinement_graph,
    planning_graph,
)


app = FastAPI(
    title="CarryJob API",
    description="AI Hackathon Copilot",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


sessions = {}


@app.get("/")
def root():

    return {
        "message": "CarryJob API is running"
    }




@app.post(
    "/api/analyze-hackathon"
)
def analyze_hackathon(
    data: HackathonURLRequest
):

    session_id = str(
        uuid.uuid4()
    )

    state = {
        "session_id": session_id,
        "hackathon_url": str(
            data.url
        )
    }

    if data.team_members:
        state["team"] = [
            member.model_dump()
            for member in data.team_members
        ]

    try:

        result = hackathon_graph.invoke(
            state
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Research/AI analysis failed: {str(e)}"
        )

    sessions[session_id] = result

    return {
        "session_id": session_id,
        "hackathon": result[
            "hackathon"
        ],
        "team": result.get("team", [])
    }



@app.post("/api/team")
def add_team(
    data: TeamInput
):

    if data.session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    state = sessions[
        data.session_id
    ]

    state["team"] = [
        member.model_dump()
        for member in data.team_members
    ]

    sessions[
        data.session_id
    ] = state

    return {
        "message": "Team saved",
        "team": state["team"]
    }



@app.post(
    "/api/ideas/{session_id}"
)
def generate_ideas(
    session_id: str
):

    if session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    state = sessions[
        session_id
    ]

    if "team" not in state:

        raise HTTPException(
            status_code=400,
            detail="Please add your team first."
        )

    result = ideation_graph.invoke(
        state
    )

    sessions[
        session_id
    ] = result

    return {
        "session_id": session_id,
        "ideas": result[
            "ideas"
        ]
    }

@app.post(
    "/api/select-idea"
)
def select_idea(
    data: SelectIdeaRequest
):

    if data.session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    state = sessions[
        data.session_id
    ]

    selected = next(
        (
            idea
            for idea in state["ideas"]
            if idea["id"] == data.idea_id
        ),
        None
    )

    if not selected:

        raise HTTPException(
            status_code=404,
            detail="Idea not found"
        )

    state[
        "selected_idea"
    ] = selected

    sessions[
        data.session_id
    ] = state

    return {
        "message": "Idea selected",
        "selected_idea": selected
    }



@app.post("/api/refine-idea")
def refine_idea(
    data: RefineIdeaRequest
):

    if data.session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    state = sessions[
        data.session_id
    ]

    if "selected_idea" not in state:

        raise HTTPException(
            status_code=400,
            detail="Please select an idea first."
        )

    if not data.feedback.strip():

        raise HTTPException(
            status_code=400,
            detail="Feedback cannot be empty."
        )

    # Store user feedback
    state[
        "idea_feedback"
    ] = data.feedback

    try:

        result = refinement_graph.invoke(
            state
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Idea refinement failed: {str(e)}"
        )

    sessions[
        data.session_id
    ] = result

    return {
        "message": "Idea refined successfully",
        "feedback": data.feedback,
        "selected_idea": result[
            "selected_idea"
        ]
    }


@app.post("/api/plan")
def create_plan(
    data: PlanRequest
):

    if data.session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    state = sessions[
        data.session_id
    ]

    if "selected_idea" not in state:

        raise HTTPException(
            status_code=400,
            detail="Please select an idea first."
        )

    result = planning_graph.invoke(
        state
    )

    sessions[
        data.session_id
    ] = result

    return {
        "session_id": data.session_id,
        "evaluation": result.get(
            "idea_evaluation"
        ),
        "project_plan": result.get(
            "project_plan"
        ),
        "team_plan": result.get(
            "team_plan"
        ),
        "timeline": result.get(
            "timeline"
        ),
        "pitch": result.get(
            "pitch"
        ),
        "judge_feedback": result.get(
            "judge_feedback"
        )
    }


@app.get(
    "/api/session/{session_id}"
)
def get_session(
    session_id: str
):

    if session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    return sessions[
        session_id
    ]