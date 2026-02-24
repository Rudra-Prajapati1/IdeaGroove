// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   updateStudentProfile,
//   deleteStudentAccount,
// } from "../redux/slice/studentsSlice";
// import {
//   User,
//   Pencil,
//   Mail,
//   Hash,
//   GraduationCap,
//   Calendar,
//   Camera,
//   Trash2,
//   AlertTriangle,
//   X,
//   Check,
//   RotateCcw,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import defaultProfilePic from "/DarkLogo.png";
// import toast from "react-hot-toast";
// import { ConfirmationBox } from "../components/common/ConfirmationBox";
// import { selectAuth } from "../redux/slice/authSlice";
// import { updateStudentProfile } from "../redux/slice/studentsSlice";

// const ProfileInformation = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useSelector(selectAuth);

//   // --- STATES ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});

//   // Sync formData with Redux user data
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         Name: user.Name || "",
//         Username: user.Username || "",
//         Email: user.Email || "",
//         Roll_No: user.Roll_No || "",
//         College: user.College || "St. Xavier's College, Ahmedabad",
//         Degree: user.Degree || "BCA",
//         Year: user.Year || "",
//         Hobbies: user.Hobbies || [],
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/auth");
//     }
//   }, [isAuthenticated, navigate]);

//   if (!user) return null;

//   // --- HANDLERS ---
//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const dispatch = useDispatch();

//   const handleSave = async () => {
//     try {
//       const payload = {
//         student_id: user.id,
//         username: formData.Username ?? null,
//         name: formData.Name ?? null,
//         roll_no: formData.Roll_No ?? null,
//         college_id: user.College_ID ?? null,
//         degree_id: user.Degree_ID ?? null,
//         year: formData.Year ?? null,
//         email: formData.Email ?? null,
//         profile_pic: user.Profile_Pic ?? null,
//         hobbies: formData.Hobbies ?? [],
//       };

//       console.log("Sending data:", payload);

//       const updatedUserFromBackend = await dispatch(
//         updateStudentProfile(payload),
//       ).unwrap();

//       dispatch(updateUserInAuth(updatedUserFromBackend));

//       toast.success("Profile Updated Successfully!");
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       toast.error(typeof err === "string" ? err : "Update failed");
//     }
//   };

//   const handleCancel = () => {
//     // Revert to original user data
//     setFormData({
//       Name: user.Name,
//       Username: user.Username,
//       Email: user.Email,
//       Roll_No: user.Roll_No,
//       College: user.College,
//       Degree: user.Degree,
//       Year: user.Year,
//       Hobbies: user.Hobbies,
//     });
//     setIsEditing(false);
//     toast.error("Changes Discarded");
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       await dispatch(deleteStudentAccount(user.S_ID)).unwrap();
//       toast.success("Profile Deleted Successfully!");
//       navigate("/auth");
//     } catch (err) {
//       toast.error(err);
//     }
//   };

//   const formatBatchYear = (yearId) => {
//     if (!yearId || yearId.toString().length !== 4) return yearId || "N/A";
//     const yearStr = yearId.toString();
//     const startYear = `20${yearStr.substring(0, 2)}`;
//     const endYear = `20${yearStr.substring(2, 4)}`;
//     return `${startYear}-${endYear}`;
//   };

//   const infoFields = [
//     { label: "EMAIL ADDRESS", key: "Email", icon: <Mail size={16} /> },
//     { label: "ROLL NUMBER", key: "Roll_No", icon: <Hash size={16} /> },
//     {
//       label: "COLLEGE NAME",
//       key: "College",
//       icon: <GraduationCap size={16} />,
//       fullWidth: true,
//     },
//     { label: "DEGREE", key: "Degree", icon: <GraduationCap size={16} /> },
//     { label: "COLLEGE YEAR", key: "Year", icon: <Calendar size={16} /> },
//   ];

