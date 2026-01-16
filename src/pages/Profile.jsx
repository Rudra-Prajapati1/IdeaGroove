import React, { useEffect } from "react";
import {
  User,
  Pencil,
  Mail,
  Hash,
  GraduationCap,
  Calendar,
  Camera,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "/DarkLogo.png";

const ProfileInformation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const infoFields = [
    {
      label: "EMAIL ADDRESS",
      value: user?.Email || "N/A",
      icon: <Mail size={16} />,
    },
    {
      label: "ROLL NUMBER",
      value: user?.Roll_No || "N/A",
      icon: <Hash size={16} />,
    },
    {
      label: "COLLEGE NAME",
      value: user?.College || "St. Xavier's College, Ahmedabad",
      icon: <GraduationCap size={16} />,
      fullWidth: true,
    },
    {
      label: "DEGREE",
      value: user?.Degree || "B.Tech Computer Science",
      icon: <GraduationCap size={16} />,
    },
    {
      label: "COLLEGE YEAR",
      value: user?.Year || 2026,
      icon: <Calendar size={16} />,
    },
  ];

  const hobbies = user?.Hobbies || [];

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      {/* Hero Section */}
      <section className="relative bg-[#1A3C20] pt-40 pb-32">
        {/* Wave SVG */}
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
      <div className="max-w-4xl mx-auto bg-white relative z-40 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-10 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3 text-[#1A3C20]">
            <User size={20} strokeWidth={2.5} />
            <h2 className="text-xl font-extrabold tracking-tight">
              Personal Information
            </h2>
          </div>
          <button className="p-2.5 bg-[#f0f9f1] text-[#1A3C20] rounded-full hover:bg-[#1A3C20] hover:text-white transition-all shadow-sm">
            <Pencil size={18} />
          </button>
        </div>

        {/* Main Content Body */}
        <div className="px-10 pb-10 flex flex-col md:flex-row gap-12">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
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

            <div className="mt-6 text-center">
              <h3 className="text-2xl font-black text-[#1A3C20]">
                {user?.Name || "Alex Johnson"}
              </h3>
              <p className="text-gray-400 font-medium text-sm mt-1">
                {user?.Username || "alexj"}
              </p>
              <p className="text-gray-400 font-medium text-sm mt-1">
                Class of {user?.Year || "2026"}
              </p>
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
                  <label className="block text-[10px] font-black text-[#1A3C20]-100 tracking-[0.15em] mb-2 uppercase">
                    {field.label}
                  </label>
                  <div className="flex items-center gap-3 bg-[#f8faf9] border border-gray-100 rounded-2xl px-5 py-4 text-[#4A5568]">
                    <span className="text-[#1A3C20]/40">{field.icon}</span>
                    <span className="text-sm font-semibold">{field.value}</span>
                  </div>
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-300 tracking-[0.15em] mb-3 uppercase">
                  Hobbies & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, idx) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
