import React from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export function InterviewSelectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const jobRaw = searchParams.get('job');
  const job = jobRaw ? JSON.parse(decodeURIComponent(jobRaw)) : null;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1117]">
        <p className="text-gray-500">No job selected.</p>
      </div>
    );
  }

  const goTo = (type: 'essay' | 'mcq') => {
    navigate(`/interview/quiz?job=${searchParams.get('job')}&type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex flex-col">
      {/* Back */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        {/* Job context card */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{job.title}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{job.company}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Interview Type</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">AI will generate questions tailored to this role</p>
        </div>

        {/* Choice cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Essay */}
          <button
            onClick={() => goTo('essay')}
            className="group text-left bg-white dark:bg-[#1a1d27] border-2 border-gray-200 dark:border-gray-700/60 hover:border-violet-400 dark:hover:border-violet-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg dark:hover:shadow-violet-900/20"
          >
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Essay Interview</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Open-ended questions where you write detailed answers. Great for demonstrating depth of knowledge and communication skills.
            </p>
            <div className="mt-4 flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold">
              Start Essay
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* MCQ & T/F */}
          <button
            onClick={() => goTo('mcq')}
            className="group text-left bg-white dark:bg-[#1a1d27] border-2 border-gray-200 dark:border-gray-700/60 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg dark:hover:shadow-blue-900/20"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">MCQ & True/False</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Multiple choice and true/false questions to test your technical knowledge quickly. Instant scoring and feedback.
            </p>
            <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold">
              Start Quiz
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}