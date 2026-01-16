import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeClosed,
  Upload,
  User,
  ChevronDown,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import ProfileUpload from "./ProfileUpload";
import Select from "./Select";

// --- CUSTOM COMPONENT: SEARCHABLE DROPDOWN ---
const SearchableDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  idKey,
  labelKey,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // --- DEBUGGING: Check Console when opening dropdown ---
  useEffect(() => {
    if (isOpen) {
      console.log(`Dropdown [${label}] Options:`, options);
      if (options && options.length > 0) {
        console.log(`First Item Keys:`, Object.keys(options[0]));
        console.log(`Code is looking for key: "${labelKey}"`);
        if (options[0][labelKey] === undefined) {
          console.error(
            `⚠️ MISMATCH: The key "${labelKey}" does not exist in your data! Check the "First Item Keys" above to see the correct spelling.`
          );
        }
      }
    }
  }, [isOpen, options, label, labelKey]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SAFE FILTERING ---
  // 1. Check if 'options' exists
  // 2. Check if the specific text (opt[labelKey]) exists before lowercasing
  const filteredOptions = options
    ? options.filter((opt) => {
        const text = opt[labelKey];
        return text
          ? text.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false;
      })
    : [];

  // console.log(`Filtered Options for [${label}]:`, filteredOptions);

  // Find the display name for the selected value
  const selectedItem = options
    ? options.find((opt) => opt[idKey] === value)
    : null;

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div
        className="w-full border-2 border-gray-300 rounded-xl p-3 cursor-pointer flex justify-between items-center bg-white hover:border-green-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedItem ? "text-black" : "text-gray-400"}>
          {selectedItem ? selectedItem[labelKey] : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white z-10">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full outline-none text-sm p-1"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-3 text-sm text-gray-400 text-center">
                Loading data...
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt[idKey]}
                  className="p-3 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  onClick={() => {
                    onChange(opt[idKey]); // Return the ID (e.g., 101)
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt[labelKey]}
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN SIGNUP COMPONENT ---
const SignupForm = ({ onLogin }) => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState("personal"); // 'personal' or 'educational'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data from Backend
  const [resources, setResources] = useState({ colleges: [], degrees: [] });
  const [resourceLoading, setResourceLoading] = useState(true);

  const [signupData, setSignupData] = useState({
    Username: "",
    Name: "",
    Roll_No: "",
    Email: "",
    College_ID: "", // ID from DB
    Degree_ID: "", // ID from DB
    Year: "",
    Password: "",
    confirmPassword: "",
    Profile_Pic: null, // (Backend logic for image upload needs separate handling, kept simple for now)
  });

  // --- FETCH COLLEGES & DEGREES ---
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/search");
        // Ensure your backend ResourceController returns { colleges: [], degrees: [], hobbies: [] }
        setResources({
          colleges: response.data.colleges || [],
          degrees: response.data.degrees || [],
        });
        console.log(
          "Fetched Resources:",
          resources.colleges,
          resources.degrees
        );
        setResourceLoading(false);
      } catch (err) {
        console.error("Resource Fetch Error:", err);
        toast.error("Failed to load colleges. Please check connection.");
        setResourceLoading(false);
      }
    };
    fetchResources();
  }, []);

  // --- HANDLERS ---
  const handleData = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }
    setSignupData((prev) => ({ ...prev, Profile_Pic: file }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Signup Data:", signupData);

    // Validation for Educational Details
    if (
      !signupData.College_ID ||
      !signupData.Degree_ID ||
      !signupData.Year ||
      !signupData.Email
    ) {
      return toast.error("Please fill all educational details.");
    }

    setLoading(true);

    try {
      const payload = {
        ...signupData,
        college_ID: parseInt(signupData.College_ID),
        degree_ID: parseInt(signupData.Degree_ID),
      };

      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        payload
      );

      if (response.status === 201) {
        toast.success("Signup Successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Registration Failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center pt-20 justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full font-inter items-center justify-between"
      >
        {step === "personal" && (
          <SectionWrapper title="Personal Details">
            <div>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Username"
                    placeholder="Enter the username"
                    value={signupData.Username}
                    onChange={(v) => handleData("Username", v)}
                  />

                  <Input
                    label="Name"
                    placeholder="Enter the name"
                    value={signupData.Name}
                    onChange={(v) => handleData("Name", v)}
                  />

                  <Input
                    label="Roll No"
                    placeholder="Enter the roll no"
                    value={signupData.Roll_No}
                    onChange={(v) => handleData("Roll_No", v)}
                  />
                </div>

                <ProfileUpload
                  file={signupData.Profile_Pic}
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex gap-6 mt-4">
                <label className="text-lg font-semibold text-primary w-[50%]">
                  Password
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupData.Password}
                      placeholder="Enter password"
                      onChange={(e) => handleData("Password", e.target.value)}
                      className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none
                 transition-colors duration-300 focus:border-primary/60 p-3"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                 hover:bg-primary/10 p-1 rounded-2xl"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5 text-primary" />
                      ) : (
                        <EyeClosed className="w-5 h-5 text-primary" />
                      )}
                    </span>
                  </div>
                </label>
                <label className="text-lg font-semibold text-primary w-[50%]">
                  Confirm Password
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupData.confirmPassword}
                      placeholder="Re-enter password"
                      onChange={(e) =>
                        handleData("confirmPassword", e.target.value)
                      }
                      className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none
                 transition-colors duration-300 focus:border-primary/60 p-3"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                 hover:bg-primary/10 p-1 rounded-2xl"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-5 h-5 text-primary" />
                      ) : (
                        <EyeClosed className="w-5 h-5 text-primary" />
                      )}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </SectionWrapper>
        )}

        {step === "educational" && (
          <SectionWrapper title="Educational Details">
            <SearchableDropdown
              label="College"
              placeholder="Search for your college..."
              options={resources.colleges}
              value={signupData.College_ID}
              onChange={(val) => handleData("College_ID", val)}
              idKey="College_ID" // The key in DB object for ID
              labelKey="College_Name" // The key in DB object for display text
              loading={resourceLoading}
            />

            {/* SEARCHABLE DEGREE SELECT */}
            <SearchableDropdown
              label="Degree"
              placeholder="Search for your degree..."
              options={resources.degrees}
              value={signupData.Degree_ID}
              onChange={(val) => handleData("Degree_ID", val)}
              idKey="Degree_ID"
              labelKey="Degree_Name"
              loading={resourceLoading}
            />

            <Select
              label="Year"
              value={signupData.Year}
              options={[1, 2, 3, 4, 5]}
              onChange={(v) => handleData("Year", v)}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter the email"
              value={signupData.Email}
              onChange={(v) => handleData("Email", v)}
            />
          </SectionWrapper>
        )}
        <div className="flex gap-4 mt-4">
          {/* Back button */}
          {step === "educational" && (
            <button
              type="button"
              onClick={() => setStep("personal")}
              className="border border-primary text-primary px-6 py-2 rounded-lg
                 hover:bg-primary/10 transition-colors"
            >
              Back
            </button>
          )}

          {/* Next button */}
          {step === "personal" && (
            <button
              type="button"
              onClick={() => {
                if (
                  !signupData.Username ||
                  !signupData.Name ||
                  !signupData.Roll_No ||
                  !signupData.Password ||
                  !signupData.confirmPassword
                ) {
                  return toast.error("Please complete personal details first");
                }

                if (signupData.Password.length < 6) {
                  return toast.error("Password must be at least 6 characters");
                }

                if (signupData.Password !== signupData.confirmPassword) {
                  return toast.error("Passwords do not match");
                }

                setStep("educational");
              }}
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg
                 hover:bg-primary/80 transition-colors"
            >
              Next
            </button>
          )}

          {/* Signup button */}
          {step === "educational" && (
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg
                 hover:bg-primary/80 transition-colors"
            >
              {loading ? "Loading..." : "Signup"}
            </button>
          )}
        </div>

        <span
          onClick={onLogin}
          className="text-[13px] text-primary/80 hover:underline cursor-pointer"
        >
          Already have an account? Login
        </span>
      </form>
    </div>
  );
};

export default SignupForm;
