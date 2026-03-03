import { BookOpen } from "lucide-react";

const PLATFORM_COLORS: Record<string, string> = {
  Udemy:        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Coursera:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Pluralsight:  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  FreeCodeCamp: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const COURSES = [
  { id: 1, title: "React – The Complete Guide (incl. React Router & Redux)", description: "Dive deep into React, hooks, context, and modern patterns used in production apps.", platform: "Udemy",    skills: ["React", "Redux", "Hooks"],          basedOn: "Senior Frontend Developer" },
  { id: 2, title: "TypeScript for Professionals",                             description: "Master TypeScript from basics to advanced generics, decorators, and strict typing.",  platform: "Udemy",    skills: ["TypeScript", "JavaScript"],          basedOn: "Senior Frontend Developer" },
  { id: 3, title: "Node.js, Express, MongoDB & More: The Complete Bootcamp",  description: "Build fast, scalable back-end apps with Node, REST APIs, and MongoDB.",              platform: "Udemy",    skills: ["Node.js", "MongoDB", "REST API"],    basedOn: "React Developer"           },
  { id: 4, title: "AWS Certified Developer – Associate",                      description: "Prepare for the AWS Developer certification with hands-on labs.",                     platform: "Coursera", skills: ["AWS", "Cloud", "DevOps"],            basedOn: "Full Stack Engineer"       },
  { id: 5, title: "Python for Everybody Specialization",                      description: "Learn Python programming, data structures, and web scraping from U of Michigan.",     platform: "Coursera", skills: ["Python", "Data Structures"],         basedOn: "Full Stack Engineer"       },
  { id: 6, title: "Tailwind CSS from Scratch",                                description: "Build modern, responsive UIs quickly with Tailwind CSS utility classes.",              platform: "Pluralsight", skills: ["Tailwind CSS", "CSS", "UI"],       basedOn: "Senior Frontend Developer" },
];

const grouped = COURSES.reduce<Record<string, typeof COURSES>>((acc, c) => {
  acc[c.basedOn] = [...(acc[c.basedOn] ?? []), c];
  return acc;
}, {});

export default function CourseRecommendationPage() {
  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Recommendations</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Based on jobs you recently viewed</p>
      </div>

      {Object.entries(grouped).map(([jobTitle, courses]) => (
        <div key={jobTitle} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Because you viewed{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">{jobTitle}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="
                border rounded-xl p-5 flex flex-col justify-between
                bg-white dark:bg-[#1a1d27]
                border-gray-200 dark:border-gray-700/60
                hover:shadow-md dark:hover:shadow-black/40
                transition-all duration-200
              ">
                <div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PLATFORM_COLORS[course.platform] ?? "bg-gray-100 text-gray-600"}`}>
                    {course.platform}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mt-3 mb-1 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {course.skills.map((s) => (
                      <span key={s} className="text-xs border rounded-full px-2.5 py-0.5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="mt-5 w-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                  View Course
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}