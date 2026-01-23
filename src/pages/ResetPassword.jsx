import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeClosed, CheckCircle } from "lucide-react";
// import ideaGrooveLogo from "../public/Images/DarkLogo.png"; // Ensure path matches your logo

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleData = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    
    // Mocking API call
    setTimeout(() => {
      toast.success("Password Reset Successful!");
      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    // Main Dark Green Background (No Navbar/Footer)
    <div className="min-h-screen w-full bg-[#1B431C] flex items-center justify-center font-inter p-4">
      
      {/* Centered White Card Layout */}
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[500px]">
        
        {/* Left Column: The Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          {!isSubmitted ? (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-primary mb-4">Reset Password</h2>
              
              <div className="flex flex-col">
                <label className="text-lg font-semibold mb-1 text-primary">New Password:</label>
                <div className="flex items-center justify-end relative">
                  <input
                    className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
                    type={!showPassword ? "password" : "text"}
                    placeholder="Enter new password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => handleData("newPassword", e.target.value)}
                  />
                  <span className="absolute mr-2 cursor-pointer p-1" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye className="w-5 h-5 text-primary" /> : <EyeClosed className="w-5 h-5 text-primary" />}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-semibold mb-1 text-primary">Confirm Password:</label>
                <input
                  className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3"
                  type={!showPassword ? "password" : "text"}
                  placeholder="Confirm your password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => handleData("confirmPassword", e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                className="bg-primary text-white w-max self-center mt-6 py-2.5 px-10 rounded-xl shadow-md font-bold hover:bg-primary/80 active:scale-95 duration-300 transition-all text-lg"
              >
                {loading ? "Updating..." : "Confirm Reset"}
              </button>
            </form>
          ) : (
            /* Success Message State */
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Updated!</h2>
              <p className="text-gray-500 mb-6 text-sm">Your password has been changed.</p>
              <button onClick={() => window.location.href = "/auth"} className="text-primary font-bold hover:underline">
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Middle Divider Line */}
        <div className="hidden md:block w-0.5 bg-primary/20 my-12"></div>

        {/* Right Column: The Logo/Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12">
          <img 
            src={"./DarkLogo.png"} 
            alt="Idea Groove" 
            className="max-w-xs object-contain animate-pulse-slow"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;