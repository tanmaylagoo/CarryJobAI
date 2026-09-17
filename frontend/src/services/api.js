import axios from "axios";

const api = axios.create({
  baseURL:
 import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export const analyzeHackathon = async (url, teamMembers = []) => {
  const response = await api.post(
    "/api/analyze-hackathon",
    {
      url,
      team_members: teamMembers,
    }
  );

  return response.data;
};

export const analyzeProblem = async (problemStatement, constraints, teamMembers = []) => {
  const response = await api.post("/api/analyze-problem", {
    input_mode: "problem_statement",
    problem_statement: problemStatement,
    constraints: constraints,
    team_members: teamMembers,
  });

  return response.data;
};


export const addTeam = async (
  sessionId,
  teamMembers
) => {
  const response = await api.post(
    "/api/team",
    {
      session_id: sessionId,
      team_members: teamMembers,
    }
  );

  return response.data;
};

export const generateIdeas = async (sessionId) => {
  const response = await api.post(
    `/api/ideas/${sessionId}`
  );

  return response.data;
};

export const selectIdea = async (
  sessionId,
  ideaId
) => {
  const response = await api.post(
    "/api/select-idea",
    {
      session_id: sessionId,
      idea_id: ideaId,
    }
  );

  return response.data;
};

export const refineIdea = async (
  sessionId,
  feedback
) => {
  const response = await api.post(
    "/api/refine-idea",
    {
      session_id: sessionId,
      feedback,
    }
  );

  return response.data;
};

export const createPlan = async (sessionId) => {
  const response = await api.post(
    "/api/plan",
    {
      session_id: sessionId,
    }
  );

  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await api.get(
    `/api/session/${sessionId}`
  );

  return response.data;
};

export default api;