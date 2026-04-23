/**
 * InterviewSelectPage.tsx
 *
 * File location: src/app/components/InterviewSelectPage.tsx
 *
 * This is the page at route "/interview"
 * User selects between Essay and MCQ interview types
 */

import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";

export default function InterviewSelectPage() {
  const navigate    = useNavigate();
  const location    = useLocation();

  // Get job description from location state
  let jobDescription: string = (location.state as any)?.jobDescription ?? "";

  // If not in state, try to get from sessionStorage (backup)
  if (!jobDescription) {
    jobDescription = sessionStorage.getItem('interviewJobDescription') || "";
  }

  // Debug logging
  console.log("=== InterviewSelectPage Debug ===");
  console.log("Job description exists:", !!jobDescription);
  console.log("Job description length:", jobDescription.length);
  console.log("Location state:", location.state);

  // Store in sessionStorage if we have it (for backup)
  useEffect(() => {
    if (jobDescription) {
      sessionStorage.setItem('interviewJobDescription', jobDescription);
    }
  }, [jobDescription]);

  const goToEssay = () => {
    console.log("Navigating to essay interview with job description length:", jobDescription.length);

    if (!jobDescription) {
      console.error("No job description available!");
      // Try to get it one more time
      const backup = sessionStorage.getItem('interviewJobDescription');
      if (backup) {
        console.log("Found backup in sessionStorage");
        navigate("/interview/quiz", {
          state: { mode: "essay", jobDescription: backup },
        });
        return;
      }
      // Still no job description, show error
      alert("No job selected. Please go back and select a job first.");
      navigate("/jobs");
      return;
    }

    // Navigate to quiz page with job description
    navigate("/interview/quiz", {
      state: { mode: "essay", jobDescription: jobDescription },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d27] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Interview Type
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AI will generate questions tailored to the job description
          </p>
          {!jobDescription && (
            <p className="text-red-500 text-xs mt-2">
              ⚠️ No job selected. Please go back and select a job.
            </p>
          )}
        </div>

        {/* Choice cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Essay */}
          <button
            onClick={goToEssay}
            disabled={!jobDescription}
            className={`group text-left bg-white dark:bg-[#1a1d27] border-2 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md ${
              !jobDescription
                ? "border-gray-300 dark:border-gray-700 opacity-50 cursor-not-allowed"
                : "border-gray-200 dark:border-gray-700/60 hover:border-violet-400 dark:hover:border-violet-500"
            }`}
          >
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/40 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Essay Interview</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Open-ended questions where you write detailed answers. Great for demonstrating depth of knowledge.
            </p>
            <div className="mt-4 flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold">
              Start Essay
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* MCQ — coming soon */}
          <button
            disabled
            className="group text-left bg-white dark:bg-[#1a1d27] border-2 border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 opacity-50 cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">MCQ Interview</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Multiple choice questions to test your technical knowledge quickly.
            </p>
            <div className="mt-4 text-gray-400 text-sm font-semibold">
              Coming Soon
            </div>
          </button>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/jobs")}
            className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    </div>
  );
}