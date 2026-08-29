# 🚀 CarryJob AI

> An AI-powered hackathon project strategist that takes you from a hackathon brief to a practical, judge-ready project plan.

**Live Demo:** https://carry-job-ai.vercel.app/

**Repository:** https://github.com/tanmaylagoo/CarryJobAI

---

## 📌 Overview

CarryJob AI helps developers and students turn a hackathon opportunity into an actionable project strategy.

Instead of manually reading a hackathon's rules, brainstorming ideas, evaluating feasibility, planning development, dividing team responsibilities, and preparing a pitch, CarryJob AI brings these steps together into a single AI-powered workflow.

The platform analyzes a hackathon, generates project ideas based on the hackathon and team capabilities, allows the user to select and refine an idea, and then produces a complete implementation and presentation strategy.

---

## ✨ Features

### 🔍 Hackathon Analysis

Enter a hackathon URL and CarryJob AI researches and structures important information including:

- Hackathon description
- Tracks
- Problem statements
- Judging criteria
- Important rules
- Submission requirements
- Technologies and requirements
- Deadlines
- Prizes
- Official sources

The system combines the hackathon page with additional web research to produce a structured understanding of the challenge.

---

### 💡 AI Project Ideation

CarryJob AI generates multiple project ideas specifically optimized around:

- Hackathon requirements
- Judging criteria
- Team skills
- Technical feasibility
- Innovation
- Impact
- Demo potential
- Available development time

Each idea includes:

- Problem statement
- Proposed solution
- Key features
- Technology stack
- Difficulty
- Estimated development time
- Innovation score
- Feasibility score
- Impact score
- Judge score
- Risks

---

### 👥 Team-Aware Planning

The project ideas are generated based on the capabilities of the team.

CarryJob AI considers the team's skills when determining whether an idea is realistic and explains why the team is suitable for the selected project.

---

### 🔄 Human-in-the-Loop Idea Refinement

Users are not forced to accept the first AI-generated idea.

After selecting an idea, users can provide feedback such as:

> "Make this simpler and focus more on the core AI feature."

CarryJob AI then revises the idea while preserving the hackathon alignment and technical feasibility.

This creates an iterative workflow between the user and the AI rather than a one-shot generation system.

---

### 📋 Project Planning

Once an idea is selected, CarryJob AI generates a complete project strategy including:

- System architecture
- Technology stack
- MVP features
- Nice-to-have features
- Features that should not be built
- Implementation steps

The goal is to prioritize a working MVP instead of unnecessary complexity.

---

### 👨‍💻 Team Distribution

The system converts the project plan into a practical team execution plan.

It assigns:

- Roles
- Responsibilities
- Development tasks
- Team-specific work

based on the team's skills.

---

### ⏱️ Development Timeline

CarryJob AI creates a development timeline covering:

1. Project setup
2. Backend development
3. Frontend development
4. Feature implementation
5. Integration
6. Testing
7. UI/UX refinement
8. Demo preparation
9. Presentation preparation
10. Submission

The timeline also accounts for buffer time so teams can handle unexpected issues.

---

### 🎤 Pitch & Presentation Planning

The platform generates a presentation strategy covering:

- Problem
- Why the problem matters
- Solution
- How the system works
- Technical architecture
- AI/ML components
- Results
- Impact
- Future scope

It also generates a demo script and one-line project pitch.

---

### ⚖️ Final Judge Evaluation

Before building the project, users can receive an AI-based final evaluation of their strategy.

The system evaluates:

- Problem clarity
- Innovation
- Technical implementation
- Feasibility
- Impact
- Demo potential
- Presentation quality
- Hackathon alignment

This helps teams identify weaknesses before submission.

---

## 🧠 How It Works

CarryJob AI follows a multi-stage AI workflow:

```text
                 ┌─────────────────────┐
                 │   Hackathon URL     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Hackathon Research  │
                 │ + Web Research      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Hackathon Analysis  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Project Ideation   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Select Idea       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Human Feedback      │
                 │ + Idea Refinement   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Project Evaluation  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Project Plan        │
                 └──────────┬──────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
          Team Plan     Timeline      Pitch
                │           │           │
                └───────────┼───────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Final Judge Review  │
                 └─────────────────────┘
