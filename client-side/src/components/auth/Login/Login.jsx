import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa6";
import logo from "../../../assets/logo.jfif";
// 1. Import the useAuth hook from your context
import { useAuth } from "../../../Contexts/AuthContext"; 
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Required for inline redirection calculation

const Login = () => {
  const navigate = useNavigate();
  // 2. Extract the login handler from your AuthContext
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const loginPayload = {
        email: formData.email,
        password: formData.password,
      };

      // API Call
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginPayload
      );

      console.log("Login Successful:", response.data);

      if (response.data.token) {
        // 3. Send token to AuthContext to process storage, decoding, and state assignment
        login(response.data.token);
        
        // Save the raw user object if your backend returns it explicitly
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // 4. Decode the token inline ONLY to determine the redirect path immediately
        const decoded = jwtDecode(response.data.token);
        const userRole = decoded?.role;

        // 5. Automated RBAC Redirection Logic
        if (userRole === "admin") {
          navigate("/admin-dashboard"); // Redirects to Admin Panel
        } else if (userRole === "employee") {
          navigate("/employee-dashboard"); // Redirects to Employee Task Board
        } else if (userRole === "customer") {
          navigate("/customer-dashboard"); // Redirects to Customer Dashboard
        } else {
          navigate("/"); // Fallback route
        }
      } else {
        setError("Authentication succeeded but no token was provided.");
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-fade-in-up">
        
        {/* Header / Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="Kidus Furniture Logo" className="w-10 h-10 rounded-lg shadow-sm" />
            <span className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
              Kidus Furniture
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">Welcome Back!</h2>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to manage your custom furniture orders.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              Remember me
            </label>
            <a href="#" className="text-indigo-600 hover:underline font-medium text-xs">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group disabled:bg-slate-400 disabled:shadow-none"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Footer / Switch to Signup */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
