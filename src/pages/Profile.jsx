// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   updateStudentProfile,
//   deleteStudentAccount,
//   fetchCurrentStudent,
//   fetchAllColleges,
//   fetchAllDegrees,
//   fetchAllHobbiesMaster,
//   selectCurrentStudent,
//   selectAllColleges,
//   selectAllDegrees,
//   selectAllHobbiesMaster,
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
//   Check,
//   RotateCcw,
//   Search,
// } from "lucide-react";

// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import defaultProfilePic from "/DarkLogo.png";

// const ProfileInformation = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const currentStudent = useSelector(selectCurrentStudent);
//   const [collegeSearch, setCollegeSearch] = useState("");
//   const [degreeSearch, setDegreeSearch] = useState("");
//   const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
//   const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);

//   const masterColleges = useSelector(selectAllColleges) || [];
//   const masterDegrees = useSelector(selectAllDegrees) || [];
//   const masterHobbies = useSelector(selectAllHobbiesMaster) || [];

//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const [hobbySearch, setHobbySearch] = useState("");

//   /* ===============================
//      LOAD DATA
//   =============================== */
//   const loadProfileData = () => {
//     const loggedInId = user?.S_ID || user?.id;
//     if (isAuthenticated && loggedInId) {
//       dispatch(fetchCurrentStudent(loggedInId));
//       dispatch(fetchAllColleges());
//       dispatch(fetchAllDegrees());
//       dispatch(fetchAllHobbiesMaster());
//     }
//   };

//   useEffect(() => {
//     loadProfileData();
//   }, [dispatch, isAuthenticated, user]);

//   useEffect(() => {
//     if (!isAuthenticated) navigate("/auth");
//   }, [isAuthenticated, navigate]);

//   /* ===============================
//      SYNC DATA
//   =============================== */
//   useEffect(() => {
//     if (currentStudent) {
//       setFormData({
//         Name: currentStudent.Name || "",
//         Username: currentStudent.Username || "",
//         Email: currentStudent.Email || "",
//         Roll_No: currentStudent.Roll_No || "",
//         Year: currentStudent.Year || "",
//         College: currentStudent.College_Name || "",
//         Degree: currentStudent.Degree_Name || "",
//         College_ID: currentStudent.College_ID,
//         Degree_ID: currentStudent.Degree_ID,
//         Hobbies: currentStudent.hobbies?.map((h) => h.Hobby_ID) || [],
//       });
//     }
//   }, [currentStudent]);

//   if (!currentStudent || !formData)
//     return <div className="p-20 text-center font-bold">Loading...</div>;

