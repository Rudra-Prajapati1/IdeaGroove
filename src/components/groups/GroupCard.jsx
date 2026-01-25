import React, { useState } from "react";
import group_temp_image from "/images/group_temp_image.jpg";
import {
  Eye,
  UserPlus,
  Flag,
  Users,
  X,
  Search,
  MessageSquare,
  UserPlus as InviteIcon,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const GroupCard = ({ group }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleReportClick = (e) => {
    e.stopPropagation();
    navigate(`/submitComplaint/group/${group.G_ID}`);
  };

  // Mock data for members based on your design
  const members = [
    { id: 1, name: "Alex Rivera", role: "GROUP ADMIN", isAdmin: true },
    { id: 2, name: "Jordan Smith", role: "Member", isAdmin: false },
    { id: 3, name: "Taylor Morgan", role: "Member", isAdmin: false },
    { id: 4, name: "Jamie Chen", role: "Member", isAdmin: false },
    { id: 5, name: "Casey Wilson", role: "Member", isAdmin: false },
    { id: 6, name: "Riley Harper", role: "Member", isAdmin: false },
  ];

  const getBadgeColor = (category) => {
    const colors = {
      Coding: "bg-green-100 text-green-700",
      Music: "bg-red-50 text-red-800",
      Sports: "bg-blue-50 text-blue-800",
      Arts: "bg-purple-50 text-purple-800",
      Social: "bg-orange-50 text-orange-800",
      Volunteering: "bg-emerald-50 text-emerald-800",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const MOCK_CURRENT_USER_ID = 104;
  const isOwner = group.Created_By === MOCK_CURRENT_USER_ID;

  return (
    <>
      <div
        key={group.G_ID}
        className="relative bg-white border border-gray-100 shadow-md rounded-2xl p-6 w-full max-w-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        {/* --- HEADER: Badge & Report --- */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getBadgeColor(group.Based_On)}`}
          >
            {group.Based_On}
          </span>

          {/* ✅ Logic: Hide Report Flag if Owner */}
          {!isOwner && (
            <button
              onClick={handleReportClick}
              className="relative p-2 bg-red-400 hover:bg-red-500 text-white backdrop-blur-md rounded-full transition-all duration-300"
              title="Report Group"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* --- BODY: Image & Info --- */}
        <div className="mb-4">
          <img
            src={group_temp_image}
            alt={group.Room_Name}
            className="rounded-full h-16 w-16 object-cover border-2 border-gray-50 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <h3 className="font-bold font-poppins text-xl text-gray-900 mb-1">
            {group.Room_Name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {group.Member_Count || "0"} Members
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
            {group.Description ||
              "Exploring data structures and creative collaborations..."}
          </p>
        </div>

        {/* --- FOOTER: Actions --- */}
        <div className="flex gap-3 h-10">
          {/* 1. View Button (Everyone sees this) */}
          <button
            disabled={!isAuth}
            onClick={() => setIsModalOpen(true)}
            className={`${
              isAuth ? "cursor-pointer" : "cursor-not-allowed"
            } flex-1 border border-primary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-sm`}
          >
            View <Eye className="w-4 h-4" />
          </button>

          {/* 2. Check Ownership for Action Buttons */}
          {isOwner ? (
            /* ✅ OWNER VIEW: Edit & Delete Buttons */
            <>
              <button
                onClick={() => console.log("Edit Group:", group.G_ID)}
                className="px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 flex items-center justify-center"
                title="Edit Group"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => console.log("Delete Group:", group.G_ID)}
                className="px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center"
                title="Delete Group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* ✅ VISITOR VIEW: Join Button */
            <button
              disabled={!isAuth}
              onClick={() => console.log("Join Group:", group.G_ID)}
              className={`${
                isAuth ? "cursor-pointer" : "cursor-not-allowed"
              } flex-1 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#153416] transition-colors text-sm shadow-md shadow-primary/20`}
            >
              Join <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- VIEW MEMBERS MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0D2E0E] p-6 text-white relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold font-poppins">
                {group.Room_Name}
              </h2>
              <p className="text-green-400 text-xs font-medium mt-1">
                {group.Based_On} • {group.Member_Count || "12"} Members
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name or role..."
                  className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Member List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                        {/* Avatar placeholder */}
                        <img
                          src={`https://i.pravatar.cc/150?u=${member.id}`}
                          alt={member.name}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {member.name}
                        </p>
                        <p
                          className={`text-[10px] font-black tracking-tighter ${member.isAdmin ? "text-green-600" : "text-gray-400"}`}
                        >
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {member.isAdmin ? (
                      <MessageSquare className="w-4 h-4 text-gray-900 cursor-pointer" />
                    ) : (
                      <span className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">
                        Member
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            {/* <div className="p-6 pt-0 flex items-center justify-between">
              <button className="text-green-600 font-bold text-sm flex items-center gap-2 hover:underline">
                <InviteIcon className="w-4 h-4" /> Invite Others
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-[#22C55E] hover:bg-[#1aad4f] text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                Done
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCard;
