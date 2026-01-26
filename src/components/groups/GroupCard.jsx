import React, { useState } from "react";
import group_temp_image from "/images/group_temp_image.jpg";
import {
  Eye,
  UserPlus,
  Users,
  X,
  Search,
  MessageSquare,
  Edit2,
  Trash2,
  AlertTriangle,
  Info, // Added for description icon
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

  // Filter members based on search
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* --- MAIN CARD --- */}
      <div className="relative bg-white border border-gray-100 shadow-md rounded-2xl p-6 w-full max-w-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getBadgeColor(group.Based_On)}`}>
            {group.Based_On}
          </span>
          {!isOwner && (
            <button onClick={handleReportClick} className="relative p-2 bg-red-400 hover:bg-red-500 text-white rounded-full transition-all">
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mb-4">
          <img src={group_temp_image} alt={group.Room_Name} className="rounded-full h-16 w-16 object-cover border-2 border-gray-50 shadow-sm" />
        </div>

        <div className="mb-6">
          <h3 className="font-bold font-poppins text-xl text-gray-900 mb-1">{group.Room_Name}</h3>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
            <Users className="w-4 h-4" />
            <span className="font-medium">{group.Member_Count || "0"} Members</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
            {group.Description || "Exploring data structures and creative collaborations..."}
          </p>
        </div>

        <div className="flex gap-3 h-10">
          <button
            disabled={!isAuth}
            onClick={() => setIsModalOpen(true)}
            className={`${isAuth ? "cursor-pointer" : "cursor-not-allowed"} flex-1 border border-primary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-sm`}
          >
            View <Eye className="w-4 h-4" />
          </button>

          {isOwner ? (
            <>
              <button className="px-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><Edit2 className="w-4 h-4" /></button>
              <button className="px-3 bg-red-50 text-red-600 rounded-lg border border-red-100"><Trash2 className="w-4 h-4" /></button>
            </>
          ) : (
            <button disabled={!isAuth} className={`${isAuth ? "cursor-pointer" : "cursor-not-allowed"} flex-1 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#153416] transition-colors text-sm`}>
              Join <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- EXPANDED VIEW MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col font-inter">
            
            {/* Modal Header: Image + Basic Info */}
            <div className="bg-white p-8 text-[#0D2E0E] relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-5">
                <img 
                  src={group_temp_image} 
                  alt={group.Room_Name} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
                <div>
                  <h2 className="text-2xl font-bold font-poppins">{group.Room_Name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {group.Based_On}
                    </span>
                    <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                      <Users className="w-3 h-3" /> {group.Member_Count || "12"} Members
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content Area (Scrollable) */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              
              {/* Full Description Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                  <Info className="w-4 h-4 text-primary" />
                  <h4>About this group</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  {group.Description || "No description provided for this group."}
                </p>
              </div>

              {/* Members Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-900 font-bold">Group Members</h4>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">List</span>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Member List */}
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm">
                          <img src={`https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                          <p className={`text-[10px] font-black tracking-tighter ${member.isAdmin ? "text-green-600" : "text-gray-400"}`}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                      {member.isAdmin ? (
                        <button className="p-2 hover:bg-white rounded-full transition-shadow">
                           <MessageSquare className="w-4 h-4 text-gray-900" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-medium uppercase tracking-widest px-3">Member</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer (Optional Actions) */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
               <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
               >
                 Close
               </button>
               {!isOwner && (
                 <button className="flex-[2] bg-primary text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-[#153416] transition-all active:scale-95">
                   Join This Group
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCard;