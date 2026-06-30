import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import {
  getMyApplications,
  createApplication,
  updateApplicationStatus,
} from '../../api/applicationService';
import type { Application, AppStatus } from '../../api/applicationService';

export type { AppStatus };

const STATUS_COLORS: Record<AppStatus, { dot: string; bg: string; text: string; border: string }> = {
  'Applied':             { dot: 'bg-sky-500',     bg: 'bg-sky-500/15',     text: 'text-sky-500',     border: 'border-sky-500/25' },
  'Interview Scheduled': { dot: 'bg-violet-500',  bg: 'bg-violet-500/15',  text: 'text-violet-500',  border: 'border-violet-500/25' },
  'Interview Done':      { dot: 'bg-indigo-500',  bg: 'bg-indigo-500/15',  text: 'text-indigo-500',  border: 'border-indigo-500/25' },
  'Offer Received':      { dot: 'bg-amber-500',   bg: 'bg-amber-500/15',   text: 'text-amber-500',   border: 'border-amber-500/25' },
  'Offer Accepted':      { dot: 'bg-emerald-500', bg: 'bg-emerald-500/15', text: 'text-emerald-500', border: 'border-emerald-500/25' },
  'Rejected':            { dot: 'bg-rose-500',    bg: 'bg-rose-500/15',    text: 'text-rose-500',    border: 'border-rose-500/25' },
  'Withdrawn':           { dot: 'bg-slate-500',   bg: 'bg-slate-500/15',   text: 'text-slate-500',   border: 'border-slate-500/25' },
};

export function ApplicationTrackerPage() {
  const [apps, setApps]       = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [filter, setFilter]   = useState<AppStatus | 'All'>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError]   = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [newApp, setNewApp] = useState<Partial<Application>>({
    jobTitle: '', company: '', location: '', salary: '', status: 'Applied', notes: '',
  });

  const load = () => {
    setLoading(true);
    setError(null);
    getMyApplications()
      .then(setApps)
      .catch(() => setError("Could not load applications. Make sure the backend is running and you are logged in."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const activeCount    = apps.filter(a => !['Rejected', 'Withdrawn'].includes(a.status)).length;
  const interviewCount = apps.filter(a => ['Interview Scheduled', 'Interview Done'].includes(a.status)).length;
  const offerCount     = apps.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length;
  const rejectedCount  = apps.filter(a => a.status === 'Rejected').length;

  const filteredApps = filter === 'All' ? apps : apps.filter(a => a.status === filter);

  const handleStatusChange = async (id: string, newStatus: AppStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    try {
      await updateApplicationStatus(id, newStatus);
    } catch {
      load();
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      const created = await createApplication({
        jobTitle:  newApp.jobTitle  || 'Unknown Title',
        company:   newApp.company   || 'Unknown Company',
        location:  newApp.location  || 'Remote',
        salary:    newApp.salary    || 'N/A',
        status:    (newApp.status as AppStatus) || 'Applied',
        notes:     newApp.notes     || '',
      });
      setApps(prev => [created, ...prev]);
      setIsModalOpen(false);
      setNewApp({ jobTitle: '', company: '', location: '', salary: '', status: 'Applied', notes: '' });
    } catch {
      setModalError('Failed to add application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading applications…</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-red-500 text-sm text-center">{error}</p>
      <button onClick={load} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-80 transition-opacity">
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Application Board</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{apps.length} applications · {activeCount} active</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setIsModalOpen(true); setModalError(null); }}
              className="flex items-center gap-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-full px-4 py-2 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <Plus size={16} /> Add Application
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Applied</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{apps.length}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">total</p>
          </div>
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Interviews</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{interviewCount}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">scheduled or done</p>
          </div>
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Offers</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{offerCount}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">received or accepted</p>
          </div>
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{rejectedCount}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">not selected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('All')} className={`px-3 py-1 text-sm font-medium transition-colors rounded-full ${filter === 'All' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/60'}`}>
            All
          </button>
          {Object.keys(STATUS_COLORS).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as AppStatus)}
              className={`px-3 py-1 text-sm font-medium transition-colors rounded-full ${filter === status ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/60'}`}
            >
              {status} <span className="ml-1 opacity-60">{apps.filter(a => a.status === status).length}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <div className="col-span-4">Job</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Applied</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Notes</div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {filteredApps.map(app => (
              <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="col-span-4 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.jobTitle}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.company}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{app.location}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{app.salary}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{app.appliedDate}</p>
                </div>
                <div className="col-span-2">
                  <div className="relative group">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-1 ${STATUS_COLORS[app.status].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[app.status].dot}`} />
                      {app.status}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as AppStatus)}
                      aria-label={`Update status for ${app.jobTitle}`}
                      className="block w-full text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded p-1 text-gray-700 dark:text-gray-300 outline-none focus:border-gray-500 dark:focus:border-white"
                    >
                      {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-white dark:bg-gray-800">{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">{app.notes || 'No notes...'}</p>
                </div>
              </div>
            ))}

            {filteredApps.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                No applications found in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD APPLICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1d27] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700/60">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Application</h2>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close modal" className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="p-5 space-y-4">
              {modalError && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{modalError}</p>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input required type="text" value={newApp.jobTitle} onChange={e => setNewApp({...newApp, jobTitle: e.target.value})} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-slate-500" placeholder="e.g. Frontend Developer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                  <input required type="text" value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-slate-500" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input type="text" value={newApp.location} onChange={e => setNewApp({...newApp, location: e.target.value})} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-slate-500" placeholder="e.g. Remote" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Range</label>
                  <input type="text" value={newApp.salary} onChange={e => setNewApp({...newApp, salary: e.target.value})} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-slate-500" placeholder="e.g. $100k - $120k" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select value={newApp.status} onChange={e => setNewApp({...newApp, status: e.target.value as AppStatus})} aria-label="Select application status" className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-slate-500">
                    {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-white dark:bg-slate-800">{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea value={newApp.notes} onChange={e => setNewApp({...newApp, notes: e.target.value})} rows={3} className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-slate-500 resize-none" placeholder="Any details about the application..." />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors">
                  {submitting ? 'Saving…' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