//   /* ===============================
//      HANDLERS
//   =============================== */

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSearchableSelect = (type, value) => {
//     if (type === "College") {
//       const match = masterColleges.find((c) => c.College_Name === value);
//       setFormData((prev) => ({
//         ...prev,
//         College: value,
//         College_ID: match ? match.College_ID : prev.College_ID,
//       }));
//     } else {
//       const match = masterDegrees.find((d) => d.Degree_Name === value);
//       setFormData((prev) => ({
//         ...prev,
//         Degree: value,
//         Degree_ID: match ? match.Degree_ID : prev.Degree_ID,
//       }));
//     }
//   };

//   const toggleHobby = (hobbyId) => {
//     setFormData((prev) => ({
//       ...prev,
//       Hobbies: prev.Hobbies.includes(hobbyId)
//         ? prev.Hobbies.filter((id) => id !== hobbyId)
//         : [...prev.Hobbies, hobbyId],
//     }));
//   };

//   const handleDiscard = () => {
//     setFormData({
//       Name: currentStudent.Name || "",
//       Username: currentStudent.Username || "",
//       Email: currentStudent.Email || "",
//       Roll_No: currentStudent.Roll_No || "",
//       Year: currentStudent.Year || "",
//       College: currentStudent.College_Name || "",
//       Degree: currentStudent.Degree_Name || "",
//       College_ID: currentStudent.College_ID,
//       Degree_ID: currentStudent.Degree_ID,
//       Hobbies: currentStudent.hobbies?.map((h) => h.Hobby_ID) || [],
//     });

//     setIsEditing(false);
//     toast.error("Changes discarded");
//   };

//   const handleSave = async () => {
//     try {
//       const payload = {
//         student_id: currentStudent.S_ID,
//         username: formData.Username ?? null,
//         name: formData.Name ?? null,
//         roll_no: formData.Roll_No ?? null,
//         college_id: formData.College_ID ?? null,
//         degree_id: formData.Degree_ID ?? null,
//         year: formData.Year ?? null,
//         email: formData.Email ?? null,
//         hobbies: formData.Hobbies ?? [],
//       };

//       await dispatch(updateStudentProfile(payload)).unwrap();
//       toast.success("Profile Updated Successfully!");

//       loadProfileData();
//       setIsEditing(false);
//     } catch (err) {
//       toast.error("Failed to update profile");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       await dispatch(deleteStudentAccount(currentStudent.S_ID)).unwrap();

//       toast.success("Account Deleted Successfully");
//       navigate("/auth");
//     } catch (err) {
//       toast.error("Failed to delete account");
//     }
//   };

//   const formatBatchYear = (yearId) => {
//     if (!yearId || yearId.toString().length !== 4) return yearId || "N/A";
//     const yearStr = yearId.toString();
//     return `20${yearStr.substring(0, 2)}-20${yearStr.substring(2, 4)}`;
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
//     {
//       label: "DEGREE",
//       key: "Degree",
//       icon: <GraduationCap size={16} />,
//     },
//     {
//       label: "COLLEGE YEAR",
//       key: "Year",
//       icon: <Calendar size={16} />,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
//       <section className="bg-[#1A3C20] pt-40 pb-32">
//         <div className="max-w-6xl mx-auto px-4">
//           <h1 className="text-5xl font-extrabold text-[#FFFBEB]">
//             Your Profile
//           </h1>
//         </div>
//       </section>

//       {/* Profile Card */}
//       <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl -mt-20 overflow-hidden">
//         {/* Header */}
//         <div className="px-10 py-8 flex justify-between items-center border-b">
//           <div className="flex items-center gap-3 text-[#1A3C20]">
//             <User size={20} />
//             <h2 className="text-xl font-extrabold">Personal Information</h2>
//           </div>

//           <div className="flex gap-2">
//             {isEditing && (
//               <button
//                 onClick={handleDiscard}
//                 className="p-2.5 bg-red-50 text-red-600 rounded-full"
//               >
//                 <RotateCcw size={18} />
//               </button>
//             )}

//             <button
//               onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//               className={`p-2.5 rounded-full ${
//                 isEditing
//                   ? "bg-green-600 text-white"
//                   : "bg-[#f0f9f1] text-[#1A3C20]"
//               }`}
//             >
//               {isEditing ? <Check size={18} /> : <Pencil size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="px-10 py-10 flex flex-col md:flex-row gap-12">
//           {/* Avatar */}
//           <div className="flex flex-col items-center min-w-[180px]">
//             <div className="w-44 h-44 rounded-4xl bg-[#FFAB8F] overflow-hidden border-[6px] border-[#e8f5e9] shadow-inner">
//               <img
//                 src={currentStudent?.Profile_Pic || defaultProfilePic}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <h3 className="text-2xl font-black text-[#1A3C20] mt-4 capitalize">
//               {formData.Name}
//             </h3>
//             <p className="text-gray-400 text-sm">@{formData.Username}</p>
//           </div>

//           {/* Info */}
//           <div className="flex-1">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {infoFields.map((field, idx) => (
//                 <div
//                   key={idx}
//                   className={field.fullWidth ? "md:col-span-2" : ""}
//                 >
//                   <label className="block text-xs font-bold mb-2 uppercase">
//                     {field.label}
//                   </label>

//                   <div className="flex items-center gap-3 bg-[#f8faf9] border rounded-2xl px-5 py-4">
//                     {field.icon}

//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={formData[field.key] || ""}
//                         onChange={(e) =>
//                           field.key === "College" || field.key === "Degree"
//                             ? handleSearchableSelect(field.key, e.target.value)
//                             : handleInputChange(field.key, e.target.value)
//                         }
//                         className="w-full bg-transparent outline-none"
//                       />
//                     ) : (
//                       <span>
//                         {field.key === "Year"
//                           ? formatBatchYear(formData[field.key])
//                           : formData[field.key] || "N/A"}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Delete */}
//             {!isEditing && (
//               <div className="mt-12 pt-8 border-t">
//                 <button
//                   onClick={handleDeleteAccount}
//                   className="flex items-center gap-2 text-red-500 font-bold text-sm"
//                 >
//                   <Trash2 size={16} /> Delete My Account
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileInformation;
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStudentProfile,
  deleteStudentAccount,
  fetchCurrentStudent,
  fetchAllColleges,
  fetchAllDegrees,
  fetchAllHobbiesMaster,
  selectCurrentStudent,
  selectAllColleges,
  selectAllDegrees,
  selectAllHobbiesMaster,
} from "../redux/slice/studentsSlice";

