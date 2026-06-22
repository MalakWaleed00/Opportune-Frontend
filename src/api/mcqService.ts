/**
 * mcqService.ts
 * src/api/mcqService.ts
 *
 * Handles HTTP calls to the Java backend for the MCQ interview module.
 */
import axios from "axios";

const BASE_URL = "http://localhost:8080";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface McqQuestion {
  questionId: string;
  skill: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export interface McqSession {
  status: string;
  sessionId: string;
  skills: string[];
  questions: McqQuestion[];
}

export interface McqAnswerItem {
  questionId: string;
  userAnswer: string; // "a" | "b" | "c" | "d"
}

export interface SkillSummary {
  skill: string;
  avgScore: number;
  grade: string;
  numQuestions: number;
}

export interface QuestionResult {
  questionId: string;
  skill: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  grade: string;
  hybridScore: number;
}

export interface McqEvaluationReport {
  status: string;
  overallScore: number;
  overallGrade: string;
  skillSummary: Record<string, SkillSummary>;
  questionResults: QuestionResult[];
}

// ─────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─────────────────────────────────────────────────────────────
// 1. GENERATE MCQ QUESTIONS
// POST /api/interview/mcq/generate
// ─────────────────────────────────────────────────────────────
export async function generateMcqQuestions(
  jobDescription: string
): Promise<McqSession> {
  if (!jobDescription?.trim()) {
    throw new Error("Job description is required");
  }

  const response = await axios.post(
    `${BASE_URL}/api/interview/mcq/generate`,
    { jobDescription },
    { headers: getAuthHeader() }
  );

  return response.data;
}

// ─────────────────────────────────────────────────────────────
// 2. EVALUATE MCQ ANSWERS
// POST /api/interview/mcq/evaluate
// ─────────────────────────────────────────────────────────────
export async function evaluateMcqAnswers(
  sessionId: string,
  answers: McqAnswerItem[]
): Promise<McqEvaluationReport> {
  if (!answers?.length) {
    throw new Error("Answers are required");
  }

  const response = await axios.post(
    `${BASE_URL}/api/interview/mcq/evaluate`,
    { sessionId, answers },
    { headers: getAuthHeader() }
  );

  return response.data;
}