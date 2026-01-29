import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeClosed,
  ChevronDown,
  X,
  Search,
  AlertCircle,
} from "lucide-react";

import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import ProfileUpload from "./ProfileUpload";

import { loginSuccess } from "../../redux/slice/authSlice";
import { MultiSearchableDropdown } from "../MultipleSearchComponent";

const FloatingError = ({ message, show }) => {
  if (!show || !message) return null;

  return (
    <div className="mt-1 animate-slideDown">
      <div className="bg-red-50 border border-red-200 rounded-lg px-2 py-1 flex items-start gap-2 max-w-xs">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-[1px]" />
        <span className="text-xs text-red-600 leading-tight">{message}</span>
      </div>
    </div>
  );
};

const SearchableDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  idKey,
  labelKey,
  loading,
  error,
  name,
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

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div
        data-name={name}
        className={`w-full border-2 rounded-xl p-3 cursor-pointer flex justify-between items-center bg-white hover:border-green-600 transition-colors ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <span className={selectedItem ? "text-black" : "text-gray-400"}>
          {selectedItem ? selectedItem[labelKey] : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      <FloatingError message={error} show={!!error} />

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
                    onChange(opt[idKey]);
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
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    College_ID: "",
    Degree_ID: "",
    Year: "",
    Password: "",
    confirmPassword: "",
    Profile_Pic: null,
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
        setResources({
          colleges: response.data.colleges || [],
          degrees: response.data.degrees || [],
          hobbies: response.data.hobbies || [],
        });
        setResourceLoading(false);
      } catch (err) {
        console.error("Resource Fetch Error:", err);
        setErrors({
          general: "Failed to load colleges. Please check connection.",
        });
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

    // Focus on first invalid field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      setTimeout(() => {
        let element = document.querySelector(`[name="${firstErrorField}"]`);

        // for custom components like dropdowns
        if (!element) {
          element = document.querySelector(`[data-name="${firstErrorField}"]`);
        }

        if (element && document.activeElement !== element) {
          element.focus();
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ Profile_Pic: "Please upload a valid image" });
      return;
    }
    setSignupData((prev) => ({ ...prev, Profile_Pic: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.Profile_Pic;
      return newErrors;
    });
  };

  const [displayBatch, setDisplayBatch] = useState("");

  const handleBatchInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length > 0 && value[0] !== "2") {
      setErrors((prev) => ({
        ...prev,
        Year: "Batch must start with the year 2000+",
      }));
      return;
    }

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

    if (formattedValue.length === 9) {
      const startYear = parseInt(formattedValue.substring(0, 4));
      const endYear = parseInt(formattedValue.substring(5, 9));

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
        handleData("Year", "");
        return;
      }

      if (endYear <= startYear) {
        setErrors((prev) => ({
          ...prev,
          Year: "End year must be after start year",
        }));
        handleData("Year", "");
        return;
      }

      const internalID =
        formattedValue.substring(2, 4) + formattedValue.substring(7, 9);
      handleData("Year", internalID);
      setErrors((prev) => ({ ...prev, Year: null }));
    } else {
      handleData("Year", "");
    }
  };

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const [tempToken, setTempToken] = useState("");

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let newErrors = {};

    if (!signupData.College_ID) {
      newErrors.College_ID = "Please select a college";
    }
    if (!signupData.Degree_ID) {
      newErrors.Degree_ID = "Please select a degree";
    }
    if (!signupData.Year) {
      newErrors.Year = "Please enter your batch year";
    }
    if (!signupData.Email) {
      newErrors.Email = "Email is required";
    } else if (!emailRegex.test(signupData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus on first invalid field
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0];
        // Try to find input with name attribute
        let element = document.querySelector(`[name="${firstErrorField}"]`);
        // If not found, try to find dropdown with data-name attribute
        if (!element) {
          element = document.querySelector(`[data-name="${firstErrorField}"]`);
        }
        if (element) {
          element.focus();
        }
      }, 100);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/sendOTP", {
        email: signupData.Email,
      });
      setTempToken(res.data.token);
      setStep("otp");
      setErrors({});
    } catch (err) {
      setErrors({ Email: err.response?.data?.error || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullOtp = otp.join("");
    if (fullOtp.length < 4) {
      setErrors({ otp: "Please enter the complete 4-digit OTP" });
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/auth/verifyOTP", {
        otp: fullOtp,
        token: tempToken,
      });

      const formData = new FormData();

      formData.append("Username", signupData.Username);
      formData.append("Name", signupData.Name);
      formData.append("Roll_No", signupData.Roll_No);
      formData.append("Email", signupData.Email);
      formData.append("Password", signupData.Password);
      formData.append("College_ID", signupData.College_ID);
      formData.append("Degree_ID", signupData.Degree_ID);
      formData.append("Year", signupData.Year);

      if (signupData.Profile_Pic) {
        formData.append("image", signupData.Profile_Pic);
      }

      if (signupData.Hobbies.length > 0) {
        formData.append("Hobbies", signupData.Hobbies.join(","));
      }

      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.status === 201 || response.status === 200) {
        const userToStore = {
          id: response.data.userId,
          Username: signupData.Username,
          Name: signupData.Name,
          Email: signupData.Email,
          Roll_No: signupData.Roll_No,
        };

        dispatch(loginSuccess(userToStore));
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Action Failed.";
      setErrors({ otp: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="w-full py-2 flex items-start pt-20 mt-10 justify-center">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full font-inter items-center justify-between"
      >
        {step === "personal" && (
          <SectionWrapper title="Personal Details">
            <div>
              <div className="flex gap-12 items-center">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Input
                      label="Username"
                      name="Username"
                      placeholder="Enter the username"
                      value={signupData.Username}
                      onChange={(v) => handleData("Username", v)}
                      className={
                        errors.Username ? "border-red-500" : "border-gray-300"
                      }
                    />
                    <FloatingError
                      message={errors.Username}
                      show={!!errors.Username}
                    />
                  </div>

                  <div className="relative">
                    <Input
                      label="Name"
                      name="Name"
                      placeholder="Enter the name"
                      value={signupData.Name}
                      onChange={(v) => handleData("Name", v)}
                      className={
                        errors.Name ? "border-red-500" : "border-gray-300"
                      }
                    />
                    <FloatingError message={errors.Name} show={!!errors.Name} />
                  </div>
                </div>

                <div className="relative">
                  <ProfileUpload
                    file={signupData.Profile_Pic}
                    onChange={handleImageChange}
                  />
                  <FloatingError
                    message={errors.Profile_Pic}
                    show={!!errors.Profile_Pic}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="relative">
                  <Input
                    label="Roll No"
                    name="Roll_No"
                    placeholder="Enter the roll no"
                    value={signupData.Roll_No}
                    onChange={(v) => handleData("Roll_No", v)}
                    className={errors.Roll_No ? "border-red-500" : ""}
                  />
                  <FloatingError
                    message={errors.Roll_No}
                    show={!!errors.Roll_No}
                  />
                </div>
                <div className="w-full relative">
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
                  <FloatingError
                    message={errors.Hobbies}
                    show={!!errors.Hobbies}
                  />
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                {passwordFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-1 w-1/2 relative"
                  >
                    <label className="text-md font-semibold text-primary">
                      {field.label}

                      <div className="relative">
                        <div>
                          <input
                            type={field.showState ? "text" : "password"}
                            name={field.id}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={(e) =>
                              handleData(field.id, e.target.value)
                            }
                            required
                            className={`w-full text-sm border-2 border-gray-300 rounded-xl outline-none 
                     transition-colors duration-300 focus:border-primary/60 p-3 ${errors[field.id] ? "border-red-500" : ""}`}
                          />
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
                    <FloatingError
                      message={errors[field.id]}
                      show={!!errors[field.id]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        )}

        {step === "educational" && (
          <SectionWrapper title="Educational Details">
            <div className="relative">
              <SearchableDropdown
                label="College"
                name="College_ID"
                placeholder="Search for your college..."
                options={resources.colleges}
                value={signupData.College_ID}
                onChange={(val) => handleData("College_ID", val)}
                idKey="College_ID"
                labelKey="College_Name"
                loading={resourceLoading}
                error={errors.College_ID}
              />
            </div>

            <div className="relative">
              <SearchableDropdown
                label="Degree"
                name="Degree_ID"
                placeholder="Search for your degree..."
                options={resources.degrees}
                value={signupData.Degree_ID}
                onChange={(val) => handleData("Degree_ID", val)}
                idKey="Degree_ID"
                labelKey="Degree_Name"
                loading={resourceLoading}
                error={errors.Degree_ID}
              />
            </div>

            <div className="flex flex-col gap-1 w-full relative">
              <label className="text-md font-semibold text-primary">
                Batch (Start Year - End Year)
              </label>
              <input
                type="text"
                name="Year"
                placeholder="e.g. 2023-2027"
                value={displayBatch}
                onChange={handleBatchInputChange}
                maxLength={9}
                className={`w-full text-sm border-2 border-gray-300 rounded-xl outline-none 
      transition-colors duration-300 focus:border-primary/60 p-3 
      ${errors.Year ? "border-red-500" : ""}`}
              />

              {signupData.Year && (
                <span className="text-[10px] text-gray-400 mt-1 ml-1">
                  Internal ID: {signupData.Year}
                </span>
              )}

              <FloatingError message={errors.Year} show={!!errors.Year} />
            </div>
            <div className="relative">
              <Input
                label="Email"
                name="Email"
                type="email"
                placeholder="Enter the email"
                value={signupData.Email}
                onChange={(v) => handleData("Email", v)}
                className={errors.Email ? "border-red-500" : ""}
              />
              <FloatingError message={errors.Email} show={!!errors.Email} />
            </div>
          </SectionWrapper>
        )}

        {step === "otp" && (
          <SectionWrapper title="OTP Verification">
            <div className="flex flex-col items-center gap-6 py-4 relative">
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
                    className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-primary outline-none transition-all ${
                      errors.otp ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              <FloatingError message={errors.otp} show={!!errors.otp} />

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

        <div className="flex gap-4 mt-4">
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
