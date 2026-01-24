import React from "react";
import {
  Download,
  AlertTriangle,
  User,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";

const NotesCard = ({
  note,
  index,
  style,
  isAuth,
  currentUserId,
  onReport,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const NoteIcon = style.icon;

  // Check ownership using the passed currentUserId
  // Ensure types match (e.g., both numbers or strings)
  const isOwner = Number(note.Added_By) === Number(currentUserId);

  // Date Formatting Helper
  const formattedDate = note.Added_On
    ? new Date(note.Added_On).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Just now";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group relative">
      {/* --- HEADER --- */}
      <div
        className={`${style.color} h-32 relative p-4 transition-colors duration-300`}
      >
        {/* Report Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={(e) => onReport(e, note.N_ID)}
            className="p-2 bg-black/10 hover:bg-red-500 text-white backdrop-blur-md rounded-full transition-all duration-300"
            title="Report note"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* Subject Badge */}
        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 z-10">
          <span className="text-[10px] font-bold text-white tracking-wide uppercase">
            {note.Subject || "General"}
          </span>
        </div>

        {/* Watermark Icon */}
        <div className="w-full h-full flex items-center justify-center">
          <NoteIcon className="w-16 h-16 text-white opacity-25 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
          {note.Note_File || note.title || "Untitled Note"}
        </h3>

        {/* Metadata: Added By & Added On */}
        <div className="flex flex-wrap gap-y-1 gap-x-4 mb-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">
              {note.Added_By || "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
          {note.Description || "No description provided."}
        </p>

        {/* --- FOOTER --- */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
          {/* Download Button */}
          <button
            onClick={() => onDownload(note.File_Path)}
            disabled={!isAuth}
            className={`${
              isAuth
                ? "hover:bg-slate-800 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            } flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm`}
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          {/* Edit & Delete Buttons (Visible to Owner) */}
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(note.N_ID)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                title="Edit Note"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(note.N_ID)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
