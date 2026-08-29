from pydantic import BaseModel, HttpUrl
from typing import List


class TeamMember(BaseModel):
    name: str
    skills: List[str]


class HackathonURLRequest(BaseModel):
    url: HttpUrl
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