import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Lock, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; 

export function SettingsPage() {
  // --- Theme State ---
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  // --- Password States ---
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

  // --- Theme Effect ---
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

  // --- Handlers ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      setPasswordStatus({ type: 'error', message: "New passwords don't match." });
      return;
    }
    if (passwords.new.length < 6) {
      setPasswordStatus({ type: 'error', message: "Password must be at least 6 characters." });
      return;
    }

    try {
      setPasswordStatus({ type: 'info', message: "Updating password..." });
      
      // REAL BACKEND CALL: Replace '1' with logged-in user ID
      // await axios.put('http://localhost:8080/api/users/1/change-password', {
      //   currentPassword: passwords.current,
      //   newPassword: passwords.new
      // });

      // Simulated success for now
      setTimeout(() => {
        setPasswordStatus({ type: 'success', message: "Password updated successfully!" });
        
        setTimeout(() => {
            closePasswordForm();
        }, 1500);
      }, 1000);

    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to update password. Check your current password.";
      setPasswordStatus({ type: 'error', message: errorMessage });
    }
  };

  const closePasswordForm = () => {
    setIsChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordStatus({ type: '', message: '' });
  };

  // FIXED LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); // <-- This will safely route you without a hard refresh
  };

  const inputClass = "w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your app preferences and security</p>
        </div>

        {/* 1. Appearance Section */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Sun size={16} /> Light
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Moon size={16} /> Dark
            </button>

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

        {/* 2. Security Section */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          
          {!isChangingPassword ? (
            // --- STATE 1: Just show the button ---
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Update your password to keep your account secure.
              </p>
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Change Password
              </button>
            </div>
          ) : (
            // --- STATE 2: Show the form ---
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={closePasswordForm}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-1 -ml-1 rounded"
                  aria-label="Go back to settings"
                >
                  <ArrowLeft size={18} />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input 
                    id="current-password"
                    type="password" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className={inputClass} 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input 
                    id="new-password" 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className={inputClass} 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input 
                    id="confirm-password" 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className={inputClass} 
                    required
                  />
                </div>

                {/* Status Message */}
                {passwordStatus.message && (
                  <p className={`text-sm font-medium ${
                    passwordStatus.type === 'error' ? 'text-red-500' : 
                    passwordStatus.type === 'success' ? 'text-green-500' : 'text-blue-500'
                  }`}>
                    {passwordStatus.message}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="submit"
                    className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Save Password
                  </button>
                  <button 
                    type="button"
                    onClick={closePasswordForm}
                    className="text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* 3. Account Actions (Logout) */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Sign out of your account on this device.
          </p>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}