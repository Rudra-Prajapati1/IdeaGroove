import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";

const LoginForm = ({ onSignup }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleData = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginData.password || !loginData.username)
      return toast.error("Please enter all the required fields.");

    setLoading(true);

    try {
      toast.success("Login Successfully!");
      setLoginData({ username: "", password: "" });
    } catch (error) {
      toast.error(error.message || "Login Error. Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex  flex-col gap-4 w-full pr-8 font-inter"
    >
      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1 text-primary">
          Username:
        </label>
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
        <label className="text-lg font-semibold mb-1 text-primary">
          Password:
        </label>
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
            {showPassword ? (
              <Eye className="w-5 h-5 text-primary" />
            ) : (
              <EyeClosed className="w-5 h-5 text-primary" />
            )}
          </span>
        </div>
      </div>

      <div className="text-[13px] flex flex-col items-start gap-1">
        <span className="text-primary/80 hover:underline cursor-pointer">
          Forget password?
        </span>

        <span
          onClick={onSignup}
          className="text-primary/80 hover:underline cursor-pointer"
        >
          Don't have an account? Signup
        </span>
      </div>

      <button
        disabled={loading}
        className="bg-primary text-white w-28 cursor-pointer text-lg py-2 px-4 rounded-xl shadow-md self-center mt-4 hover:bg-primary/80 active:scale-95 duration-300 transition-all"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
