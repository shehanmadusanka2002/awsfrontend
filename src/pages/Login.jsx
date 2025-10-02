/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      
      const data = await res.json();
      console.log("Login response:", data);
      
      // Check if token exists in response
      if (data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        
        // Optional: Save user info
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        console.log("Token saved successfully");
        
        // Call onLogin callback if provided
        if (onLogin) {
          onLogin(data, navigate);
        }
        
        // Close modal
        onClose();
        
        // Navigate to profile or dashboard
        
        
      } else {
        throw new Error("No token received from server");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setErrMsg(error.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"> 
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/80 to-cyan-50/80 p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-5 border border-white/40"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          AquaLink Login
        </h2>

        {errMsg && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {errMsg}
          </div>
        )}

        <input
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-lg px-4 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-lg px-4 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-cyan-600 hover:text-cyan-800 font-medium"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    
    try {
      await login(email, password);
      
      // Close modal and redirect based on user role
      onClose();
      // You can add role-based navigation here if needed
      navigate('/');
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Enhanced error message handling
      let displayMessage = "Login failed. Please try again.";
      
      if (error.message) {
        displayMessage = error.message;
      }
      
      // Make specific error messages more user-friendly
      if (error.message?.includes('pending admin approval')) {
        displayMessage = "⏳ Your account is awaiting admin approval. Please wait for verification to complete.";
      } else if (error.message?.includes('rejected by the administrator')) {
        displayMessage = "❌ Your account has been rejected. Please contact support for assistance.";
      } else if (error.message?.includes('deactivated')) {
        displayMessage = "🚫 Your account has been deactivated. Please contact support.";
      } else if (error.message?.includes('Invalid email or password')) {
        displayMessage = "🔐 Invalid email or password. Please check your credentials.";
      }
      
      setErrMsg(displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"> 
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/80 to-cyan-50/80 p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-5 border border-white/40"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          AquaLink Login
        </h2>

        {errMsg && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {errMsg}
          </div>
        )}

        <input
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-lg px-4 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-lg px-4 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-cyan-600 hover:text-cyan-800 font-medium"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;

