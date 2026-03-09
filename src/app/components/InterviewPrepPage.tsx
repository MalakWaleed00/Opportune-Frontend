import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

const ROLES = ["Frontend", "Backend", "Full Stack", "DevOps", "Data Science"];

const SYSTEM_PROMPT = (role: string) =>
  `You are an expert technical interviewer specializing in ${role} engineering roles.
Your job is to conduct a mock interview. Ask one interview question at a time, wait for the candidate's answer, then give brief constructive feedback and move to the next question.
Start by asking your first ${role}-specific interview question directly — no small talk.
Keep responses concise and professional.`;

type Message = { role: "user" | "assistant"; content: string };

export default function InterviewPrepPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startSession = async (role: string) => {
    setSelectedRole(role);
    setMessages([]);
    setLoading(true);
    const reply = await callClaude(role, []);
    setMessages([{ role: "assistant", content: reply }]);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !selectedRole) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    const reply = await callClaude(selectedRole, updated);
    setMessages([...updated, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const callClaude = async (role: string, history: Message[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM_PROMPT(role), messages: history }),
      });
      const data = await res.json();
      return data.content?.[0]?.text ?? "Sorry, I couldn't get a response.";
    } catch {
      return "Error connecting to the AI. Please try again.";
    }
  };

  const reset = () => { setSelectedRole(null); setMessages([]); setInput(""); };

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] dark:bg-[#0f1117] transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between bg-white dark:bg-[#0f1117]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Prep</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">AI-powered mock interviews tailored to your role</p>
        </div>
        {selectedRole && (
          <button onClick={reset} className="text-sm border rounded-lg px-4 py-2 transition-colors border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
            ↩ Change Role
          </button>
        )}
      </div>

      {!selectedRole ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 bg-[#0f1117]">
          <div className="text-center">
            <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bot size={28} className="text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose your interview track</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">The AI will ask role-specific questions and give you live feedback</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center max-w-lg">
            {ROLES.map((role) => (
              <button key={role} onClick={() => startSession(role)}
                className="px-6 py-3 rounded-xl border-2 font-medium transition-all
                  border-gray-700 text-gray-300
                  hover:border-white hover:bg-white hover:text-black">
                {role}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="px-8 py-3 bg-gray-50 dark:bg-[#1a1d27] border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <span className="text-xs font-semibold bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full">{selectedRole}</span>
            <span className="text-xs text-gray-400">Mock Interview Session</span>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 bg-[#0f1117]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                  ${msg.role === "assistant" ? "bg-white" : "bg-gray-700"}`}>
                  {msg.role === "assistant"
                    ? <Bot size={16} className="text-black" />
                    : <User size={16} className="text-gray-300" />}
                </div>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === "assistant"
                    ? "bg-[#1a1d27] border border-gray-700 text-gray-100"
                    : "bg-white text-black"}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-black" />
                </div>
                <div className="bg-[#1a1d27] border border-gray-700 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-8 py-4 border-t border-gray-800 bg-[#0f1117]">
            <div className="flex gap-3 items-end">
              <textarea rows={1} value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type your answer… (Enter to send)"
                className="flex-1 border rounded-xl px-4 py-3 text-sm resize-none outline-none transition-colors bg-[#1a1d27] border-gray-700 text-white placeholder-gray-500 focus:border-gray-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}