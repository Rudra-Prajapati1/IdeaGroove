// src/components/auth/SignupForm.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import {
  sendOTP,
  verifyOTP,
  signup,
  selectAuthLoading,
  selectAuthError,
} from "../../redux/slice/authSlice";
import {
  fetchHobbies,
  selectHobbies,
  selectHobbiesStatus,
} from "../../redux/slice/hobbySlice"; // ← NEW: hobbies from Redux
import toast from "react-hot-toast";
import { Eye, EyeClosed, ChevronDown, Search, AlertCircle } from "lucide-react";
import api from "../../api/axios";

import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import ProfileUpload from "./ProfileUpload";
import { MultiSearchableDropdown } from "../common/MultipleSearchComponent";

const FloatingError = ({ message, show }) => {
  if (!show || !message) return null;

  return (
    <div className="mt-1 animate-slideDown">
      <div className="rounded-lg px-2 py-1 flex items-start gap-2 max-w-xs">
        <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-px" />
        <span className="text-[0.7rem] text-red-600 leading-tight">
          {message}
        </span>
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
      <label className="text-md font-semibold text-primary">{label}:</label>

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

const SignupForm = ({ onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authLoading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ─── Hobbies from Redux ────────────────────────────────────────────
  const hobbies = useSelector(selectHobbies);
  const hobbiesStatus = useSelector(selectHobbiesStatus);

  useEffect(() => {
    if (hobbiesStatus === "idle") {
      dispatch(fetchHobbies());
    }
  }, [hobbiesStatus, dispatch]);

  const toastShown = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !toastShown.current) {
      toast.success("Welcome!");
      toastShown.current = true;
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // ─── Form State ────────────────────────────────────────────────────
  const [step, setStep] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Resources (colleges & degrees still from /api/search)
  const [resources, setResources] = useState({
    colleges: [],
    degrees: [],
  });
  const [resourceLoading, setResourceLoading] = useState(true);

  const [signupData, setSignupData] = useState({
    Username: "",
    Name: "",
    Roll_No: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    Profile_Pic: null,
    College_ID: "",
    Degree_ID: "",
    Year: "",
    Hobbies: [],
  });

  const [displayBatch, setDisplayBatch] = useState("");

  // OTP
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // ─── Fetch Colleges & Degrees (hobbies now come from Redux) ────────
  useEffect(() => {
    const fetchResources = async () => {
      setResourceLoading(true);
      try {
        const { data } = await api.get("/api/search");
        setResources({
          colleges: data.colleges || [],
          degrees: data.degrees || [],
        });
      } catch (err) {
        console.error("Resource Fetch Error:", err);
        setErrors({ general: "Failed to load options. Check connection." });
        toast.error("Failed to load signup options");
      } finally {
        setResourceLoading(false);
      }
    };
    fetchResources();
  }, []);

  // ─── Debounced Availability Check ─────────────────────────────────
  const AVAILABILITY_MAP = {
    username: { key: "Username", msg: "Username is already taken" },
    email: { key: "Email", msg: "Email is already registered" },
    roll_no: { key: "Roll_No", msg: "Roll No is already registered" },
  };

  const checkAvailability = async (field, value) => {
    if (!value || value.trim().length === 0) return;
    const { key, msg } = AVAILABILITY_MAP[field];
    try {
      const { data } = await api.get("/auth/check-availability", {
        params: { field, value: value.trim() },
      });
      if (!data.available) {
        setErrors((prev) => ({ ...prev, [key]: msg }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          if (next[key] === msg) delete next[key];
          return next;
        });
      }
    } catch (err) {
      console.error("Availability check failed:", err);
    }
  };

  // Create stable debounced functions (recreated only on mount)
  const debouncedCheckUsername = useCallback(
    debounce((value) => checkAvailability("username", value), 600),
    [],
  );

  const debouncedCheckEmail = useCallback(
    debounce((value) => checkAvailability("email", value), 600),
    [],
  );

  const debouncedCheckRollNo = useCallback(
    debounce((value) => checkAvailability("roll_no", value), 600),
    [],
  );

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      debouncedCheckUsername.cancel();
      debouncedCheckEmail.cancel();
      debouncedCheckRollNo.cancel();
    };
  }, [debouncedCheckUsername, debouncedCheckEmail, debouncedCheckRollNo]);

  // ─── Helpers ───────────────────────────────────────────────────────
  const handleData = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (field === "Username") debouncedCheckUsername(value);
    if (field === "Email") debouncedCheckEmail(value);
    if (field === "Roll_No") debouncedCheckRollNo(value);
  };

  const validatePersonal = () => {
    const newErrors = {};

    if (!signupData.Username?.trim())
      newErrors.Username = "Username is required";
    if (!signupData.Name?.trim()) newErrors.Name = "Name is required";

    if (!signupData.Roll_No?.trim()) {
      newErrors.Roll_No = "Roll No is required";
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(signupData.Roll_No)) {
      newErrors.Roll_No = "Only letters, numbers, spaces, hyphens allowed";
    }

    if (!signupData.Password) {
      newErrors.Password = "Password is required";
    } else if (signupData.Password.length < 6) {
      newErrors.Password = "Must be at least 6 characters";
    }

    if (signupData.Password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Preserve any existing availability errors (username/email taken)
    if (errors.Username === "Username is already taken") {
      newErrors.Username = errors.Username;
    }
    if (errors.Email === "Email is already registered") {
      newErrors.Email = errors.Email;
    }
    if (errors.Roll_No === "Roll No is already registered") {
      newErrors.Roll_No = errors.Roll_No;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const first = Object.keys(newErrors)[0];
      setTimeout(() => {
        const el =
          document.querySelector(`[name="${first}"]`) ||
          document.querySelector(`[data-name="${first}"]`);
        el?.focus();
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ Profile_Pic: "Please upload a valid image" });
      return;
    }
    handleData("Profile_Pic", file);
  };

  const handleBatchChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val && val[0] !== "2") {
      setErrors((p) => ({ ...p, Year: "Batch must start with 20XX" }));
      return;
    }

    let formatted = val.slice(0, 4);
    if (val.length > 4) formatted += "-" + val.slice(4, 8);

    setDisplayBatch(formatted);

    if (formatted.length === 9) {
      const [s, e] = formatted.split("-").map(Number);
      if (e <= s || s < 2000 || e > 2099) {
        setErrors((p) => ({ ...p, Year: "Invalid batch range" }));
        handleData("Year", "");
      } else {
        handleData("Year", formatted.replace("-", "").slice(2));
        setErrors((p) => {
          const n = { ...p };
          delete n.Year;
          return n;
        });
      }
    } else {
      handleData("Year", "");
    }
  };

  // ─── Step Handlers ─────────────────────────────────────────────────
  const handleNextPersonal = () => {
    if (validatePersonal()) {
      setStep("educational");
    }
  };

  const handleSendOtp = async () => {
    const newErrors = {};

    if (!signupData.College_ID) newErrors.College_ID = "College required";
    if (!signupData.Degree_ID) newErrors.Degree_ID = "Degree required";
    if (!signupData.Year) newErrors.Year = "Batch required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupData.Email) {
      newErrors.Email = "Email required";
    } else if (!emailRegex.test(signupData.Email)) {
      newErrors.Email = "Invalid email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const result = await dispatch(sendOTP(signupData.Email));

    if (sendOTP.fulfilled.match(result)) {
      setStep("otp");
    }
  };

  const handleCompleteSignup = async () => {
    const fullOtp = otp.join("").trim();
    if (fullOtp.length !== 4) {
      setErrors({ otp: "Enter complete 4-digit OTP" });
      return;
    }

    const verifyResult = await dispatch(verifyOTP({ otp: fullOtp }));

    if (!verifyOTP.fulfilled.match(verifyResult)) return;

    const formData = new FormData();

    formData.append("Username", signupData.Username.trim());
    formData.append("Name", signupData.Name.trim());
    formData.append("Roll_No", signupData.Roll_No.trim());
    formData.append("Email", signupData.Email.trim());
    formData.append("Password", signupData.Password);
    formData.append("College_ID", signupData.College_ID);
    formData.append("Degree_ID", signupData.Degree_ID);
    formData.append("Year", signupData.Year);

    if (signupData.Profile_Pic) {
      formData.append("image", signupData.Profile_Pic);
    }

    if (signupData.Hobbies?.length > 0) {
      formData.append("Hobbies", signupData.Hobbies.join(","));
    }

    const signupResult = await dispatch(signup(formData));

    if (signup.fulfilled.match(signupResult)) {
      navigate("/dashboard");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1]?.current?.focus();
    }

    if (errors.otp)
      setErrors((p) => {
        const n = { ...p };
        delete n.otp;
        return n;
      });
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <div className="w-full py-2 flex items-start pt-20 mt-5 justify-center">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>

      <form className="flex flex-col gap-4 w-full font-inter items-center justify-between">
        {serverError && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
            {serverError}
          </div>
        )}

        {step === "personal" && (
          <SectionWrapper title="Personal Details">
            <div>
              <div className="flex gap-12 items-center">
                <div className="flex flex-col gap-6">
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

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="relative">
                  <Input
                    label="Roll No"
                    name="Roll_No"
                    placeholder="Enter the roll no"
                    value={signupData.Roll_No}
                    onChange={(v) => handleData("Roll_No", v)}
                    className={
                      errors.Roll_No ? "border-red-500" : "border-gray-300"
                    }
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
                    options={hobbies}
                    selectedValues={signupData.Hobbies}
                    onChange={(newHobbies) => handleData("Hobbies", newHobbies)}
                    idKey="Hobby_ID"
                    labelKey="Hobby_Name"
                    loading={hobbiesStatus === "loading"}
                    className={errors.Hobbies ? "border-red-500" : ""}
                  />
                  <FloatingError
                    message={errors.Hobbies}
                    show={!!errors.Hobbies}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                {[
                  {
                    id: "Password",
                    label: "Password",
                    placeholder: "Enter password",
                    value: signupData.Password,
                    show: showPassword,
                    toggle: () => setShowPassword(!showPassword),
                  },
                  {
                    id: "confirmPassword",
                    label: "Confirm Password",
                    placeholder: "Re-enter password",
                    value: signupData.confirmPassword,
                    show: showConfirmPassword,
                    toggle: () => setShowConfirmPassword(!showConfirmPassword),
                  },
                ].map((field) => (
                  <div key={field.id} className="relative">
                    <label className="text-md font-semibold text-primary mb-1 block">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={field.show ? "text" : "password"}
                        name={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        onChange={(e) => handleData(field.id, e.target.value)}
                        className={`w-full text-sm border-2 rounded-xl outline-none transition-colors p-3 ${
                          errors[field.id]
                            ? "border-red-500"
                            : "border-gray-300 focus:border-primary/60"
                        }`}
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-primary/10 p-1 rounded-xl transition-colors"
                        onClick={field.toggle}
                      >
                        {field.show ? (
                          <Eye className="w-5 h-5 text-primary" />
                        ) : (
                          <EyeClosed className="w-5 h-5 text-primary" />
                        )}
                      </span>
                    </div>
                    <FloatingError
                      message={errors[field.id]}
                      show={!!errors[field.id]}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleNextPersonal}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition font-medium"
              >
                Next → Educational Details
              </button>
            </div>
          </SectionWrapper>
        )}

        {step === "educational" && (
          <SectionWrapper title="Educational Details">
            <div className="space-y-6">
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

              <div className="relative">
                <label className="text-md font-semibold text-primary block mb-1">
                  Batch (Start Year - End Year)
                </label>
                <input
                  type="text"
                  name="Year"
                  placeholder="e.g. 2023-2027"
                  value={displayBatch}
                  onChange={handleBatchChange}
                  maxLength={9}
                  className={`w-full text-sm border-2 rounded-xl outline-none transition-colors p-3 ${
                    errors.Year
                      ? "border-red-500"
                      : "border-gray-300 focus:border-primary/60"
                  }`}
                />
                <FloatingError message={errors.Year} show={!!errors.Year} />
              </div>

              <div className="relative">
                <Input
                  label="Email"
                  name="Email"
                  type="email"
                  placeholder="Enter your institutional email"
                  value={signupData.Email}
                  onChange={(v) => handleData("Email", v)}
                  className={
                    errors.Email ? "border-red-500" : "border-gray-300"
                  }
                />
                <FloatingError message={errors.Email} show={!!errors.Email} />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-8">
              <button
                type="button"
                onClick={() => setStep("personal")}
                className="border border-primary text-primary px-8 py-3 rounded-xl hover:bg-primary/10 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={authLoading || resourceLoading}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition font-medium"
              >
                {authLoading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </div>
          </SectionWrapper>
        )}

        {step === "otp" && (
          <SectionWrapper title="OTP Verification">
            <div className="flex flex-col items-center gap-6 py-6">
              <p className="text-sm text-gray-600 text-center">
                We have sent a 4-digit code to
                <br />
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
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-primary outline-none transition-all ${
                      errors.otp
                        ? "border-red-500"
                        : "border-gray-300 focus:border-primary"
                    }`}
                  />
                ))}
              </div>

              <FloatingError
                message={errors.otp || serverError}
                show={!!(errors.otp || serverError)}
              />

              <button
                type="button"
                onClick={handleSendOtp}
                className="text-xs text-primary hover:underline font-medium"
              >
                Didn't receive code? Resend OTP
              </button>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep("educational")}
                  className="border border-primary text-primary px-8 py-3 rounded-xl hover:bg-primary/10 transition"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleCompleteSignup}
                  disabled={authLoading || otp.join("").length < 4}
                  className="bg-primary text-white px-10 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition font-medium"
                >
                  {authLoading ? "Creating account..." : "Complete Signup"}
                </button>
              </div>
            </div>
          </SectionWrapper>
        )}

        <span
          onClick={onLogin}
          className="text-[13px] text-primary/80 hover:underline cursor-pointer mt-6"
        >
          Already have an account? Login
        </span>
      </form>
    </div>
  );
};

export default SignupForm;
