// /**
//  * interviewService.ts
//  *
//  * File location: src/api/interviewService.ts
//  * → This is a NEW file. Create it inside the api folder alongside authService.ts and jobService.ts.
//  *
//  * Handles all HTTP calls to the Java backend for the interview module.
//  */
// import axios from "axios";
//
// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
//
// // ─────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────
//
// export interface QuestionItem {
//   clusterId:  number;
//   skills:     string[];
//   question:   string;
//   answer:     string; // reference answer — kept in state for the evaluate call
// }
//
// export interface AnswerItem {
//   clusterId:     number;
//   skills:        string[];
//   question:      string;
//   userAnswer:    string;
//   correctAnswer: string;
// }
//
// export interface ClusterResult {
//   clusterId:   number;
//   skills:      string[];
//   avgScore:    number;
//   grade:       string;
//   weakMetrics: string[];
// }
//
// export interface EvaluationReport {
//   status:        string;
//   overallScore:  number;
//   overallGrade:  string;
//   clusters:      Record<string, ClusterResult>;
// }
//
// // ─────────────────────────────────────────────────────────────
// // HELPER — attach auth token from localStorage
// // ─────────────────────────────────────────────────────────────
// function authHeaders(): HeadersInit {
//   const token = localStorage.getItem("token");
//   return {"ngrok-skip-browser-warning": true,
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }
//
// // ─────────────────────────────────────────────────────────────
// // 1. GENERATE QUESTIONS
// // POST /api/interview/generate
// // ─────────────────────────────────────────────────────────────
// export async function generateInterviewQuestions(
//   jobDescription: string
// ): Promise<QuestionItem[]> {
//   const res =await fetch(`${BASE_URL}/api/interview/generate`, {
//     method:  "POST",
//     headers: authHeaders(),
//     body:    JSON.stringify({ jobDescription }),
//   });
//
//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`Failed to generate questions: ${err}`);
//   }
//
//   return res.json() as Promise<QuestionItem[]>;
// }
//
// // ─────────────────────────────────────────────────────────────
// // 2. EVALUATE ANSWERS
// // POST /api/interview/evaluate
// // ─────────────────────────────────────────────────────────────
// export async function evaluateInterviewAnswers(
//   answers: AnswerItem[]
// ): Promise<EvaluationReport> {
//   const res = await fetch(`${BASE_URL}/api/interview/evaluate`, {
//     method:  "POST",
//     headers: authHeaders(),
//     body:    JSON.stringify({ answers }),
//   });
//
//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`Failed to evaluate answers: ${err}`);
//   }
//
//   return res.json() as Promise<EvaluationReport>;
// }


/**
 * interviewService.ts
 *
 * File location: src/api/interviewService.ts
 *
 * Handles all HTTP calls to the Java backend for the interview module.
 */
import axios from "axios";
const BASE_URL = "http://localhost:8080";

//const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface QuestionItem {
  clusterId:  number;
  skills:     string[];
  question:   string;
  answer:     string;
}

export interface AnswerItem {
  clusterId:     number;
  skills:        string[];
  question:      string;
  userAnswer:    string;
  correctAnswer: string;
}

export interface ClusterResult {
  clusterId:   number;
  skills:      string[];
  avgScore:    number;
  grade:       string;
  weakMetrics: string[];
}

export interface EvaluationReport {
  status:        string;
  overallScore:  number;
  overallGrade:  string;
  clusters:      Record<string, ClusterResult>;
}

// ─────────────────────────────────────────────────────────────
// HELPER — get auth token from localStorage
// ─────────────────────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log("🔑 Token from localStorage:", token ? `${token.substring(0, 20)}...` : "No token found");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─────────────────────────────────────────────────────────────
// 1. GENERATE QUESTIONS
// POST /api/interview/generate
// ─────────────────────────────────────────────────────────────
export async function generateInterviewQuestions(
  jobDescription: string
): Promise<QuestionItem[]> {
  // Validate input
  if (!jobDescription || jobDescription.trim() === "") {
    console.error("❌ No job description provided");
    throw new Error("Job description is required");
  }

  console.log("📤 Generating interview questions...");
  console.log("📝 Job description length:", jobDescription.length);
  console.log("🌐 API URL:", `${BASE_URL}/api/interview/generate`);

  try {
    const response = await axios.post(
      `${BASE_URL}/api/interview/generate`,
      { jobDescription },
      { headers: getAuthHeader() }
    );

    console.log("✅ Questions generated successfully:", response.data.length);
    return response.data;
  } catch (error: any) {
    console.error("❌ Generate questions failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Headers:", error.response?.headers);

    if (error.response?.status === 403) {
      throw new Error("Access denied. Please make sure you are logged in.");
    } else if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    } else {
      throw new Error(error.response?.data?.message || "Failed to generate questions");
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 2. EVALUATE ANSWERS
// POST /api/interview/evaluate
// ─────────────────────────────────────────────────────────────
export async function evaluateInterviewAnswers(
  answers: AnswerItem[]
): Promise<EvaluationReport> {
  if (!answers || answers.length === 0) {
    console.error("❌ No answers provided");
    throw new Error("Answers are required");
  }

  console.log("📤 Evaluating answers...");
  console.log("📊 Number of answers:", answers.length);

  try {
    const response = await axios.post(
      `${BASE_URL}/api/interview/evaluate`,
      { answers },
      { headers: getAuthHeader() }
    );

    console.log("✅ Evaluation complete");
    return response.data;
  } catch (error: any) {
    console.error("❌ Evaluate answers failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);

    if (error.response?.status === 403) {
      throw new Error("Access denied. Please make sure you are logged in.");
    } else if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    } else {
      throw new Error(error.response?.data?.message || "Failed to evaluate answers");
    }
  }
}