import {
  User,
  Pencil,
  Mail,
  Hash,
  GraduationCap,
  Calendar,
  Trash2,
  Check,
  RotateCcw,
  Search,
  Building2,
  BookOpen,
  X,
  ChevronDown,
  Camera,
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "/DarkLogo.png";
import { ConfirmationBox } from "../components/common/ConfirmationBox";

/* ─────────────────────────── SearchableDropdown ─────────────────────────── */
const SearchableDropdown = ({
  label,
  icon,
  value,
  isEditing,
  placeholder,
  items,
  searchKey,
  idKey,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = items.filter((item) =>
    item[searchKey]?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[#3a6b42]">
        {label}
      </label>

      {isEditing ? (
        <div ref={ref} className="relative">
          <div
            className="flex items-center gap-3 bg-[#f4fbf5] border-2 border-[#c8e6c9] rounded-2xl px-5 py-3 cursor-pointer hover:border-[#1A3C20] transition-all duration-200 focus-within:border-[#1A3C20] focus-within:shadow-[0_0_0_3px_rgba(26,60,32,0.08)]"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="text-[#4caf50]">{icon}</span>
            <span
              className={`flex-1 text-sm ${value ? "text-[#1A3C20] font-medium" : "text-gray-400"}`}
            >
              {value || placeholder}
            </span>
            <ChevronDown
              size={16}
              className={`text-[#4caf50] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </div>

          {open && (
            <div className="absolute z-50 mt-2 w-full bg-white border-2 border-[#c8e6c9] rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8f5e9]">
                <Search size={14} className="text-[#4caf50]" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="flex-1 text-sm outline-none bg-transparent text-[#1A3C20] placeholder:text-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={13} className="text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center">
                    No results found
                  </li>
                ) : (
                  filtered.map((item) => (
                    <li
                      key={item[idKey]}
                      onClick={() => {
                        onSelect(item);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[#f0f9f1] text-[#1A3C20] ${
                        value === item[searchKey]
                          ? "bg-[#e8f5e9] font-semibold"
                          : ""
                      }`}
                    >
                      {item[searchKey]}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-[#f4fbf5] border-2 border-[#e8f5e9] rounded-2xl px-5 py-3">
          <span className="text-[#4caf50]">{icon}</span>
          <span className="text-[#1A3C20] text-sm font-medium">
            {value || "N/A"}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── HobbiesField ─────────────────────────── */
const HobbiesField = ({
  masterHobbies,
  selectedIds,
  isEditing,
  onToggle,
  currentHobbies,
}) => {
  const [search, setSearch] = useState("");

  const filtered = masterHobbies.filter((h) =>
    h.Hobby_Name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <label className="block text-xs font-bold mb-3 uppercase tracking-widest text-[#3a6b42]">
        Hobbies
      </label>

      {isEditing ? (
        <div className="bg-[#f4fbf5] border-2 border-[#c8e6c9] rounded-2xl p-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white border border-[#c8e6c9] rounded-xl px-3 py-2 mb-3 focus-within:border-[#1A3C20] transition-all">
            <Search size={14} className="text-[#4caf50]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hobbies..."
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400 text-[#1A3C20]"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} className="text-gray-400 hover:text-red-400" />
              </button>
            )}
          </div>

          {/* Selected count badge */}
          {selectedIds.length > 0 && (
            <p className="text-xs text-[#4caf50] font-semibold mb-2">
              {selectedIds.length} selected
            </p>
          )}

          {/* Hobby pills */}
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
            {filtered.map((hobby) => {
              const selected = selectedIds.includes(hobby.Hobby_ID);
              return (
                <button
                  key={hobby.Hobby_ID}
                  onClick={() => onToggle(hobby.Hobby_ID)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border-2 ${
                    selected
                      ? "bg-[#1A3C20] text-white border-[#1A3C20] shadow-sm"
                      : "bg-white text-[#3a6b42] border-[#c8e6c9] hover:border-[#1A3C20] hover:text-[#1A3C20]"
                  }`}
                >
                  {selected && <Check size={11} />}
                  {hobby.Hobby_Name}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 py-2">
                No hobbies match your search
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {currentHobbies?.length > 0 ? (
            currentHobbies.map((hobby) => (
              <span
                key={hobby.Hobby_ID}
                className="px-4 py-1.5 bg-[#e8f5e9] text-[#1A3C20] border border-[#c8e6c9] rounded-full text-sm font-medium"
              >
                {hobby.Hobby_Name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No hobbies added</span>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── InfoField ─────────────────────────── */
const InfoField = ({
  label,
  icon,
  value,
  isEditing,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[#3a6b42]">
      {label}
    </label>
    <div
      className={`flex items-center gap-3 bg-[#f4fbf5] border-2 rounded-2xl px-5 py-3 transition-all duration-200 ${
        isEditing && onChange
          ? "border-[#c8e6c9] hover:border-[#1A3C20] focus-within:border-[#1A3C20] focus-within:shadow-[0_0_0_3px_rgba(26,60,32,0.08)]"
          : "border-[#e8f5e9]"
      }`}
    >
      <span className="text-[#4caf50]">{icon}</span>
      {isEditing && onChange ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-[#1A3C20] placeholder:text-gray-400 font-medium"
        />
      ) : (
        <span className="text-sm text-[#1A3C20] font-medium">
          {value || "N/A"}
        </span>
      )}
    </div>
  </div>
);

/* ─────────────────────────── ProfileInformation ─────────────────────────── */
const ProfileInformation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const currentStudent = useSelector(selectCurrentStudent);

  const masterColleges = useSelector(selectAllColleges) || [];
  const masterDegrees = useSelector(selectAllDegrees) || [];
  const masterHobbies = useSelector(selectAllHobbiesMaster) || [];

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const loadProfileData = () => {
    const loggedInId = user?.S_ID || user?.id;
    if (isAuthenticated && loggedInId) {
      dispatch(fetchCurrentStudent(loggedInId));
      dispatch(fetchAllColleges());
      dispatch(fetchAllDegrees());
      dispatch(fetchAllHobbiesMaster());
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    loadProfileData();
  }, [dispatch, isAuthenticated, user]);
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentStudent) {
      setFormData({
        Name: currentStudent.Name || "",
        Username: currentStudent.Username || "",
        Email: currentStudent.Email || "",
        Roll_No: currentStudent.Roll_No || "",
        Year: currentStudent.Year || "",
        College: currentStudent.College_Name || "",
        Degree: currentStudent.Degree_Name || "",
        College_ID: currentStudent.College_ID,
        Degree_ID: currentStudent.Degree_ID,
        Hobbies: currentStudent.hobbies?.map((h) => h.Hobby_ID) || [],
      });
    }
  }, [currentStudent]);

  if (!currentStudent || !formData)
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <div className="text-[#1A3C20] font-bold text-lg animate-pulse">
          Loading profile...
        </div>
      </div>
    );

  const formatBatchYear = (year) => {
    if (!year) return "N/A";
    const yearStr = String(year);
    if (yearStr.length !== 4) return yearStr;
    return `20${yearStr.substring(0, 2)}-20${yearStr.substring(2, 4)}`;
  };

  // Convert "2023-2027" → "2327" for storage
  const parseBatchYear = (displayStr) => {
    const match = displayStr.match(/20(\d{2})-20(\d{2})/);
    if (match) return `${match[1]}${match[2]}`; // "2327"
    return displayStr;
  };

  const handleSave = async () => {
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("student_id", currentStudent.S_ID);
      formDataPayload.append("username", formData.Username);
      formDataPayload.append("name", formData.Name);
      formDataPayload.append("roll_no", formData.Roll_No);
      formDataPayload.append("college_id", formData.College_ID);
      formDataPayload.append("degree_id", formData.Degree_ID);
      formDataPayload.append("year", formData.Year);
      formDataPayload.append("email", formData.Email);
      formDataPayload.append("hobbies", JSON.stringify(formData.Hobbies));
      if (profilePicFile) {
        formDataPayload.append("profile_pic", profilePicFile);
      }

      const result = await dispatch(
        updateStudentProfile(formDataPayload),
      ).unwrap();
      console.log("Update result:", result); // 👈 check what comes back
      toast.success("Profile Updated Successfully!");
      setIsEditing(false);
      setProfilePicFile(null);
      setProfilePicPreview(null);
      loadProfileData();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      {/* Hero */}
      <section className="bg-[#1A3C20] pt-40 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-[#FFFBEB]">
            Your Profile
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl -mt-20 px-10 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3 text-[#1A3C20]">
            <User size={22} />
            <h2 className="text-2xl font-extrabold">Personal Information</h2>
          </div>
          <div className="flex gap-3">
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <RotateCcw size={15} /> Discard
              </button>
            )}
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                isEditing
                  ? "bg-[#1A3C20] text-white hover:bg-[#2d6b38] shadow-lg"
                  : "bg-[#f0f9f1] text-[#1A3C20] hover:bg-[#e0f2e1]"
              }`}
            >
              {isEditing ? (
                <>
                  <Check size={15} /> Save Changes
                </>
              ) : (
                <>
                  <Pencil size={15} /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-14">
          <div className="flex flex-col items-center min-w-[200px]">
            <div className="relative group">
              <div className="w-44 h-44 rounded-[2rem] overflow-hidden border-4 border-[#e8f5e9] shadow-inner">
                <img
                  src={
                    profilePicPreview ||
                    (currentStudent.Profile_Pic
                      ? currentStudent.Profile_Pic
                      : defaultProfilePic)
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-[#1A3C20] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2d6b38] transition-colors"
                  >
                    <Camera size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </>
              )}
            </div>

            {isEditing && profilePicPreview && (
              <button
                onClick={() => {
                  setProfilePicPreview(null);
                  setProfilePicFile(null);
                }}
                className="mt-2 text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1"
              >
                <X size={12} /> Remove
              </button>
            )}

            <h3 className="text-2xl font-black text-[#1A3C20] mt-4 capitalize">
              {formData.Name}
            </h3>
            <p className="text-gray-400 text-sm">@{formData.Username}</p>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-5">
            <InfoField
              label="Email"
              icon={<Mail size={16} />}
              value={formData.Email}
              isEditing={isEditing}
              onChange={(v) => setFormData((p) => ({ ...p, Email: v }))}
              placeholder="your@email.com"
            />

            {/* College */}
            <SearchableDropdown
              label="College"
              icon={<Building2 size={16} />}
              value={formData.College}
              isEditing={isEditing}
              placeholder="Select your college"
              items={masterColleges}
              searchKey="College_Name"
              idKey="College_ID"
              onSelect={(item) =>
                setFormData((p) => ({
                  ...p,
                  College: item.College_Name,
                  College_ID: item.College_ID,
                }))
              }
            />

            {/* Degree */}
            <SearchableDropdown
              label="Degree"
              icon={<GraduationCap size={16} />}
              value={formData.Degree}
              isEditing={isEditing}
              placeholder="Select your degree"
              items={masterDegrees}
              searchKey="Degree_Name"
              idKey="Degree_ID"
              onSelect={(item) =>
                setFormData((p) => ({
                  ...p,
                  Degree: item.Degree_Name,
                  Degree_ID: item.Degree_ID,
                }))
              }
            />

            {/* Roll No + Year — same row */}
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Roll Number"
                icon={<Hash size={16} />}
                value={formData.Roll_No}
                isEditing={isEditing}
                onChange={(v) => setFormData((p) => ({ ...p, Roll_No: v }))}
                placeholder="e.g. 21CS001"
              />
              <InfoField
                label="Batch Year"
                icon={<Calendar size={16} />}
                value={formatBatchYear(formData.Year)} // display: "2023-2027"
                isEditing={isEditing}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, Year: parseBatchYear(v) }))
                } // store: "2327"
                placeholder="e.g. 2023-2027"
              />
            </div>

            {/* Hobbies */}
            <HobbiesField
              masterHobbies={masterHobbies}
              selectedIds={formData.Hobbies}
              isEditing={isEditing}
              onToggle={(id) =>
                setFormData((prev) => {
                  const isSelected = prev.Hobbies.includes(id);
                  if (!isSelected && prev.Hobbies.length >= 7) {
                    toast.error("You can select at most 7 hobbies");
                    return prev; // don't update state
                  }
                  return {
                    ...prev,
                    Hobbies: isSelected
                      ? prev.Hobbies.filter((h) => h !== id)
                      : [...prev.Hobbies, id],
                  };
                })
              }
              currentHobbies={currentStudent.hobbies}
            />

            {!isEditing && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-red-400 hover:text-red-600 font-bold text-sm transition-colors mt-2"
              >
                <Trash2 size={16} /> Delete My Account
              </button>
            )}

            {showDeleteConfirm && (
              <ConfirmationBox
                type="Account"
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                  dispatch(deleteStudentAccount(currentStudent.S_ID));
                  setShowDeleteConfirm(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
