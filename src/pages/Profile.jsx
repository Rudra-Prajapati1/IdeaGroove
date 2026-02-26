import React, { useEffect, useState } from "react";
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
  Camera,
  Trash2,
  Check,
  RotateCcw,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "/DarkLogo.png";

const ProfileInformation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const currentStudent = useSelector(selectCurrentStudent);

  const masterColleges = useSelector(selectAllColleges) || [];
  const masterDegrees = useSelector(selectAllDegrees) || [];
  const masterHobbies = useSelector(selectAllHobbiesMaster) || [];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [hobbySearch, setHobbySearch] = useState("");

  /* ===============================
     LOAD DATA
  =============================== */
  const loadProfileData = () => {
    const loggedInId = user?.S_ID || user?.id;
    if (isAuthenticated && loggedInId) {
      dispatch(fetchCurrentStudent(loggedInId));
      dispatch(fetchAllColleges());
      dispatch(fetchAllDegrees());
      dispatch(fetchAllHobbiesMaster());
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  /* ===============================
     SYNC DATA
  =============================== */
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
    return <div className="p-20 text-center font-bold">Loading...</div>;

  /* ===============================
     HANDLERS
  =============================== */

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchableSelect = (type, value) => {
    if (type === "College") {
      const match = masterColleges.find((c) => c.College_Name === value);
      setFormData((prev) => ({
        ...prev,
        College: value,
        College_ID: match ? match.College_ID : prev.College_ID,
      }));
    } else {
      const match = masterDegrees.find((d) => d.Degree_Name === value);
      setFormData((prev) => ({
        ...prev,
        Degree: value,
        Degree_ID: match ? match.Degree_ID : prev.Degree_ID,
      }));
    }
  };

  const toggleHobby = (hobbyId) => {
    setFormData((prev) => ({
      ...prev,
      Hobbies: prev.Hobbies.includes(hobbyId)
        ? prev.Hobbies.filter((id) => id !== hobbyId)
        : [...prev.Hobbies, hobbyId],
    }));
  };

  const handleDiscard = () => {
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

    setIsEditing(false);
    toast.error("Changes discarded");
  };

  const handleSave = async () => {
    try {
      const payload = {
        student_id: currentStudent.S_ID,
        username: formData.Username ?? null,
        name: formData.Name ?? null,
        roll_no: formData.Roll_No ?? null,
        college_id: formData.College_ID ?? null,
        degree_id: formData.Degree_ID ?? null,
        year: formData.Year ?? null,
        email: formData.Email ?? null,
        hobbies: formData.Hobbies ?? [],
      };

      await dispatch(updateStudentProfile(payload)).unwrap();
      toast.success("Profile Updated Successfully!");

      loadProfileData();
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteStudentAccount(currentStudent.S_ID)).unwrap();

      toast.success("Account Deleted Successfully");
      navigate("/auth");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const formatBatchYear = (yearId) => {
    if (!yearId || yearId.toString().length !== 4) return yearId || "N/A";
    const yearStr = yearId.toString();
    return `20${yearStr.substring(0, 2)}-20${yearStr.substring(2, 4)}`;
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
    {
      label: "DEGREE",
      key: "Degree",
      icon: <GraduationCap size={16} />,
    },
    {
      label: "COLLEGE YEAR",
      key: "Year",
      icon: <Calendar size={16} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <section className="bg-[#1A3C20] pt-40 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-[#FFFBEB]">
            Your Profile
          </h1>
        </div>
      </section>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl -mt-20 overflow-hidden">
        {/* Header */}
        <div className="px-10 py-8 flex justify-between items-center border-b">
          <div className="flex items-center gap-3 text-[#1A3C20]">
            <User size={20} />
            <h2 className="text-xl font-extrabold">Personal Information</h2>
          </div>

          <div className="flex gap-2">
            {isEditing && (
              <button
                onClick={handleDiscard}
                className="p-2.5 bg-red-50 text-red-600 rounded-full"
              >
                <RotateCcw size={18} />
              </button>
            )}

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`p-2.5 rounded-full ${
                isEditing
                  ? "bg-green-600 text-white"
                  : "bg-[#f0f9f1] text-[#1A3C20]"
              }`}
            >
              {isEditing ? <Check size={18} /> : <Pencil size={18} />}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-10 py-10 flex flex-col md:flex-row gap-12">
          {/* Avatar */}
          <div className="flex flex-col items-center min-w-[180px]">
            <div className="w-44 h-44 rounded-4xl bg-[#FFAB8F] overflow-hidden border-[6px] border-[#e8f5e9] shadow-inner">
              <img
                src={currentStudent?.Profile_Pic || defaultProfilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-black text-[#1A3C20] mt-4 capitalize">
              {formData.Name}
            </h3>
            <p className="text-gray-400 text-sm">@{formData.Username}</p>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infoFields.map((field, idx) => (
                <div
                  key={idx}
                  className={field.fullWidth ? "md:col-span-2" : ""}
                >
                  <label className="block text-xs font-bold mb-2 uppercase">
                    {field.label}
                  </label>

                  <div className="flex items-center gap-3 bg-[#f8faf9] border rounded-2xl px-5 py-4">
                    {field.icon}

                    {isEditing ? (
                      <input
                        type="text"
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          field.key === "College" || field.key === "Degree"
                            ? handleSearchableSelect(field.key, e.target.value)
                            : handleInputChange(field.key, e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    ) : (
                      <span>
                        {field.key === "Year"
                          ? formatBatchYear(formData[field.key])
                          : formData[field.key] || "N/A"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Delete */}
            {!isEditing && (
              <div className="mt-12 pt-8 border-t">
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 text-red-500 font-bold text-sm"
                >
                  <Trash2 size={16} /> Delete My Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
