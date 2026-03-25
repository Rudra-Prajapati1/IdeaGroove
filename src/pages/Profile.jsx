import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { logout } from "../redux/slice/authSlice";

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
  EyeOff,
  Eye,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ConfirmationBox } from "../components/common/ConfirmationBox";
import api from "../api/axios";
import { updateUserInAuth } from "../redux/slice/authSlice";
import {
  formatAcademicYear,
  toStoredAcademicYear,
} from "../utils/academicYear";
import { debounce } from "lodash";

const mapStudentProfileToAuthUser = (student) => ({
  id: student.S_ID,
  S_ID: student.S_ID,
  Name: student.Name,
  Username: student.Username,
  Email: student.Email,
  Roll_No: student.Roll_No,
  Year: student.Year,
  College: student.College_Name || "",
  Degree: student.Degree_Name || "",
  Profile_Pic: student.Profile_Pic,
  Hobbies: Array.isArray(student.hobbies)
    ? student.hobbies.map((hobby) => hobby.Hobby_Name)
    : [],
});

const AVAILABILITY_MAP = {
  username: { key: "Username", msg: "Username is already taken" },
  roll_no: { key: "Roll_No", msg: "Roll No is already registered" },
};

const REQUIRED_FIELD_ERRORS = {
  Username: "Username is required",
};

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

          {selectedIds.length > 0 && (
            <p className="text-xs text-[#4caf50] font-semibold mb-2">
              {selectedIds.length} selected
            </p>
          )}

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
  onBlur,
  type = "text",
  placeholder,
  error = "",
}) => (
  <div>
    <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[#3a6b42]">
      {label}
    </label>
    <div
      className={`flex items-center gap-3 bg-[#f4fbf5] border-2 rounded-2xl px-5 py-3 transition-all duration-200 ${
        error
          ? "border-red-300 focus-within:border-red-400 focus-within:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
          : isEditing && onChange
          ? "border-[#c8e6c9] hover:border-[#1A3C20] focus-within:border-[#1A3C20] focus-within:shadow-[0_0_0_3px_rgba(26,60,32,0.08)]"
          : "border-[#e8f5e9]"
      }`}
    >
      <span className={error ? "text-red-400" : "text-[#4caf50]"}>
        {icon}
      </span>
      {isEditing && onChange ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-[#1A3C20] placeholder:text-gray-400 font-medium"
        />
      ) : (
        <span className="text-sm text-[#1A3C20] font-medium">
          {value || "N/A"}
        </span>
      )}
    </div>
    {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
  </div>
);

/* ─────────────────────────── PasswordField ─────────────────────────── */
// ✅ Defined OUTSIDE ChangePasswordModal to prevent re-mount on every keystroke
const PasswordField = ({ label, fieldKey, form, setForm, show, setShow }) => (
  <div>
    <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-[#3a6b42]">
      {label}
    </label>
    <div className="flex items-center gap-3 bg-[#f4fbf5] border-2 border-[#c8e6c9] rounded-2xl px-5 py-3 focus-within:border-[#1A3C20] transition-all">
      <KeyRound size={16} className="text-[#4caf50]" />
      <input
        type={show[fieldKey] ? "text" : "password"}
        value={form[fieldKey]}
        onChange={(e) => setForm((p) => ({ ...p, [fieldKey]: e.target.value }))}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="flex-1 bg-transparent outline-none text-sm text-[#1A3C20] placeholder:text-gray-400 font-medium"
      />
      <button
        type="button"
        onClick={() => setShow((p) => ({ ...p, [fieldKey]: !p[fieldKey] }))}
      >
        {show[fieldKey] ? (
          <EyeOff size={16} className="text-gray-400" />
        ) : (
          <Eye size={16} className="text-gray-400" />
        )}
      </button>
    </div>
  </div>
);

/* ─────────────────────────── ChangePasswordModal ─────────────────────────── */
const ChangePasswordModal = ({ onClose, studentId }) => {
  const [form, setForm] = useState({ old: "", new: "", confirm: "" });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.old || !form.new || !form.confirm)
      return toast.error("Please fill all fields");
    if (form.new !== form.confirm)
      return toast.error("New passwords do not match");
    if (form.new.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await api.post("/auth/changePassword", {
        S_ID: studentId,
        oldPassword: form.old,
        newPassword: form.new,
      });
      toast.success("Password changed successfully!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-4xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-[#e8f5e9] text-[#1A3C20] rounded-full flex items-center justify-center mb-4">
            <KeyRound size={32} />
          </div>
          <h3 className="text-2xl font-black text-[#1A3C20] mb-1">
            Change Password
          </h3>
          <p className="text-gray-400 text-sm">
            Enter your current and new password
          </p>
        </div>

        <div className="space-y-4">
          <PasswordField
            label="Old Password"
            fieldKey="old"
            form={form}
            setForm={setForm}
            show={show}
            setShow={setShow}
          />
          <PasswordField
            label="New Password"
            fieldKey="new"
            form={form}
            setForm={setForm}
            show={show}
            setShow={setShow}
          />
          <PasswordField
            label="Confirm New Password"
            fieldKey="confirm"
            form={form}
            setForm={setForm}
            show={show}
            setShow={setShow}
          />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-[#1A3C20] text-white rounded-2xl font-bold hover:bg-[#2d6b38] transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────── ProfileInformation ─────────────────────────── */
const ProfileInformation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { isAuthenticated, user, sessionChecked } = useSelector(
    (state) => state.auth,
  );
  const currentStudent = useSelector(selectCurrentStudent);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const masterColleges = useSelector(selectAllColleges) || [];
  const masterDegrees = useSelector(selectAllDegrees) || [];
  const masterHobbies = useSelector(selectAllHobbiesMaster) || [];

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadProfileData = () => {
    const loggedInId = user?.S_ID || user?.id;
    if (sessionChecked && isAuthenticated && loggedInId) {
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

  const clearFieldError = useCallback((fieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[fieldKey]) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  }, []);

  const checkAvailability = useCallback(
    async (field, value) => {
      const trimmedValue = value?.trim();
      const config = AVAILABILITY_MAP[field];
      const requiredMessage =
        field === "username" ? REQUIRED_FIELD_ERRORS.Username : "";

      if (!config) {
        return true;
      }

      if (!trimmedValue) {
        if (requiredMessage) {
          setFieldErrors((prev) => ({
            ...prev,
            [config.key]: requiredMessage,
          }));
          return false;
        }
        clearFieldError(config.key);
        return true;
      }

      const currentValue =
        field === "username" ? currentStudent?.Username : currentStudent?.Roll_No;

      if (trimmedValue === currentValue) {
        clearFieldError(config.key);
        return true;
      }

      try {
        const { data } = await api.get("/auth/check-availability", {
          params: { field, value: trimmedValue },
        });

        if (!data.available) {
          setFieldErrors((prev) => ({ ...prev, [config.key]: config.msg }));
          return false;
        }

        clearFieldError(config.key);
        return true;
      } catch (err) {
        console.error("Availability check failed:", err);
        return true;
      }
    },
    [clearFieldError, currentStudent],
  );

  const debouncedCheckUsername = useCallback(
    debounce((value) => {
      checkAvailability("username", value);
    }, 600),
    [checkAvailability],
  );

  const debouncedCheckRollNo = useCallback(
    debounce((value) => {
      checkAvailability("roll_no", value);
    }, 600),
    [checkAvailability],
  );

  useEffect(() => {
    loadProfileData();
  }, [dispatch, isAuthenticated, sessionChecked, user]);

  useEffect(() => {
    if (sessionChecked && !isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate, sessionChecked]);

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
      setFieldErrors({});
    }
  }, [currentStudent]);

  useEffect(() => {
    return () => {
      debouncedCheckUsername.cancel();
      debouncedCheckRollNo.cancel();
    };
  }, [debouncedCheckRollNo, debouncedCheckUsername]);

  if (!currentStudent || !formData)
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <div className="text-[#1A3C20] font-bold text-lg animate-pulse">
          Loading profile...
        </div>
      </div>
    );

  const profileImageSrc =
    profilePicPreview || currentStudent?.Profile_Pic || "";
  const profileInitial = (formData.Name || currentStudent?.Name || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const formatBatchYear = (year) => {
    if (!year) return "N/A";
    const yearStr = String(year);
    if (yearStr.length !== 4) return yearStr;
    return `20${yearStr.substring(0, 2)}-20${yearStr.substring(2, 4)}`;
  };

  const parseBatchYear = (displayStr) => {
    const match = displayStr.match(/20(\d{2})-20(\d{2})/);
    if (match) return `${match[1]}${match[2]}`;
    return displayStr;
  };

  const handleSave = async () => {
    try {
      const trimmedUsername = formData.Username.trim();
      if (!trimmedUsername) {
        setFieldErrors((prev) => ({
          ...prev,
          Username: REQUIRED_FIELD_ERRORS.Username,
        }));
        toast.error(REQUIRED_FIELD_ERRORS.Username);
        return;
      }

      const isUsernameAvailable = await checkAvailability(
        "username",
        trimmedUsername,
      );
      const isRollNoAvailable = await checkAvailability(
        "roll_no",
        formData.Roll_No,
      );

      if (!isUsernameAvailable) {
        toast.error(AVAILABILITY_MAP.username.msg);
        return;
      }

      if (!isRollNoAvailable) {
        toast.error(AVAILABILITY_MAP.roll_no.msg);
        return;
      }

      const formDataPayload = new FormData();
      formDataPayload.append("student_id", currentStudent.S_ID);
      formDataPayload.append("username", trimmedUsername);
      formDataPayload.append("name", formData.Name.trim());
      formDataPayload.append("roll_no", formData.Roll_No.trim());
      formDataPayload.append("college_id", formData.College_ID);
      formDataPayload.append("degree_id", formData.Degree_ID);
      formDataPayload.append("year", formData.Year);
      formDataPayload.append("email", formData.Email.trim());
      formDataPayload.append("hobbies", JSON.stringify(formData.Hobbies));
      if (profilePicFile) {
        formDataPayload.append("profile_pic", profilePicFile);
      }

      await dispatch(updateStudentProfile(formDataPayload)).unwrap();
      const refreshedStudent = await dispatch(
        fetchCurrentStudent(currentStudent.S_ID),
      ).unwrap();

      dispatch(updateUserInAuth(mapStudentProfileToAuthUser(refreshedStudent)));
      toast.success("Profile Updated Successfully!");
      setIsEditing(false);
      setProfilePicFile(null);
      setProfilePicPreview(null);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      {/* Hero */}
      <section className="bg-[#1A3C20] pt-40 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#FFFBEB]/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} /> Back
          </button>
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
              <div className="w-44 h-44 rounded-4xl overflow-hidden border-4 border-[#e8f5e9] shadow-inner">
                {profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white">
                    <span className="bg-gradient-to-br from-[#1A3C20] to-[#4caf50] bg-clip-text text-6xl font-black text-transparent">
                      {profileInitial}
                    </span>
                  </div>
                )}
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
            {formData.Username?.trim() && (
              <p className="text-gray-400 text-sm">@{formData.Username.trim()}</p>
            )}
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Name"
                icon={<User size={16} />}
                value={formData.Name}
                isEditing={isEditing}
                onChange={(v) => setFormData((p) => ({ ...p, Name: v }))}
                placeholder="Enter your name"
              />
              <InfoField
                label="Username"
                icon={<Pencil size={16} />}
                value={formData.Username}
                isEditing={isEditing}
                error={fieldErrors.Username}
                onBlur={() => checkAvailability("username", formData.Username)}
                onChange={(v) => {
                  setFormData((p) => ({ ...p, Username: v }));
                  if (v.trim()) {
                    clearFieldError("Username");
                  }
                  debouncedCheckUsername(v);
                }}
                placeholder="Choose a username"
              />
            </div>

            <InfoField
              label="Email"
              icon={<Mail size={16} />}
              value={formData.Email}
              isEditing={isEditing}
              onChange={(v) => setFormData((p) => ({ ...p, Email: v }))}
              placeholder="your@email.com"
            />

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

            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Roll Number"
                icon={<Hash size={16} />}
                value={formData.Roll_No}
                isEditing={isEditing}
                error={fieldErrors.Roll_No}
                onBlur={() => checkAvailability("roll_no", formData.Roll_No)}
                onChange={(v) => {
                  setFormData((p) => ({ ...p, Roll_No: v }));
                  clearFieldError("Roll_No");
                  debouncedCheckRollNo(v);
                }}
                placeholder="e.g. 21CS001"
              />
              <InfoField
                label="Batch Year"
                icon={<Calendar size={16} />}
                value={formatAcademicYear(formData.Year)}
                isEditing={isEditing}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, Year: toStoredAcademicYear(v) }))
                }
                placeholder="e.g. 2023-2027"
              />
            </div>

            <HobbiesField
              masterHobbies={masterHobbies}
              selectedIds={formData.Hobbies}
              isEditing={isEditing}
              onToggle={(id) =>
                setFormData((prev) => {
                  const isSelected = prev.Hobbies.includes(id);
                  if (!isSelected && prev.Hobbies.length >= 7) {
                    toast.error("You can select at most 7 hobbies");
                    return prev;
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
              <div className="flex items-center gap-6 mt-2">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-2 text-[#1A3C20] hover:text-[#2d6b38] font-bold text-sm transition-colors"
                >
                  <KeyRound size={16} /> Change Password
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-600 font-bold text-sm transition-colors"
                >
                  <Trash2 size={16} /> Delete My Account
                </button>
              </div>
            )}

            {showChangePassword && (
              <ChangePasswordModal
                onClose={() => setShowChangePassword(false)}
                studentId={currentStudent.S_ID}
              />
            )}

            {showDeleteConfirm && (
              <ConfirmationBox
                type="Account"
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={async () => {
                  setShowDeleteConfirm(false);
                  const result = await dispatch(
                    deleteStudentAccount(currentStudent.S_ID),
                  );
                  if (deleteStudentAccount.fulfilled.match(result)) {
                    toast.success("Account deleted successfully!");
                    dispatch(logout());
                    navigate("/");
                  } else {
                    toast.error("Failed to delete account. Please try again.");
                  }
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
