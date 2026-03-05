import { useState, useRef, useEffect } from "react";
import { Send, Search, Bot, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Conversation = { id: number; name: string; avatar: string; role: string; system: string; messages: Message[]; };

const CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "TechCorp Recruiter", avatar: "TC", role: "Senior Frontend Developer",
    system: `You are a recruiter at TechCorp Inc. hiring for a Senior Frontend Developer role. Be friendly, ask about React and TypeScript experience, answer questions about the role, salary ($120k-$150k), and company culture. Keep responses concise and professional.`,
    messages: [{ role: "assistant", content: "Hi! Thanks for applying to TechCorp. I'd love to learn more about your React experience. Can you tell me about a recent project you've worked on?" }],
  },
  {
    id: 2, name: "StartupXYZ HR", avatar: "SX", role: "React Developer",
    system: `You are an HR manager at StartupXYZ hiring for a React Developer role. Remote work, salary $100k-$130k. Be enthusiastic, mention startup culture, equity options, and flexible hours. Keep responses conversational.`,
    messages: [{ role: "assistant", content: "Hey! Excited to connect about the React Developer role. We move fast here — what excites you most about joining a startup?" }],
  },
  {
    id: 3, name: "InnovateLabs CTO", avatar: "IL", role: "Full Stack Engineer",
    system: `You are the CTO of InnovateLabs looking for a Full Stack Engineer. Ask technical questions about JavaScript, Python, and AWS. Keep responses concise and technical but approachable.`,
    messages: [{ role: "assistant", content: "Hello! We use JavaScript, Python, and AWS heavily. What's your experience with cloud infrastructure?" }],
  },
];

export default function MessagesPage() {
  const [convos, setConvos] = useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState<number>(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages, loading]);

  const filtered = convos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...active.messages, userMsg];
    setConvos(prev => prev.map(c => c.id === activeId ? { ...c, messages: updated } : c));
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: active.system, messages: updated }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "Sorry, couldn't respond right now.";
      setConvos(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...updated, { role: "assistant", content: reply }] } : c));
    } catch {
      setConvos(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...updated, { role: "assistant", content: "Connection error. Please try again." }] } : c));
    }
    setLoading(false);
  };

  const lastMsg = (c: Conversation) => {
    const last = c.messages[c.messages.length - 1];
    return last ? (last.content.length > 45 ? last.content.slice(0, 45) + "…" : last.content) : "";
  };

  return (
    <div className="flex h-screen bg-[#0f1117] transition-colors duration-300">
      {/* Left panel */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#13151f] flex flex-col flex-shrink-0">
        <div className="px-5 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Messages</h1>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1a1d27] rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && <p className="text-center text-gray-400 text-sm mt-8">No conversations found</p>}
          {filtered.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors
                ${activeId === c.id
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}>
              <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold flex-shrink-0">
                {c.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{lastMsg(c)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold">
            {active.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{active.name}</p>
            <p className="text-xs text-gray-400">{active.role}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gray-50 dark:bg-[#0f1117]">
          {active.messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold
                ${msg.role === "assistant" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                {msg.role === "assistant" ? active.avatar[0] : <User size={14} />}
              </div>
              <div className={`max-w-[65%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                ${msg.role === "assistant"
                  ? "bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                  : "bg-black dark:bg-white text-white dark:text-black"}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-black flex-shrink-0">
                {active.avatar[0]}
              </div>
              <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117]">
          <div className="flex gap-3 items-end">
            <textarea rows={1} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message… (Enter to send)"
              className="flex-1 border rounded-xl px-4 py-3 text-sm resize-none outline-none transition-colors
                bg-white dark:bg-[#1a1d27] border-gray-200 dark:border-gray-700
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                focus:border-black dark:focus:border-gray-500" />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-xl hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}