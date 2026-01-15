// import { Eye, EyeClosed, User2 } from "lucide-react";
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import SectionWrapper from "./SectionWrapper";
// import Input from "./Input";
// import ProfileUpload from "./ProfileUpload";
// import Select from "./Select";

// const SignupForm = ({ onLogin }) => {
//   const [signupData, setSignupData] = useState({
//     username: "",
//     name: "",
//     roll_no: "",
//     email: "",
//     college: "",
//     degree: "",
//     year: "",
//     profile_pic: null,
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const colleges = [
//     "IIT Bombay",
//     "IIT Delhi",
//     "NIT Trichy",
//     "BITS Pilani",
//     "Other",
//   ];

//   const degrees = ["B.Tech", "M.Tech", "MBA", "BSc", "MSc"];

//   const handleData = (field, value) => {
//     setSignupData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please upload a valid image");
//       return;
//     }

//     setSignupData((prev) => ({
//       ...prev,
//       profile_pic: file,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       !signupData.username ||
//       !signupData.name ||
//       !signupData.roll_no ||
//       !signupData.email ||
//       !signupData.password ||
//       !signupData.confirmPassword
//     ) {
//       return toast.error("Please fill all required fields");
//     }

//     if (signupData.password.length < 6) {
//       return toast.error("Password must be at least 6 characters");
//     }

//     if (signupData.password !== signupData.confirmPassword) {
//       return toast.error("Passwords do not match");
//     }

//     if (!signupData.college || !signupData.degree || !signupData.year) {
//       return toast.error("Please complete educational details");
//     }

//     setLoading(true);

//     try {
//       toast.success("Signup Successful!");
//     } catch (error) {
//       toast.error(error.message || "Signup Failed. Please Try Again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [details, setDetails] = useState("personal");

//   return (
//     <div className="w-full h-full flex items-center pt-20 justify-center">
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 w-full font-inter items-center justify-between"
//       >
//         {details === "personal" && (
//           <SectionWrapper title="Personal Details">
//             <div>
//               <div className="flex gap-6 items-center">
//                 <div className="flex flex-col gap-4">
//                   <Input
//                     label="Username"
//                     placeholder="Enter the username"
//                     value={signupData.username}
//                     onChange={(v) => handleData("username", v)}
//                   />

//                   <Input
//                     label="Name"
//                     placeholder="Enter the name"
//                     value={signupData.name}
//                     onChange={(v) => handleData("name", v)}
//                   />

//                   <Input
//                     label="Roll No"
//                     placeholder="Enter the roll no"
//                     value={signupData.roll_no}
//                     onChange={(v) => handleData("roll_no", v)}
//                   />
//                 </div>

//                 <ProfileUpload
//                   file={signupData.profile_pic}
//                   onChange={handleImageChange}
//                 />
//               </div>
//               <div className="flex gap-6 mt-4">
//                 <label className="text-lg font-semibold text-primary w-[50%]">
//                   Password
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={signupData.password}
//                       placeholder="Enter password"
//                       onChange={(e) => handleData("password", e.target.value)}
//                       className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none
//                  transition-colors duration-300 focus:border-primary/60 p-3"
//                       required
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
//                  hover:bg-primary/10 p-1 rounded-2xl"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? (
//                         <Eye className="w-5 h-5 text-primary" />
//                       ) : (
//                         <EyeClosed className="w-5 h-5 text-primary" />
//                       )}
//                     </span>
//                   </div>
//                 </label>
//                 <label className="text-lg font-semibold text-primary w-[50%]">
//                   Confirm Password
//                   <div className="relative">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={signupData.confirmPassword}
//                       placeholder="Re-enter password"
//                       onChange={(e) =>
//                         handleData("confirmPassword", e.target.value)
//                       }
//                       className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none
//                  transition-colors duration-300 focus:border-primary/60 p-3"
//                       required
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
//                  hover:bg-primary/10 p-1 rounded-2xl"
//                       onClick={() => setShowConfirmPassword((prev) => !prev)}
//                     >
//                       {showConfirmPassword ? (
//                         <Eye className="w-5 h-5 text-primary" />
//                       ) : (
//                         <EyeClosed className="w-5 h-5 text-primary" />
//                       )}
//                     </span>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           </SectionWrapper>
//         )}

//         {details === "educational" && (
//           <SectionWrapper title="Educational Details">
//             <Select
//               label="College"
//               value={signupData.college}
//               options={colleges}
//               onChange={(v) => handleData("college", v)}
//             />

//             <Select
//               label="Degree"
//               value={signupData.degree}
//               options={degrees}
//               onChange={(v) => handleData("degree", v)}
//             />

//             <Select
//               label="Year"
//               value={signupData.year}
//               options={[
//                 "1st Year",
//                 "2nd Year",
//                 "3rd Year",
//                 "4th Year",
//                 "5th Year",
//               ]}
//               onChange={(v) => handleData("year", v)}
//             />

//             <Input
//               label="Email"
//               type="email"
//               placeholder="Enter the email"
//               value={signupData.email}
//               onChange={(v) => handleData("email", v)}
//             />
//           </SectionWrapper>
//         )}
//         <div className="flex gap-4 mt-4">
//           {/* Back button */}
//           {details === "educational" && (
//             <button
//               type="button"
//               onClick={() => setDetails("personal")}
//               className="border border-primary text-primary px-6 py-2 rounded-lg
//                  hover:bg-primary/10 transition-colors"
//             >
//               Back
//             </button>
//           )}

//           {/* Next button */}
//           {details === "personal" && (
//             <button
//               type="button"
//               onClick={() => {
//                 if (
//                   !signupData.username ||
//                   !signupData.name ||
//                   !signupData.roll_no ||
//                   !signupData.password ||
//                   !signupData.confirmPassword
//                 ) {
//                   return toast.error("Please complete personal details first");
//                 }

//                 if (signupData.password.length < 6) {
//                   return toast.error("Password must be at least 6 characters");
//                 }

//                 if (signupData.password !== signupData.confirmPassword) {
//                   return toast.error("Passwords do not match");
//                 }

//                 setDetails("educational");
//               }}
//               disabled={loading}
//               className="bg-primary text-white px-6 py-2 rounded-lg
//                  hover:bg-primary/80 transition-colors"
//             >
//               Next
//             </button>
//           )}

//           {/* Signup button */}
//           {details === "educational" && (
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-primary text-white px-6 py-2 rounded-lg
//                  hover:bg-primary/80 transition-colors"
//             >
//               {loading ? "Loading..." : "Signup"}
//             </button>
//           )}
//         </div>

//         <span
//           onClick={onLogin}
//           className="text-[13px] text-primary/80 hover:underline cursor-pointer"
//         >
//           Already have an account? Login
//         </span>
//       </form>
//     </div>
//   );
// };

// export default SignupForm;

import { Eye, EyeOff, X } from "lucide-react"; // FIX: Changed 'EyeClosed' to 'EyeOff'
import React, { useState } from "react";
import toast from "react-hot-toast";
import SearchableSelect from "./SearchableSelect"; // Ensure this file exists

const SignupForm = ({ onLogin }) => {
  const [details, setDetails] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signupData, setSignupData] = useState({
    username: "",
    name: "",
    roll_no: "",
    email: "",
    college_id: null,
    degree_id: null,
    year: "",
    password: "",
    confirmPassword: "",
    hobby_ids: [],
    hobby_names: [],
  });

  const handleData = (field, value) =>
    setSignupData((prev) => ({ ...prev, [field]: value }));

  const removeHobby = (indexToRemove) => {
    setSignupData((prev) => ({
      ...prev,
      hobby_ids: prev.hobby_ids.filter((_, i) => i !== indexToRemove),
      hobby_names: prev.hobby_names.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!signupData.college_id || !signupData.degree_id || !signupData.year) {
      return toast.error("Please fill all educational details");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: signupData.username,
          Name: signupData.name,
          Roll_No: signupData.roll_no,
          College_ID: signupData.college_id,
          Degree_ID: signupData.degree_id,
          Year: signupData.year,
          Email: signupData.email,
          Password: signupData.password,
          hobby_ids: signupData.hobby_ids,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup Successful!");
        if (onLogin) onLogin();
      } else {
        toast.error(data.error || "Signup Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center pt-10 justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-lg bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        {/* --- STEP 1: PERSONAL --- */}
        {details === "personal" && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Personal Details
            </h2>

            <input
              placeholder="Username"
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
              onChange={(e) => handleData("username", e.target.value)}
              value={signupData.username}
              required
            />

            <input
              placeholder="Full Name"
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
              onChange={(e) => handleData("name", e.target.value)}
              value={signupData.name}
              required
            />

            <input
              placeholder="Roll Number"
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
              onChange={(e) => handleData("roll_no", e.target.value)}
              value={signupData.roll_no}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors pr-10"
                onChange={(e) => handleData("password", e.target.value)}
                value={signupData.password}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* FIX: Replaced EyeClosed with EyeOff */}
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
              onChange={(e) => handleData("confirmPassword", e.target.value)}
              value={signupData.confirmPassword}
              required
            />

            <button
              type="button"
              onClick={() => {
                if (!signupData.username || !signupData.password)
                  return toast.error("Required fields missing");
                setDetails("educational");
              }}
              className="bg-blue-600 text-white p-3 rounded-xl w-full font-semibold hover:bg-blue-700 transition-all mt-4"
            >
              Next
            </button>

            <p
              className="text-center text-sm text-gray-500 cursor-pointer hover:underline"
              onClick={onLogin}
            >
              Already have an account? Login
            </p>
          </div>
        )}

        {/* --- STEP 2: EDUCATIONAL --- */}
        {details === "educational" && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Educational Details
            </h2>

            <SearchableSelect
              label="College"
              placeholder="Search college..."
              endpoint="http://localhost:5000/api/fetch/search/colleges"
              onSelect={(id) => handleData("college_id", id)}
            />

            <SearchableSelect
              label="Degree"
              placeholder="Search degree..."
              endpoint="http://localhost:5000/api/fetch/search/degrees"
              onSelect={(id) => handleData("degree_id", id)}
            />

            <div className="space-y-1">
              <SearchableSelect
                label="Hobbies (Optional)"
                placeholder="Search hobbies..."
                endpoint="http://localhost:5000/api/fetch/search/hobbies"
                onSelect={(id, name) => {
                  if (id && !signupData.hobby_ids.includes(id)) {
                    handleData("hobby_ids", [...signupData.hobby_ids, id]);
                    handleData("hobby_names", [
                      ...signupData.hobby_names,
                      name,
                    ]);
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {signupData.hobby_names.map((name, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {name}{" "}
                    <button type="button" onClick={() => removeHobby(idx)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500"
              onChange={(e) => handleData("year", e.target.value)}
              value={signupData.year}
              required
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>

            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
              onChange={(e) => handleData("email", e.target.value)}
              value={signupData.email}
              required
            />

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setDetails("personal")}
                className="border-2 border-blue-600 text-blue-600 p-3 rounded-xl w-1/3 font-semibold hover:bg-blue-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white p-3 rounded-xl w-2/3 font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Signing Up..." : "Signup"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
