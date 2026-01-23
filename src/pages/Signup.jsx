import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  // 1. State to hold form data
  const [formData, setFormData] = useState({
    Name: "",
    Username: "",
    Email: "", // ✅ Added input field below
    Roll_No: "", // ✅ Added input field below
    College_ID: "",
    Degree_ID: "",
    Password: "",
  });

  const [error, setError] = useState("");

  // 2. Handle input changes
  const handleChange = (e) => {
    // This requires 'name' attribute on inputs to work!
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ FIX 1: URL changed to /register to match your backend route
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          ...formData,
          // Convert to numbers or null if empty
          College_ID: formData.College_ID
            ? parseInt(formData.College_ID)
            : null,
          Degree_ID: formData.Degree_ID ? parseInt(formData.Degree_ID) : null,
        },
      );

      if (response.status === 201) {
        alert("Signup Successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-700 flex justify-center items-center font-sans">
      <div className="bg-white rounded-[40px] h-auto py-8 w-180 flex justify-between items-center overflow-hidden">
        {/* Logo Section */}
        <div className="flex justify-center items-center">
          <img
            src="./DarkLogo.png"
            alt="logo"
            className="h-80 w-[20rem] border-r-2 border-green-700 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="h-full mr-10 flex justify-center items-center flex-1 ml-10">
          {/* ✅ FIX 2: Added onSubmit here. Removed onClick from button */}
          <form
            className="flex flex-col gap-[15px] w-full"
            onSubmit={handleSubmit}
          >
            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm font-bold text-center">
                {error}
              </p>
            )}

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Your name :</label>
              <input
                name="Name" // ✅ FIX 3: Added name attribute
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="text"
                placeholder="Enter name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Username :</label>
              <input
                name="Username" // ✅ Added name attribute
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="text"
                onChange={handleChange}
                placeholder="Enter Username"
                required
              />
            </div>

            {/* ✅ ADDED MISSING FIELD: Email */}
            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Email :</label>
              <input
                name="Email"
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="email"
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
            </div>

            {/* ✅ ADDED MISSING FIELD: Roll No */}
            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Roll No :</label>
              <input
                name="Roll_No"
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="text"
                onChange={handleChange}
                placeholder="Enter Roll No"
                required
              />
            </div>

            {/* Note: In a real app, College & Degree should be dropdowns (Select) */}
            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">College ID :</label>
              <input
                name="College_ID" // ✅ Added name attribute
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="number"
                onChange={handleChange}
                placeholder="Enter college ID"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Degree ID :</label>
              <input
                name="Degree_ID" // ✅ Added name attribute
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="number"
                onChange={handleChange}
                placeholder="Enter degree ID"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Password</label>
              <input
                name="Password" // ✅ Added name attribute
                className="w-full p-2 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none focus:border-green-700"
                type="password"
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="text-[13px] flex flex-col items-end text-blue-600">
              <a href="/login" className="hover:underline">
                Already have an account? Login
              </a>
            </div>

            <button
              type="submit"
              className="border-none rounded-[10px] bg-blue-600 text-white w-28 cursor-pointer text-[1.1rem] p-2 shadow-[2px_2px_2px_rgba(0,0,0,0.3)] self-center mt-[15px] hover:bg-[#063280] transition-colors"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
