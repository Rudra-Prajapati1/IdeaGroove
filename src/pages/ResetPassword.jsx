import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeClosed, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
//import ideaGrooveLogo from "../public/Images/DarkLogo.png"; // Ensure path matches your logo

const ResetPassword = () => {
  // 3. Get ID and Token from URL
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleData = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = async (e) => {
    e.preventDefault();

    // Validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      // 4. API Call
      // Make sure this URL matches your backend route structure (/reset-password/:id/:token)
      const response = await axios.post(
        `http://localhost:8080/api/auth/resetPassword/${id}/${token}`,
        {
          password: passwords.newPassword,
        },
      );

      // 5. Success Handling
      toast.success(response.data.message || "Password Reset Successful!");
      setIsSubmitted(true);

      // Optional: Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (error) {
      // 6. Error Handling
      console.error(error);
      const msg =
        error.response?.data?.message || "Reset failed. Link may have expired.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1B431C] flex items-center justify-center font-inter p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[500px]">
        {/* Left Column: The Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          {!isSubmitted ? (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Reset Password
              </h2>

              <div className="flex flex-col">
                <label className="text-lg font-semibold mb-1 text-primary">
                  New Password:
                </label>
                <div className="flex items-center justify-end relative">
                  <input
                    className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
                    type={!showPassword ? "password" : "text"}
                    placeholder="Enter new password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => handleData("newPassword", e.target.value)}
                  />
                  <span
                    className="absolute mr-2 cursor-pointer p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5 text-primary" />
                    ) : (
                      <EyeClosed className="w-5 h-5 text-primary" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-semibold mb-1 text-primary">
                  Confirm Password:
                </label>
                <input
                  className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
                  type={!showPassword ? "password" : "text"}
                  placeholder="Confirm your password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    handleData("confirmPassword", e.target.value)
                  }
                />
              </div>

              <button
                disabled={loading}
                className="bg-primary text-white w-max self-center mt-6 py-2.5 px-10 rounded-xl shadow-md font-bold hover:bg-primary/80 active:scale-95 duration-300 transition-all text-lg disabled:opacity-50"
              >
                {loading ? "Updating..." : "Confirm Reset"}
              </button>
            </form>
          ) : (
            /* Success Message State */
            <div className="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Updated!
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Your password has been changed successfully.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="text-primary font-bold hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Middle Divider Line */}
        <div className="hidden md:block w-0.5 bg-primary/20 my-12"></div>

        {/* Right Column: The Logo/Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12">
          {/* Ensure this path is correct for your Vite/React setup */}
          <img
            src={"../public/Images/DarkLogo.png"}
            alt="Idea Groove"
            className="max-w-xs object-contain animate-pulse-slow"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
