// /**
//  * InterviewQuizPage.tsx
//  *
//  * File location: src/app/components/InterviewQuizPage.tsx
//  *
//  * This is the page at route "/interview/quiz"
//  * Handles the actual interview questions and answers
//  */
//
// import { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   generateInterviewQuestions,
//   evaluateInterviewAnswers,
//   QuestionItem,
//   AnswerItem,
//   EvaluationReport,
//   ClusterResult,
// } from "../../api/interviewService";
//
// // Speech-to-text: Web Speech API
// declare global {
//   interface Window {
//     SpeechRecognition:       typeof SpeechRecognition | undefined;
//     webkitSpeechRecognition: typeof SpeechRecognition | undefined;
//   }
// }
//
// type Stage = "loading" | "interviewing" | "submitting" | "report" | "error";
//
// export default function InterviewQuizPage() {
//   const location      = useLocation();
//   const navigate      = useNavigate();
//   const state         = location.state as { mode: string; jobDescription: string } | null;
//
//   // Try multiple sources for job description
//   let jobDescription = state?.jobDescription ?? "";
//
//   // If not in state, try sessionStorage
//   if (!jobDescription) {
//     jobDescription = sessionStorage.getItem('interviewJobDescription') || "";
//     console.log("Retrieved job description from sessionStorage");
//   }
//
//   // If still not, try localStorage
//   if (!jobDescription) {
//     jobDescription = localStorage.getItem('tempJobDescription') || "";
//     console.log("Retrieved job description from localStorage");
//   }
//
//   // Debug logging
//   console.log("=== InterviewQuizPage Debug ===");
//   console.log("Job description exists:", !!jobDescription);
//   console.log("Job description length:", jobDescription.length);
//   console.log("First 100 chars:", jobDescription.substring(0, 100));
//   console.log("Location state:", location.state);
//
//   // State
//   const [stage,        setStage]        = useState<Stage>("loading");
//   const [questions,    setQuestions]    = useState<QuestionItem[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers,      setAnswers]      = useState<string[]>([]);
//   const [currentText,  setCurrentText]  = useState("");
//   const [report,       setReport]       = useState<EvaluationReport | null>(null);
//   const [errorMsg,     setErrorMsg]     = useState("");
//
//   // Speech-to-text state
//   const [isListening,  setIsListening]  = useState(false);
//   const recognitionRef                  = useRef<SpeechRecognition | null>(null);
//
//   // Step 1: Fetch questions on mount
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       // Validate job description
//       if (!jobDescription || jobDescription.trim() === "") {
//         console.error("No job description found");
//         setErrorMsg("No job description found. Please go back to Jobs page and select a job.");
//         setStage("error");
//         return;
//       }
//
//       console.log("Generating questions for job description...");
//
//       try {
//         const qs = await generateInterviewQuestions(jobDescription);
//         console.log("Questions generated successfully:", qs.length);
//         setQuestions(qs);
//         setAnswers(new Array(qs.length).fill(""));
//         setStage("interviewing");
//       } catch (err: any) {
//         console.error("Failed to generate questions:", err);
//         setErrorMsg(err.message ?? "Failed to generate questions. Please try again.");
//         setStage("error");
//       }
//     };
//
//     fetchQuestions();
//   }, [jobDescription]); // Only run once on mount
//
//   // Speech-to-text setup
//   const speechSupported =
//     typeof window !== "undefined" &&
//     (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
//
//   const startListening = () => {
//     const SpeechRecognitionAPI =
//       window.SpeechRecognition ?? window.webkitSpeechRecognition;
//     if (!SpeechRecognitionAPI) return;
//
//     const recognition = new SpeechRecognitionAPI();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.continuous = true;
//
//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       let transcript = "";
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         transcript += event.results[i][0].transcript;
//       }
//       setCurrentText((prev) => {
//         const base = prev.replace(/\s*\[speaking...\]\s*$/, "").trimEnd();
//         return base + (base ? " " : "") + transcript;
//       });
//     };
//
//     recognition.onerror = () => stopListening();
//     recognition.onend = () => setIsListening(false);
//
//     recognitionRef.current = recognition;
//     recognition.start();
//     setIsListening(true);
//   };
//
//   const stopListening = () => {
//     recognitionRef.current?.stop();
//     setIsListening(false);
//   };
//
//   const toggleMic = () => {
//     if (isListening) stopListening();
//     else startListening();
//   };
//
//   // Stop mic when moving to next question
//   useEffect(() => {
//     stopListening();
//     setCurrentText(answers[currentIndex] ?? "");
//   }, [currentIndex]);
//
//   // Navigation functions
//   const saveCurrentAnswer = () => {
//     const updated = [...answers];
//     updated[currentIndex] = currentText.trim() || "I don't know";
//     setAnswers(updated);
//     return updated;
//   };
//
//   const handleNext = () => {
//     const updated = saveCurrentAnswer();
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex((i) => i + 1);
//       setCurrentText(updated[currentIndex + 1] ?? "");
//     }
//   };
//
//   const handleBack = () => {
//     saveCurrentAnswer();
//     if (currentIndex > 0) {
//       setCurrentIndex((i) => i - 1);
//     }
//   };
//
//   const handleSubmit = async () => {
//     const updated = saveCurrentAnswer();
//     setStage("submitting");
//
//     const payload: AnswerItem[] = questions.map((q, i) => ({
//       clusterId: q.clusterId,
//       skills: q.skills,
//       question: q.question,
//       userAnswer: updated[i] || "I don't know",
//       correctAnswer: q.answer,
//     }));
//
//     try {
//       const result = await evaluateInterviewAnswers(payload);
//       setReport(result);
//       setStage("report");
//     } catch (err: any) {
//       console.error("Evaluation failed:", err);
//       setErrorMsg(err.message ?? "Evaluation failed. Please try again.");
//       setStage("error");
//     }
//   };
//
//   // Helper functions for styling
//   const gradeColour = (grade: string) => {
//     if (grade.includes("Excellent")) return "text-green-600 dark:text-green-400";
//     if (grade.includes("Good")) return "text-blue-600 dark:text-blue-400";
//     if (grade.includes("Partial")) return "text-yellow-600 dark:text-yellow-400";
//     return "text-red-600 dark:text-red-400";
//   };
//
//   const gradeBg = (grade: string) => {
//     if (grade.includes("Excellent")) return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
//     if (grade.includes("Good")) return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
//     if (grade.includes("Partial")) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
//     return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
//   };
//
//   const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
//
//   // Loading state
//   if (stage === "loading") {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
//         <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-gray-600 dark:text-gray-300 text-sm">
//           Generating your personalised interview questions…
//         </p>
//       </div>
//     );
//   }
//
//   // Submitting state
//   if (stage === "submitting") {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
//         <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-gray-600 dark:text-gray-300 text-sm">
//           Evaluating your answers…
//         </p>
//       </div>
//     );
//   }
//
//   // Error state
//   if (stage === "error") {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4 p-6">
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md text-center">
//           <p className="text-red-700 dark:text-red-400 font-semibold mb-2">Something went wrong</p>
//           <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
//           <button
//             onClick={() => navigate("/jobs")}
//             className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm"
//           >
//             Go Back to Jobs
//           </button>
//         </div>
//       </div>
//     );
//   }
//
//   // Report state
//   if (stage === "report" && report) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] p-6">
//         <div className="max-w-2xl mx-auto">
//           {/* Overall score */}
//           <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 text-center shadow-sm">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//               Interview Complete 🎉
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
//               Here is your performance breakdown
//             </p>
//             <div className="text-5xl font-bold text-violet-600 dark:text-violet-400 mb-1">
//               {Math.round(report.overallScore * 100)}%
//             </div>
//             <div className={`text-lg font-semibold ${gradeColour(report.overallGrade)}`}>
//               {report.overallGrade}
//             </div>
//           </div>
//
//           {/* Per-cluster cards */}
//           <h2 className="text-gray-700 dark:text-gray-300 font-semibold mb-3">
//             Skills Breakdown
//           </h2>
//           <div className="flex flex-col gap-4">
//             {Object.values(report.clusters).map((cluster: ClusterResult) => (
//               <div
//                 key={cluster.clusterId}
//                 className={`border rounded-2xl p-5 ${gradeBg(cluster.grade)}`}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex flex-wrap gap-1">
//                     {cluster.skills.map((s) => (
//                       <span
//                         key={s}
//                         className="bg-white/70 dark:bg-black/20 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full"
//                       >
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                   <span className={`text-sm font-bold ${gradeColour(cluster.grade)}`}>
//                     {cluster.grade}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="flex-1 h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-current rounded-full transition-all"
//                       style={{ width: `${Math.round(cluster.avgScore * 100)}%` }}
//                     />
//                   </div>
//                   <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
//                     {Math.round(cluster.avgScore * 100)}%
//                   </span>
//                 </div>
//                 {cluster.weakMetrics.length > 0 && (
//                   <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
//                     💡 {cluster.weakMetrics.join(" · ")}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//
//           <button
//             onClick={() => navigate("/jobs")}
//             className="mt-8 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
//           >
//             Back to Jobs
//           </button>
//         </div>
//       </div>
//     );
//   }
//
//   // Interview state
//   const currentQ = questions[currentIndex];
//   const isLast = currentIndex === questions.length - 1;
//
//   if (!currentQ) {
//     return null;
//   }
//
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] p-6">
//       <div className="max-w-2xl mx-auto">
//         {/* Progress bar */}
//         <div className="mb-6">
//           <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
//             <span>Question {currentIndex + 1} of {questions.length}</span>
//             <span>{Math.round(progress)}% complete</span>
//           </div>
//           <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-violet-500 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//
//         {/* Question card */}
//         <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-4 shadow-sm">
//           <div className="flex flex-wrap gap-1 mb-4">
//             {currentQ.skills.map((s) => (
//               <span
//                 key={s}
//                 className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs px-2 py-0.5 rounded-full"
//               >
//                 {s}
//               </span>
//             ))}
//           </div>
//           <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed">
//             {currentQ.question}
//           </p>
//         </div>
//
//         {/* Answer area */}
//         <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm mb-4">
//           {speechSupported && (
//             <div className="flex items-center gap-2 mb-3">
//               <button
//                 onClick={toggleMic}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                   isListening
//                     ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200"
//                     : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200"
//                 }`}
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   {isListening ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10h6v4H9z" />
//                   ) : (
//                     <>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
//                     </>
//                   )}
//                 </svg>
//                 {isListening ? "Stop Recording" : "Speak Answer"}
//                 {isListening && (
//                   <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                 )}
//               </button>
//               <span className="text-xs text-gray-400">
//                 {isListening ? "Listening… speak now" : "or type below"}
//               </span>
//             </div>
//           )}
//
//           <textarea
//             value={currentText}
//             onChange={(e) => setCurrentText(e.target.value)}
//             placeholder="Type your answer here, or click 'Speak Answer' to use your microphone…"
//             rows={6}
//             className="w-full bg-gray-50 dark:bg-[#12141f] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
//           />
//           <p className="text-xs text-gray-400 mt-1">
//             Leave blank to mark as "I don't know"
//           </p>
//         </div>
//
//         {/* Navigation buttons */}
//         <div className="flex gap-3">
//           {currentIndex > 0 && (
//             <button
//               onClick={handleBack}
//               className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             >
//               ← Previous
//             </button>
//           )}
//
//           {!isLast ? (
//             <button
//               onClick={handleNext}
//               className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
//             >
//               Next →
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
//             >
//               Submit Interview ✓
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


/**
 * InterviewQuizPage.tsx
 *
 * File location: src/app/components/InterviewQuizPage.tsx
 */

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate , Link ,Outlet } from "react-router-dom";
import {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
  QuestionItem,
  AnswerItem,
  EvaluationReport,
  ClusterResult,
} from "../../api/interviewService";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }
}

