import React from "react";
import { NavLink } from "react-router";
import { Briefcase, BookOpen, UserCircle, Mail, LayoutDashboard, KanbanSquare, Settings } from "lucide-react";

const links = [
  { to: "/analytics", icon: <LayoutDashboard size={18} />, label: "Analytics Dashboard" },
  { to: "/tracker",   icon: <KanbanSquare size={18} />,    label: "Application Board" },
  { to: "/jobs",      icon: <Briefcase size={18} />,       label: "Job Search" },
  { to: "/courses",   icon: <BookOpen size={18} />,        label: "Course" },
  { to: "/messages",  icon: <Mail size={18} />,            label: "Messages" },
  { to: "/profile",   icon: <UserCircle size={18} />,      label: "Profile" },
  { to: "/settings",  icon: <Settings size={18} />,        label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="
      h-screen w-56 fixed left-0 top-0 z-40 flex flex-col pt-6
      bg-white dark:bg-[#0f1117]
      border-r border-gray-200 dark:border-gray-800
      transition-colors duration-300
    ">
      <div className="px-5 mb-8">
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Opportune
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 flex-1">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
               ${isActive
                 ? "bg-black text-white dark:bg-white dark:text-black"
                 : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
               }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4">
        <p className="text-xs text-gray-300 dark:text-gray-600">Opportune © 2026</p>
      </div>
    </aside>
  );
}