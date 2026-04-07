import React, { useState } from 'react';

// ── Question types ───────────────────────────────
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
  sampleAnswer: string;
};

type Question = MCQQuestion | TFQuestion | EssayQuestion;

// ── Static demo questions ────────────────────────
const staticQuestions: Question[] = [
  {
    type: 'mcq',
    question: 'What does JSX stand for?',
    options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'None'],
    answer: 0,
  },
  {
    type: 'tf',
    question: 'React uses a virtual DOM.',
    answer: true,
  },
  {
    type: 'essay',
    question: 'Tell me about yourself.',
    hint: 'Mention your background, education, and technical interests.',
    sampleAnswer:
      'I am a software developer with a background in computer science. I enjoy building web applications and solving real-world problems using technologies like React, Node.js, and databases.',
  },
  {
    type: 'mcq',
    question: 'Which hook is used for state in React?',
    options: ['useEffect', 'useState', 'useReducer', 'useContext'],
    answer: 1,
  },
  {
    type: 'tf',
    question: 'Props in React are mutable.',
    answer: false,
  },
];

// ── Result Screen ───────────────────────────────
function ResultScreen({
  questions,
  answers,
  onRetry,
}: {
  questions: Question[];
  answers: (number | boolean | string)[];
  onRetry: () => void;
}) {
  const mcqTf = questions.filter(q => q.type !== 'essay') as (MCQQuestion | TFQuestion)[];
  const correct = mcqTf.filter((q, i) => {
    const idx = questions.indexOf(q);
    if (q.type === 'mcq') return answers[idx] === q.answer;
    if (q.type === 'tf') return answers[idx] === q.answer;
    return false;
  }).length;
  const score = mcqTf.length > 0 ? Math.round((correct / mcqTf.length) * 100) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">{score !== null ? `You scored ${score}%` : 'Essay Submitted!'}</h2>
      <p className="mb-6">{score !== null ? `${correct} out of ${mcqTf.length} correct` : 'Your answers have been recorded.'}</p>

      <div className="space-y-4 mb-8 text-left">
        {questions.map((q, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <p className="font-medium mb-2">{i + 1}. {q.question}</p>
            {q.type === 'mcq' && (
              <p>Your answer: {q.options[answers[i] as number] ?? '—'}, Correct: {q.options[q.answer]}</p>
            )}
            {q.type === 'tf' && (
              <p>Your answer: {String(answers[i])}, Correct: {String(q.answer)}</p>
            )}
            {q.type === 'essay' && (
              <p className="italic text-gray-500">"{answers[i]}"</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onRetry}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
}

// ── Main Quiz Component ─────────────────────────
export function InterviewQuizPage() {
  const [questions] = useState<Question[]>(staticQuestions);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | boolean | string)[]>(new Array(staticQuestions.length).fill(null));
  const [selected, setSelected] = useState<number | boolean | string | null>(null);
  const [essayText, setEssayText] = useState('');
  const [showResult, setShowResult] = useState(false);

  const q = questions[current];
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
    }
  };

  const canProceed = q.type === 'essay' ? essayText.trim().length > 0 : selected !== null;

  if (showResult) return <ResultScreen questions={questions} answers={answers} onRetry={() => {
    setCurrent(0);
    setAnswers(new Array(questions.length).fill(null));
    setSelected(null);
    setEssayText('');
    setShowResult(false);
  }} />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow">
        <p className="mb-4 font-semibold">{current + 1} / {questions.length}</p>
        <p className="mb-6 font-medium">{q.question}</p>

        {q.type === 'mcq' && q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`block w-full mb-2 p-3 rounded border text-left ${selected === i ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
          >
            {opt}
          </button>
        ))}

        {q.type === 'tf' && [true, false].map(val => (
          <button
            key={String(val)}
            onClick={() => setSelected(val)}
            className={`block w-full mb-2 p-3 rounded border ${selected === val ? 'bg-green-100 border-green-400' : 'border-gray-300'}`}
          >
            {val ? 'True' : 'False'}
          </button>
        ))}

        {q.type === 'essay' && (
          <textarea
            rows={5}
            value={essayText}
            onChange={e => setEssayText(e.target.value)}
            placeholder={q.hint}
            className="w-full p-3 mb-4 border rounded"
          />
        )}

        <button
          disabled={!canProceed}
          onClick={handleNext}
          className={`w-full py-3 rounded ${canProceed ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}











// import React, { useState } from 'react';

// // ── Question types ───────────────────────────────
// type MCQQuestion = {
//   type: 'mcq';
//   question: string;
//   options: string[];
//   answer: number;
// };

// type TFQuestion = {
//   type: 'tf';
//   question: string;
//   answer: boolean;
// };

// type EssayQuestion = {
//   type: 'essay';
//   question: string;
//   hint: string;
//   sampleAnswer: string;
// };

// type Question = MCQQuestion | TFQuestion | EssayQuestion;

// // ── Static demo questions ────────────────────────
// const staticQuestions: Question[] = [
//   {
//     type: 'mcq',
//     question: 'What does JSX stand for?',
//     options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'None'],
//     answer: 0,
//   },
//   {
//     type: 'tf',
//     question: 'React uses a virtual DOM.',
//     answer: true,
//   },
//   {
//     type: 'essay',
//     question: 'Tell me about yourself.',
//     hint: 'Mention your background, education, and technical interests.',
//     sampleAnswer:
//       'I am a software developer with a background in computer science. I enjoy building web applications and solving real-world problems using technologies like React, Node.js, and databases.',
//   },
//   {
//     type: 'mcq',
//     question: 'Which hook is used for state in React?',
//     options: ['useEffect', 'useState', 'useReducer', 'useContext'],
//     answer: 1,
//   },
//   {
//     type: 'tf',
//     question: 'Props in React are mutable.',
//     answer: false,
//   },
// ];

// // ── Result Screen ───────────────────────────────
// function ResultScreen({
//   questions,
//   answers,
//   onRetry,
// }: {
//   questions: Question[];
//   answers: (number | boolean | string)[];
//   onRetry: () => void;
// }) {
//   const mcqTf = questions.filter(q => q.type !== 'essay') as (MCQQuestion | TFQuestion)[];
//   const correct = mcqTf.filter((q, i) => {
//     const idx = questions.indexOf(q);
//     if (q.type === 'mcq') return answers[idx] === q.answer;
//     if (q.type === 'tf') return answers[idx] === q.answer;
//     return false;
//   }).length;
//   const score = mcqTf.length > 0 ? Math.round((correct / mcqTf.length) * 100) : null;

//   return (
//     <div className="max-w-2xl mx-auto px-6 py-12 text-center">
//       <h2 className="text-2xl font-bold mb-4">{score !== null ? `You scored ${score}%` : 'Essay Submitted!'}</h2>
//       <p className="mb-6">{score !== null ? `${correct} out of ${mcqTf.length} correct` : 'Your answers have been recorded.'}</p>

//       <div className="space-y-4 mb-8 text-left">
//         {questions.map((q, i) => (
//           <div key={i} className="p-4 border rounded-lg">
//             <p className="font-medium mb-2">{i + 1}. {q.question}</p>
//             {q.type === 'mcq' && (
//               <p>Your answer: {q.options[answers[i] as number] ?? '—'}, Correct: {q.options[q.answer]}</p>
//             )}
//             {q.type === 'tf' && (
//               <p>Your answer: {String(answers[i])}, Correct: {String(q.answer)}</p>
//             )}
//             {q.type === 'essay' && (
//               <p className="italic text-gray-500">"{answers[i]}"</p>
//             )}
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={onRetry}
//         className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//       >
//         Try Again
//       </button>
//     </div>
//   );
// }

// // ── Main Quiz Component ─────────────────────────
// export function InterviewQuizPage() {
//   const [questions] = useState<Question[]>(staticQuestions);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState<(number | boolean | string)[]>(new Array(staticQuestions.length).fill(null));
//   const [selected, setSelected] = useState<number | boolean | string | null>(null);
//   const [essayText, setEssayText] = useState('');
//   const [showResult, setShowResult] = useState(false);

//   const q = questions[current];
//   const isLast = current === questions.length - 1;

//   const handleNext = () => {
//     const ans = q.type === 'essay' ? essayText : selected;
//     const newAnswers = [...answers];
//     newAnswers[current] = ans as any;
//     setAnswers(newAnswers);

//     if (isLast) {
//       setShowResult(true);
//     } else {
//       setCurrent(c => c + 1);
//       setSelected(null);
//       setEssayText('');
//     }
//   };

//   const canProceed = q.type === 'essay' ? essayText.trim().length > 0 : selected !== null;

//   if (showResult) return <ResultScreen questions={questions} answers={answers} onRetry={() => {
//     setCurrent(0);
//     setAnswers(new Array(questions.length).fill(null));
//     setSelected(null);
//     setEssayText('');
//     setShowResult(false);
//   }} />;

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow">
//         <p className="mb-4 font-semibold">{current + 1} / {questions.length}</p>
//         <p className="mb-6 font-medium">{q.question}</p>

//         {q.type === 'mcq' && q.options.map((opt, i) => (
//           <button
//             key={i}
//             onClick={() => setSelected(i)}
//             className={`block w-full mb-2 p-3 rounded border text-left ${selected === i ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
//           >
//             {opt}
//           </button>
//         ))}

//         {q.type === 'tf' && [true, false].map(val => (
//           <button
//             key={String(val)}
//             onClick={() => setSelected(val)}
//             className={`block w-full mb-2 p-3 rounded border ${selected === val ? 'bg-green-100 border-green-400' : 'border-gray-300'}`}
//           >
//             {val ? 'True' : 'False'}
//           </button>
//         ))}

//         {q.type === 'essay' && (
//           <textarea
//             rows={5}
//             value={essayText}
//             onChange={e => setEssayText(e.target.value)}
//             placeholder={q.hint}
//             className="w-full p-3 mb-4 border rounded"
//           />
//         )}

//         <button
//           disabled={!canProceed}
//           onClick={handleNext}
//           className={`w-full py-3 rounded ${canProceed ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//         >
//           {isLast ? 'Submit' : 'Next'}
//         </button>
//       </div>
//     </div>
//   );
// }
