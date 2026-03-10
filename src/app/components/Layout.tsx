import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import React from 'react';
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function Layout() {
  // Keep initial theme loading logic so the app remembers the theme on refresh
  const [theme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });

  useEffect(() => {
    if (theme === "system") applyDark(getSystemDark());
    else applyDark(theme === "dark");
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") applyDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <Sidebar />

      <main className="ml-56 flex-1 min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
}