import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function SettingsPage() {
  // Check local storage for a saved theme, default to 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  // Whenever the theme state changes, update the HTML tag and LocalStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      localStorage.setItem('theme', 'system');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your app preferences</p>
        </div>

        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          
          <div className="flex items-center gap-3">
            {/* Light Mode Button */}
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Sun size={16} /> Light
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Moon size={16} /> Dark
            </button>

            {/* System Mode Button */}
            <button
              onClick={() => setTheme('system')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${theme === 'system' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Monitor size={16} /> System
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}