import { useAuthStore } from '../Store/isAuthStore.js';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { isLoggingIn,login } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    const success=validateForm();

    if (success === true) login(formData);
  }
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Chat App</h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            Log in to continue chatting with your friends.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-300 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <><Loader2 className='animate-spin' /> Loading...</>
              ) : (
                'Log In'
              )}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Go to Signup Page</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
