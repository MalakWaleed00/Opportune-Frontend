import React, { useState } from 'react';
import { UserCircle, Mail, MapPin, Building2, Globe, Pencil, Check } from 'lucide-react';
import { updateCurrentProfile } from '../../../api/authService';

interface ProfileForm {
  name: string;
  username: string;
  email: string;
  location: string;
  company: string;
  website: string;
}

export function RecruiterProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ProfileForm>({
    name: storedUser.name ?? '',
    username: storedUser.username ?? '',
    email: storedUser.email ?? '',
    location: storedUser.location ?? '',
    company: storedUser.company ?? '',
    website: storedUser.website ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCurrentProfile({
        name: form.name,
        username: form.username,
        location: form.location,
      });
      const updated = { ...storedUser, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name
    ? form.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const fields: Array<{
    icon: React.ReactNode;
    label: string;
    name: keyof ProfileForm;
    placeholder: string;
    disabled?: boolean;
  }> = [
    { icon: <UserCircle size={16} />, label: 'Full Name', name: 'name', placeholder: 'Your full name' },
    { icon: <UserCircle size={16} />, label: 'Username', name: 'username', placeholder: 'username' },
    { icon: <Mail size={16} />, label: 'Email', name: 'email', placeholder: 'you@company.com', disabled: true },
    { icon: <MapPin size={16} />, label: 'Location', name: 'location', placeholder: 'City, Country' },
    { icon: <Building2 size={16} />, label: 'Company', name: 'company', placeholder: 'Company name' },
    { icon: <Globe size={16} />, label: 'Website', name: 'website', placeholder: 'https://yourcompany.com' },
  ];

  const inputCls =
    'w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Manage your public recruiter profile
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(false); setError(''); }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                <Check size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Avatar card */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            {storedUser.profilePicLink ? (
              <img
                src={storedUser.profilePicLink}
                alt={form.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-white dark:text-black text-xl font-bold">{initials}</span>
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {form.name || 'Your Name'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{form.username || 'username'}</p>
              <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 font-medium">
                Recruiter
              </span>
            </div>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Contact & Details</h3>

          {fields.map(field => (
            <div key={field.name} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400">
                {field.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{field.label}</p>
                {editing && !field.disabled ? (
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {form[field.name] || (
                      <span className="text-gray-400 font-normal italic">{field.placeholder}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 justify-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <Check size={14} />
            Profile updated successfully
          </div>
        )}
      </div>
    </div>
  );
}
