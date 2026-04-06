import React, { useState, useRef, useEffect } from "react";
import {
  MapPin, Calendar, Briefcase, Download,
  Pencil, X, Check, User
} from "lucide-react";
import { getCurrentProfile, updateCurrentProfile } from "../../api/authService";

type Experience = { role: string; company: string; year: string };

// 1. Removed: age, website, about, education
type Profile = {
  name: string;
  handle: string;
  role: string;
  location: string;
  skills: string[];
  experience: Experience[];
  cvLink: string;
  pp: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // 2. RETRIEVING: Fetch data from Spring Boot
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentProfile();
        
        const fetchedData: Profile = {
          name: data.name || "",
          handle: data.username || "", 
          role: data.roleName || "", 
          location: data.location || "",
          skills: data.skills || [], 
          experience: data.workExperiences?.map((exp: any) => ({
            role: exp.position,
            company: exp.company,
            year: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`
          })) || [],
          cvLink: data.cvLink || "",
          pp: data.profilePicLink || "",
        };

        setProfile(fetchedData);
        setDraft(fetchedData);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setFetchError('Please sign in to view your profile.');
        } else {
          setFetchError('Failed to load profile. Please try again.');
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 4. SAVING: Push updates back to Spring Boot
  const save = async () => {
    if (!draft) return;
    try {
      // 5. Removed from payload
      const payload = {
        name: draft.name,
        username: draft.handle,
        location: draft.location,
        cvLink: draft.cvLink,
        profilePicLink: draft.pp,
      };

      await updateCurrentProfile(payload);
      
      setProfile(draft);
      setEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save. Check console for errors.");
    }
  };

  const startEdit = () => { setDraft(profile); setEditing(true); };
  const cancel = () => { setDraft(profile); setEditing(false); };
  const set = (k: keyof Profile, v: string) => setDraft(d => d ? { ...d, [k]: v } : null);

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !draft) return;
    e.preventDefault();
    const val = skillInput.trim();
    if (val && !draft.skills.includes(val)) {
        setDraft(d => d ? { ...d, skills: [...d.skills, val] } : null);
    }
    setSkillInput("");
  };
  
  const removeSkill = (s: string) => setDraft(d => d ? { ...d, skills: d.skills.filter(x => x !== s) } : null);

  const updateExp = (i: number, k: keyof Experience, v: string) =>
    setDraft(d => { 
        if (!d) return null;
        const ex = [...d.experience]; 
        ex[i] = { ...ex[i], [k]: v }; 
        return { ...d, experience: ex }; 
    });
    
  const addExp = () => setDraft(d => d ? { ...d, experience: [...d.experience, { role: "", company: "", year: "" }] } : null);
  
  const removeExp = (i: number) => setDraft(d => d ? { ...d, experience: d.experience.filter((_, idx) => idx !== i) } : null);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("pp", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white flex items-center justify-center">Loading profile...</div>;
  if (fetchError) return <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white flex items-center justify-center">{fetchError}</div>;
  if (!profile || !draft) return <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white flex items-center justify-center">Profile not found.</div>;

  const cur = editing ? draft : profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="h-40 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-900 dark:to-gray-700 relative" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#0f1117] bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center shadow-md">
              {cur.pp
                ? <img src={cur.pp} alt="pp" className="w-full h-full object-cover" />
                : <User size={36} className="text-gray-400 dark:text-gray-500" />}
            </div>
            {editing && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 w-7 h-7 bg-black dark:bg-white rounded-full flex items-center justify-center shadow"
                  aria-label="Change profile picture"
                >
                  <Pencil size={11} className="text-white dark:text-black" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} aria-label="Upload profile picture" />
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-14">
            {editing ? (
              <>
                <button
                  onClick={cancel}
                  className="flex items-center gap-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  onClick={save}
                  className="flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Check size={13} /> Save
                </button>
              </>
            ) : (
              <>
                <a
                  href={profile.cvLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Download size={14} /> Resume
                </a>
                <button
                  onClick={startEdit}
                  className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Pencil size={14} /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name / handle / role */}
        <div className="mb-3">
          {editing ? (
            <div className="flex flex-wrap gap-3 items-center mb-1">
              <input value={draft.name} onChange={e => set("name", e.target.value)} className={`${inp} text-xl font-bold w-44`} placeholder="Name" />
              <input value={draft.handle} onChange={e => set("handle", e.target.value)} className={`${inp} text-sm w-32`} placeholder="@handle" />
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-0.5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{profile.handle}</span>
            </div>
          )}
          {editing
            ? <input value={draft.role} onChange={e => set("role", e.target.value)} className={`${inp} text-sm font-semibold w-64 mt-1`} placeholder="Job title" />
            : <p className="text-gray-600 dark:text-gray-300 font-semibold">{profile.role}</p>}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {editing
              ? <input value={draft.location} onChange={e => set("location", e.target.value)} className={`${inp} w-40`} placeholder="Location" />
              : profile.location}
          </span>
          <span className="flex items-center gap-1"><Calendar size={13} /> Joined 2024</span>
        </div>

        {/* Open to work banner */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 mb-6 shadow-sm">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Briefcase size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Open to Work</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Actively looking for Full-time roles.</p>
          </div>
        </div>

        {/* Main content - Adjusted grid for fewer items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          
          {/* Left col: Skills and CV Link */}
          <div className="space-y-6">
            <Section label="Skills">
              <div className="flex flex-wrap gap-2">
                {cur.skills.map(s => (
                  <span key={s} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                    {s}
                    {editing && (
                      <button onClick={() => removeSkill(s)} aria-label={`Remove skill ${s}`} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400">
                        <X size={11} />
                      </button>
                    )}
                  </span>
                ))}
                {editing && (
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="Add…"
                    className="text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-full px-3 py-1 outline-none focus:border-black dark:focus:border-gray-400 bg-transparent text-gray-700 dark:text-gray-300 w-24"
                  />
                )}
              </div>
            </Section>

            <Section label="CV / Resume">
              {editing
                ? <input value={draft.cvLink} onChange={e => set("cvLink", e.target.value)} className={`${inp} w-full`} placeholder="https://..." />
                : <a href={profile.cvLink.includes('http') ? profile.cvLink : `https://${profile.cvLink}`} target="_blank" rel="noreferrer" className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors break-all">{profile.cvLink || "No CV uploaded"}</a>}
            </Section>
          </div>

          {/* Right col: Experience */}
          <div className="space-y-6">
            <Section label="Experience">
              <div className="space-y-3">
                {cur.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700/60 rounded-xl bg-gray-50 dark:bg-[#0f1117] hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors">
                    <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase size={15} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editing ? (
                        <div className="space-y-1">
                          <input value={exp.role} onChange={e => updateExp(i, "role", e.target.value)} className={`${inp} w-full text-xs`} placeholder="Role" />
                          <input value={exp.company} onChange={e => updateExp(i, "company", e.target.value)} className={`${inp} w-full text-xs`} placeholder="Company" />
                          <input value={exp.year} onChange={e => updateExp(i, "year", e.target.value)} className={`${inp} w-full text-xs`} placeholder="Year" />
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{exp.role}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{exp.company}</p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{exp.year}</p>
                        </>
                      )}
                    </div>
                    {editing && (
                      <button onClick={() => removeExp(i)} aria-label={`Remove experience ${exp.role || "entry"}`} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 mt-1">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {editing && (
                  <button
                    onClick={addExp}
                    className="w-full border border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-2 text-xs text-gray-400 dark:text-gray-500 hover:border-gray-900 dark:hover:border-gray-300 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    + Add Experience
                  </button>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp = "border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
      <h4 className="font-bold text-gray-900 dark:text-white mb-3">{label}</h4>
      {children}
    </div>
  );
}