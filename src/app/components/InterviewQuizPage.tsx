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

// ── Function to generate new random questions ───
const generateQuestions = (): Question[] => {
  const essayQs: EssayQuestion[] = [];

 const mcqQs: MCQQuestion[] = [
  {
    type: 'mcq',
    question: 'What is the primary purpose of a CI/CD pipeline in DevOps?',
    options: [
      'To manually deploy applications',
      'To automate building, testing, and deployment of applications',
      'To replace source control systems',
      'To monitor employee productivity',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'Which of the following tools is commonly used for CI/CD automation?',
    options: ['Docker', 'Jenkins', 'Postman', 'Grafana'],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'In GitHub Actions, what is a workflow?',
    options: [
      'A Docker image',
      'A branch protection rule',
      'An automated process defined in YAML',
      'A Git merge strategy',
    ],
    answer: 2,
  },
  {
    type: 'mcq',
    question: 'What is the best reason to use branching strategies in Git?',
    options: [
      'To increase server RAM',
      'To organize and isolate code changes safely',
      'To avoid using pull requests',
      'To replace CI pipelines',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What is the main purpose of Docker in a DevOps environment?',
    options: [
      'To create databases',
      'To manage Git branches',
      'To package applications and dependencies into containers',
      'To scan source code for vulnerabilities',
    ],
    answer: 2,
  },
  {
    type: 'mcq',
    question: 'Which Kubernetes object is commonly used to manage a set of running application pods?',
    options: ['Deployment', 'Volume', 'Namespace', 'Ingress'],
    answer: 0,
  },
  {
    type: 'mcq',
    question: 'What is GitHub Advanced Security primarily used for?',
    options: [
      'Managing cloud billing',
      'Code scanning, secret detection, and dependency security',
      'Container orchestration',
      'Server patching only',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What does SAST stand for?',
    options: [
      'Secure Application Setup Testing',
      'Static Application Security Testing',
      'System Access Security Tracking',
      'Software Automation Security Tool',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What does DAST stand for?',
    options: [
      'Dynamic Application Security Testing',
      'Distributed API Security Tracking',
      'Deployment Analysis Security Tool',
      'Database Access Security Testing',
    ],
    answer: 0,
  },
  {
    type: 'mcq',
    question: 'What is the key difference between SAST and DAST?',
    options: [
      'SAST scans running apps, DAST scans source code',
      'SAST scans source code, DAST tests running applications',
      'SAST is for Docker only, DAST is for Kubernetes only',
      'There is no difference',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'Why is secret detection important in a CI/CD pipeline?',
    options: [
      'To improve UI design',
      'To prevent credentials and tokens from being exposed in code',
      'To reduce CPU usage',
      'To replace API gateways',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What is the purpose of a container registry?',
    options: [
      'To store and distribute container images',
      'To host Git repositories',
      'To log API requests',
      'To manage user passwords',
    ],
    answer: 0,
  },
  {
    type: 'mcq',
    question: 'Which Azure service is commonly used to publish and host web applications?',
    options: ['Azure Blob Storage', 'Azure App Service', 'Azure SQL', 'Azure Monitor'],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What is Azure API Management (APIM) mainly used for?',
    options: [
      'Managing source code branches',
      'Hosting virtual machines',
      'Securing, publishing, and managing APIs',
      'Running SQL queries',
    ],
    answer: 2,
  },
  {
    type: 'mcq',
    question: 'Which of the following is an example of API authentication?',
    options: [
      'Using a firewall rule',
      'Using OAuth 2.0 or JWT tokens',
      'Using a Dockerfile',
      'Using Git hooks',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What is the purpose of environment variables in application deployment?',
    options: [
      'To store code comments',
      'To configure application settings without hardcoding them',
      'To replace source control',
      'To increase network speed',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'Why should connection strings not be hardcoded in source code?',
    options: [
      'Because it makes the UI slower',
      'Because it can expose sensitive credentials and reduce flexibility',
      'Because it prevents Git commits',
      'Because it breaks YAML files',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'What is Infrastructure as Code (IaC)?',
    options: [
      'Writing business logic in JavaScript',
      'Managing infrastructure using code and configuration files',
      'Deploying applications without version control',
      'A method for writing frontend CSS',
    ],
    answer: 1,
  },
  {
    type: 'mcq',
    question: 'Which of the following is an Infrastructure as Code tool?',
    options: ['Terraform', 'Postman', 'Jira', 'Figma'],
    answer: 0,
  },
  {
    type: 'mcq',
    question: 'What is a major benefit of Infrastructure as Code?',
    options: [
      'It eliminates the need for cloud platforms',
      'It makes infrastructure reproducible and version-controlled',
      'It removes the need for testing',
      'It replaces containerization',
    ],
    answer: 1,
  },



  
];

  const tfQs: TFQuestion[] = [
   
  ];

  // Randomly shuffle and pick questions
  const allQs: Question[] = [...essayQs, ...mcqQs, ...tfQs];
  return allQs.sort(() => Math.random() - 0.5);
};

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
  const [questions, setQuestions] = useState<Question[]>(generateQuestions());
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | boolean | string)[]>(new Array(questions.length).fill(null));
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

  if (showResult) return (
    <ResultScreen
      questions={questions}
      answers={answers}
      onRetry={() => {
        const newQs = generateQuestions();
        setQuestions(newQs);
        setCurrent(0);
        setAnswers(new Array(newQs.length).fill(null));
        setSelected(null);
        setEssayText('');
        setShowResult(false);
      }}
    />
  );

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