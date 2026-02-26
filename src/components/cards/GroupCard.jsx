import React, { useState } from "react";
import {
  Eye,
  UserPlus,
  Users,
  Edit2,
  Trash2,
  Info,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import ViewMembers from "@/components/groups/ViewMembers";
import ComplaintButton from "../ComplaintButton";
import toast from "react-hot-toast";
import {
  deleteGroup,
  joinGroup,
  leaveGroup,
} from "../../redux/slice/chatRoomsSlice";
import { ConfirmationBox } from "../common/ConfirmationBox";

const GroupCard = ({ group, onEdit, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuth = !!user;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const currentUserId = user?.id || user?.S_ID;
  const isOwner = group.Created_By === currentUserId;

  const isMember = Array.isArray(group.Members)
    ? group.Members.some((m) => m.Student_ID === currentUserId)
    : false;

  const formattedDate = group.Created_On
    ? new Date(group.Created_On).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently created";

  /* =================== DELETE =================== */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteGroup(group.Room_ID)).unwrap();
      toast.success("Group deleted successfully!");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      toast.error(err || "Failed to delete group");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  /* =================== JOIN =================== */
  const handleJoin = async (e) => {
    e?.stopPropagation();
    if (!isAuth) {
      toast.error("Please login to join the group");
      return;
    }
    setIsJoining(true);
    try {
      await dispatch(
        joinGroup({ Room_ID: group.Room_ID, Student_ID: currentUserId }),
      ).unwrap();
      toast.success("You have successfully joined the group!");
      setTimeout(() => navigate("/chats"), 500);
    } catch (err) {
      toast.error(err || "Failed to join group");
    } finally {
      setIsJoining(false);
    }
  };

  /* =================== LEAVE =================== */
  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await dispatch(
        leaveGroup({ Room_ID: group.Room_ID, Student_ID: currentUserId }),
      ).unwrap();
      toast.success("You have left the group.");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      toast.error(err || "Failed to leave group");
    } finally {
      setIsLeaving(false);
      setIsLeaveOpen(false);
    }
  };

  return (
    <>
      <div className="relative bg-white border border-gray-100 shadow-md rounded-2xl p-6 w-full max-w-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          {!isOwner && isAuth && (
            <ComplaintButton
              onClick={() =>
                navigate(`/submitComplaint/group/${group.Room_ID}`)
              }
              element="group"
            />
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-bold font-poppins text-xl text-gray-900 mb-1">
            {group.Room_Name}
          </h3>

          <div className="space-y-2.5 mb-3">
            <div className="flex items-center gap-1.5 text-gray-800 text-sm">
              <span className="font-medium">Admin : {group.Creator_Name}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">{group.Member_Count} Members</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Info className="w-3.5 h-3.5" />
              <span>Created on {formattedDate}</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
            {group.Description ||
              "Exploring ideas and creative collaborations..."}
          </p>
        </div>

        <div className="flex gap-3 h-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 border cursor-pointer border-primary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-sm"
          >
            View <Eye className="w-4 h-4" />
          </button>

          {isOwner ? (
            <>
              <button
                onClick={() => navigate("/chats")}
                className="flex-1 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#153416] transition-colors text-sm cursor-pointer"
              >
                Chat <MessageCircle className="w-4 h-4" />
              </button>
              <button
                className="px-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                onClick={onEdit}
                title="Edit Group"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                className="px-3 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isDeleting}
                title="Delete Group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : isMember ? (
            <>
              <button
                onClick={() => navigate("/chats")}
                className="flex-1 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#153416] transition-colors text-sm cursor-pointer"
              >
                Go to Chat <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLeaveOpen(true)}
                disabled={isLeaving}
                title="Leave Group"
                className="px-3 bg-red-50 text-red-500 rounded-lg border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className={`flex-1 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm
                ${isAuth ? "cursor-pointer hover:bg-[#153416]" : "cursor-not-allowed opacity-60"}
                ${isJoining ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {isJoining ? "Joining..." : "Join"}
              {!isJoining && <UserPlus className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ViewMembers
          group={group}
          setIsModalOpen={setIsModalOpen}
          isOwner={isOwner}
          isMember={isMember}
          onJoin={handleJoin}
          isJoining={isJoining}
        />
      )}

      {isDeleteOpen && (
        <ConfirmationBox
          type="Group"
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {isLeaveOpen && (
        <ConfirmationBox
          type="Leave Group"
          subType=""
          onClose={() => setIsLeaveOpen(false)}
          onConfirm={handleLeave}
        />
      )}
    </>
  );
};

export default GroupCard;