//   return (
//     <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
//       {/* Hero Section */}
//       <section className="relative bg-[#1A3C20] pt-40 pb-32">
//         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
//           <svg
//             viewBox="0 0 1440 120"
//             preserveAspectRatio="none"
//             className="block w-full h-[100px]"
//           >
//             <path
//               fill="#FFFBEB"
//               d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
//             ></path>
//           </svg>
//         </div>
//       </section>

//       <div className="max-w-6xl mx-auto px-4 relative z-30 -mt-30">
//         <h1 className="text-5xl font-extrabold mb-6 text-[#FFFBEB]">
//           Your Profile
//         </h1>
//       </div>

//       {/* Main Profile Card */}
//       <div className="max-w-4xl mx-auto bg-white relative z-20 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
//         <div className="px-10 py-8 flex justify-between items-center border-b border-gray-50">
//           <div className="flex items-center gap-3 text-[#1A3C20]">
//             <User size={20} strokeWidth={2.5} />
//             <h2 className="text-xl font-extrabold tracking-tight">
//               Personal Information
//             </h2>
//           </div>
//           <div className="flex gap-2">
//             {isEditing && (
//               <button
//                 onClick={handleCancel}
//                 className="p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
//               >
//                 <RotateCcw size={18} />
//               </button>
//             )}
//             <button
//               onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//               className={`p-2.5 rounded-full transition-all shadow-sm ${
//                 isEditing
//                   ? "bg-green-600 text-white"
//                   : "bg-[#f0f9f1] text-[#1A3C20]"
//               } hover:scale-110`}
//             >
//               {isEditing ? <Check size={18} /> : <Pencil size={18} />}
//             </button>
//           </div>
//         </div>

