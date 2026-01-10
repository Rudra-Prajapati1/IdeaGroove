import { Eye, EyeClosed, User2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import ProfileUpload from "./ProfileUpload";
import Select from "./Select";

const SignupForm = ({ onLogin }) => {
  const [signupData, setSignupData] = useState({
    username: "",
    name: "",
    roll_no: "",
    email: "",
    college: "",
    degree: "",
    year: "",
    profile_pic: null,
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const colleges = [
    "IIT Bombay",
    "IIT Delhi",
    "NIT Trichy",
    "BITS Pilani",
    "Other",
  ];

  const degrees = ["B.Tech", "M.Tech", "MBA", "BSc", "MSc"];

  const handleData = (field, value) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }

    setSignupData((prev) => ({
      ...prev,
      profile_pic: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !signupData.username ||
      !signupData.name ||
      !signupData.roll_no ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      return toast.error("Please fill all required fields");
    }

    if (signupData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!signupData.college || !signupData.degree || !signupData.year) {
      return toast.error("Please complete educational details");
    }

    setLoading(true);

    try {
      toast.success("Signup Successful!");
    } catch (error) {
      toast.error(error.message || "Signup Failed. Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const [details, setDetails] = useState("personal");

  return (
    <div className="w-full h-full flex items-center pt-20 justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full font-inter items-center justify-between"
      >
        {details === "personal" && (
          <SectionWrapper title="Personal Details">
            <div>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Username"
                    placeholder="Enter the username"
                    value={signupData.username}
                    onChange={(v) => handleData("username", v)}
                  />

                  <Input
                    label="Name"
                    placeholder="Enter the name"
                    value={signupData.name}
                    onChange={(v) => handleData("name", v)}
                  />

                  <Input
                    label="Roll No"
                    placeholder="Enter the roll no"
                    value={signupData.roll_no}
                    onChange={(v) => handleData("roll_no", v)}
                  />
                </div>

                <ProfileUpload
                  file={signupData.profile_pic}
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex gap-6 mt-4">
                <label className="text-lg font-semibold text-primary w-[50%]">
                  Password
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      placeholder="Enter password"
                      onChange={(e) => handleData("password", e.target.value)}
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

        {details === "educational" && (
          <SectionWrapper title="Educational Details">
            <Select
              label="College"
              value={signupData.college}
              options={colleges}
              onChange={(v) => handleData("college", v)}
            />

            <Select
              label="Degree"
              value={signupData.degree}
              options={degrees}
              onChange={(v) => handleData("degree", v)}
            />

            <Select
              label="Year"
              value={signupData.year}
              options={[
                "1st Year",
                "2nd Year",
                "3rd Year",
                "4th Year",
                "5th Year",
              ]}
              onChange={(v) => handleData("year", v)}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter the email"
              value={signupData.email}
              onChange={(v) => handleData("email", v)}
            />
          </SectionWrapper>
        )}
        <div className="flex gap-4 mt-4">
          {/* Back button */}
          {details === "educational" && (
            <button
              type="button"
              onClick={() => setDetails("personal")}
              className="border border-primary text-primary px-6 py-2 rounded-lg
                 hover:bg-primary/10 transition-colors"
            >
              Back
            </button>
          )}

          {/* Next button */}
          {details === "personal" && (
            <button
              type="button"
              onClick={() => {
                if (
                  !signupData.username ||
                  !signupData.name ||
                  !signupData.roll_no ||
                  !signupData.password ||
                  !signupData.confirmPassword
                ) {
                  return toast.error("Please complete personal details first");
                }

                if (signupData.password.length < 6) {
                  return toast.error("Password must be at least 6 characters");
                }

                if (signupData.password !== signupData.confirmPassword) {
                  return toast.error("Passwords do not match");
                }

                setDetails("educational");
              }}
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg
                 hover:bg-primary/80 transition-colors"
            >
              Next
            </button>
          )}

          {/* Signup button */}
          {details === "educational" && (
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
