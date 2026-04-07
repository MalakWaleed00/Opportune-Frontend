import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { register } from "../../api/authService";

export function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    userType: 'jobseeker' as 'jobseeker' | 'recruiter',
    cvLink: '',
    country: '',
    profilePicture: '',
    skills: [] as string[],
    experience: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    cvLink: '',
    country: '',
    skills: '',
    experience: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const countries = [
    'Egypt',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'India',
    'China',
    'Japan',
    'Brazil',
    'Mexico',
    'South Africa',
  ].sort();

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (2-5 years)',
    'Senior Level (5-10 years)',
    'Expert Level (10+ years)',
  ];

  const validateForm = () => {
    const newErrors = {
      username: '',
      name: '',
      email: '',
      password: '',
      cvLink: '',
      country: '',
      skills: '',
      experience: '',
    };

    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.userType === 'jobseeker' && !formData.cvLink.trim()) {
      newErrors.cvLink = 'CV link is required for jobseekers';
      isValid = false;
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill';
      isValid = false;
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleUserTypeChange = (type: 'jobseeker' | 'recruiter') => {
    setFormData(prev => ({
      ...prev,
      userType: type,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const request = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.userType === "jobseeker" ? "JOBSEEKER" : "RECRUITER",
        cvLink: formData.cvLink,
        profilePicLink: formData.profilePicture,
        country: formData.country,
        skills: formData.skills,
        experienceLevel: formData.experience,
      };
      
      const response = await register(request);
      console.log("Registration success:", response);
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error: any) {
      console.error("Registration failed:", error);
      const message = error?.response?.data?.message || "Registration failed";
      alert(message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white dark:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">Account Created!</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome, {formData.name}! Your {formData.userType} account has been successfully created.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">Create an account</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                  errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
                placeholder="john_doe"
              />
              {errors.username && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* User Type Selection */}
            <div>
              <label className="block mb-2 text-black dark:text-gray-200 font-medium">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('jobseeker')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.userType === 'jobseeker'
                      ? 'border-black bg-gray-100 text-black dark:border-gray-300 dark:bg-gray-800 dark:text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-black hover:text-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Job Seeker</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('recruiter')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.userType === 'recruiter'
                      ? 'border-black bg-gray-100 text-black dark:border-gray-300 dark:bg-gray-800 dark:text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-black hover:text-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Recruiter</span>
                  </div>
                </button>
              </div>
            </div>

            {/* CV Link (only for jobseekers) */}
            {formData.userType === 'jobseeker' && (
              <div>
                <label htmlFor="cvLink" className="block mb-2 text-black dark:text-gray-200 font-medium">
                  CV Link
                </label>
                <input
                  type="url"
                  id="cvLink"
                  name="cvLink"
                  value={formData.cvLink}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                    errors.cvLink ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
                  placeholder="https://example.com/my-cv.pdf"
                />
                {errors.cvLink && (
                  <p className="mt-1.5 text-red-500 text-sm">{errors.cvLink}</p>
                )}
              </div>
            )}

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                  errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.country}</p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label htmlFor="profilePicture" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Profile Picture URL (Optional)
              </label>
              <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors"
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            {/* Skills Field */}
            <div>
              <label htmlFor="skillInput" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className={`flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                    errors.skills ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-black text-white dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                        aria-label={`Remove skill ${skill}`}
                        title={`Remove skill ${skill}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.skills && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.skills}</p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience" className="block mb-2 text-black dark:text-gray-200 font-medium">
                Experience Level
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white border ${
                  errors.experience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-colors`}
              >
                <option value="">Select experience level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.experience && (
                <p className="mt-1.5 text-red-500 text-sm">{errors.experience}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mt-6"
            >
              Sign Up
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/"
              className="text-black dark:text-white hover:underline font-small"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
