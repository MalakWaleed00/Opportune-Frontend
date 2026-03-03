import { useState } from 'react';
import { Link } from 'react-router';

export function SignUpPage() {
  const [formData, setFormData] = useState({
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
      name: '',
      email: '',
      password: '',
      cvLink: '',
      country: '',
      skills: '',
      experience: '',
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // CV Link validation (only for jobseekers)
    if (formData.userType === 'jobseeker' && !formData.cvLink.trim()) {
      newErrors.cvLink = 'CV link is required for jobseekers';
      isValid = false;
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    // Skills validation
    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill';
      isValid = false;
    }

    // Experience validation
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

    // Clear error when user starts typing
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitted(true);
      console.log('Form submitted:', formData);
      // Handle sign up logic here
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-foreground"
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
            <h2 className="mb-2">Account Created!</h2>
            <p className="text-muted-foreground">
              Welcome, {formData.name}! Your {formData.userType} account has been successfully created.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-2">Create an account</h1>
            <p className="text-muted-foreground">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-2 text-foreground">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-background border ${
                  errors.name ? 'border-destructive' : 'border-border'
                } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-background border ${
                  errors.email ? 'border-destructive' : 'border-border'
                } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-background border ${
                  errors.password ? 'border-destructive' : 'border-border'
                } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            {/* User Type Selection */}
            <div>
              <label className="block mb-2 text-foreground">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('jobseeker')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.userType === 'jobseeker'
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-input-background'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Job Seeker</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('recruiter')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.userType === 'recruiter'
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-input-background'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Recruiter</span>
                  </div>
                </button>
              </div>
            </div>

            {/* CV Link (only for jobseekers) */}
            {formData.userType === 'jobseeker' && (
              <div>
                <label htmlFor="cvLink" className="block mb-2 text-foreground">
                  CV Link
                </label>
                <input
                  type="url"
                  id="cvLink"
                  name="cvLink"
                  value={formData.cvLink}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg bg-input-background border ${
                    errors.cvLink ? 'border-destructive' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                  placeholder="https://example.com/my-cv.pdf"
                />
                {errors.cvLink && (
                  <p className="mt-1.5 text-destructive text-sm">{errors.cvLink}</p>
                )}
              </div>
            )}

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block mb-2 text-foreground">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-background border ${
                  errors.country ? 'border-destructive' : 'border-border'
                } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1.5 text-destructive text-sm">{errors.country}</p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label htmlFor="profilePicture" className="block mb-2 text-foreground">
                Profile Picture URL (Optional)
              </label>
              <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            {/* Skills Field */}
            <div>
              <label htmlFor="skillInput" className="block mb-2 text-foreground">
                Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className={`flex-1 px-4 py-2.5 rounded-lg bg-input-background border ${
                    errors.skills ? 'border-destructive' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-destructive transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.skills && (
                <p className="mt-1.5 text-destructive text-sm">{errors.skills}</p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience" className="block mb-2 text-foreground">
                Experience Level
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-background border ${
                  errors.experience ? 'border-destructive' : 'border-border'
                } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
              >
                <option value="">Select experience level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.experience && (
                <p className="mt-1.5 text-destructive text-sm">{errors.experience}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-opacity mt-6"
            >
              Sign Up
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/"
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}