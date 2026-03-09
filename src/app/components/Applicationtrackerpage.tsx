import React, { useState } from 'react';
import { Link } from 'react-router';

export type AppStatus =
  | 'Applied'
  | 'Interview Scheduled'
  | 'Interview Done'
  | 'Offer Received'
  | 'Offer Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: AppStatus;
  notes: string;
}

const STATUS_META: Record<AppStatus, { color: string; bg: string; darkBg: string; darkColor: string; dot: string }> = {
  'Applied':             { color: 'text-blue-700',   bg: 'bg-blue-50',   darkBg: 'dark:bg-blue-900/20',   darkColor: 'dark:text-blue-300',   dot: 'bg-blue-500' },
  'Interview Scheduled': { color: 'text-violet-700', bg: 'bg-violet-50', darkBg: 'dark:bg-violet-900/20', darkColor: 'dark:text-violet-300', dot: 'bg-violet-500' },
  'Interview Done':      { color: 'text-indigo-700', bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-900/20', darkColor: 'dark:text-indigo-300', dot: 'bg-indigo-500' },
  'Offer Received':      { color: 'text-amber-700',  bg: 'bg-amber-50',  darkBg: 'dark:bg-amber-900/20',  darkColor: 'dark:text-amber-300',  dot: 'bg-amber-500' },
  'Offer Accepted':      { color: 'text-green-700',  bg: 'bg-green-50',  darkBg: 'dark:bg-green-900/20',  darkColor: 'dark:text-green-300',  dot: 'bg-green-500' },
  'Rejected':            { color: 'text-red-700',    bg: 'bg-red-50',    darkBg: 'dark:bg-red-900/20',    darkColor: 'dark:text-red-300',    dot: 'bg-red-500' },
  'Withdrawn':           { color: 'text-gray-600',   bg: 'bg-gray-100',  darkBg: 'dark:bg-gray-800',      darkColor: 'dark:text-gray-400',   dot: 'bg-gray-400' },
};

const ALL_STATUSES: AppStatus[] = [
  'Applied', 'Interview Scheduled', 'Interview Done',
  'Offer Received', 'Offer Accepted', 'Rejected', 'Withdrawn',
];

const INITIAL: Application[] = [
  { id: '1', jobTitle: 'Senior Frontend Developer', company: 'TechCorp Inc.',  logo: '🚀', location: 'San Francisco, CA', salary: '$120k–$150k', appliedDate: '2025-02-10', status: 'Interview Done',      notes: 'Had a great call with the engineering lead.' },
  { id: '2', jobTitle: 'React Developer',           company: 'StartupXYZ',     logo: '💡', location: 'Remote',            salary: '$100k–$130k', appliedDate: '2025-02-14', status: 'Offer Received',      notes: 'Offer letter received. Evaluating.' },
  { id: '3', jobTitle: 'Full Stack Engineer',        company: 'InnovateLabs',   logo: '🎯', location: 'New York, NY',      salary: '$110k–$140k', appliedDate: '2025-02-18', status: 'Applied',             notes: '' },
  { id: '4', jobTitle: 'UI/UX Designer',             company: 'DesignHub',      logo: '🎨', location: 'Los Angeles, CA',   salary: '$90k–$120k',  appliedDate: '2025-02-20', status: 'Rejected',            notes: 'They went with someone more senior.' },
  { id: '5', jobTitle: 'Backend Developer',          company: 'CloudSystems',   logo: '☁️', location: 'Seattle, WA',       salary: '$115k–$145k', appliedDate: '2025-02-22', status: 'Interview Scheduled', notes: 'Interview on March 15 at 2pm.' },
  { id: '6', jobTitle: 'DevOps Engineer',            company: 'InfraTech',      logo: '⚙️', location: 'Austin, TX',        salary: '$125k–$155k', appliedDate: '2025-02-25', status: 'Withdrawn',           notes: 'Role was not the right fit.' },
  { id: '7', jobTitle: 'Mobile App Developer',       company: 'AppStudio',      logo: '📱', location: 'Remote',            salary: '$80k–$110k',  appliedDate: '2025-03-01', status: 'Applied',             notes: '' },
];

function StatusBadge({ status }: { status: AppStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${m.bg} ${m.color} ${m.darkBg} ${m.darkColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {status}
    </span>
  );
}

function StatusSelect({ value, onChange }: { value: AppStatus; onChange: (s: AppStatus) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as AppStatus)}
      aria-label="Update application status"
      title="Update application status"
      className="text-xs rounded-lg px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors cursor-pointer"
    >
      {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

export function ApplicationTrackerPage() {
  const [apps, setApps] = useState<Application[]>(INITIAL);
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'All'>('All');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [search, setSearch] = useState('');

  const updateStatus = (id: string, status: AppStatus) =>
    setApps(a => a.map(x => x.id === id ? { ...x, status } : x));

  const saveNotes = (id: string) => {
    setApps(a => a.map(x => x.id === id ? { ...x, notes: notesDraft } : x));
    setEditingNotes(null);
  };

  const filtered = apps.filter(a => {
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    const matchSearch = a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Summary counts
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<AppStatus, number>);

  const totalActive = apps.filter(a => !['Rejected', 'Withdrawn'].includes(a.status)).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{apps.length} applications · {totalActive} active</p>
          </div>
          <Link
            to="/analytics"
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Applied',    value: apps.length,               color: 'text-gray-900 dark:text-white',   sub: 'total' },
            { label: 'Interviews', value: counts['Interview Done'] + counts['Interview Scheduled'], color: 'text-violet-600 dark:text-violet-400', sub: 'scheduled or done' },
            { label: 'Offers',     value: counts['Offer Received'] + counts['Offer Accepted'],      color: 'text-green-600 dark:text-green-400',   sub: 'received or accepted' },
            { label: 'Rejected',   value: counts['Rejected'],        color: 'text-red-600 dark:text-red-400',  sub: 'not selected' },
          ].map(c => (
            <div key={c.label} className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{c.label}</p>
              <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs or companies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['All', ...ALL_STATUSES] as (AppStatus | 'All')[]).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === s
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                {s} {s !== 'All' && counts[s as AppStatus] > 0 && <span className="ml-1 opacity-60">{counts[s as AppStatus]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 dark:text-gray-600 text-sm">No applications match your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">Job</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3 hidden sm:table-cell">Location</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3 hidden md:table-cell">Applied</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3 hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      {/* Job */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                            {app.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{app.jobTitle}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">{app.company}</p>
                          </div>
                        </div>
                      </td>
                      {/* Location */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{app.location}</p>
                        <p className="text-gray-400 dark:text-gray-600 text-xs">{app.salary}</p>
                      </td>
                      {/* Applied date */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <StatusBadge status={app.status} />
                          <StatusSelect value={app.status} onChange={s => updateStatus(app.id, s)} />
                        </div>
                      </td>
                      {/* Notes */}
                      <td className="px-5 py-4 hidden lg:table-cell max-w-xs">
                        {editingNotes === app.id ? (
                          <div className="flex flex-col gap-1.5">
                            <textarea
                              rows={2}
                              value={notesDraft}
                              onChange={e => setNotesDraft(e.target.value)}
                              aria-label="Application notes"
                              placeholder="Add notes about this application…"
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-violet-300 dark:border-violet-600 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white outline-none resize-none"
                              autoFocus
                            />
                            <div className="flex gap-1.5">
                              <button onClick={() => saveNotes(app.id)} className="text-xs px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold">Save</button>
                              <button onClick={() => setEditingNotes(null)} className="text-xs px-2.5 py-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingNotes(app.id); setNotesDraft(app.notes); }}
                            className="text-left w-full group"
                          >
                            {app.notes
                              ? <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{app.notes}</p>
                              : <p className="text-xs text-gray-300 dark:text-gray-600 italic group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">Add notes…</p>
                            }
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}