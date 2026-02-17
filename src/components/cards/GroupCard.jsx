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
import ViewMembers from "@/components/groups/ViewMembers";
import ComplaintButton from "../ComplaintButton";
import toast from "react-hot-toast";

const GroupCard = ({ group, onEdit }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  let MOCK_CURRENT_USER_ID = 0;
  if (isAuth) {
    MOCK_CURRENT_USER_ID = 104;
  }
  const isOwner = group.Created_By === MOCK_CURRENT_USER_ID;

  const formattedDate = group.Created_On
    ? new Date(group.Created_On).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently created";

  return (
    <>
      <div className="relative bg-white border border-gray-100 shadow-md rounded-2xl p-6 w-full max-w-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          {!isOwner && (
            <ComplaintButton
              onClick={() => navigate(`/submitComplaint/group/${group.G_ID}`)}
              element="group"
            />
          )}
        </div>

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
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {group.Member_Count || "12"} Members
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Info className="w-3.5 h-3.5" />
              <span>Created on {formattedDate}</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
            {group.Description ||
              "Exploring data structures and creative collaborations..."}
          </p>
        </div>

        <div className="flex gap-3 h-10">
          <button
            // disabled={!isAuth}
            onClick={() => setIsModalOpen(true)}
            className={`flex-1 border cursor-pointer border-primary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-sm`}
          >
            View <Eye className="w-4 h-4" />
          </button>

          {isOwner ? (
            <>
              <button
                className="px-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"
                onClick={onEdit}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                className="px-3 bg-red-50 text-red-600 rounded-lg border border-red-100"
                onClick={() => {
                  toast.success("Group Deleted Successfully!");
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();

                if (!isAuth) {
                  toast.error("Please login to join the group");
                  return;
                }

                toast.success("You have successfully joined the group");
                navigate("/chats");
              }}
              className={`${isAuth ? "cursor-pointer" : "cursor-not-allowed"} flex-1 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#153416] transition-colors text-sm`}
            >
              Join <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ViewMembers
          group={group}
          setIsModalOpen={setIsModalOpen}
          isOwner={isOwner}
        />
      )}
    </>
  );
};

export default GroupCard;
