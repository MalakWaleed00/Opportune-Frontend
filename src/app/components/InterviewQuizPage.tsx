import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type MCQQuestion = {
  type: 'mcq';
  question: string;
  options: string[];
  answer: number;
};

type TFQuestion = {
  type: 'tf';
  question: string;
  answer: boolean;
};

type EssayQuestion = {
  type: 'essay';
  question: string;
  hint: string;
};

type Question = MCQQuestion | TFQuestion | EssayQuestion;

// ── Result screen ────────────────────────────────────────────────────────────
function ResultScreen({
  questions,
  answers,
  onRetry,
  onBack,
}: {
  questions: Question[];
  answers: (number | boolean | string)[];
  onRetry: () => void;
  onBack: () => void;
}) {
  const mcqTf = questions.filter(q => q.type !== 'essay') as (MCQQuestion | TFQuestion)[];
  const correct = mcqTf.filter((q, i) => {
    const globalIdx = questions.indexOf(q);
    if (q.type === 'mcq') return answers[globalIdx] === q.answer;
    if (q.type === 'tf') return answers[globalIdx] === q.answer;
    return false;
  }).length;

  const score = mcqTf.length > 0 ? Math.round((correct / mcqTf.length) * 100) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        score === null ? 'bg-violet-100 dark:bg-violet-900/30'
        : score >= 70 ? 'bg-green-100 dark:bg-green-900/30'
        : score >= 40 ? 'bg-yellow-100 dark:bg-yellow-900/30'
        : 'bg-red-100 dark:bg-red-900/30'
      }`}>
        <span className="text-3xl">
          {score === null ? '✍️' : score >= 70 ? '🎉' : score >= 40 ? '📚' : '💪'}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {score === null ? 'Essay Submitted!' : `You scored ${score}%`}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        {score === null
          ? 'Your answers have been recorded. Review them below.'
          : `${correct} out of ${mcqTf.length} correct`}
      </p>

      {/* Answer review */}
      <div className="text-left space-y-4 mb-8">
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          let isCorrect: boolean | null = null;
          if (q.type === 'mcq') isCorrect = userAnswer === q.answer;
          if (q.type === 'tf') isCorrect = userAnswer === q.answer;

          return (
            <div key={i} className={`rounded-xl p-4 border ${
              isCorrect === true ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
              : isCorrect === false ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d27]'
            }`}>
              <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                {i + 1}. {q.question}
              </p>
              {q.type === 'mcq' && (
                <div className="text-xs space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-500'}>{q.options[userAnswer as number] ?? '—'}</span></p>
                  {!isCorrect && <p className="text-green-600">Correct: {q.options[q.answer]}</p>}
                </div>
              )}
              {q.type === 'tf' && (
                <div className="text-xs space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-500'}>{String(userAnswer)}</span></p>
                  {!isCorrect && <p className="text-green-600">Correct: {String(q.answer)}</p>}
                </div>
              )}
              {q.type === 'essay' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{(userAnswer as string).slice(0, 120)}{(userAnswer as string).length > 120 ? '…' : ''}"</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Try Again
        </button>
        <button onClick={onBack} className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Back to Jobs
        </button>
      </div>
    </div>
  );
}

// ── Main quiz page ────────────────────────────────────────────────────────────
export function InterviewQuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const jobRaw = searchParams.get('job');
  const type = searchParams.get('type') as 'essay' | 'mcq' | null;
  const job = jobRaw ? JSON.parse(decodeURIComponent(jobRaw)) : null;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | boolean | string)[]>([]);
  const [selected, setSelected] = useState<number | boolean | string | null>(null);
  const [essayText, setEssayText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const fetchQuestions = async () => {
    if (!job || !type) return;
    setLoading(true);
    setError('');
    setQuestions([]);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setEssayText('');
    setSubmitted(false);
    setShowResult(false);

    try {
      const prompt = type === 'essay'
        ? `Generate exactly 5 essay interview questions for a "${job.title}" position at "${job.company}".
Skills required: ${job.tags.join(', ')}.
Job description: ${job.description}

Return ONLY a valid JSON array. No explanation, no markdown. Example format:
[
  {"type":"essay","question":"Describe your experience with React hooks.","hint":"Mention useState, useEffect, custom hooks."},
  ...
]`
        : `Generate exactly 8 interview questions for a "${job.title}" position at "${job.company}".
Skills required: ${job.tags.join(', ')}.
Job description: ${job.description}
Mix: 5 multiple choice questions (MCQ) and 3 true/false questions.

Return ONLY a valid JSON array. No explanation, no markdown. Example format:
[
  {"type":"mcq","question":"What does JSX stand for?","options":["JavaScript XML","Java Syntax Extension","JSON XML","None"],"answer":0},
  {"type":"tf","question":"React uses a virtual DOM.","answer":true},
  ...
]`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      const raw = data.content?.map((b: any) => b.text || '').join('') ?? '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed: Question[] = JSON.parse(clean);
      setQuestions(parsed);
      setAnswers(new Array(parsed.length).fill(null));
    } catch (e) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  if (!job || !type) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1117]">
      <p className="text-gray-500">Missing job or interview type.</p>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1117] gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-violet-500 animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Generating your interview questions…</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1117] gap-4">
      <p className="text-red-500 text-sm">{error}</p>
      <button onClick={fetchQuestions} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold">
        Retry
      </button>
    </div>
  );

  if (showResult) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      <ResultScreen
        questions={questions}
        answers={answers}
        onRetry={fetchQuestions}
        onBack={() => navigate('/jobs')}
      />
    </div>
  );

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const isLast = current === questions.length - 1;

  const handleNext = () => {
    const ans = q.type === 'essay' ? essayText : selected;
    const newAnswers = [...answers];
    newAnswers[current] = ans as any;
    setAnswers(newAnswers);

    if (isLast) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setEssayText('');
      setSubmitted(false);
    }
  };

  const canProceed = q.type === 'essay'
    ? essayText.trim().length > 20
    : selected !== null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {type === 'essay' ? 'Essay Interview' : 'MCQ & True/False'}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">{job.title} · {job.company}</p>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {current + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${type === 'essay' ? 'bg-violet-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 mb-6">
          <p className="font-semibold text-gray-900 dark:text-white text-base leading-relaxed mb-5">
            {current + 1}. {q.question}
          </p>

          {/* MCQ options */}
          {q.type === 'mcq' && (
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                    selected === i
                      ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs mr-3 font-semibold
                    border-current opacity-60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* True/False */}
          {q.type === 'tf' && (
            <div className="flex gap-4">
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  onClick={() => setSelected(val)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                    selected === val
                      ? val
                        ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {val ? '✓ True' : '✗ False'}
                </button>
              ))}
            </div>
          )}

          {/* Essay */}
          {q.type === 'essay' && (
            <div>
              <textarea
                rows={6}
                value={essayText}
                onChange={e => setEssayText(e.target.value)}
                placeholder="Write your answer here…"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white text-sm outline-none focus:border-violet-400 dark:focus:border-violet-500 resize-none transition-colors"
              />
              {(q as EssayQuestion).hint && (
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  💡 Hint: {(q as EssayQuestion).hint}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-600 text-right">{essayText.length} chars</p>
            </div>
          )}
        </div>

        {/* Next / Submit */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            canProceed
              ? type === 'essay'
                ? 'bg-violet-600 hover:bg-violet-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLast ? 'Submit Interview' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}