import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";

const LoginForm = ({ onSignup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You are already logged in!");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleData = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   if (!loginData.password || !loginData.username)
  //     return toast.error("Please enter all the required fields.");

  //   setLoading(true);

  //   try {
  //     toast.success("Login Successfully!");
  //     setTimeout(() => navigate("/dashboard"), 1500);
  //     setLoginData({ username: "", password: "" });
  //   } catch (error) {
  //     toast.error(error.message || "Login Error. Please Try Again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   if (!loginData.password || !loginData.username) {
  //     return toast.error("Please enter all required fields.");
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/api/auth/login",
  //       loginData,
  //       { withCredentials: true } // CRITICAL: This allows the session cookie to be saved
  //     );

  //     if (response.status === 200) {
  //       // 3. Save User Info Locally (For UI display like "Welcome, Rudra")
  //       localStorage.setItem("user", JSON.stringify(response.data.user));

  //       toast.success("Login Successful!");

  //       // 4. Redirect
  //       // Small delay allows the user to read the toast message
  //       setTimeout(() => {
  //         navigate("/dashboard");
  //       }, 1000);

  //       // Optional: Clear form (usually not needed if redirecting)
  //       setLoginData({ username: "", password: "" });
  //     }
  //   } catch (error) {
  //     console.error("Login Error:", error);

  //     // 5. Smart Error Handling
  //     // If backend sends specific error (e.g., "Invalid credentials"), show that.
  //     // Otherwise, show a generic fallback.
  //     const errorMessage =
  //       error.response?.data?.message ||
  //       error.response?.data?.error ||
  //       "Login failed. Please try again.";

  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        { withCredentials: true } // CRITICAL: This allows the session cookie to be saved
      );

      if (response.status === 200) {
        // ✅ REDUX WAY: Dispatch the user data
        // This will update the State AND save to LocalStorage automatically
        dispatch(loginSuccess(response.data.user));

        toast.success("Login Successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
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
