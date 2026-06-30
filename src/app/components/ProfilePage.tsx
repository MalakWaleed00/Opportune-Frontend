import React, { useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  User,
  GraduationCap,
  Code,
  FolderKanban,
  Building2,
} from "lucide-react";

type Education = {
  degree: string;
  institution: string;
  year: string;
};

type Job = {
  title: string;
  company: string;
  summary: string;
};

type Project = {
  name: string;
  description: string;
  technologies: string[];
};

type Internship = {
  title: string;
  company: string;
  duration: string;
  summary: string;
};

type Profile = {
  name: string;
  email: string;
  phone: string;
  experience_level: string;
  skills: string[];
  education: Education[];
  jobs: Job[];
  projects: Project[];
  internships: Internship[];
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      if (!storedUser?.id) return;
      const res = await fetch(`http://localhost:8080/api/cv?userId=${storedUser.id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        experience_level: data.experience_level || "",
        skills: data.skills || [],
        education: data.education || [],
        jobs: data.jobs || [],
        projects: data.projects || [],
        internships: data.internships || [],
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpload = async () => {
    if (!cvFile || !storedUser?.id) return;
    setUploading(true);
    setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", cvFile);
      const res = await fetch(
        `http://localhost:8080/api/cv/parse?userId=${storedUser.id}`,
        {
          method: "POST",
          body: fd,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setUploadMsg({ type: "success", text: "CV uploaded! Refreshing profile..." });
      setCvFile(null);
      setTimeout(() => { fetchProfile(); setUploadMsg(null); }, 1500);
    } catch (err: any) {
      setUploadMsg({ type: "error", text: err?.message || "Upload failed. Try again." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CV UPLOAD */}
        <div className="bg-white dark:bg-[#1a1d27] rounded-xl shadow p-5">
          <h2 className="font-bold mb-3 flex items-center gap-2 text-sm">
            <User size={16} /> {profile ? "Update CV" : "Upload Your CV"}
          </h2>
          {!profile && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              No CV found. Upload one to populate your profile.
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => { setCvFile(e.target.files?.[0] ?? null); setUploadMsg(null); }}
              className="flex-1 min-w-0 text-sm text-gray-600 dark:text-gray-400
                file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:bg-black file:text-white dark:file:bg-white dark:file:text-black
                hover:file:opacity-80 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={!cvFile || uploading}
              className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40 flex-shrink-0"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {uploadMsg && (
            <p className={`mt-2 text-sm ${uploadMsg.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {uploadMsg.text}
            </p>
          )}
        </div>

        {!profile ? (
          <div className="bg-white dark:bg-[#1a1d27] rounded-xl shadow p-12 text-center text-gray-400">
            Upload your CV above to see your profile.
          </div>
        ) : (<>

        {/* HEADER WITH COVER + PROFILE PIC */}
        <div className="bg-white dark:bg-[#1a1d27] rounded-xl shadow overflow-hidden">

          {/* COVER PHOTO */}
          <div className="h-44 w-full relative">
            <img
              src={
                "https://ui-avatars.com/api/?name=${profile.name}"
              }
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* PROFILE INFO */}
          <div className="p-6 relative">

            {/* PROFILE PICTURE */}
            <div className="absolute -top-12 left-6">
              <img
                src={
                  `https://ui-avatars.com/api/?name=${profile.name}`
                }
                alt="profile"
                className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1a1d27] object-cover"
              />
            </div>

            {/* NAME + DETAILS */}
            <div className="mt-12">
              <h1 className="text-2xl font-bold">{profile.name}</h1>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Mail size={14} /> {profile.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={14} /> {profile.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase size={14} /> {profile.experience_level}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* SKILLS */}
        <Section title="Skills" icon={<Code size={16} />}>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>

        {/* EDUCATION */}
        <Section title="Education" icon={<GraduationCap size={16} />}>
          <div className="space-y-3">
            {profile.education.map((e, i) => (
              <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{e.degree}</p>
                <p className="text-sm text-gray-500">{e.institution}</p>
                <p className="text-xs text-gray-400">{e.year}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* JOBS */}
        <Section title="Work Experience" icon={<Briefcase size={16} />}>
          <div className="space-y-3">
            {profile.jobs.map((j, i) => (
              <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{j.title}</p>
                <p className="text-sm text-gray-500">{j.company}</p>
                <p className="text-xs text-gray-400">{j.summary}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* PROJECTS */}
        <Section title="Projects" icon={<FolderKanban size={16} />}>
          <div className="space-y-3">
            {profile.projects.map((p, i) => (
              <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">{p.description}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {p.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* INTERNSHIPS */}
        <Section title="Internships" icon={<Building2 size={16} />}>
          <div className="space-y-3">
            {profile.internships.map((i, idx) => (
              <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{i.title}</p>
                <p className="text-sm text-gray-500">
                  {i.company} • {i.duration}
                </p>
                <p className="text-xs text-gray-400">{i.summary}</p>
              </div>
            ))}
          </div>
        </Section>

        </>)}
      </div>
    </div>
  );
}

/* ---------- Reusable Section ---------- */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1d27] p-5 rounded-xl shadow">
      <h2 className="font-bold mb-3 flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}