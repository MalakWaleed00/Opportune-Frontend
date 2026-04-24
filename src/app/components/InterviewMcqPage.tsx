/**
 * InterviewMcqPage.tsx
 * src/app/components/InterviewMcqPage.tsx
 *
 * Route: /interview/mcq
 * Handles MCQ interview flow: loading → quiz → submitting → report → error
 */

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate , Link ,Outlet } from "react-router-dom";
import {
  generateMcqQuestions,
  evaluateMcqAnswers,
  McqQuestion,
  McqAnswerItem,
  McqEvaluationReport,
  SkillSummary,
  QuestionResult,
} from "../../api/mcqService";

type Stage = "loading" | "quiz" | "submitting" | "report" | "error";
type Choice = "a" | "b" | "c" | "d" | null;

export default function InterviewMcqPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { mode: string; jobDescription: string } | null;

  let jobDescription = state?.jobDescription ?? "";
  if (!jobDescription) {
    jobDescription = sessionStorage.getItem("interviewJobDescription") || "";
  }
  const [stage, setStage] = useState<Stage>("loading");
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [report, setReport] = useState<McqEvaluationReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const hasFetched = useRef(false);

  // Fetch questions once on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      if (!jobDescription?.trim()) {
        setErrorMsg("No job description found. Please go back and select a job.");
        setStage("error");
        return;
      }

      try {
        const session = await generateMcqQuestions(jobDescription);
        setSessionId(session.sessionId);
        setQuestions(session.questions);
        setChoices(new Array(session.questions.length).fill(null));
        setStage("quiz");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to generate questions. Please try again.");
        setStage("error");
      }
    };

    load();
  }, []);

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelect = (choice: Choice) => {
    const updated = [...choices];
    updated[currentIndex] = choice;
    setChoices(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    setStage("submitting");

    const payload: McqAnswerItem[] = questions.map((q, i) => ({
      questionId: q.questionId,
      userAnswer: choices[i] ?? "a",
    }));

    try {
      const result = await evaluateMcqAnswers(sessionId, payload);
      setReport(result);
      setStage("report");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Evaluation failed. Please try again.");
      setStage("error");
    }
  };

  // ── Styling helpers ──────────────────────────────────────────
  const gradeColour = (grade: string) => {
    if (grade?.includes("Excellent")) return "text-green-600 dark:text-green-400";
    if (grade?.includes("Good")) return "text-blue-600 dark:text-blue-400";
    if (grade?.includes("Partial")) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const gradeBg = (grade: string) => {
    if (grade?.includes("Excellent")) return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (grade?.includes("Good")) return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    if (grade?.includes("Partial")) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  const optionLabel: Record<string, string> = { a: "A", b: "B", c: "C", d: "D" };
  const optionText = (q: McqQuestion, key: string) => {
    const map: Record<string, string> = {
      a: q.optionA, b: q.optionB, c: q.optionC, d: q.optionD,
    };
    return map[key] || "";
  };

  // ── Stages ───────────────────────────────────────────────────
  if (stage === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Generating your MCQ interview questions…
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          This may take a moment while AI analyzes the job description
        </p>
      </div>
    );
  }

  if (stage === "submitting") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">Evaluating your answers…</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md text-center">
          <p className="text-red-700 dark:text-red-400 font-semibold mb-2">Something went wrong</p>
          <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
        <Link to="/jobs" className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm inline-block">
          Go Back to Jobs
        </Link>
        </div>
      </div>
    );
  }

  if (stage === "report" && report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] p-6">
        <div className="max-w-2xl mx-auto">
          {/* Overall score */}
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              MCQ Interview Complete 🎉
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Here is your performance breakdown
            </p>
            <div className="text-5xl font-bold text-violet-600 dark:text-violet-400 mb-1">
              {Math.round((report.overallScore || 0) * 100)}%
            </div>
            <div className={`text-lg font-semibold ${gradeColour(report.overallGrade)}`}>
              {report.overallGrade || "Completed"}
            </div>
          </div>

          {/* Per-skill summary */}
          <h2 className="text-gray-700 dark:text-gray-300 font-semibold mb-3">Skills Breakdown</h2>
          <div className="flex flex-col gap-4 mb-6">
            {report.skillSummary && Object.values(report.skillSummary).map((s: SkillSummary) => (
              <div key={s.skill} className={`border rounded-2xl p-5 ${gradeBg(s.grade)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/70 dark:bg-black/20 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {s.skill}
                  </span>
                  <span className={`text-sm font-bold ${gradeColour(s.grade)}`}>{s.grade}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-current rounded-full transition-all"
                      style={{ width: `${Math.round((s.avgScore || 0) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
                    {Math.round((s.avgScore || 0) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {s.numQuestions} question{s.numQuestions !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Per-question review */}
          <h2 className="text-gray-700 dark:text-gray-300 font-semibold mb-3">Question Review</h2>
          <div className="flex flex-col gap-3 mb-8">
            {report.questionResults?.map((r: QuestionResult, i: number) => (
              <div key={r.questionId} className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">{r.skill}</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">{i + 1}. {r.question}</p>
                <div className="flex gap-3 text-xs">
                  <span className={`px-2 py-1 rounded-lg font-medium ${
                    r.userAnswer === r.correctAnswer
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  }`}>
                    Your answer: {r.userAnswer?.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded-lg font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    Correct: {r.correctAnswer?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

         <Link
           to="/jobs"
           className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors block text-center"
         >
           Back to Jobs
         </Link>
        </div>
      </div>
    );
  }

  // ── Quiz state ───────────────────────────────────────────────
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-4 shadow-sm">
          <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs px-2 py-0.5 rounded-full mb-4 inline-block">
            {currentQ.skill}
          </span>
          <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-3 mb-6">
          {(["a", "b", "c", "d"] as const).map((key) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-medium text-sm ${
                choices[currentIndex] === key
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d27] text-gray-800 dark:text-gray-200 hover:border-violet-300 dark:hover:border-violet-600"
              }`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                choices[currentIndex] === key
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}>
                {optionLabel[key]}
              </span>
              {optionText(currentQ, key)}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← Previous
            </button>
          )}

          {!isLast ? (
            <button
              onClick={handleNext}
              disabled={choices[currentIndex] === null}
              className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={choices[currentIndex] === null}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Submit Interview ✓
            </button>
          )}
        </div>

        {choices[currentIndex] === null && (
          <p className="text-xs text-center text-gray-400 mt-2">Please select an answer to continue</p>
        )}
      </div>
    </div>
  );
}