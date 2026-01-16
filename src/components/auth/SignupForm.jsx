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

  // // --- DEBUGGING: Check Console when opening dropdown ---
  // useEffect(() => {
  //   if (isOpen) {
  //     console.log(`Dropdown [${label}] Options:`, options);
  //     if (options && options.length > 0) {
  //       console.log(`First Item Keys:`, Object.keys(options[0]));
  //       console.log(`Code is looking for key: "${labelKey}"`);
  //       if (options[0][labelKey] === undefined) {
  //         console.error(
  //           `⚠️ MISMATCH: The key "${labelKey}" does not exist in your data! Check the "First Item Keys" above to see the correct spelling.`
  //         );
  //       }
  //     }
  //   }
  // }, [isOpen, options, label, labelKey]);

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

// --- NEW COMPONENT: MULTI-SELECT DROPDOWN ---
const MultiSearchableDropdown = ({
  label,
  options,
  selectedValues, // Expecting an Array of IDs
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
        const matchesSearch = opt[labelKey]
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isNotSelected = !selectedValues.includes(opt[idKey]);
        return matchesSearch && isNotSelected;
      })
    : [];

  const handleSelect = (id) => {
    onChange([...selectedValues, id]);
    setSearchTerm("");
  };

  const handleRemove = (idToRemove) => {
    onChange(selectedValues.filter((id) => id !== idToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div
        className="w-full min-h-[50px] border-2 border-gray-300 rounded-xl p-2 cursor-pointer bg-white hover:border-green-600 transition-colors flex flex-wrap gap-2 items-center"
        onClick={() => setIsOpen(true)}
      >
        {selectedValues.map((id) => {
          const item = options.find((opt) => opt[idKey] === id);
          return item ? (
            <span
              key={id}
              className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
            >
              {item[labelKey]}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(id);
                }}
                className="hover:text-green-900 bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ) : null;
        })}

        <div className="flex-1 min-w-[100px] flex justify-between items-center">
          {selectedValues.length === 0 && (
            <span className="text-gray-400 text-sm ml-1">{placeholder}</span>
          )}
          <input
            className="outline-none text-sm w-full bg-transparent p-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-3 text-sm text-gray-400 text-center">
                Loading...
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt[idKey]}
                  className="p-3 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  onClick={() => handleSelect(opt[idKey])}
                >
                  {opt[labelKey]}
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-400 text-center">
                No options
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

  // ✅ 2. Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState("personal"); // 'personal' or 'educational'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Submitting Signup Data:", signupData);

  //   // Validation for Educational Details
  //   if (
  //     !signupData.College_ID ||
  //     !signupData.Degree_ID ||
  //     !signupData.Year ||
  //     !signupData.Email
  //   ) {
  //     return toast.error("Please fill all educational details.");
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = {
  //       ...signupData,
  //       college_ID: parseInt(signupData.College_ID),
  //       degree_ID: parseInt(signupData.Degree_ID),
  //     };

  //     const response = await axios.post(
  //       "http://localhost:8080/api/auth/signup",
  //       payload
  //     );
  //     console.log(payload);

  //     if (response.status === 201) {
  //       toast.success("Signup Successful!");
  //       setTimeout(() => navigate("/dashboard"), 1500);
  //     }
  //   } catch (err) {
  //     const msg = err.response?.data?.error || "Registration Failed.";
  //     toast.error(msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
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
      // 2. CREATE FORM DATA (Required for File Uploads)
      const formData = new FormData();

      // Append text fields
      formData.append("Username", signupData.Username);
      formData.append("Name", signupData.Name);
      formData.append("Roll_No", signupData.Roll_No);
      formData.append("Email", signupData.Email);
      formData.append("Password", signupData.Password);
      formData.append("College_ID", signupData.College_ID);
      formData.append("Degree_ID", signupData.Degree_ID);
      formData.append("Year", signupData.Year);

      // Append File (Key MUST be "image" because your Route uses upload.single("image"))
      if (signupData.Profile_Pic) {
        formData.append("image", signupData.Profile_Pic);
      }


    const formData = new FormData();

  // 2. Append all text fields
  Object.keys(signupData).forEach((key) => {
    if (key !== "Profile_Pic" && key !== "confirmPassword") {
      formData.append(key, signupData[key]);
    }
  });

  // 3. Append the image file specifically
  if (signupData.profile_pic) {
    formData.append("image", signupData.profile_pic);
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      body: formData, // No headers needed, browser sets 'multipart/form-data' automatically
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Signup Successful!");
    } else {
      throw new Error(result.error || "Signup Failed");

      // Append Hobbies (Handle Array for FormData)
      // We append them one by one, or joined by comma.
      // Your backend logic now handles comma-separated strings nicely.
      if (signupData.Hobbies.length > 0) {
        formData.append("Hobbies", signupData.Hobbies.join(","));
      }

      // 3. Send Request
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        formData, // Send the FormData object
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Construct User Object manually since backend only returns ID
        const userToStore = {
          id: response.data.userId,
          Username: signupData.Username,
          Name: signupData.Name,
          Email: signupData.Email,
          Roll_No: signupData.Roll_No,
          // You can add more fields if needed for display
        };

        // ✅ REDUX: Dispatch user to state + LocalStorage
        dispatch(loginSuccess(userToStore));

        toast.success("Signup Successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      const msg = err.response?.data?.error || "Registration Failed.";
      toast.error(msg);
    } finally {
      setLoading(false);

    }
  } catch (error) {
    toast.error(error.message);
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
                </div>

                <ProfileUpload
                  file={signupData.Profile_Pic}
                  onChange={handleImageChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <Input
                  label="Roll No"
                  placeholder="Enter the roll no"
                  value={signupData.Roll_No}
                  onChange={(v) => handleData("Roll_No", v)}
                />
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
                  />
                </div>
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
