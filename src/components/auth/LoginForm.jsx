import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../redux/slice/authSlice";
import toast from "react-hot-toast";

const LoginForm = ({ onSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toastShown = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !toastShown.current) {
      toast.success("Welcome back!");
      toastShown.current = true;
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      return toast.error("Please fill in all fields");
    }
    dispatch(login(form));
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error("Please enter your email");
    toast.success("Reset link would be sent (feature coming soon)");
    setTimeout(() => setIsForgotPassword(false), 1800);
  };

  return (
    <form
      onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
      className="flex flex-col gap-4 w-full pr-8 font-inter"
    >
      {!isForgotPassword ? (
        <>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1 text-primary">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1 text-primary">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </span>
            </div>
          </div>

          <div className="text-sm flex flex-col gap-1">
            <button
              type="button"
              className="text-primary/80 hover:underline text-left"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="text-primary/80 hover:underline text-left"
              onClick={onSignup}
            >
              Don't have an account? Signup
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white w-32 py-2.5 rounded-xl self-center mt-3 hover:bg-primary/90 disabled:opacity-60 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1 text-primary">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
              required
              autoFocus
            />
          </div>

          <button
            type="button"
            className="text-sm text-primary/80 hover:underline flex items-center gap-1.5 mt-2"
            onClick={() => setIsForgotPassword(false)}
          >
            <ArrowLeft size={14} /> Back to Login
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white w-max py-2.5 px-8 rounded-xl self-center mt-4 hover:bg-primary/90 disabled:opacity-60 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </>
      )}
    </form>
  );
};

export default LoginForm;
