import {
  CheckCircle,
  Ban,
  Calendar,
  Download,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import StudentProfile from "../admin/StudentProfile";

const AdminNoteCard = ({ note, onModerate }) => {
  const isActive = note.status === "active";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!note.id) {
      toast.error("File not available");
      return;
    }

    try {
      setIsDownloading(true);
      toast.loading("Preparing download...", { id: `admin-note-${note.id}` });
      const { data } = await api.get(`/notes/admin-download/${note.id}`);

      if (!data?.url) {
        throw new Error("Download URL missing");
      }

      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!", { id: `admin-note-${note.id}` });
    } catch (err) {
      toast.error("Failed to download file", {
        id: `admin-note-${note.id ?? "download"}`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group ${isActive ? "hover:border-green-300 hover:shadow-green-200" : "hover:border-red-300 hover:shadow-red-200"}`}
      >
        <div className="px-4 pt-4 pb-3 flex justify-between items-center">
          <span className="text-[10px] font-mono font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
            #{note.id}
          </span>
          <span
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full
              ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`}
            />
            {isActive ? "Active" : "Blocked"}
          </span>
        </div>

        {/* Body */}
        <div className="px-4 pb-4">
          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight">
              {note.subject}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 leading-snug mb-1.5 line-clamp-1 font-poppins group-hover:text-[#1B431C] transition-colors flex items-center gap-2">
            <FileText size={14} className="text-gray-300 shrink-0" />
            {note.file}
          </h3>

          {note.description && (
            <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
              {note.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <button
              onClick={() => setIsProfileOpen(true)}
              title="View student profile"
              className="group/author flex items-center gap-1.5 hover:text-[#1B431C] transition-colors"
            >
              <User
                size={11}
                className="text-gray-300 group-hover/author:text-[#1B431C] transition-colors"
              />
              <span>
                By{" "}
                <span className="font-semibold text-gray-600 group-hover/author:text-[#1B431C] underline underline-offset-2 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                  {note.uploadedBy}
                </span>
              </span>
              <ExternalLink
                size={9}
                className="text-gray-300 opacity-0 group-hover/author:opacity-100 transition-opacity"
              />
            </button>
            <div className="flex items-center gap-1">
              <Calendar size={11} className="text-gray-300" />
              <span>
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-4 py-3 border-t border-gray-50 flex gap-2 bg-gray-50/40">
          <button
            onClick={handleDownload}
            disabled={!note.id || isDownloading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            {isDownloading ? "Opening..." : "Download"}
          </button>
          <button
            onClick={() => onModerate(isActive ? "block" : "unblock", note.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                isActive
                  ? "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
                  : "bg-[#1B431C] text-white hover:bg-[#153416]"
              }`}
          >
            {isActive ? (
              <>
                <Ban size={14} />
                Block Note
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                Unblock Note
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsProfileOpen(false)
          }
        >
          <div className="relative bg-[#f8faf8] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={note.userId} // Assuming Added_By contains the S_ID of the uploader
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNoteCard;
