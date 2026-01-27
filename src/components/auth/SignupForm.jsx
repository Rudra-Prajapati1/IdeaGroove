import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeClosed, ChevronDown, X, Search } from "lucide-react";
import toast from "react-hot-toast";

import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import ProfileUpload from "./ProfileUpload";
import Select from "./Select";

import { loginSuccess } from "../../redux/slice/authSlice";
import { MultiSearchableDropdown } from "../MultipleSearchComponent";

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options
    ? options.filter((opt) => {
        const text = opt[labelKey];
        return text
          ? text.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false;
      })
    : [];

  const selectedItem = options
    ? options.find((opt) => opt[idKey] === value)
    : null;

  // Add this inside your SignupForm component or above it

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const toastShown = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (!toastShown.current) {
        toast.success("Redirecting to dashboard...");
        toastShown.current = true;
      }
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState("personal"); // 'personal' or 'educational'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const ErrorMessage = ({ message }) =>
    message ? (
      <span className="text-red-500 text-xs mt-1 ml-1">{message}</span>
    ) : null;

  // Data from Backend
  const [resources, setResources] = useState({
    colleges: [],
    degrees: [],
    hobbies: [],
  });
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
    Hobbies: [],
  });

  const passwordFields = [
    {
      id: "Password",
      label: "Password:",
      placeholder: "Enter password",
      value: signupData.Password,
      showState: showPassword,
      toggleFunc: () => setShowPassword(!showPassword),
    },
    {
      id: "confirmPassword",
      label: "Confirm Password:",
      placeholder: "Re-enter password",
      value: signupData.confirmPassword,
      showState: showConfirmPassword,
      toggleFunc: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  // --- FETCH COLLEGES & DEGREES ---
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/search");
        // Ensure your backend ResourceController returns { colleges: [], degrees: [], hobbies: [] }
        setResources({
          colleges: response.data.colleges || [],
          degrees: response.data.degrees || [],
          hobbies: response.data.hobbies || [],
        });
        setResourceLoading(false);
      } catch (err) {
        console.error("Resource Fetch Error:", err);
        toast.error("Failed to load colleges. Please check connection.");
        setResourceLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Helper to clear errors when user types
  const handleData = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    let newErrors = {};
    if (!signupData.Username) newErrors.Username = "Username is required";
    if (!signupData.Name) newErrors.Name = "Name is required";
    if (!signupData.Roll_No) {
      newErrors.Roll_No = "Roll No is required";
    } else {
      const rollNoRegex = /^[a-zA-Z0-9\s-]+$/;
      if (!rollNoRegex.test(signupData.Roll_No)) {
        newErrors.Roll_No =
          "Only numbers, letters, hyphens, and spaces allowed";
      }
    }
    if (!signupData.Password) {
      newErrors.Password = "Password is required";
    } else if (signupData.Password.length < 6) {
      newErrors.Password = "Must be at least 6 characters";
    }
    if (signupData.Password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
  // 1. Add this to your state management at the top of SignupForm
  const [displayBatch, setDisplayBatch] = useState("");

  // 2. The Formatter & Validator Logic
  const handleBatchInputChange = (e) => {
    // Remove all non-numeric characters
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    // A. Block if the first digit isn't '2' (Forces 2000s)
    if (value.length > 0 && value[0] !== "2") {
      setErrors((prev) => ({
        ...prev,
        Year: "Batch must start with the year 2000+",
      }));
      return;
    }

    // B. Auto-Hyphen Logic (YYYY-YYYY)
    if (value.length > 0) {
      formattedValue = value.substring(0, 4);
      if (value.length > 4) {
        formattedValue += "-" + value.substring(4, 8);
      } else if (
        value.length === 4 &&
        e.nativeEvent.inputType !== "deleteContentBackward"
      ) {
        formattedValue += "-";
      }
    }

    setDisplayBatch(formattedValue);

    // C. Range Validation & Internal ID update
    if (formattedValue.length === 9) {
      const startYear = parseInt(formattedValue.substring(0, 4));
      const endYear = parseInt(formattedValue.substring(5, 9));

      // Validate 2000-2099 range
      if (
        startYear < 2000 ||
        startYear > 2099 ||
        endYear < 2000 ||
        endYear > 2099
      ) {
        setErrors((prev) => ({
          ...prev,
          Year: "Years must be between 2000 and 2099",
        }));
        handleData("Year", ""); // Reset DB value
        return;
      }

      // Validate Chronology
      if (endYear <= startYear) {
        setErrors((prev) => ({
          ...prev,
          Year: "End year must be after start year",
        }));
        handleData("Year", "");
        return;
      }

      // Success: Extract last two digits of each (e.g., 2023-2026 -> 2326)
      const internalID =
        formattedValue.substring(2, 4) + formattedValue.substring(7, 9);
      handleData("Year", internalID);
      setErrors((prev) => ({ ...prev, Year: null })); // Clear errors
    } else {
      handleData("Year", ""); // Keep DB value empty until input is complete
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // 1. COMPREHENSIVE VALIDATION
  //   // Check for Step 1 Fields
  //   if (!signupData.Username || !signupData.Name || !signupData.Password) {
  //     return toast.error("Please complete all personal details.");
  //   }

  //   // Check Password Security
  //   if (signupData.Password.length < 6) {
  //     return toast.error("Password must be at least 6 characters.");
  //   }

  //   // Check Password Match
  //   if (signupData.Password !== signupData.confirmPassword) {
  //     return toast.error("Passwords do not match!");
  //   }

  //   // Check for Step 2 Fields
  //   if (
  //     !signupData.College_ID ||
  //     !signupData.Degree_ID ||
  //     !signupData.Year ||
  //     !signupData.Email
  //   ) {
  //     return toast.error("Please fill all educational details.");
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!emailRegex.test(signupData.Email)) {
  //     return toast.error("Please enter a valid email address.");
  //   }

  //   const rollNoRegex = /^[a-zA-Z0-9\s-]+$/;
  //   if (!rollNoRegex.test(signupData.Roll_No)) {
  //     return toast.error(
  //       "Roll No can only contain numbers, letters, hyphens (-), and spaces.",
  //     );
  //   }
  //   if (
  //     signupData.Year &&
  //     parseInt(signupData.Year.substring(2, 4)) <=
  //       parseInt(signupData.Year.substring(0, 2))
  //   ) {
  //     return toast.error("End year must be after start year!");
  //   }

  //   setLoading(true);

  //   try {
  //     // 2. CREATE FORM DATA (Required for File Uploads)
  //     const formData = new FormData();

  //     // Append text fields
  //     formData.append("Username", signupData.Username);
  //     formData.append("Name", signupData.Name);
  //     formData.append("Roll_No", signupData.Roll_No);
  //     formData.append("Email", signupData.Email);
  //     formData.append("Password", signupData.Password);
  //     formData.append("College_ID", signupData.College_ID);
  //     formData.append("Degree_ID", signupData.Degree_ID);
  //     formData.append("Year", signupData.Year);

  //     // Append File (Key MUST be "image" because your Route uses upload.single("image"))
  //     if (signupData.Profile_Pic) {
  //       formData.append("image", signupData.Profile_Pic);
  //     }

  //     if (signupData.Hobbies.length > 0) {
  //       formData.append("Hobbies", signupData.Hobbies.join(","));
  //     }

  //     const response = await axios.post(
  //       "http://localhost:8080/api/auth/signup",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       },
  //     );

  //     if (response.status === 201 || response.status === 200) {
  //       // Construct User Object manually since backend only returns ID
  //       const userToStore = {
  //         id: response.data.userId,
  //         Username: signupData.Username,
  //         Name: signupData.Name,
  //         Email: signupData.Email,
  //         Roll_No: signupData.Roll_No,
  //       };

  //       dispatch(loginSuccess(userToStore));

  //       toast.success("Signup Successful!");
  //       setTimeout(() => navigate("/dashboard"), 1500);
  //     }
  //   } catch (err) {
  //     console.error("Signup Error:", err);
  //     const msg = err.response?.data?.error || "Registration Failed.";
  //     toast.error(msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 1. Add 'otp' to your step options: 'personal' | 'educational' | 'otp'
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // 2. Handle OTP input logic (Auto-focus next box)
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Only numbers
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Keep only the last digit
    setOtp(newOtp);

    // Move to next box if value is entered
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const [tempToken, setTempToken] = useState("");

  const handleSendOtp = async () => {
    // Add validation for Step 2 here before sending
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !signupData.College_ID ||
      !signupData.Degree_ID ||
      !signupData.Year ||
      !emailRegex.test(signupData.Email)
    ) {
      return toast.error("Please ensure all educational details are correct.");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/sendOTP", {
        email: signupData.Email,
      });
      setTempToken(res.data.token);
      setStep("otp"); // <--- Add this to move to the OTP UI
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Final Safety Check for OTP length
    const fullOtp = otp.join("");
    if (fullOtp.length < 4) {
      return toast.error("Please enter the complete 4-digit OTP.");
    }

    setLoading(true);

    try {
      // 2. PHASE 1: Verify the Stateless OTP
      // We send the 4-digit code and the JWT token stored in tempToken
      await axios.post("http://localhost:8080/api/auth/verifyOTP", {
        otp: fullOtp,
        token: tempToken,
      });

      // 3. PHASE 2: Prepare Multipart Form Data for Signup
      // Since you have a Profile_Pic (File), we must use FormData
      const formData = new FormData();

      // Systematic appending of all signup fields
      formData.append("Username", signupData.Username);
      formData.append("Name", signupData.Name);
      formData.append("Roll_No", signupData.Roll_No);
      formData.append("Email", signupData.Email);
      formData.append("Password", signupData.Password);
      formData.append("College_ID", signupData.College_ID);
      formData.append("Degree_ID", signupData.Degree_ID);
      formData.append("Year", signupData.Year);

      // Handle the Profile Picture File specifically
      if (signupData.Profile_Pic) {
        formData.append("image", signupData.Profile_Pic);
      }

      // Handle the Hobbies array by joining into a comma-separated string
      if (signupData.Hobbies.length > 0) {
        formData.append("Hobbies", signupData.Hobbies.join(","));
      }

      // 4. PHASE 3: Execute the Signup Request
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // 5. Success Handling: Update Redux and Redirect
      if (response.status === 201 || response.status === 200) {
        // Construct the user object for Redux storage
        const userToStore = {
          id: response.data.userId,
          Username: signupData.Username,
          Name: signupData.Name,
          Email: signupData.Email,
          Roll_No: signupData.Roll_No,
        };

        dispatch(loginSuccess(userToStore));
        toast.success("Registration Successful!");

        // Brief delay before navigation for better UX
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      // 6. Systematic Error Handling
      console.error("Submission Error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Action Failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous box on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
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
              <div className="flex gap-12 items-center">
                <div className="flex flex-col gap-4">
                  <div>
                    <Input
                      label="Username"
                      placeholder="Enter the username"
                      value={signupData.Username}
                      onChange={(v) => handleData("Username", v)}
                      className={errors.Username ? "border-red-500" : ""}
                    />
                    <ErrorMessage message={errors.Username} />
                  </div>

                  <div>
                    <Input
                      label="Name"
                      placeholder="Enter the name"
                      value={signupData.Name}
                      onChange={(v) => handleData("Name", v)}
                      className={errors.Name ? "border-red-500" : ""}
                    />
                    <ErrorMessage message={errors.Name} />
                  </div>
                </div>

                <ProfileUpload
                  file={signupData.Profile_Pic}
                  onChange={handleImageChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <Input
                    label="Roll No"
                    placeholder="Enter the roll no"
                    value={signupData.Roll_No}
                    onChange={(v) => handleData("Roll_No", v)}
                    className={errors.Roll_No ? "border-red-500" : ""}
                  />
                  <ErrorMessage message={errors.Roll_No} />
                </div>
                <div className="w-full">
                  <MultiSearchableDropdown
                    label="Hobbies"
                    placeholder="Select hobbies..."
                    options={resources.hobbies}
                    selectedValues={signupData.Hobbies}
                    onChange={(newHobbies) => handleData("Hobbies", newHobbies)}
                    idKey="Hobby_ID"
                    labelKey="Hobby_Name"
                    loading={resourceLoading}
                    className={errors.Hobbies ? "border-red-500" : ""}
                  />
                  <ErrorMessage message={errors.Hobbies} />
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                {passwordFields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-1 w-1/2">
                    <label className="text-md font-semibold text-primary">
                      {field.label}

                      <div className="relative">
                        <div>
                          <input
                            type={field.showState ? "text" : "password"}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={(e) =>
                              handleData(field.id, e.target.value)
                            }
                            required
                            className={`w-full text-sm border-2 border-gray-300 rounded-xl outline-none 
                     transition-colors duration-300 focus:border-primary/60 p-3 ${errors[field.id] ? "border-red-500" : ""}`}
                          />
                          <ErrorMessage message={errors[field.id]} />
                        </div>
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer 
                     hover:bg-primary/10 p-1 rounded-2xl transition-colors"
                          onClick={field.toggleFunc}
                        >
                          {field.showState ? (
                            <Eye className="w-5 h-5 text-primary" />
                          ) : (
                            <EyeClosed className="w-5 h-5 text-primary" />
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        )}

        {step === "educational" && (
          <SectionWrapper title="Educational Details">
            <div>
              <SearchableDropdown
                label="College"
                placeholder="Search for your college..."
                options={resources.colleges}
                value={signupData.College_ID}
                onChange={(val) => handleData("College_ID", val)}
                idKey="College_ID" // The key in DB object for ID
                labelKey="College_Name" // The key in DB object for display text
                loading={resourceLoading}
                className={errors.College_ID ? "border-red-500" : ""}
              />
              <ErrorMessage message={errors.College_ID} />
            </div>

            <div>
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
                className={errors.Degree_ID ? "border-red-500" : ""}
              />
              <ErrorMessage message={errors.Degree_ID} />
            </div>

            {/* --- Inside Educational Details Section --- */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-md font-semibold text-primary">
                Batch (Start Year - End Year)
              </label>
              <input
                type="text"
                placeholder="e.g. 2023-2027"
                value={displayBatch} // Use the local formatted state
                onChange={handleBatchInputChange}
                maxLength={9}
                className={`w-full text-sm border-2 border-gray-300 rounded-xl outline-none 
      transition-colors duration-300 focus:border-primary/60 p-3 
      ${errors.Year ? "border-red-500" : ""}`}
              />

              {/* Helper text so user knows it's working */}
              {signupData.Year && (
                <span className="text-[10px] text-gray-400 mt-1 ml-1">
                  Internal ID: {signupData.Year}
                </span>
              )}

              <ErrorMessage message={errors.Year} />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="Enter the email"
                value={signupData.Email}
                onChange={(v) => handleData("Email", v)}
                className={errors.Email ? "border-red-500" : ""}
              />
              <ErrorMessage message={errors.Email} />
            </div>
          </SectionWrapper>
        )}

        {/* --- OTP VERIFICATION STEP --- */}
        {step === "otp" && (
          <SectionWrapper title="OTP Verification">
            <div className="flex flex-col items-center gap-6 py-4">
              <p className="text-sm text-gray-500 text-center">
                We have sent a 4-digit code to <br />
                <span className="font-bold text-primary">
                  {signupData.Email}
                </span>
              </p>

              <div className="flex gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="text-xs text-primary hover:underline font-medium"
              >
                Didn't receive code? Resend OTP
              </button>
            </div>
          </SectionWrapper>
        )}

        {/* --- UPDATED BUTTONS SECTION --- */}
        <div className="flex gap-4 mt-4">
          {/* Back button logic */}
          {step !== "personal" && (
            <button
              type="button"
              onClick={() =>
                setStep(step === "otp" ? "educational" : "personal")
              }
              className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Back
            </button>
          )}

          {/* Dynamic Action Button */}
          {step === "personal" ? (
            <button
              type="button"
              onClick={() => validateStep1() && setStep("educational")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Next
            </button>
          ) : step === "educational" ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Send OTP
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || otp.join("").length < 4}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Signup"}
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
