import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function Layout() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (theme === "system") applyDark(getSystemDark());
    else applyDark(theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") applyDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = () => setShowMenu(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showMenu]);

  const isDark = theme === "dark" || (theme === "system" && getSystemDark());

  const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light",  icon: <Sun size={14} />,     label: "Light"  },
    { value: "dark",   icon: <Moon size={14} />,    label: "Dark"   },
    { value: "system", icon: <Monitor size={14} />, label: "System" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <Sidebar />

      <main className="ml-56 flex-1 min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 transition-colors duration-300">

        {/* Theme picker */}
        <div className="fixed top-4 right-5 z-50">
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(p => !p); }}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
              border transition-all duration-200 shadow-sm
              ${isDark
                ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}
            `}
          >
            {isDark ? <Moon size={15} className="text-indigo-400" /> : <Sun size={15} className="text-amber-500" />}
            <span>{theme === "system" ? "System" : isDark ? "Dark" : "Light"}</span>
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div
              onClick={e => e.stopPropagation()}
              className={`
                absolute right-0 mt-2 w-36 rounded-xl shadow-lg border overflow-hidden
                transition-all duration-200
                ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
              `}
            >
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setTheme(opt.value); setShowMenu(false); }}
                  className={`
                    w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors
                    ${theme === opt.value
                      ? isDark
                        ? "bg-gray-700 text-white font-semibold"
                        : "bg-gray-100 text-gray-900 font-semibold"
                      : isDark
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-50"}
                  `}
                >
                  <span className={theme === opt.value ? (isDark ? "text-indigo-400" : "text-amber-500") : ""}>
                    {opt.icon}
                  </span>
                  {opt.label}
                  {theme === opt.value && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <Outlet />
      </main>
    </div>
  );
}