//         <div className="px-10 py-10 flex flex-col md:flex-row gap-12">
//           {/* Avatar Section */}
//           <div className="flex flex-col items-center min-w-[180px]">
//             <div className="relative group">
//               <div className="w-44 h-44 rounded-4xl bg-[#FFAB8F] overflow-hidden border-[6px] border-[#e8f5e9] shadow-inner">
//                 <img
//                   src={user?.Profile_Pic || defaultProfilePic}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <button className="absolute -bottom-2 -right-2 bg-[#1A3C20] text-white p-2.5 rounded-xl border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform">
//                 <Camera size={16} />
//               </button>
//             </div>
//             <div className="mt-6 text-center w-full">
//               {isEditing ? (
//                 <div className="flex flex-col gap-2">
//                   <input
//                     type="text"
//                     value={formData.Name}
//                     onChange={(e) => handleInputChange("Name", e.target.value)}
//                     className="text-center w-full bg-slate-50 border border-slate-200 rounded-lg py-1 text-lg font-bold text-[#1A3C20] outline-none focus:border-green-500"
//                     placeholder="Name"
//                   />
//                   <input
//                     type="text"
//                     value={formData.Username}
//                     onChange={(e) =>
//                       handleInputChange("Username", e.target.value)
//                     }
//                     className="text-center w-full bg-transparent text-gray-400 font-medium text-sm outline-none"
//                     placeholder="Username"
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <h3 className="text-2xl font-black text-[#1A3C20] capitalize">
//                     {formData.Name || "Alex Johnson"}
//                   </h3>
//                   <p className="text-gray-400 font-medium text-sm mt-1">
//                     @{formData.Username || "alexj"}
//                   </p>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Form Fields Section */}
//           <div className="flex-1">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
//               {infoFields.map((field, idx) => (
//                 <div
//                   key={idx}
//                   className={field.fullWidth ? "md:col-span-2" : ""}
//                 >
//                   <label className="block text-[10px] font-black text-[#1A3C20]/40 tracking-[0.15em] mb-2 uppercase">
//                     {field.label}
//                   </label>
//                   <div className="flex items-center gap-3 bg-[#f8faf9] border border-gray-100 rounded-2xl px-5 py-4 text-[#4A5568]">
//                     <span className="text-[#1A3C20]/40">{field.icon}</span>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={formData[field.key]}
//                         onChange={(e) =>
//                           handleInputChange(field.key, e.target.value)
//                         }
//                         className="w-full bg-transparent outline-none text-sm font-semibold text-[#1A3C20]"
//                       />
//                     ) : (
//                       <span className="text-sm font-semibold">
//                         {field.key === "Year"
//                           ? formatBatchYear(formData[field.key])
//                           : formData[field.key]}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               <div className="md:col-span-2">
//                 <label className="block text-[10px] font-black text-gray-300 tracking-[0.15em] mb-3 uppercase">
//                   Hobbies & Interests
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.Hobbies?.map((hobby, idx) => (
//                     <span
//                       key={idx}
//                       className="px-5 py-2 bg-[#e8f5e9] text-[#1A3C20] text-xs font-bold rounded-full border border-[#1A3C20]/5 hover:bg-[#1A3C20] hover:text-white transition-colors"
//                     >
//                       {hobby}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Danger Zone */}
//             {!isEditing && (
//               <div className="mt-12 pt-8 border-t border-gray-100">
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm transition-colors px-2 py-1"
//                 >
//                   <Trash2 size={16} />
//                   Delete My Account
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {isModalOpen && (
//         <ConfirmationBox
//           onClose={() => setIsModalOpen(false)}
//           onConfirm={handleDeleteAccount}
//           type="Account"
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileInformation;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Combined imports
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Pencil,
  Mail,
  Hash,
  GraduationCap,
  Calendar,
  Camera,
  Trash2,
  Check,
  RotateCcw,
} from "lucide-react";

// --- REDUX IMPORTS ---
import {
  updateStudentProfile,
  deleteStudentAccount,
} from "../redux/slice/studentsSlice"; // Import only once
import { selectAuth, updateUserInAuth } from "../redux/slice/authSlice";

import defaultProfilePic from "/DarkLogo.png";
import { ConfirmationBox } from "../components/common/ConfirmationBox";

const ProfileInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(selectAuth);

  // --- STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Sync formData with Redux user data
  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || "",
        Username: user.Username || "",
        Email: user.Email || "",
        Roll_No: user.Roll_No || "",
        College: user.College || "St. Xavier's College, Ahmedabad",
        Degree: user.Degree || "BCA",
        Year: user.Year || "",
        Hobbies: user.Hobbies || [],
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  // --- HANDLERS ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        student_id: user.id || user.S_ID, // Handle both ID cases
        username: formData.Username ?? null,
        name: formData.Name ?? null,
        roll_no: formData.Roll_No ?? null,
        college_id: user.College_ID ?? null,
        degree_id: user.Degree_ID ?? null,
        year: formData.Year ?? null,
        email: formData.Email ?? null,
        profile_pic: user.Profile_Pic ?? null,
        hobbies: formData.Hobbies ?? [],
      };

      console.log("Sending data:", payload);

      // 1. Call API
      const response = await dispatch(updateStudentProfile(payload)).unwrap();

      // 2. Update Auth State (UI)
      // Note: We check if response has 'updatedUser' key or is the user object itself
      const userData = response.updatedUser || response;
      dispatch(updateUserInAuth(userData));

      toast.success("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(typeof err === "string" ? err : "Update failed");
    }
  };

  const handleCancel = () => {
    setFormData({
      Name: user.Name,
      Username: user.Username,
      Email: user.Email,
      Roll_No: user.Roll_No,
      College: user.College,
      Degree: user.Degree,
      Year: user.Year,
      Hobbies: user.Hobbies,
    });
    setIsEditing(false);
    toast.error("Changes Discarded");
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteStudentAccount(user.id || user.S_ID)).unwrap();
      toast.success("Profile Deleted Successfully!");
      navigate("/auth");
    } catch (err) {
      toast.error(err);
    }
  };

  const formatBatchYear = (yearId) => {
    if (!yearId || yearId.toString().length !== 4) return yearId || "N/A";
    const yearStr = yearId.toString();
    const startYear = `20${yearStr.substring(0, 2)}`;
    const endYear = `20${yearStr.substring(2, 4)}`;
    return `${startYear}-${endYear}`;
  };

  const infoFields = [
    { label: "EMAIL ADDRESS", key: "Email", icon: <Mail size={16} /> },
    { label: "ROLL NUMBER", key: "Roll_No", icon: <Hash size={16} /> },
    {
      label: "COLLEGE NAME",
      key: "College",
      icon: <GraduationCap size={16} />,
      fullWidth: true,
    },
    { label: "DEGREE", key: "Degree", icon: <GraduationCap size={16} /> },
    { label: "COLLEGE YEAR", key: "Year", icon: <Calendar size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      {/* Hero Section */}
      <section className="relative bg-[#1A3C20] pt-40 pb-32">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[100px]"
          >
            <path
              fill="#FFFBEB"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 relative z-30 -mt-30">
        <h1 className="text-5xl font-extrabold mb-6 text-[#FFFBEB]">
          Your Profile
        </h1>
      </div>

      {/* Main Profile Card */}
      <div className="max-w-4xl mx-auto bg-white relative z-20 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-10 py-8 flex justify-between items-center border-b border-gray-50">
          <div className="flex items-center gap-3 text-[#1A3C20]">
            <User size={20} strokeWidth={2.5} />
            <h2 className="text-xl font-extrabold tracking-tight">
              Personal Information
            </h2>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <button
                onClick={handleCancel}
                className="p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <RotateCcw size={18} />
              </button>
            )}
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`p-2.5 rounded-full transition-all shadow-sm ${isEditing ? "bg-green-600 text-white" : "bg-[#f0f9f1] text-[#1A3C20]"} hover:scale-110`}
            >
              {isEditing ? <Check size={18} /> : <Pencil size={18} />}
            </button>
          </div>
        </div>

        <div className="px-10 py-10 flex flex-col md:flex-row gap-12">
          {/* Avatar Section */}
          <div className="flex flex-col items-center min-w-[180px]">
            <div className="relative group">
              <div className="w-44 h-44 rounded-4xl bg-[#FFAB8F] overflow-hidden border-[6px] border-[#e8f5e9] shadow-inner">
                <img
                  src={user?.Profile_Pic || defaultProfilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-[#1A3C20] text-white p-2.5 rounded-xl border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <div className="mt-6 text-center w-full">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                    className="text-center w-full bg-slate-50 border border-slate-200 rounded-lg py-1 text-lg font-bold text-[#1A3C20] outline-none focus:border-green-500"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={formData.Username}
                    onChange={(e) =>
                      handleInputChange("Username", e.target.value)
                    }
                    className="text-center w-full bg-transparent text-gray-400 font-medium text-sm outline-none"
                    placeholder="Username"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-[#1A3C20] capitalize">
                    {formData.Name || "Alex Johnson"}
                  </h3>
                  <p className="text-gray-400 font-medium text-sm mt-1">
                    @{formData.Username || "alexj"}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {infoFields.map((field, idx) => (
                <div
                  key={idx}
                  className={field.fullWidth ? "md:col-span-2" : ""}
                >
                  <label className="block text-[10px] font-black text-[#1A3C20]/40 tracking-[0.15em] mb-2 uppercase">
                    {field.label}
                  </label>
                  <div className="flex items-center gap-3 bg-[#f8faf9] border border-gray-100 rounded-2xl px-5 py-4 text-[#4A5568]">
                    <span className="text-[#1A3C20]/40">{field.icon}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData[field.key]}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className="w-full bg-transparent outline-none text-sm font-semibold text-[#1A3C20]"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {field.key === "Year"
                          ? formatBatchYear(formData[field.key])
                          : formData[field.key]}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-300 tracking-[0.15em] mb-3 uppercase">
                  Hobbies & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.Hobbies?.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="px-5 py-2 bg-[#e8f5e9] text-[#1A3C20] text-xs font-bold rounded-full border border-[#1A3C20]/5 hover:bg-[#1A3C20] hover:text-white transition-colors"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            {!isEditing && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm transition-colors px-2 py-1"
                >
                  <Trash2 size={16} /> Delete My Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ConfirmationBox
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteAccount}
          type="Account"
        />
      )}
    </div>
  );
};

export default ProfileInformation;