type Stage = "loading" | "interviewing" | "submitting" | "report" | "error";

export default function InterviewQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { mode: string; jobDescription: string } | null;

  // Get job description from multiple sources
  let jobDescription = state?.jobDescription ?? "";
  if (!jobDescription) {
    jobDescription = sessionStorage.getItem('interviewJobDescription') || "";
  }

  // State
  const [stage, setStage] = useState<Stage>("loading");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
const hasFetched = useRef(false);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("=== InterviewQuizPage mounted ===");
      console.log("Job description:", jobDescription?.substring(0, 100));

      if (!jobDescription || jobDescription.trim() === "") {
        console.error("No job description found");
        setErrorMsg("No job description found. Please go back and select a job.");
        setStage("error");
        return;
      }

      if (isLoading) {
        console.log("Already loading, skipping...");
        return;
      }

      setIsLoading(true);
      setStage("loading");

      try {
        console.log("Calling generateInterviewQuestions...");
        const qs = await generateInterviewQuestions(jobDescription);

        console.log("Questions received:", qs);
        console.log("Number of questions:", qs?.length);

        if (!qs || qs.length === 0) {
          throw new Error("No questions generated. Please try again.");
        }

        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(""));
        setStage("interviewing");
        console.log("Stage set to interviewing");

      } catch (err: any) {
        console.error("Failed to generate questions:", err);
        setErrorMsg(err.message || "Failed to generate questions. Please try again.");
        setStage("error");
      } finally {
        setIsLoading(false);
      }
    };
  if (hasFetched.current) return;
  hasFetched.current = true;
    fetchQuestions();
  }, []);

  // Speech-to-text setup
  const speechSupported = typeof window !== "undefined" &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentText((prev) => {
        const base = prev.replace(/\s*\[speaking...\]\s*$/, "").trimEnd();
        return base + (base ? " " : "") + transcript;
      });
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  // Stop mic when moving to next question
  useEffect(() => {
    stopListening();
    setCurrentText(answers[currentIndex] ?? "");
  }, [currentIndex]);

  // Navigation functions
  const saveCurrentAnswer = () => {
    const updated = [...answers];
    updated[currentIndex] = currentText.trim() || "I don't know";
    setAnswers(updated);
    return updated;
  };

  const handleNext = () => {
    const updated = saveCurrentAnswer();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCurrentText(updated[currentIndex + 1] ?? "");
    }
  };

  const handleBack = () => {
    saveCurrentAnswer();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    const updated = saveCurrentAnswer();
    setStage("submitting");

    const payload: AnswerItem[] = questions.map((q, i) => ({
      clusterId: q.clusterId,
      skills: q.skills,
      question: q.question,
      userAnswer: updated[i] || "I don't know",
      correctAnswer: q.answer,
    }));

    try {
      const result = await evaluateInterviewAnswers(payload);
      setReport(result);
      setStage("report");
    } catch (err: any) {
      console.error("Evaluation failed:", err);
      setErrorMsg(err.message ?? "Evaluation failed. Please try again.");
      setStage("error");
    }
  };

  // Helper functions for styling
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

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  // Loading state
  if (stage === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Generating your personalised interview questions...
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          This may take a moment while AI analyzes the job description
        </p>
      </div>
    );
  }

  // Submitting state
  if (stage === "submitting") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Evaluating your answers...
        </p>
      </div>
    );
  }

  // Error state
  if (stage === "error") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md text-center">
          <p className="text-red-700 dark:text-red-400 font-semibold mb-2">Something went wrong</p>
          <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm"
          >
            Go Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Report state
  if (stage === "report" && report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Interview Complete 🎉
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

          <h2 className="text-gray-700 dark:text-gray-300 font-semibold mb-3">
            Skills Breakdown
          </h2>
          <div className="flex flex-col gap-4">
            {report.clusters && Object.values(report.clusters).map((cluster: ClusterResult) => (
              <div
                key={cluster.clusterId}
                className={`border rounded-2xl p-5 ${gradeBg(cluster.grade)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1">
                    {cluster.skills?.map((s) => (
                      <span
                        key={s}
                        className="bg-white/70 dark:bg-black/20 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className={`text-sm font-bold ${gradeColour(cluster.grade)}`}>
                    {cluster.grade}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-current rounded-full transition-all"
                      style={{ width: `${Math.round((cluster.avgScore || 0) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
                    {Math.round((cluster.avgScore || 0) * 100)}%
                  </span>
                </div>
                {cluster.weakMetrics?.length > 0 && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    💡 {cluster.weakMetrics.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
         <Link to="/jobs" className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm inline-block">
                   Go Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  // Make sure questions exist before rendering interview
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">Loading questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) {
    return null;
  }

  const isLast = currentIndex === questions.length - 1;

  // Interview state
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
          <div className="flex flex-wrap gap-1 mb-4">
            {currentQ.skills?.map((s) => (
              <span
                key={s}
                className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* Answer area */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm mb-4">
          {speechSupported && (
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isListening
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200"
                    : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isListening ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10h6v4H9z" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                    </>
                  )}
                </svg>
                {isListening ? "Stop Recording" : "Speak Answer"}
                {isListening && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
              <span className="text-xs text-gray-400">
                {isListening ? "Listening… speak now" : "or type below"}
              </span>
            </div>
          )}

          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Type your answer here, or click 'Speak Answer' to use your microphone…"
            rows={6}
            className="w-full bg-gray-50 dark:bg-[#12141f] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave blank to mark as "I don't know"
          </p>
        </div>

        {/* Navigation buttons */}
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
              className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
            >
              Submit Interview ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}