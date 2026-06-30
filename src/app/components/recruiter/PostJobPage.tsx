import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { X, Plus, ChevronLeft } from 'lucide-react';
import { createJob, updateJob, JobPostRequest, JobPost } from '../../../api/recruiterService';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Expert'];

export function PostJobPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editJob = (location.state as any)?.job as JobPost | undefined;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [form, setForm] = useState<JobPostRequest>({
    title: editJob?.title ?? '',
    companyName: editJob?.companyName ?? (user.company ?? ''),
    location: editJob?.location ?? '',
    jobType: editJob?.jobType ?? 'Full-time',
    experienceLevel: editJob?.experienceLevel ?? 'Mid Level',
    salaryRange: editJob?.salaryRange ?? '',
    description: editJob?.description ?? '',
    skills: editJob?.skills ?? [],
    deadline: editJob?.deadline ?? '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.companyName || !form.location || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      if (editJob) {
        await updateJob(editJob.id, form);
      } else {
        await createJob(form);
      }
      setSuccess(true);
      setTimeout(() => navigate('/recruiter/jobs'), 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Failed to save job. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1117]">
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {editJob ? 'Job Updated!' : 'Job Posted!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting to your jobs...</p>
        </div>
      </div>
    );
  }

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editJob ? 'Edit Job Posting' : 'Post a New Job'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Fill in the details to attract the right candidates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Senior React Developer"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName" value={form.companyName} onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Cairo, Egypt or Remote"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                  Salary Range
                </label>
                <input
                  name="salaryRange" value={form.salaryRange} onChange={handleChange}
                  placeholder="e.g. $80k–$120k / year"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">Job Type</label>
                <select name="jobType" value={form.jobType} onChange={handleChange} className={inputCls}>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">Experience Level</label>
                <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className={inputCls}>
                  {EXP_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">Application Deadline</label>
                <input
                  type="date" name="deadline" value={form.deadline} onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={8}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Required Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button" onClick={addSkill}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.map(skill => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button" onClick={() => removeSkill(skill)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-xl py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pb-6">
            <button
              type="button" onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? (editJob ? 'Saving...' : 'Posting...') : (editJob ? 'Save Changes' : 'Post Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
