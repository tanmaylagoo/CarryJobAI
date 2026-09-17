from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class TeamMember(BaseModel):
    name: str
    skills: List[str]


class HackathonURLRequest(BaseModel):
    input_mode: str = "hackathon_url"
    url: HttpUrl
    team_members: List[TeamMember] = []


class ConstraintsInput(BaseModel):
    available_time: str
    team_size: int
    team_members: List[TeamMember] = []
    resources: List[str] = []


class ProblemStatementRequest(BaseModel):
    input_mode: str = "problem_statement"
    problem_statement: str
    constraints: ConstraintsInput
    team_members: List[TeamMember] = []


class TeamInput(BaseModel):
    session_id: str
    team_members: List[TeamMember]


class SelectIdeaRequest(BaseModel):
    session_id: str
    idea_id: int


class RefineIdeaRequest(BaseModel):
    session_id: str
    feedback: str


class PlanRequest(BaseModel):
    session_id: str