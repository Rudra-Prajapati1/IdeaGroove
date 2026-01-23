import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react"; // Added ArrowLeft icon
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";

const LoginForm = ({ onSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1. New State for Toggling Views
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You are already logged in!");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleData = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.password || !loginData.username) {
      return toast.error("Please enter all required fields.");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        loginData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(loginSuccess(response.data.user));
        toast.success("Login Successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error("Please enter your email.");

    setLoading(true);
    try {
      // Replace with your actual forgot-password API endpoint
      // await axios.post("http://localhost:8080/api/auth/forgot-password", { email: resetEmail });
      toast.success("Reset link sent to your email!");
      setIsForgotPassword(false); // Go back to login after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Request Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
      className="flex flex-col gap-4 w-full pr-8 font-inter"
    >
      {/* --- CONDITIONAL RENDERING STARTS HERE --- */}
      {!isForgotPassword ? (
        <>
          {/* LOGIN FIELDS */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1 text-primary">Username:</label>
            <input
              className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none transition-colors duration-300 focus:border-primary/60 p-3"
              type="text"
              placeholder="Enter username"
              required
              autoFocus
              value={loginData.username}
              onChange={(e) => handleData("username", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1 text-primary">Password:</label>
            <div className="flex items-center justify-end relative">
              <input
                className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none transition-colors duration-300 focus:border-primary/60 p-3"
                type={!showPassword ? "password" : "text"}
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => handleData("password", e.target.value)}
              />
              <span
                className="absolute mr-2 cursor-pointer hover:bg-primary/10 p-1 rounded-2xl"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye className="w-5 h-5 text-primary" /> : <EyeClosed className="w-5 h-5 text-primary" />}
              </span>
            </div>
          </div>

          <div className="text-[13px] flex flex-col items-start gap-1">
            <span 
              className="text-primary/80 hover:underline cursor-pointer" 
              onClick={() => setIsForgotPassword(true)} // Toggle to Forgot Password
            >
              Forget password?
            </span>
            <span onClick={onSignup} className="text-primary/80 hover:underline cursor-pointer">
              Don't have an account? Signup
            </span>
          </div>

          <button
            disabled={loading}
            className="bg-primary text-white w-28 cursor-pointer text-lg py-2 px-4 rounded-xl shadow-md self-center mt-4 hover:bg-primary/80 active:scale-95 duration-300 transition-all"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </>
      ) : (
        <>
          {/* FORGOT PASSWORD FIELD (One Field, One Button) */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1 text-primary">Enter you registered email:</label>
            <input
              className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none transition-colors duration-300 focus:border-primary/60 p-3"
              type="email"
              placeholder="abc@gmail.com"
              required
              autoFocus
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>

          <div className="text-[13px]">
            <span 
              className="text-primary/80 hover:underline cursor-pointer flex items-center gap-1"
              onClick={() => setIsForgotPassword(false)} // Back to Login
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </span>
          </div>

          <button
            disabled={loading}
            className="bg-primary text-white w-max cursor-pointer text-lg py-2 px-6 rounded-xl shadow-md self-center mt-4 hover:bg-primary/80 active:scale-95 duration-300 transition-all"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </>
      )}
    </form>
  );
};

export default LoginForm;