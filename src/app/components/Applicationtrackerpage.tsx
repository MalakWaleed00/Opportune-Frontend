import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BarChart2, Plus, X } from 'lucide-react';

export type AppStatus = 'Applied' | 'Interview Scheduled' | 'Interview Done' | 'Offer Received' | 'Offer Accepted' | 'Rejected' | 'Withdrawn';

interface Application {
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

const INITIAL_APPS: Application[] = [
  { id: '1', jobTitle: 'Senior Frontend Developer', company: 'TechCorp Inc.', logo: '🚀', location: 'San Francisco, CA', salary: '$120k–$150k', appliedDate: 'Feb 10, 2025', status: 'Interview Done', notes: 'Had a great call with the engineering lead.' },
  { id: '2', jobTitle: 'React Developer', company: 'StartupXYZ', logo: '💡', location: 'Remote', salary: '$100k–$130k', appliedDate: 'Feb 14, 2025', status: 'Offer Received', notes: 'Offer letter received. Evaluating.' },
  { id: '3', jobTitle: 'Full Stack Engineer', company: 'InnovateLabs', logo: '🎯', location: 'New York, NY', salary: '$110k–$140k', appliedDate: 'Feb 18, 2025', status: 'Applied', notes: 'Add notes...' },
];

const STATUS_COLORS: Record<AppStatus, { dot: string; bg: string; text: string; border: string }> = {
  'Applied': { dot: 'bg-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Interview Scheduled': { dot: 'bg-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  'Interview Done': { dot: 'bg-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  'Offer Received': { dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Offer Accepted': { dot: 'bg-green-500', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  'Rejected': { dot: 'bg-red-500', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  'Withdrawn': { dot: 'bg-gray-500', bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
};

export function ApplicationTrackerPage() {
  // Sync state with local storage so Analytics page can read it
  const [apps, setApps] = useState<Application[]>(() => {
    const saved = localStorage.getItem('opportune_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPS;
  });

  // Whenever 'apps' changes, save it to local storage
  useEffect(() => {
    localStorage.setItem('opportune_applications', JSON.stringify(apps));
  }, [apps]);

  const [filter, setFilter] = useState<AppStatus | 'All'>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Application>>({
    jobTitle: '', company: '', location: '', salary: '', status: 'Applied', notes: ''
  });

  // Calculate Stats
  const activeCount = apps.filter(a => !['Rejected', 'Withdrawn'].includes(a.status)).length;
  const interviewCount = apps.filter(a => ['Interview Scheduled', 'Interview Done'].includes(a.status)).length;
  const offerCount = apps.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length;
  const rejectedCount = apps.filter(a => a.status === 'Rejected').length;

  const filteredApps = filter === 'All' ? apps : apps.filter(a => a.status === filter);

  // Handlers
  const handleStatusChange = (id: string, newStatus: AppStatus) => {
    setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const application: Application = {
      id: Date.now().toString(),
      jobTitle: newApp.jobTitle || 'Unknown Title',
      company: newApp.company || 'Unknown Company',
      location: newApp.location || 'Remote',
      salary: newApp.salary || 'N/A',
      status: (newApp.status as AppStatus) || 'Applied',
      notes: newApp.notes || '',
      logo: '💼', 
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setApps([application, ...apps]); 
    setIsModalOpen(false); 
    setNewApp({ jobTitle: '', company: '', location: '', salary: '', status: 'Applied', notes: '' }); 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{apps.length} applications · {activeCount} active</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Add Application
            </button>
            
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applied</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{apps.length}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">total</p>
          </div>
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Interviews</p>
            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{interviewCount}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">scheduled or done</p>
          </div>
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Offers</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{offerCount}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">received or accepted</p>
          </div>
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">not selected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('All')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'All' ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            All
          </button>
          {Object.keys(STATUS_COLORS).map(status => (
            <button key={status} onClick={() => setFilter(status as AppStatus)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${filter === status ? 'bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {status} <span className="ml-1 opacity-50">{apps.filter(a => a.status === status).length}</span>
            </button>
          ))}
        </div>

        {/* Table / List */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <div className="col-span-4">Job</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Applied</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Notes</div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {filteredApps.map(app => (
              <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                    {app.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.jobTitle}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.company}</p>
                  </div>
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
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold mb-1 ${STATUS_COLORS[app.status].bg} ${STATUS_COLORS[app.status].text} ${STATUS_COLORS[app.status].border}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1d27] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Application</h2>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close modal" className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddApplication} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                <input required type="text" value={newApp.jobTitle} onChange={e => setNewApp({...newApp, jobTitle: e.target.value})} className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" placeholder="e.g. Frontend Developer" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input required type="text" value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input type="text" value={newApp.location} onChange={e => setNewApp({...newApp, location: e.target.value})} className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" placeholder="e.g. Remote" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Range</label>
                  <input type="text" value={newApp.salary} onChange={e => setNewApp({...newApp, salary: e.target.value})} className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" placeholder="e.g. $100k - $120k" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={newApp.status} onChange={e => setNewApp({...newApp, status: e.target.value as AppStatus})} aria-label="Select application status" className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500">
                    {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-white dark:bg-gray-800">{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea value={newApp.notes} onChange={e => setNewApp({...newApp, notes: e.target.value})} rows={3} className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 resize-none" placeholder="Any details about the application..." />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}