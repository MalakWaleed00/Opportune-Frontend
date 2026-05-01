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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stored = localStorage.getItem("user");

        if (!stored) {
          console.error("No user in localStorage");
          return;
        }

        const user = JSON.parse(stored);
        console.log("userrr", user)
        if (!user.id) {
          console.error("User id is missing");
          return;
        }

        const res = await fetch(`http://localhost:8080/api/cv?userId=${user.id}`);

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

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER WITH COVER + PROFILE PIC */}
        <div className="bg-white dark:bg-[#1a1d27] rounded-xl shadow overflow-hidden">

          {/* COVER PHOTO */}
          <div className="h-44 w-full relative">
            <img
              src={
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
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