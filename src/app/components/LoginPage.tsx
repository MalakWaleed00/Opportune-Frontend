import { useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { login } from "../../api/authService";

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    let isValid = true;

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await login(formData);

      console.log("Login success:", res);

      const token = res.token || res.accessToken || res.jwt || res.authToken || res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("Login returned no token, profile requests may fail.", res);
      }

      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/jobs");
      }, 1000);

    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setErrors({
            email: "",
            password: "Invalid email or password",
          });
        } else if (error.response.status === 400) {
          setErrors({
            email: "",
            password: "Bad request. Please check your input.",
          });
        } else {
          setErrors({
            email: "",
            password: "Server error. Please try again later.",
          });
        }
      } else {
        setErrors({
          email: "",
          password: "Network error. Please check your connection.",
        });
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
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
           <h1 className="mb-2 text-black">Welcome back</h1>
            <p className="text-foreground">
              You have successfully logged in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-2 !text-black">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className={`w-full px-4 py-2.5 rounded-lg bg-input-background border text-foreground placeholder-muted-foreground/50 ${
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg bg-input-background border text-foreground placeholder-muted-foreground/50 ${
                    errors.password ? 'border-destructive' : 'border-border'
                  } focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-input-background focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="rememberMe" className="ml-2 text-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}